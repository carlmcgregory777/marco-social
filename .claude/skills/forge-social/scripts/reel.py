"""Monta un reel FORGE 1080x1920 da un file JSON.

Uso:  python reel.py spec.json

{
  "uscita": "r1.mp4",
  "gancio": {"video": "gancio.mp4", "testo": "Coach, quante volte ti chiedono la scheda?"},
      (senza "video": "img" + "durata", un'immagine ferma con uno zoom lento)
  "scene": [
    {"img": "C:/.../clienti.png", "testo": "Prepari la scheda", "durata": 2.5},
    {"img": "C:/.../cliente-luca.png", "testo": "Il cliente la apre dal link", "durata": 2.5}
  ],
  "finale": {"titolo": "10 schede gratis", "testo": "link in bio · @forgecoach.it", "durata": 2.5}
}

Le schermate stanno dentro una cornice da telefono su sfondo FORGE, il testo e' in alto.
L'audio e' solo quello della clip del gancio (la voce dell'avatar): la musica la aggiunge
Marco dalla libreria di TikTok o Instagram, cosi' non ci sono problemi di diritti.
"""
import json
import os
import subprocess
import sys
import tempfile

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H, FPS = 1080, 1920, 30
BG = (7, 9, 11)
VERDE = (0, 225, 95)
MARCHIO = r"C:\Users\stang\code\forge\marchio"
BOLD = os.path.join(MARCHIO, "SpaceGrotesk-Bold.ttf")
MEDIUM = os.path.join(MARCHIO, "SpaceGrotesk-Medium.ttf")
XFADE = 0.3


def scrivi(draw, testo, y, dim=74, colore=(238, 242, 244), font=BOLD, larghezza=W - 160):
    """Testo centrato; le parole tra *asterischi* in verde (per posizione). Ritorna la y sotto il testo."""
    f = ImageFont.truetype(font, dim)
    for paragrafo in testo.split("\n"):
        # ogni parola e' una lista di pezzi (testo, verde): "PDF" verde + "?" bianco restano una parola sola
        parole, verde, fine_spazio = [], False, True
        for pezzo in paragrafo.split("*"):
            attacca = bool(pezzo) and not pezzo[0].isspace() and not fine_spazio and bool(parole)
            if pezzo:
                fine_spazio = pezzo[-1].isspace()
            for i, p in enumerate(pezzo.split()):
                if i == 0 and attacca:
                    parole[-1].append((p, verde))
                else:
                    parole.append([(p, verde)])
            verde = not verde
        largo = lambda ps: draw.textlength(" ".join("".join(t for t, _ in p) for p in ps), font=f)
        righe, riga = [], []
        for p in parole:
            if riga and largo(riga + [p]) > larghezza:
                righe.append(riga)
                riga = [p]
            else:
                riga.append(p)
        righe.append(riga)
        for riga in righe:
            x = (W - largo(riga)) / 2
            for parola in riga:
                for t, v in parola:
                    draw.text((x + 3, y + 4), t, font=f, fill=(0, 0, 0))
                    draw.text((x, y), t, font=f, fill=VERDE if v else colore)
                    x += draw.textlength(t, font=f)
                x += draw.textlength(" ", font=f)
            y += int(dim * 1.18)
    return y


def sfondo():
    im = Image.new("RGB", (W, H), BG)
    alone = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(alone)
    d.ellipse((W - 500, -400, W + 500, 500), fill=(0, 70, 32))
    return Image.blend(im, alone.filter(ImageFilter.GaussianBlur(160)), 0.9)


def telefono(png, altezza=1330):
    s = Image.open(png).convert("RGB")
    s = s.resize((int(s.width * altezza / s.height), altezza), Image.LANCZOS)
    m = Image.new("L", s.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, s.width - 1, s.height - 1), radius=56, fill=255)
    cornice = Image.new("RGBA", (s.width + 28, s.height + 28), (0, 0, 0, 0))
    ImageDraw.Draw(cornice).rounded_rectangle((0, 0, cornice.width - 1, cornice.height - 1), radius=70, fill=(33, 43, 52, 255))
    cornice.paste(s, (14, 14), m)
    return cornice


