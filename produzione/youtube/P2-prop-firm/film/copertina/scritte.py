# Copertina YouTube del film P2 (21/11/2026): base Runpod Nano Banana 2 Edit (0,13 $) -> 1280x720, scritte Anton stile L0/trailer.
# Uso: python scritte.py  (scrive copertina-P2-film.jpg e _prova-piccola.jpg)
import os
from PIL import Image, ImageDraw, ImageFont
QUI = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(QUI, "..", "..", "..", "..", "vox", "ep1", "src", "Anton-Regular.ttf")
GIALLO, BIANCO = (255, 210, 63), (255, 255, 255)

def riga(d, xy, testo, size, colore, ombra=10):
    f = ImageFont.truetype(FONT, size)
    x, y = xy
    for dx in range(-ombra, ombra + 1, 2):
        for dy in range(-ombra, ombra + 1, 2):
            d.text((x + dx, y + dy), testo, font=f, fill=(0, 0, 0))
    d.text((x, y), testo, font=f, fill=colore)

def chip(im, xy, testo, size=66, rot=-4, bg=(91, 63, 214)):
    f = ImageFont.truetype(FONT, size)
    l, t, r, b = ImageDraw.Draw(im).textbbox((0, 0), testo, font=f)
    w, h = r - l + 50, b - t + 34
    c = Image.new("RGBA", (w + 16, h + 16), (0, 0, 0, 0))
    d = ImageDraw.Draw(c)
    d.rounded_rectangle((8, 8, w + 8, h + 8), 14, fill=(0, 0, 0, 255))
    d.rounded_rectangle((0, 0, w, h), 14, fill=bg + (255,))
    d.text((25 - l, 17 - t), testo, font=f, fill=(255, 255, 255))
    c = c.rotate(rot, expand=True, resample=Image.BICUBIC)
    im.paste(c, xy, c)

im = Image.open(os.path.join(QUI, "base.png")).convert("RGB").resize((1280, 720), Image.LANCZOS)
d = ImageDraw.Draw(im)
riga(d, (40, 6), "LE 7", 150, BIANCO)
riga(d, (40, 168), "TRAPPOLE", 150, GIALLO)
chip(im, (300, 40), "delle prop firm", size=60, rot=-5)
im.save(os.path.join(QUI, "copertina-P2-film.jpg"), quality=92)
im.resize((320, 180), Image.LANCZOS).save(os.path.join(QUI, "_prova-piccola.jpg"), quality=90)
