# Copertina YouTube trailer P2 (17/11/2026), stile L0: C a destra, titolo grande in alto a sinistra, etichetta viola.
from PIL import Image, ImageDraw, ImageFont, ImageFilter
ANTON = "C:/Users/stang/code/marco-social/produzione/vox/ep1/src/Anton-Regular.ttf"
W, H = 1280, 720
im = Image.open("base.png").convert("RGB").resize((W, H), Image.LANCZOS)
# copre la scritta finta in alto a sinistra con un buio graduale
ov = Image.new("L", (W, H), 0); d = ImageDraw.Draw(ov)
d.rectangle([0, 0, 790, 245], fill=255); d.rectangle([700, 25, 818, 135], fill=255); ov = ov.filter(ImageFilter.GaussianBlur(14))
im = Image.composite(Image.new("RGB", (W, H), (11, 10, 16)), im, ov)
dr = ImageDraw.Draw(im)
def riga(txt, y, size, col):
    f = ImageFont.truetype(ANTON, size)
    for dx, dy in [(-4,0),(4,0),(0,-4),(0,4),(5,6)]: dr.text((40+dx, y+dy), txt, font=f, fill=(0,0,0))
    dr.text((40, y), txt, font=f, fill=col)
riga("PROP FIRM", 10, 128, (255, 255, 255))
riga("TRAPPOLA?", 140, 128, (255, 214, 10))
# etichetta viola inclinata
f = ImageFont.truetype(ANTON, 64); t = "SOLO 7 SU 100"
w = int(dr.textlength(t, font=f)) + 50
tag = Image.new("RGBA", (w, 100), (0, 0, 0, 0)); td = ImageDraw.Draw(tag)
td.rounded_rectangle([0, 0, w-1, 99], 18, fill=(91, 63, 214, 255)); td.text((25, 6), t, font=f, fill="white")
tag = tag.rotate(4, expand=True, resample=Image.BICUBIC)
im.paste(tag, (60, 300), tag)
im.save("copertina-trailer.jpg", quality=92)
