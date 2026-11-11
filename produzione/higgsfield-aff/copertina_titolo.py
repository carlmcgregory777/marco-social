# Copertina reel affiliato Higgsfield (da A1 Polonia) in stile «post notizia» (titolo Anton grande in basso, una parola nel riquadro colorato).
# Uso: python copertina_titolo.py <foto 9:16> <out.jpg>
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1080, 1920
VIOLA, NERO = (91, 63, 214), (11, 10, 16)
ANTON = "C:/Users/stang/code/marco-social/produzione/vox/ep1/src/Anton-Regular.ttf"

foto = Image.open(sys.argv[1]).convert("RGB")
s = max(W / foto.width, H / foto.height)
foto = foto.resize((round(foto.width * s), round(foto.height * s)), Image.LANCZOS)
x0, y0 = (foto.width - W) // 2, (foto.height - H) // 2
img = foto.crop((x0, y0, x0 + W, y0 + H))

# sfumatura scura sotto, per leggere il titolo
ombra = Image.new("L", (W, H), 0)
d = ImageDraw.Draw(ombra)
for y in range(H):
    t = max(0.0, (y - 640) / (H - 640))
    d.line([(0, y), (W, y)], fill=int(235 * min(1, t * 1.3)))
img = Image.composite(Image.new("RGB", (W, H), NERO), img, ombra)
draw = ImageDraw.Draw(img)

# titolo: righe di parole, la parola marcata con * va nel riquadro viola; ogni riga riempie la larghezza
RIGHE = [["NON", "L'HA", "GIRATO"], ["*NESSUNO"]]
MAXW, GAP, Y = 980, 14, 1000
for riga in RIGHE:
    parti = [(p.lstrip("*"), p.startswith("*")) for p in riga]
    SIZE = 300
    while True:
        font = ImageFont.truetype(ANTON, SIZE)
        larg = [draw.textlength(p, font=font) for p, _ in parti]
        spazio = draw.textlength(" ", font=font) * 0.8
        tot = sum(larg) + spazio * (len(parti) - 1) + sum(SIZE * 0.2 for _, b in parti if b)
        if tot <= MAXW or SIZE < 60:
            break
        SIZE -= 4
    x = (W - tot) / 2
    pad = SIZE * 0.1
    for (p, box), l in zip(parti, larg):
        if box:
            draw.rectangle([x, Y + SIZE * 0.12, x + l + 2 * pad, Y + SIZE * 1.12], fill=VIOLA)
            x += pad
        draw.text((x, Y), p, font=font, fill="white")
        x += l + spazio + (pad if box else 0)
    Y += SIZE * 1.12 + GAP

# marchio e handle
piccolo = ImageFont.truetype(ANTON, 38)
draw.rectangle([56, 64, 56 + 92, 64 + 92], fill=VIOLA)
mw = draw.textlength("MS", font=ImageFont.truetype(ANTON, 56))
draw.text((56 + (92 - mw) / 2, 70), "MS", font=ImageFont.truetype(ANTON, 56), fill="white")
draw.text((60, 1838), "@cthe.trader", font=piccolo, fill=(255, 255, 255, 230))
num = "VIDEO AI · 2 PASSAGGI"
draw.text((W - 60 - draw.textlength(num, font=piccolo), 1838), num, font=piccolo, fill=(139, 109, 255))

img.save(sys.argv[2], quality=93)
# anteprima del ritaglio 4:5 della griglia (zona centrale 1080x1350)
img.crop((0, (H - 1350) // 2, W, (H + 1350) // 2)).save(sys.argv[2].replace(".jpg", "-griglia.jpg"), quality=90)