def fotogramma_scena(sc, file):
    im = sfondo()
    d = ImageDraw.Draw(im)
    y = scrivi(d, sc["testo"], 150, dim=70)
    tel = telefono(sc["img"], altezza=min(1330, H - max(y + 60, 430) - 60))
    im.paste(tel, ((W - tel.width) // 2, max(y + 50, 420)), tel)
    im.save(file)


def fotogramma_finale(fn, file):
    im = sfondo()
    d = ImageDraw.Draw(im)
    logo = Image.open(os.path.join(MARCHIO, "icona-1024.png")).convert("RGB").resize((220, 220))
    im.paste(logo, ((W - 220) // 2, 560))
    y = scrivi(d, fn.get("titolo", "10 schede gratis"), 860, dim=96, colore=VERDE)
    scrivi(d, fn.get("testo", "link in bio · @forgecoach.it"), y + 30, dim=52, colore=(139, 151, 163), font=MEDIUM)
    im.save(file)


def testo_gancio(testo, file):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    fascia = Image.new("RGBA", (W, 520), (0, 0, 0, 0))
    for i in range(520):
        ImageDraw.Draw(fascia).line((0, i, W, i), fill=(0, 0, 0, int(170 * (1 - i / 520))))
    im.alpha_composite(fascia, (0, 0))
    scrivi(d, testo, 150, dim=78)
    d.text((40, H - 90), "Contenuto creato con l'AI", font=ImageFont.truetype(MEDIUM, 30), fill=(200, 205, 210))
    im.save(file)


def run(*a):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *a], check=True)


def main():
    spec = json.load(open(sys.argv[1], encoding="utf-8"))
    base = os.path.dirname(os.path.abspath(sys.argv[1]))
    tmp = tempfile.mkdtemp(prefix="reel-forge-")
    pezzi = []
    g = spec["gancio"]
    over = os.path.join(tmp, "gancio.png")
    testo_gancio(g["testo"], over)
    gv = os.path.join(tmp, "p0.mp4")
    if g.get("video"):
        src = os.path.join(base, g["video"])
        run("-i", src, "-i", over, "-filter_complex",
            "[0:v]scale=%d:%d:force_original_aspect_ratio=increase,crop=%d:%d,fps=%d[v];[v][1:v]overlay=0:0,format=yuv420p[o]" % (W, H, W, H, FPS),
            "-map", "[o]", "-map", "0:a?", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-c:a", "aac", "-ar", "48000", "-ac", "2", gv)
    else:
        src = os.path.join(base, g["img"])
        d = g.get("durata", 3)
        run("-loop", "1", "-t", str(d), "-i", src, "-i", over, "-f", "lavfi", "-t", str(d), "-i", "anullsrc=r=48000:cl=stereo",
            "-filter_complex",
            "[0:v]scale=%d:%d:force_original_aspect_ratio=increase,crop=%d:%d,zoompan=z='min(zoom+0.0007,1.06)':d=%d:s=%dx%d:fps=%d[v];[v][1:v]overlay=0:0,format=yuv420p[o]" % (W, H, W, H, int(d * FPS), W, H, FPS),
            "-map", "[o]", "-map", "2:a", "-c:v", "libx264", "-crf", "18", "-c:a", "aac", "-shortest", gv)
    pezzi.append(gv)
    fotogrammi = []
    for i, sc in enumerate(spec["scene"], 1):
        f = os.path.join(tmp, "s%d.png" % i)
        fotogramma_scena({**sc, "img": os.path.join(base, sc["img"])}, f)
        fotogrammi.append((f, sc.get("durata", 2.5)))
    f = os.path.join(tmp, "fine.png")
    fotogramma_finale(spec.get("finale", {}), f)
    fotogrammi.append((f, spec.get("finale", {}).get("durata", 2.5)))
    for i, (f, d) in enumerate(fotogrammi, 1):
        p = os.path.join(tmp, "p%d.mp4" % i)
        run("-loop", "1", "-t", str(d), "-i", f, "-f", "lavfi", "-t", str(d), "-i", "anullsrc=r=48000:cl=stereo",
            "-vf", "fps=%d,format=yuv420p" % FPS, "-c:v", "libx264", "-crf", "18", "-c:a", "aac", "-shortest", p)
        pezzi.append(p)
    # dissolvenze brevi tra i pezzi
    durate = []
    for p in pezzi:
        out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True).stdout
        durate.append(float(out.strip()))
    ingressi = []
    for p in pezzi:
        ingressi += ["-i", p]
    fv, fa, t, prev_v, prev_a = [], [], 0.0, "0:v", "0:a"
    for i in range(1, len(pezzi)):
        t += durate[i - 1] - XFADE
        fv.append("[%s][%d:v]xfade=transition=slideleft:duration=%s:offset=%.3f[v%d]" % (prev_v, i, XFADE, t, i))
        fa.append("[%s][%d:a]acrossfade=d=%s[a%d]" % (prev_a, i, XFADE, i))
        prev_v, prev_a = "v%d" % i, "a%d" % i
    uscita = os.path.join(base, spec.get("uscita", "reel.mp4"))
    run(*ingressi, "-filter_complex", ";".join(fv + fa) + ";[%s]loudnorm=I=-14:TP=-1.5:LRA=11[af]" % prev_a,
        "-map", "[%s]" % prev_v, "-map", "[af]", "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", uscita)
    print(uscita)


if __name__ == "__main__":
    main()
