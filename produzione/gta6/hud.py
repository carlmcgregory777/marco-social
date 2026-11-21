# HUD stile videogioco open-world per G1 «GTA Milano» (21/11/2026).
# Disegna minimappa, stelle ricercato, dialoghi, checkpoint, logo e «MISSIONE COMPIUTA»
# sopra il video base e mette l'audio (voci + effetti). Niente logo ufficiale di GTA/Rockstar.
#
# Uso: python hud.py <base.mp4 oppure cartella di immagini sN.png> <out.mp4>
#   - con una cartella di immagini fa un'anteprima (ogni scena = immagine ferma con zoom lento)
import math, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H, FPS = 1080, 1920, 30
QUI = os.path.dirname(os.path.abspath(__file__))
ANTON = os.path.join(QUI, "..", "vox", "ep1", "src", "Anton-Regular.ttf")
BOLD = r"C:\Windows\Fonts\segoeuib.ttf"
VIOLA, ACCENTO = (91, 63, 214), (139, 109, 255)

# Scene: (inizio, fine) in secondi
SCENE = [(0.0, 2.5), (2.5, 11.2), (11.2, 16.2), (16.2, 20.2), (20.2, 24.7), (24.7, 38.0)]
DURATA = SCENE[-1][1]
# Battute: (file, inizio, chi, testo)
BATTUTE = [
    ("k1", 2.7, "CONTATTO", "C, ho una missione per te."),
    ("k2", 5.0, "CONTATTO", "È uscito GTA VI. 79,99 €."),
    ("c1", 9.3, "C", "79 euro?"),
    ("k3", 11.6, "CONTATTO", "Primo checkpoint: Piazza Cordusio. Muoviti."),
    ("p1", 17.0, "PASSANTE", "Ehi, attento!"),
    ("k4", 20.8, "CONTATTO", "Checkpoint: Piazza Affari."),
    ("k5", 25.0, "CONTATTO", "Guarda. Primo giorno: 3,79 miliardi di dollari."),
    ("c2", 30.9, "C", "In un giorno."),
    ("c3", 32.6, "C", "Noi abbiamo pagato il gioco. Loro hanno vinto la missione."),
]
# Stelle ricercato nel tempo
STELLE = [(0, 0), (11.2, 1), (17.2, 3), (20.2, 2), (24.7, 0)]
CHECKPOINT = [(11.4, 14.8, "PRIMO CHECKPOINT", "Piazza Cordusio"), (20.4, 23.6, "CHECKPOINT", "Piazza Affari")]
COMPIUTA = 33.2

def durata_audio(f):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                                capture_output=True, text=True).stdout.strip())

VOCE = os.path.join(QUI, "voce")
BATTUTE = [(k, t, chi, tx, durata_audio(os.path.join(VOCE, k + ".mp3"))) for k, t, chi, tx in BATTUTE]

def font(p, s):
    return ImageFont.truetype(p, s)

F_SUB, F_CHI = font(BOLD, 46), font(BOLD, 34)
F_CP1, F_CP2 = font(ANTON, 54), font(ANTON, 96)
F_LOGO1, F_LOGO2 = font(ANTON, 150), font(ANTON, 120)
F_MC, F_MC2 = font(ANTON, 150), font(BOLD, 52)

def ease(x):
    x = max(0.0, min(1.0, x))
    return 1 - (1 - x) ** 3

def testo_ombra(d, xy, tx, f, fill, anchor="mm", ombra=6, spessore=0):
    x, y = xy
    d.text((x + ombra * 0.4, y + ombra * 0.6), tx, font=f, fill=(0, 0, 0, 160), anchor=anchor)
    d.text((x, y), tx, font=f, fill=fill, anchor=anchor, stroke_width=spessore, stroke_fill=(0, 0, 0, 255))

def a_capo(tx, f, maxw, d):
    parole, righe, r = tx.split(), [], ""
    for p in parole:
        prova = (r + " " + p).strip()
        if d.textlength(prova, font=f) > maxw and r:
            righe.append(r); r = p
        else:
            r = prova
    righe.append(r)
    return righe

