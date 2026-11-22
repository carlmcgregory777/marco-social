# Copertine nuove del film P2 (22/11/2026): basi Dreamina GPT Image 2.5 (25 crediti l'una) + scritte Anton, 3 parole al massimo.
# base1 = soldi finti DEMO · base2 = scontrino 3 challenge · base3 = «shh» e sveglia 00:00. Uso: python scritte.py
import os, sys
from PIL import Image, ImageDraw, ImageFilter
QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(QUI, "..", "copertina"))
from scritte import riga, chip, GIALLO, BIANCO   # stesse funzioni delle copertine di sempre
ROSSO = (255, 59, 77)
P = lambda f: os.path.join(QUI, f)

def base(nome, velo=(560, 260)):
    im = Image.open(P(nome)).convert("RGB").resize((1280, 720), Image.LANCZOS)
    m = Image.new("L", (1280, 720), 0); ImageDraw.Draw(m).rectangle((0, 0) + velo, fill=210)
    return Image.composite(Image.new("RGB", im.size, (8, 6, 14)), im, m.filter(ImageFilter.GaussianBlur(45)))

def a():  # 100.000 $ FINTI
    im = base("base1.png", (600, 330)); d = ImageDraw.Draw(im)
    riga(d, (34, 4), "100.000$", 150, BIANCO)
    riga(d, (34, 168), "FINTI", 190, ROSSO)
    chip(im, (40, 385), "lo scrivono loro", size=50, rot=-4)
    return im

def b():  # LA PAGHI 3 VOLTE
    im = base("base2.png", (600, 360)); d = ImageDraw.Draw(im)
    riga(d, (34, 4), "LA PAGHI", 150, BIANCO)
    riga(d, (34, 170), "3 VOLTE", 180, GIALLO)
    chip(im, (40, 390), "in media", size=54, rot=-4)
    return im

def c():  # BOCCIATO MENTRE DORMI
    im = base("base3.png", (720, 230)); d = ImageDraw.Draw(im)
    riga(d, (34, 4), "BOCCIATO", 160, ROSSO)
    riga(d, (34, 178), "MENTRE DORMI", 92, BIANCO)
    return im

out = {"A": a(), "B": b(), "C": c()}
for k, im in out.items():
    im.save(P(f"copertina-P2-{k}.jpg"), quality=93)
t = Image.new("RGB", (1280 + 340, 720 * 3 + 40), (30, 30, 30))
for i, k in enumerate("ABC"):
    t.paste(out[k], (0, i * 740)); t.paste(out[k].resize((320, 180), Image.LANCZOS), (1290, i * 740))
t.save(P("_confronto.jpg"), quality=85)
