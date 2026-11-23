# Clip verticali 1080x1920 dal film P2 (23/11/2026), per Reels, TikTok e Shorts.
# Uso: python clip.py <n> [<n> ...]   (n = numero della clip in CLIP; "tutte" per farle tutte)
# Schema: titolo in alto, film 16:9 al centro, sottotitoli parola per parola, finale «CONTINUA SU YOUTUBE».
import json, subprocess, sys, os
from PIL import Image, ImageDraw, ImageFont

QUI = os.path.dirname(os.path.abspath(__file__))
FILM = os.path.join(QUI, "..", "film", "finale", "P2-film-YOUTUBE-1440p-v3b.mp4")
COP = os.path.join(QUI, "..", "film", "copertina2", "copertina-P2-A.jpg")
PAROLE = json.load(open(os.path.join(QUI, "parole-film.json"), encoding="utf-8"))
# Correzioni della trascrizione (Whisper sbaglia nomi e parole): tempo d'inizio -> parola giusta ("" = togli).
GIUSTE = {228.24: "", 239.28: "size", 257.12: "in perdita.", 379.0: "Arkes", 379.56: "Blumer,", 451.3: "A",
          474.82: "Risultato,", 479.68: "ceca", 481.72: "ricompense", 548.82: "chi lo mette", 576.3: "ha",
          576.46: "tolte", 576.74: "Trustpilot.", 603.02: "280.", 603.28: ""}
for w in PAROLE:
    if w["a"] in GIUSTE: w["w"] = GIUSTE[w["a"]]
    if w["w"].lower().startswith("imperdita"): w["w"] = "in perdita" + w["w"][9:]
P2 = []
for w in PAROLE:  # riattacca i pezzi staccati: "100 .000", "un 'operazione", "0 ,71%"
    if w["w"] and P2 and w["w"][0] in ".,'%" and len(w["w"]) > 1:
        P2[-1]["w"] += w["w"]; P2[-1]["b"] = w["b"]
    elif w["w"]: P2.append(dict(w))
PAROLE = P2
NERO, VIOLA, BIANCO = (11, 10, 16), (91, 63, 214), (255, 255, 255)
F = "C:/Windows/Fonts/"
def font(n, s): return ImageFont.truetype(F + n, s)
CODA = 3.2  # secondi del cartello finale

# (da, a, etichetta, riga1, riga2 con [parola] nel riquadro viola)
CLIP = {
  1: (0.0, 45.9, "LE 7 TRAPPOLE", "Su 100 che ci provano", "solo [7] vengono pagati"),
  2: (98.6, 155.6, "TRAPPOLA 1 DI 7", "Il conto da 100.000 $", "[non esiste]"),
  3: (155.6, 226.9, "TRAPPOLA 2 DI 7", "Bocciato", "mentre [dormi]"),
  4: (233.0, 328.5, "TRAPPOLA 3 DI 7", "L'obiettivo che", "ti fa [rischiare]"),
  5: (354.0, 402.0, "TRAPPOLA 4 DI 7", "Il cliente", "[perfetto] sei tu"),
  6: (402.8, 460.0, "TRAPPOLA 5 DI 7", "Le regole con", "gli [aggettivi]"),
  7: (459.9, 536.1, "TRAPPOLA 6 DI 7", "Se vinci tu,", "per loro è un [costo]"),
  8: (536.1, 587.0, "TRAPPOLA 7 DI 7", "Chi te l'ha", "[consigliata]?"),
  9: (587.1, 667.1, "I 7 CHE VENGONO PAGATI", "Cosa fanno", "[diversamente]"),
}

def riga_box(d, y, testo, f, cx=540):
    # testo con una [parola] dentro il riquadro viola, centrato
    pezzi = []
    for i, p in enumerate(testo.replace("]", "[").split("[")):
        if p: pezzi.append((p, i % 2 == 1))
    w = sum(d.textlength(p, font=f) + (36 if b else 0) for p, b in pezzi)
    x = cx - w / 2
    for p, b in pezzi:
        tw = d.textlength(p, font=f)
        if b:
            d.rectangle([x, y - 6, x + tw + 36, y + f.size + 18], fill=VIOLA)
            d.text((x + 18, y), p, font=f, fill=BIANCO); x += tw + 36
        else:
            d.text((x, y), p, font=f, fill=NERO); x += tw