# ---------- minimappa ----------
MM_R, MM_C = 170, (60 + 170, H - 300)
STRADE = [((-400, -60), (400, -60)), ((-400, 120), (400, 120)), ((-80, -400), (-80, 400)), ((110, -400), (110, 400)),
          ((-400, -260), (400, -260)), ((260, -400), (260, 400)), ((-260, -400), (-260, 400)), ((-400, 300), (400, 300))]
PERCORSO = [(-80, 300), (-80, 120), (110, 120), (110, -60), (110, -260), (260, -260)]

def lungo(percorso):
    return sum(math.dist(percorso[i], percorso[i + 1]) for i in range(len(percorso) - 1))

def punto_su(percorso, s):
    for i in range(len(percorso) - 1):
        l = math.dist(percorso[i], percorso[i + 1])
        if s <= l:
            a, b = percorso[i], percorso[i + 1]
            return (a[0] + (b[0] - a[0]) * s / l, a[1] + (b[1] - a[1]) * s / l), math.atan2(b[1] - a[1], b[0] - a[0])
        s -= l
    a, b = percorso[-2], percorso[-1]
    return b, math.atan2(b[1] - a[1], b[0] - a[0])

def minimappa(t):
    S = MM_R * 2
    m = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(m)
    d.ellipse((0, 0, S - 1, S - 1), fill=(38, 38, 46, 225))
    prog = ease((t - 2.5) / (DURATA - 9)) if t > 2.5 else 0
    pos, ang = punto_su(PERCORSO, prog * lungo(PERCORSO))
    sc = 0.9
    def P(p):  # mondo -> mappa centrata sul giocatore
        return (MM_R + (p[0] - pos[0]) * sc, MM_R + (p[1] - pos[1]) * sc)
    for a, b in STRADE:
        d.line([P(a), P(b)], fill=(92, 92, 104, 255), width=22)
    d.line([P(p) for p in PERCORSO], fill=ACCENTO + (255,), width=12, joint="curve")
    dest = P(PERCORSO[-1])
    lamp = 1 + 0.25 * math.sin(t * 8)
    d.ellipse((dest[0] - 18 * lamp, dest[1] - 18 * lamp, dest[0] + 18 * lamp, dest[1] + 18 * lamp), fill=(255, 255, 255, 255), outline=ACCENTO + (255,), width=6)
    # freccia del giocatore
    c = (MM_R, MM_R)
    pts = [(22, 0), (-14, 13), (-7, 0), (-14, -13)]
    rot = [(c[0] + x * math.cos(ang) - y * math.sin(ang), c[1] + x * math.sin(ang) + y * math.cos(ang)) for x, y in pts]
    d.polygon(rot, fill=(255, 255, 255, 255))
    maschera = Image.new("L", (S, S), 0)
    ImageDraw.Draw(maschera).ellipse((0, 0, S - 1, S - 1), fill=255)
    out = Image.new("RGBA", (S + 24, S + 24), (0, 0, 0, 0))
    od = ImageDraw.Draw(out)
    od.ellipse((0, 0, S + 23, S + 23), fill=ACCENTO + (200,))
    out.paste(m, (12, 12), maschera)
    return out

# ---------- stelle ----------
def stella(cx, cy, r, piena, d):
    pts = []
    for i in range(10):
        rr = r if i % 2 == 0 else r * 0.45
        a = -math.pi / 2 + i * math.pi / 5
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d.polygon(pts, fill=(255, 255, 255, 255) if piena else (255, 255, 255, 70), outline=(0, 0, 0, 200), width=3)

def n_stelle(t):
    n = 0
    for t0, k in STELLE:
        if t >= t0:
            n = k
    return n

