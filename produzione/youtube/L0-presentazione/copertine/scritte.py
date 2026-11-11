# Copertine YouTube L0: base Nano Banana (2752x1536) -> 1280x720 con scritte Anton.
# Uso: python scritte.py   (scrive copertina-A/B/C.jpg e _confronto.jpg con la prova a 160 px)
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

QUI = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(QUI, "..", "..", "..", "vox", "ep1", "src", "Anton-Regular.ttf")
GIALLO, BIANCO, ROSSO, VIOLA = (255, 210, 63), (255, 255, 255), (255, 77, 94), (139, 109, 255)

def base(nome, velo):
    im = Image.open(os.path.join(QUI, nome)).convert("RGB").resize((1280, 714), Image.LANCZOS)
    im = im.crop((0, 0, 1280, 714)).resize((1280, 720))
    if velo:  # sfuma a nero l'angolo in alto a sinistra (copre scritte sporche della base)
        m = Image.new("L", (1280, 720), 0)
        d = ImageDraw.Draw(m)
        d.rectangle((0, 0, velo[0], velo[1]), fill=235)
        m = m.filter(ImageFilter.GaussianBlur(60))
        im = Image.composite(Image.new("RGB", im.size, (11, 10, 16)), im, m)
    return im

def riga(d, xy, testo, size, colore, ombra=10):
    f = ImageFont.truetype(FONT, size)
    x, y = xy
    for dx in range(-ombra, ombra + 1, 2):
        for dy in range(-ombra, ombra + 1, 2):
            d.text((x + dx, y + dy), testo, font=f, fill=(0, 0, 0))
    d.text((x, y), testo, font=f, fill=colore)
    return d.textbbox((x, y), testo, font=f)

def chip(im, xy, testo, size=78, rot=-4, bg=(91, 63, 214)):
    # riquadro viola inclinato con parola minuscola (stile titolo «*imbarazzante*»)
    f = ImageFont.truetype(FONT, size)
    tmp = ImageDraw.Draw(im)
    l, t, r, b = tmp.textbbox((0, 0), testo, font=f)
    w, h = r - l + 50, b - t + 34
    c = Image.new("RGBA", (w + 16, h + 16), (0, 0, 0, 0))
    d = ImageDraw.Draw(c)
    d.rounded_rectangle((8, 8, w + 8, h + 8), 14, fill=(0, 0, 0, 255))
    d.rounded_rectangle((0, 0, w, h), 14, fill=bg + (255,))
    d.text((25 - l, 17 - t), testo, font=f, fill=(255, 255, 255))
    c = c.rotate(rot, expand=True, resample=Image.BICUBIC)
    im.paste(c, xy, c)

def a():
    im = base("base-A.png", (780, 360)); d = ImageDraw.Draw(im)
    riga(d, (40, 10), "HO PROVATO", 150, BIANCO)
    riga(d, (40, 170), "TUTTO", 190, GIALLO)
    chip(im, (40, 430), "non giudicatemi", size=70)
    return im

def b():
    im = base("base-B.png", (560, 260)); d = ImageDraw.Draw(im)
    riga(d, (40, 20), "-500 €", 210, ROSSO)
    riga(d, (44, 255), "IN UN WEEKEND", 92, BIANCO)
    chip(im, (44, 400), "non giudicatemi", size=70, rot=4)
    return im

def c():
    im = base("base-C.png", None); d = ImageDraw.Draw(im)
    riga(d, (40, 20), "PRIMA", 150, BIANCO)
    f = ImageFont.truetype(FONT, 150)
    w = d.textlength("OGGI", font=f)
    riga(d, (1280 - 40 - w, 20), "OGGI", 150, GIALLO)
    chip(im, (430, 560), "10 anni dopo", size=70, rot=-3)
    return im

copie = []
for nome, fn in (("A", a), ("B", b), ("C", c)):
    im = fn()
    im.save(os.path.join(QUI, f"copertina-{nome}.jpg"), quality=92)
    copie.append(im)
# foglio di confronto: grandi + come appaiono a 160 px (suggerimenti a lato)
fo = Image.new("RGB", (1280 + 40 + 240, 3 * 740), (30, 30, 30))
for i, im in enumerate(copie):
    fo.paste(im, (0, i * 740))
    fo.paste(im.resize((160, 90), Image.LANCZOS).resize((240, 135), Image.NEAREST), (1300, i * 740))
fo.save(os.path.join(QUI, "_confronto.jpg"), quality=85)
print("ok")
