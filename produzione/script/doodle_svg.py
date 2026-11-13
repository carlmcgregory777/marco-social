# Doodle «alla Hormozi» (13/11/2026): da un foglio di icone a pennarello (PNG, sfondo bianco, griglia COLxRIG)
# a tratti vettoriali che Remotion disegna uno alla volta (effetto «si disegna da solo").
#
# Uso:  python doodle_svg.py <icone.png> <cartella_public> <out.ts> <COL> <RIG> nome1,nome2,...
# Per ogni icona:
#   - <cartella_public>/<nome>.png   icona finale con trasparenza (colori veri: candele rosse/verdi ecc.)
#   - nel .ts: tratti (scheletro del disegno) con spessore e lunghezza, per lo stroke-dashoffset
import json, os, sys
import cv2
import numpy as np
from skimage.morphology import skeletonize

src, pub, out_ts, COL, RIG, nomi = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5]), sys.argv[6].split(",")
os.makedirs(pub, exist_ok=True)
img = cv2.imread(src)
H, W = img.shape[:2]
grigio = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
# inchiostro = scuro oppure colorato (saturo)
inchiostro = ((grigio < 150) | ((hsv[..., 1] > 80) & (hsv[..., 2] < 235))).astype(np.uint8)

VICINI = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]


def traccia(sk):
    """Scheletro (bool) -> lista di polilinee [(x,y),...]."""
    pts = set(zip(*np.nonzero(sk)))
    def vic(p):
        return [(p[0] + a, p[1] + b) for a, b in VICINI if (p[0] + a, p[1] + b) in pts]
    grado = {p: len(vic(p)) for p in pts}
    visti_lati = set()
    linee = []
    def cammina(a, b):
        linea = [a, b]
        visti_lati.add((a, b)); visti_lati.add((b, a))
        prec, cur = a, b
        while grado[cur] == 2:
            nx = [q for q in vic(cur) if q != prec and (cur, q) not in visti_lati]
            if not nx:
                break
            prec, cur = cur, nx[0]
            visti_lati.add((prec, cur)); visti_lati.add((cur, prec))
            linea.append(cur)
        return linea
    nodi = [p for p in pts if grado[p] != 2]
    for n in sorted(nodi):
        for q in vic(n):
            if (n, q) not in visti_lati:
                linee.append(cammina(n, q))
    # anelli chiusi (tutti di grado 2)
    for p in sorted(pts):
        for q in vic(p):
            if (p, q) not in visti_lati:
                linee.append(cammina(p, q))
    out = []
    for l in linee:
        if len(l) < 6:
            continue
        a = np.array([[c, r] for r, c in l], dtype=np.float32).reshape(-1, 1, 2)
        s = cv2.approxPolyDP(a, 1.2, False).reshape(-1, 2)
        out.append(s)
    return out


icone = {}
cw, ch = W / COL, H / RIG
for i, nome in enumerate(nomi):
    c, r = i % COL, i // COL
    x0, y0, x1, y1 = int(c * cw), int(r * ch), int((c + 1) * cw), int((r + 1) * ch)
    m = inchiostro[y0:y1, x0:x1]
    ys, xs = np.nonzero(m)
    pad = 12
    bx0, by0 = max(0, xs.min() - pad), max(0, ys.min() - pad)
    bx1, by1 = min(m.shape[1], xs.max() + pad), min(m.shape[0], ys.max() + pad)
    m = m[by0:by1, bx0:bx1]
    pezzo = img[y0 + by0:y0 + by1, x0 + bx0:x0 + bx1]
    # PNG con trasparenza: alfa = quanto il pixel si allontana dal bianco
    g = cv2.cvtColor(pezzo, cv2.COLOR_BGR2GRAY).astype(np.float32)
    alfa = np.clip((255 - g) * 1.6, 0, 255)
    alfa = np.maximum(alfa, m * 255).astype(np.uint8)
    rgba = np.dstack([pezzo, alfa])
    cv2.imwrite(os.path.join(pub, f"{nome}.png"), rgba)
    # spessore medio del tratto
    dist = cv2.distanceTransform(m, cv2.DIST_L2, 3)
    sk = skeletonize(m > 0)
    spess = float(np.median(dist[sk]) * 2) if sk.any() else 8.0
    linee = traccia(sk)
    # ordine di disegno: dall'alto a sinistra, prima i tratti lunghi dello stesso «gruppo»
    linee.sort(key=lambda s: (round(s[:, 1].min() / 60), s[:, 0].min()))
    tratti = []
    for s in linee:
        d = "M" + " L".join(f"{x:.0f} {y:.0f}" for x, y in s)
        lung = float(np.sum(np.linalg.norm(np.diff(s, axis=0), axis=1)))
        tratti.append({"d": d, "l": round(lung, 1)})
    icone[nome] = {"w": int(m.shape[1]), "h": int(m.shape[0]), "s": round(spess, 1), "t": tratti}
    print(nome, m.shape[1], "x", m.shape[0], "tratti", len(tratti), "spessore", round(spess, 1))

with open(out_ts, "w", encoding="utf-8") as f:
    f.write("// generato da script/doodle_svg.py — non modificare a mano\n")
    f.write("export const DOODLE: Record<string, { w: number; h: number; s: number; t: { d: string; l: number }[] }> = ")
    f.write(json.dumps(icone, separators=(",", ":")))
    f.write(";\n")