# ---------- fotogramma HUD ----------
def hud(t):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if t < SCENE[0][1]:  # apertura: il poster ha già il logo, niente HUD
        return im
    if False:  # vecchio logo disegnato (tenuto per riferimento)
        a = 0
        lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ld = ImageDraw.Draw(lay)
        sc = 1 + 0.04 * t
        for i, (riga, f) in enumerate([("GRAND THEFT", F_LOGO2), ("TRADING", F_LOGO1)]):
            y = 760 + i * 150
            ld.text((W / 2 + 8, y + 10), riga, font=f, fill=(0, 0, 0, 200), anchor="mm")
            ld.text((W / 2, y), riga, font=f, fill=(255, 255, 255, 255), anchor="mm", stroke_width=8, stroke_fill=VIOLA + (255,))
        ld.rounded_rectangle((W / 2 - 220, 1010, W / 2 + 220, 1110), 22, fill=ACCENTO + (255,))
        ld.text((W / 2, 1060), "MILANO", font=F_CP2, fill=(255, 255, 255, 255), anchor="mm")
        lay = lay.resize((int(W * sc), int(H * sc)), Image.LANCZOS).crop((int((W * sc - W) / 2), int((H * sc - H) / 2), int((W * sc - W) / 2) + W, int((H * sc - H) / 2) + H))
        lay.putalpha(lay.getchannel("A").point(lambda v: int(v * a)))
        return lay
    # minimappa
    mm = minimappa(t)
    im.alpha_composite(mm, (MM_C[0] - mm.width // 2, MM_C[1] - mm.height // 2))
    # stelle (in alto a destra, lampeggiano quando salgono)
    n = n_stelle(t)
    lamp = any(t0 <= t < t0 + 1.5 and k > 0 for t0, k in STELLE)
    for i in range(5):
        piena = (4 - i) < n and not (lamp and int(t * 6) % 2)
        stella(W - 70 - i * 70, 150, 30, piena, d)
    # checkpoint
    for t0, t1, a1, a2 in CHECKPOINT:
        if t0 <= t < t1:
            a = ease((t - t0) / 0.3) * (1 - ease((t - t1 + 0.3) / 0.3))
            y = 520 - 30 * (1 - ease((t - t0) / 0.4))
            testo_ombra(d, (W / 2, y), a1, F_CP1, ACCENTO + (int(255 * a),))
            testo_ombra(d, (W / 2, y + 85), a2.upper(), F_CP2, (255, 255, 255, int(255 * a)), spessore=4)
    # dialoghi
    attive = [b for b in BATTUTE if b[1] - 0.1 <= t]  # solo l'ultima battuta iniziata: mai due sovrapposte
    for k, t0, chi, tx, du in attive[-1:]:
        if t < t0 + du + 0.5:
            righe = a_capo(tx, F_SUB, W - 220, d)
            y0 = 1290 - 30 * (len(righe) - 1)
            colore = (255, 214, 64, 255) if chi == "C" else (255, 255, 255, 255)
            testo_ombra(d, (W / 2, y0 - 60), chi, F_CHI, ACCENTO + (255,), spessore=3)
            for j, r in enumerate(righe):
                testo_ombra(d, (W / 2, y0 + j * 62), r, F_SUB, colore, spessore=4)
    # missione compiuta
    if t >= COMPIUTA:
        a = ease((t - COMPIUTA) / 0.35)
        sc = 1.25 - 0.25 * a
        lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ld = ImageDraw.Draw(lay)
        ld.rectangle((0, 700, W, 1080), fill=(0, 0, 0, 150))
        ld.text((W / 2, 820), "MISSIONE", font=F_MC, fill=(255, 214, 64, 255), anchor="mm", stroke_width=6, stroke_fill=(0, 0, 0, 255))
        ld.text((W / 2, 960), "COMPIUTA", font=F_MC, fill=(255, 214, 64, 255), anchor="mm", stroke_width=6, stroke_fill=(0, 0, 0, 255))
        ld.text((W / 2, 1045), "+ 3,79 MLD $   ·   a loro", font=F_MC2, fill=(255, 255, 255, 255), anchor="mm", stroke_width=3, stroke_fill=(0, 0, 0, 255))
        lay = lay.resize((int(W * sc), int(H * sc)), Image.LANCZOS)
        ox, oy = (lay.width - W) // 2, (lay.height - H) // 2
        lay = lay.crop((ox, oy, ox + W, oy + H))
        lay.putalpha(lay.getchannel("A").point(lambda v: int(v * a)))
        im.alpha_composite(lay)
    return im

def base_da_immagini(cartella):
    """Anteprima: ogni scena = sN.png ferma con un lento zoom."""
    imgs = []
    for i in range(len(SCENE)):
        p = os.path.join(cartella, f"s{i + 1}.png")
        if not os.path.exists(p):
            p = os.path.join(cartella, f"s{i + 1}.jpg")
        im = Image.open(p).convert("RGB")
        r = max(W / im.width, H / im.height)
        im = im.resize((int(im.width * r) + 1, int(im.height * r) + 1), Image.LANCZOS)
        imgs.append(im)
    def frame(t):
        for i, (a, b) in enumerate(SCENE):
            if a <= t < b or i == len(SCENE) - 1:
                im = imgs[i]
                z = 1 + 0.06 * (t - a) / (b - a)
                w, h = int(W / z), int(H / z)
                ox, oy = (im.width - w) // 2, (im.height - h) // 2
                return im.crop((ox, oy, ox + w, oy + h)).resize((W, H), Image.BILINEAR)
    return frame

def audio(out_wav):
    """Voci + bip della chiamata + effetti, in un solo wav."""
    ins, filtri = [], []
    for i, (k, t0, chi, tx, du) in enumerate(BATTUTE):
        ins += ["-i", os.path.join(VOCE, k + ".mp3")]
        # voce del contatto «al telefono»: banda stretta
        f = "highpass=f=300,lowpass=f=3400,volume=1.4" if chi == "CONTATTO" else "volume=1.0"
        filtri.append(f"[{i}:a]{f},adelay={int(t0 * 1000)}|{int(t0 * 1000)}[v{i}]")
    n = len(BATTUTE)
    # musica a crescendo + effetti (audio/ da musica_regia.py)
    AU = os.path.join(QUI, "audio")
    extra = [("musica.wav", 0.0, 0.22), ("whoosh.wav", 2.4, 0.6), ("whoosh.wav", 11.1, 0.6), ("ding.wav", 11.4, 0.7),
             ("whoosh.wav", 16.1, 0.6), ("whoosh.wav", 20.1, 0.6), ("ding.wav", 20.4, 0.7), ("whoosh.wav", 24.6, 0.6),
             ("riser.wav", 31.2, 0.5), ("impact.wav", COMPIUTA, 0.9)]
    for j, (f, t0, vol) in enumerate(extra):
        ins += ["-i", os.path.join(AU, f)]
        filtri.append(f"[{n + j}:a]volume={vol},adelay={int(t0 * 1000)}|{int(t0 * 1000)}[x{j}]")
    mix = "".join(f"[v{i}]" for i in range(n)) + "".join(f"[x{j}]" for j in range(len(extra)))
    filtri.append(f"{mix}amix=inputs={n + len(extra)}:normalize=0,alimiter=limit=0.9,apad=whole_dur={DURATA}[a]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(filtri), "-map", "[a]", "-t", str(DURATA), out_wav], check=True)

def main():
    src, out = sys.argv[1], sys.argv[2]
    wav = out[:-4] + "-voci.wav"
    audio(wav)
    n = int(DURATA * FPS)
    if os.path.isdir(src):
        get = base_da_immagini(src)
        cmd_in = ["-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", wav]
        p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", *cmd_in, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-crf", "20",
                              "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", out], stdin=subprocess.PIPE)
        for i in range(n):
            t = i / FPS
            fr = get(t).convert("RGBA")
            fr.alpha_composite(hud(t))
            p.stdin.write(fr.convert("RGB").tobytes())
    else:
        # video base: leggo i fotogrammi da ffmpeg e ci disegno sopra
        lettore = subprocess.Popen(["ffmpeg", "-v", "error", "-i", src, "-vf", f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS}",
                                    "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
        cmd_in = ["-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", wav]
        p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", *cmd_in, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-crf", "18",
                              "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", out], stdin=subprocess.PIPE)
        for i in range(n):
            raw = lettore.stdout.read(W * H * 3)
            if len(raw) < W * H * 3:
                break
            fr = Image.frombytes("RGB", (W, H), raw).convert("RGBA")
            fr.alpha_composite(hud(i / FPS))
            p.stdin.write(fr.convert("RGB").tobytes())
    p.stdin.close(); p.wait()
    print("OK", out)

if __name__ == "__main__":
    main()
