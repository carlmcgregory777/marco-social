# Copertine A/B/C del trailer P2 (17/11/2026): base Nano Banana 16:9 -> 1280x720 con scritte Anton stile L0.
# Uso: python scritte.py  (scrive copertina-A/B/C.jpg e _confronto.jpg con la prova piccola)
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont
QUI = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(QUI, "..", "..", "..", "..", "..", "vox", "ep1", "src", "Anton-Regular.ttf")
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
    im = base("base-A.png", (700, 330)); d = ImageDraw.Draw(im)
    riga(d, (40, 14), "NON VUOLE", 140, BIANCO)
    riga(d, (40, 170), "CHE VINCI", 150, GIALLO)
    chip(im, (40, 360), "vuole che riprovi", size=62)
    return im

def b():
    im = base("base-B.png", (760, 380)); d = ImageDraw.Draw(im)
    riga(d, (40, 14), "93 SU 100", 150, BIANCO)
    riga(d, (40, 180), "PERDONO", 170, ROSSO)
    chip(im, (40, 400), "e tu dove sei?", size=62)
    return im

def c():
    im = base("base-C.png", (700, 330)); d = ImageDraw.Draw(im)
    riga(d, (40, 14), "È UN", 130, BIANCO)
    riga(d, (40, 150), "CASINÒ?", 180, GIALLO)
    chip(im, (40, 380), "le prop firm", size=62)
    return im

if __name__ == "__main__":
    imm = []
    for k, f in (("A", a), ("B", b), ("C", c)):
        im = f(); im.save(os.path.join(QUI, f"copertina-{k}.jpg"), quality=92); imm.append(im)
    W = Image.new("RGB", (1280 + 20 + 246, 3 * 720 + 40), (30, 30, 30))
    for i, im in enumerate(imm):
        W.paste(im, (0, i * 740)); W.paste(im.resize((246, 138)), (1300, i * 740))
    W.save(os.path.join(QUI, "_confronto.jpg"), quality=85)
    print("ok")
