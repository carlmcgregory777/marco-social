# Shorts verticali dagli spezzoni del video lungo L0 (youtu.be/RIrsWRF3X8w).
# Uso: python clip_l0.py [id ...]   (senza argomenti fa tutti gli spezzoni)
# Layout 1080x1920: sfondo sfocato, titolo in alto (Anton), video 16:9 intero al centro,
# sottotitoli parola per parola sotto il video, invito al link «video collegato» sopra la UI di YouTube.
import json, re, subprocess, sys, unicodedata
from pathlib import Path

QUI = Path(__file__).resolve().parent
L0 = QUI.parent / "L0-presentazione"
VIDEO = L0 / "finale" / "L0-presentazione.mp4"
PAROLE = json.load(open(L0 / "montaggio" / "parole.json", encoding="utf-8"))
FONT_DIR = QUI.parents[1] / "vox" / "ep1" / "src"  # Anton-Regular.ttf
OUT = QUI / "finale"
OUT.mkdir(exist_ok=True)

# id, frase iniziale, frase finale, titolo (2 righe max)
SPEZZONI = [
    ("s1-cinema", "venerdì sera, ho una posizione", "che tu lo voglia o no", "HO PERSO 500 €\\NMENTRE ERO AL CINEMA"),
    ("s2-80euro", "sto scrollando e mi esce", "arriva la mazzata", "80 € IN UN'ORA:\\NLA COSA PEGGIORE"),
    ("s3-gratta", "Il problema è quel contatore", "Pure caro", "LE CHALLENGE SONO\\NUN GRATTA E VINCI?"),
    ("s4-metodo", "Pensi che ti manchi un pezzo", "davanti al grafico", "HO CAMBIATO 4 METODI.\\NIL PROBLEMA ERO IO"),
    ("s5-10per20", "Se ogni volta che entri", "non vuol dire rispettarle", "PUOI SBAGLIARE\\NUNA VOLTA SU DUE"),
    ("s6-conviene", "Il grafico va letto in modo oggettivo", "l'inversione dappertutto", "IL GRAFICO LO LEGGI\\NCOME TI CONVIENE"),
]


def norm(s):
    s = unicodedata.normalize("NFKD", s.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in s if not unicodedata.combining(c)))


TOK = [norm(w["w"]) for w in PAROLE]


def trova(frase, dopo=0):
    """indice della prima parola della frase (confronto senza accenti/punteggiatura)."""
    f = [norm(x) for x in frase.replace("'", " ").split()]
    f = [x for x in f if x]
    flat = "".join(f)
    for i in range(dopo, len(TOK)):
        acc, j = "", i
        while j < len(TOK) and len(acc) < len(flat):
            acc += TOK[j]
            j += 1
        if acc == flat:
            return i, j - 1
    raise SystemExit(f"frase non trovata: {frase}")


def t_ass(t):
    h, r = divmod(max(t, 0), 3600)
    m, s = divmod(r, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def sottotitoli(a, b, t0, titolo, durata):
    W = PAROLE[a:b + 1]
    righe = [
        "[Script Info]", "ScriptType: v4.00+", "PlayResX: 1080", "PlayResY: 1920", "WrapStyle: 2", "",
        "[V4+ Styles]",
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
        "Style: Tit,Anton,92,&H00FFFFFF,&H00FFFFFF,&H00100A0B,&H00000000,0,0,0,0,100,100,1,0,3,14,0,8,60,60,250,1",
        "Style: Sub,Anton,104,&H00FFFFFF,&H00FFFFFF,&H00100A0B,&H00000000,0,0,0,0,100,100,1,0,1,7,0,8,50,50,1150,1",
        "Style: Cta,Anton,56,&H00FFFFFF,&H00FFFFFF,&H00100A0B,&H00000000,0,0,0,0,100,100,1,0,1,4,0,8,60,60,1440,1",
        "", "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
        # titolo: riquadro viola dietro (BorderStyle via \\3c + \\bord) e testo bianco
        f"Dialogue: 1,{t_ass(0)},{t_ass(durata)},Tit,,0,0,0,,{{\\3c&HD63F5B&\\bord14}}{titolo}",
        f"Dialogue: 1,{t_ass(0)},{t_ass(durata)},Cta,,0,0,0,,{{\\1c&HFF6D8B&}}▼ LA STORIA COMPLETA: TOCCA IL LINK QUI SOTTO ▼",
    ]
    # gruppi di 2-3 parole, la parola detta in giallo
    gruppi, g = [], []
    for w in W:
        g.append(w)
        fine_frase = w["w"].rstrip().endswith((".", "?", "!", ","))
        if len(g) == 3 or (fine_frase and len(g) >= 2) or sum(len(x["w"]) for x in g) > 16:
            gruppi.append(g); g = []
    if g:
        gruppi.append(g)
    for gi, g in enumerate(gruppi):
        fine_g = gruppi[gi + 1][0]["s"] if gi + 1 < len(gruppi) else g[-1]["e"] + 0.4
        for k, w in enumerate(g):
            s = w["s"]
            e = g[k + 1]["s"] if k + 1 < len(g) else fine_g
            testo = " ".join(
                ("{\\1c&H00D7FF&}" if j == k else "") + x["w"].upper().strip() + ("{\\1c&HFFFFFF&}" if j == k else "")
                for j, x in enumerate(g))
            righe.append(f"Dialogue: 0,{t_ass(s - t0)},{t_ass(e - t0)},Sub,,0,0,0,,{testo}")
    return "\n".join(righe) + "\n"


def fai(sp):
    nome, da, a, titolo = sp
    i0, _ = trova(da)
    _, i1 = trova(a, i0)
    t0 = max(PAROLE[i0]["s"] - 0.12, 0)
    t1 = PAROLE[i1]["e"] + 0.45
    durata = t1 - t0
    ass = OUT / f"{nome}.ass"
    ass.write_text(sottotitoli(i0, i1, t0, titolo, durata), encoding="utf-8")
    fd = str(FONT_DIR).replace("\\", "/").replace(":", "\\:")
    sub = str(ass).replace("\\", "/").replace(":", "\\:")
    filtro = (
        "[0:v]split[a][b];"
        "[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:2,eq=brightness=-0.18[bg];"
        "[b]scale=1080:608:flags=lanczos[fg];"
        "[bg][fg]overlay=0:500,"
        f"subtitles='{sub}':fontsdir='{fd}'[v]"
    )
    out = OUT / f"{nome}.mp4"
    cmd = ["ffmpeg", "-v", "error", "-y", "-ss", f"{t0:.3f}", "-t", f"{durata:.3f}", "-i", str(VIDEO),
           "-filter_complex", filtro, "-map", "[v]", "-map", "0:a",
           "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-r", "30",
           "-c:a", "aac", "-b:a", "192k", "-af", "afade=t=out:st=%.2f:d=0.35" % (durata - 0.35),
           "-movflags", "+faststart", str(out)]
    subprocess.run(cmd, check=True)
    print(f"{nome}: {t0:.2f}-{t1:.2f} ({durata:.1f} s) -> {out.name}")


if __name__ == "__main__":
    scelti = sys.argv[1:]
    for sp in SPEZZONI:
        if not scelti or sp[0] in scelti:
            fai(sp)
