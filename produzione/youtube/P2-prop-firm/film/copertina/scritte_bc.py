# Copertine B e C del film P2 (22/11/2026), gratis: fotogrammi del film + C scontornato (sfondo bianco, soglia + riempimento dai bordi) + scritte Anton come scritte.py.
import os
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import numpy as np, cv2
from scritte import riga, chip, GIALLO, BIANCO
QUI = os.path.dirname(os.path.abspath(__file__))
ROSSO = (255, 77, 94)
P = lambda f: os.path.join(QUI, f)

def scontorna(f):
    a = np.array(Image.open(f).convert("RGB"))
    chiaro = ((a.min(axis=2) > 205) & (a.max(axis=2) - a.min(axis=2) < 30)).astype(np.uint8) * 255
    h, w = chiaro.shape; ff = chiaro.copy(); m = np.zeros((h + 2, w + 2), np.uint8)
    for p in [(0, 0), (w - 1, 0), (0, h // 2), (w - 1, h // 2), (w // 2, 0)]:
        if ff[p[1], p[0]] == 255: cv2.floodFill(ff, m, p, 128)
    alpha = np.where(ff == 128, 0, 255).astype(np.uint8)
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    alpha = cv2.GaussianBlur(alpha, (5, 5), 0)
    im = Image.fromarray(a).convert("RGBA"); im.putalpha(Image.fromarray(alpha))
    return im

def copertina_b():
    bg = Image.open(P("bg-breach.png")).convert("RGB").resize((1280, 720), Image.LANCZOS)
    bg = ImageEnhance.Brightness(bg).enhance(0.85)
    # buio graduale in basso a sinistra per le scritte
    m = Image.new("L", (1280, 720), 0); ImageDraw.Draw(m).rectangle((0, 380, 760, 720), fill=230); ImageDraw.Draw(m).rectangle((640, 0, 1280, 720), fill=255)  # scuro a destra: sparisce il manichino
    bg = Image.composite(Image.new("RGB", bg.size, (11, 10, 16)), bg, m.filter(ImageFilter.GaussianBlur(50)))
    c = scontorna(P("c23b.png"))
    c = c.crop(c.getbbox())
    h = 700; c = c.resize((int(c.width * h / c.height), h), Image.LANCZOS)
    # alone viola dietro C
    alone = Image.new("RGBA", (1280, 720), (0, 0, 0, 0))
    x = 1280 - c.width + 60
    sag = Image.new("RGBA", c.size, (91, 63, 214, 0)); sag.putalpha(c.getchannel("A"))
    alone.paste(sag, (x, 720 - h + 20), sag); alone = alone.filter(ImageFilter.GaussianBlur(25))
    bg = Image.alpha_composite(bg.convert("RGBA"), alone)
    bg.paste(c, (x, 720 - h + 20), c)
    d = ImageDraw.Draw(bg)
    riga(d, (40, 360), "IN GUADAGNO", 130, BIANCO)
    riga(d, (40, 510), "E BOCCIATO", 150, ROSSO)
    chip(bg, (40, 290), "trappola n.2", size=50, rot=-4)
    return bg.convert("RGB")

def copertina_c():
    im = Image.open(os.path.join(QUI, "..", "..", "trailer", "copertina", "ab", "base-B.png")).convert("RGB").resize((1280, 720), Image.LANCZOS)
    m = Image.new("L", (1280, 720), 0); ImageDraw.Draw(m).rectangle((0, 0, 760, 380), fill=235)
    im = Image.composite(Image.new("RGB", im.size, (11, 10, 16)), im, m.filter(ImageFilter.GaussianBlur(60)))
    d = ImageDraw.Draw(im)
    riga(d, (40, 14), "COSA FANNO", 140, BIANCO)
    riga(d, (40, 170), "I 7 SU 100", 150, GIALLO)
    chip(im, (40, 370), "che vengono pagati", size=60)
    return im

for nome, f in [("B", copertina_b), ("C", copertina_c)]:
    f().save(P(f"copertina-P2-film-{nome}.jpg"), quality=92)
a = Image.open(P("copertina-P2-film.jpg")); b = Image.open(P("copertina-P2-film-B.jpg")); c = Image.open(P("copertina-P2-film-C.jpg"))
t = Image.new("RGB", (1280 + 340, 720 * 3 + 40), (30, 30, 30))
for i, im in enumerate([a, b, c]):
    t.paste(im, (0, i * 740)); t.paste(im.resize((320, 180), Image.LANCZOS), (1290, i * 740))
t.save(P("_confronto.jpg"), quality=85)