def sopra(n, out):
    _, _, et, r1, r2 = CLIP[n]
    im = Image.new("RGB", (1080, 1920), BIANCO); d = ImageDraw.Draw(im)
    fe = font("seguibl.ttf", 38); w = d.textlength(et, font=fe)
    d.rounded_rectangle([540 - w / 2 - 26, 250, 540 + w / 2 + 26, 312], 14, fill=NERO)
    d.text((540 - w / 2, 256), et, font=fe, fill=BIANCO)
    ft = font("seguibl.ttf", 84)
    riga_box(d, 350, r1, ft); riga_box(d, 460, r2, ft)
    fs = font("segoeuib.ttf", 34); s = "Dal film «Le 7 trappole delle prop firm» · completo su YouTube"
    d.text((540 - d.textlength(s, font=fs) / 2, 1310), s, font=fs, fill=(120, 120, 130))
    im.save(out)

def coda(out):
    im = Image.new("RGB", (1080, 1920), BIANCO); d = ImageDraw.Draw(im)
    ft = font("seguibl.ttf", 96)
    riga_box(d, 330, "CONTINUA", ft); riga_box(d, 450, "SU [YOUTUBE]", ft)
    c = Image.open(COP).convert("RGB").resize((960, 540))
    d.rounded_rectangle([54, 634, 1026, 1186], 28, fill=VIOLA); im.paste(c, (60, 640))
    f2 = font("seguibl.ttf", 58); f3 = font("segoeuib.ttf", 44)
    for y, t, f in [(1250, "Il film completo: 12 minuti", f2), (1340, "cerca «C The Trader» · link in bio", f3)]:
        d.text((540 - d.textlength(t, font=f) / 2, y), t, font=f, fill=NERO)
    im.save(out)

def ass(da, a, out):
    # sottotitoli: gruppi di 3 parole, la parola detta in viola
    ws = [w for w in PAROLE if w["a"] >= da - 0.05 and w["b"] <= a + 0.05 and w["w"]]
    def t(s):
        s = max(0, s - da); return f"{int(s//3600)}:{int(s%3600//60):02d}:{s%60:05.2f}"
    righe = ["[Script Info]", "PlayResX: 1080", "PlayResY: 1920", "", "[V4+ Styles]",
             "Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV",
             "Style: S,Segoe UI Black,78,&H00100A0B,&H00FFFFFF,&H00FFFFFF,1,1,0,0,5,60,60,0", "",
             "[Events]", "Format: Layer, Start, End, Style, Text"]
    gr = [ws[i:i + 3] for i in range(0, len(ws), 3)]
    for gi, g in enumerate(gr):
        for j, w in enumerate(g):
            nxt = g[j + 1]["a"] if j + 1 < len(g) else (gr[gi + 1][0]["a"] if gi + 1 < len(gr) else w["b"] + 0.3)
            fine = min(nxt, w["b"] + 0.6) if j + 1 == len(g) else nxt
            txt = " ".join(("{\\c&H00D63F5B&}" + x["w"].upper() + "{\\c&H00100A0B&}") if k == j else x["w"].upper() for k, x in enumerate(g))
            righe.append(f"Dialogue: 0,{t(w['a'])},{t(fine)},S,{{\\pos(540,1480)}}{txt}")
    open(out, "w", encoding="utf-8").write("\n".join(righe) + "\n")

def fai(n):
    da, a = CLIP[n][:2]; L = a - da
    os.makedirs(os.path.join(QUI, "out"), exist_ok=True); os.chdir(QUI)
    sopra(n, f"tmp-sopra{n}.png"); coda("tmp-coda.png"); ass(da, a, f"tmp-{n}.ass")
    out = f"out/P2-clip{n}.mp4"
    fc = (f"[0:v]scale=1280:720:flags=lanczos,crop=1080:720[f];[1:v][f]overlay=0:560:shortest=1,subtitles=tmp-{n}.ass:fontsdir=C\\\\:/Windows/Fonts,"
          f"fps=30,format=yuv420p,trim=duration={L},setpts=PTS-STARTPTS[m];[2:v]scale=1080:1920,fps=30,format=yuv420p,trim=0:{CODA},setpts=PTS-STARTPTS,fade=t=in:d=0.25[c];"
          f"[m][c]concat=n=2:v=1:a=0[v];[0:a]afade=t=out:st={L-0.3}:d=0.3,apad=pad_dur={CODA}[a]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(da), "-t", str(L), "-i", FILM,
                    "-loop", "1", "-t", str(L), "-i", f"tmp-sopra{n}.png", "-loop", "1", "-t", str(CODA), "-i", "tmp-coda.png",
                    "-filter_complex", fc, "-map", "[v]", "-map", "[a]", "-t", str(L + CODA), "-c:v", "libx264", "-preset", "medium",
                    "-crf", "20", "-threads", "4", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", out], check=True)
    print("ok", out, round(L + CODA, 1))

if __name__ == "__main__":
    for n in (CLIP if sys.argv[1] == "tutte" else map(int, sys.argv[1:])): fai(n)
