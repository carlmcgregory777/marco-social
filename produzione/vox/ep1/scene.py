"""Scene dell'episodio 1 Vox in stile «collage su carta»: foto di C in bianco e nero
(capelli viola), bordi strappati, schizzi d'inchiostro, etichette evidenziatore viola.
Tutto in codice, zero crediti. Uscita: scene/sNN.png 1080x1920."""
import math
import os
import random

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, ImageOps

W, H = 1080, 1920
VIOLA = (91, 63, 214)
VIOLA_CH = (139, 109, 255)
NERO = (18, 17, 22)
CARTA = (214, 211, 203)
FONT = "src/Anton-Regular.ttf"
os.makedirs("scene", exist_ok=True)


def font(px):
    return ImageFont.truetype(FONT, px)


def carta(seed):
    rnd = random.Random(seed)
    base = Image.new("RGB", (W, H), CARTA)
    rumore = Image.effect_noise((W // 2, H // 2), 22).resize((W, H), Image.BICUBIC)
    macchie = Image.effect_noise((W // 40, H // 40), 60).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(30))
    base = ImageChops.multiply(base, Image.merge("RGB", [ImageOps.autocontrast(rumore, cutoff=1).point(lambda v: 225 + v // 9)] * 3))
    base = ImageChops.multiply(base, Image.merge("RGB", [macchie.point(lambda v: 235 + v // 14)] * 3))
    d = ImageDraw.Draw(base, "RGBA")
    for _ in range(140):  # fibre della carta
        x, y = rnd.randrange(W), rnd.randrange(H)
        a = rnd.uniform(0, math.pi)
        l = rnd.randint(8, 40)
        d.line([x, y, x + l * math.cos(a), y + l * math.sin(a)], fill=(120, 115, 105, 40), width=1)
    return base


def bn_viola(img):
    """Bianco e nero contrastato, ma i viola restano viola."""
    img = img.convert("RGB")
    hsv = img.convert("HSV")
    h, s, v = hsv.split()
    maschera = Image.eval(h, lambda x: 255 if 175 <= x <= 215 else 0)
    maschera = ImageChops.multiply(maschera, s.point(lambda x: 255 if x > 70 else 0)).filter(ImageFilter.GaussianBlur(2))
    grigio = ImageOps.autocontrast(img.convert("L"), cutoff=2)
    grigio = grigio.point(lambda x: min(255, int((x / 255) ** 1.15 * 270)))
    return Image.composite(img, grigio.convert("RGB"), maschera)


def ritaglia(img, w, h, fx=0.5, fy=0.4):
    r = max(w / img.width, h / img.height)
    img = img.resize((round(img.width * r), round(img.height * r)), Image.LANCZOS)
    x = int((img.width - w) * fx)
    y = int((img.height - h) * fy)
    return img.crop((x, y, x + w, y + h))


def bordo_strappato(w, h, rnd, dente=9):
    pts = []
    for (x0, y0, x1, y1) in [(0, 0, w, 0), (w, 0, w, h), (w, h, 0, h), (0, h, 0, 0)]:
        n = max(8, int(math.hypot(x1 - x0, y1 - y0) / 14))
        for i in range(n):
            t = i / n
            x = x0 + (x1 - x0) * t
            y = y0 + (y1 - y0) * t
            j = rnd.uniform(0, dente)
            if y0 == y1:
                y += j if y0 == 0 else -j
            else:
                x += j if x0 == 0 else -j
            pts.append((x, y))
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).polygon(pts, fill=255)
    return m


def stampa(img, w, h, rnd, fx=0.5, fy=0.4, bn=True, margine=16):
    """Foto stampata con bordo bianco strappato."""
    foto = ritaglia(img, w - 2 * margine, h - 2 * margine, fx, fy)
    if bn:
        foto = bn_viola(foto)
    carta_b = Image.new("RGB", (w, h), (246, 244, 238))
    carta_b.paste(foto, (margine, margine))
    return carta_b.convert("RGBA"), bordo_strappato(w, h, rnd)


def incolla(sfondo, pezzo, maschera, x, y, ang, ombra=True):
    pezzo = pezzo.copy()
    pezzo.putalpha(maschera)
    pezzo = pezzo.rotate(ang, Image.BICUBIC, expand=True)
    if ombra:
        o = Image.new("RGBA", pezzo.size, (0, 0, 0, 0))
        o.putalpha(pezzo.split()[3].point(lambda a: a * 0.45))
        o = o.filter(ImageFilter.GaussianBlur(10))
        sfondo.alpha_composite(o, (int(x - pezzo.width / 2 + 10), int(y - pezzo.height / 2 + 14)))
    sfondo.alpha_composite(pezzo, (int(x - pezzo.width / 2), int(y - pezzo.height / 2)))


def schizzi(sfondo, cx, cy, rnd, n=5, col=NERO):
    d = ImageDraw.Draw(sfondo)
    for _ in range(n):
        x = cx + rnd.uniform(-60, 60)
        y = cy + rnd.uniform(-60, 60)
        r = rnd.uniform(10, 34)
        d.ellipse([x - r, y - r, x + r, y + r], fill=col)
        for _ in range(rnd.randint(4, 9)):
            a = rnd.uniform(0, 2 * math.pi)
            dist = r + rnd.uniform(6, 70)
            rr = rnd.uniform(2, 8)
            px, py = x + dist * math.cos(a), y + dist * math.sin(a)
            d.ellipse([px - rr, py - rr, px + rr, py + rr], fill=col)


def nastro(sfondo, x, y, ang, rnd):
    t = Image.new("RGBA", (190, 54), (232, 222, 196, 185))
    m = bordo_strappato(190, 54, rnd, 5)
    incolla(sfondo, t, ImageChops.multiply(m, t.split()[3]), x, y, ang, ombra=False)


def etichetta(testo, px, fondo=VIOLA, col=(255, 255, 255), pad=26, rnd=None):
    """Striscia di evidenziatore con testo Anton."""
    f = font(px)
    l, t, r, b = f.getbbox(testo)
    w, h = r - l + 2 * pad, b - t + int(pad * 1.3)
    img = Image.new("RGBA", (w, h), fondo + (255,))
    ImageDraw.Draw(img).text((pad - l, int(pad * 0.65) - t), testo, font=f, fill=col)
    return img, bordo_strappato(w, h, rnd or random.Random(1), 6)


def testata(sfondo, n, titolo, rnd):
    """«N · TITOLO» in alto, come i capitoli di Parlamento Trasparente."""
    num, mn = etichetta(str(n), 92, rnd=rnd)
    tit, mt = etichetta(titolo, 92, fondo=(250, 249, 245), col=NERO, rnd=rnd)
    tot = num.width + tit.width - 6
    x0 = (W - tot) / 2
    incolla(sfondo, tit, mt, x0 + num.width - 6 + tit.width / 2, 300, rnd.uniform(-1.5, 1.5))
    incolla(sfondo, num, mn, x0 + num.width / 2, 296, rnd.uniform(-4, 4))


def scritta(sfondo, testo, px, x, y, col=NERO, ang=0):
    f = font(px)
    l, t, r, b = f.getbbox(testo)
    img = Image.new("RGBA", (r - l + 20, b - t + 20), (0, 0, 0, 0))
    ImageDraw.Draw(img).text((10 - l, 10 - t), testo, font=f, fill=col)
    img = img.rotate(ang, Image.BICUBIC, expand=True)
    sfondo.alpha_composite(img, (int(x - img.width / 2), int(y - img.height / 2)))


def biglietto(w, h, righe, rnd, fondo=(250, 249, 245)):
    """Cartoncino con righe di testo [(testo, px, colore)]."""
    img = Image.new("RGBA", (w, h), fondo + (255,))
    d = ImageDraw.Draw(img)
    y = 34
    for testo, px, col in righe:
        f = font(px)
        l, t, r, b = f.getbbox(testo)
        d.text(((w - (r - l)) / 2 - l, y - t), testo, font=f, fill=col)
        y += b - t + 26
    return img, bordo_strappato(w, h, rnd)


def timbro(sfondo, testo, x, y, ang, col=VIOLA, px=120):
    f = font(px)
    l, t, r, b = f.getbbox(testo)
    w, h = r - l + 70, b - t + 60
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([6, 6, w - 6, h - 6], 14, outline=col + (235,), width=10)
    d.text((35 - l, 30 - t), testo, font=f, fill=col + (235,))
    grana = Image.effect_noise((w, h), 90).point(lambda v: 255 if v > 95 else 90)
    img.putalpha(ImageChops.multiply(img.split()[3], grana))
    img = img.rotate(ang, Image.BICUBIC, expand=True)
    sfondo.alpha_composite(img, (int(x - img.width / 2), int(y - img.height / 2)))


def omino(d, x, y, s, col):
    d.ellipse([x - s * 0.22, y, x + s * 0.22, y + s * 0.44], fill=col)
    d.rounded_rectangle([x - s * 0.3, y + s * 0.5, x + s * 0.3, y + s * 1.25], int(s * 0.12), fill=col)


def freccia(sfondo, x0, y0, x1, y1, col=NERO, w=10):
    d = ImageDraw.Draw(sfondo)
    d.line([x0, y0, x1, y1], fill=col, width=w)
    a = math.atan2(y1 - y0, x1 - x0)
    for da in (2.6, -2.6):
        d.line([x1, y1, x1 + 46 * math.cos(a + da), y1 + 46 * math.sin(a + da)], fill=col, width=w)


def foto(nome):
    return Image.open(f"src/{nome}.png").convert("RGB")


def salva(s, n):
    s.convert("RGB").save(f"scene/s{n:02d}.png")


# ---------- scene ----------

def intro(n, seed, timbro_si=False):
    rnd = random.Random(seed)
    s = carta(seed).convert("RGBA")
    p, m = stampa(foto("c_close"), 760, 900, rnd, fy=0.35)
    schizzi(s, 280, 700, rnd)
    incolla(s, p, m, 560, 860, -3)
    nastro(s, 560, 420, 4, rnd)
    for i, riga in enumerate(["LE PROP FIRM", "GUADAGNANO", "QUANDO PERDI?"]):
        e, me = etichetta(riga, 96, fondo=(250, 249, 245) if i < 2 else VIOLA,
                          col=NERO if i < 2 else (255, 255, 255), rnd=rnd)
        incolla(s, e, me, 540, 1060 + i * 135, rnd.uniform(-2.5, 2.5))
    if timbro_si:
        timbro(s, "SPESSO SÌ", 720, 640, -12, px=130)
    salva(s, n)


def challenge(n, seed):
    rnd = random.Random(seed)
    s = carta(seed).convert("RGBA")
    testata(s, 1, "LA CHALLENGE", rnd)
    p, m = stampa(foto("c_bust"), 520, 640, rnd, fy=0.3)
    incolla(s, p, m, 330, 820, 4)
    for i, (prezzo, y) in enumerate([("100 €", 560), ("300 €", 800), ("500 €", 1040)]):
        b, mb = biglietto(380, 190, [("CHALLENGE", 46, NERO), (prezzo, 80, VIOLA)], rnd)
        incolla(s, b, mb, 800, y, rnd.uniform(-7, 7))
        nastro(s, 800, y - 90, rnd.uniform(-10, 10), rnd)
    scritta(s, "CONTO DI PROVA", 70, 540, 1250, ang=2)
    salva(s, n)


def incassi(n, seed):
    rnd = random.Random(seed)
    s = carta(seed).convert("RGBA")
    testata(s, 1, "LA CHALLENGE", rnd)
    # due barre: quote challenge vs mercati
    for x, alt, col, et in [(360, 640, VIOLA, "QUOTE"), (720, 120, NERO, "MERCATI")]:
        b = Image.new("RGBA", (240, alt), col + (255,))
        incolla(s, b, bordo_strappato(240, alt, rnd, 7), x, 1150 - alt / 2, rnd.uniform(-1.5, 1.5))
        scritta(s, et, 64, x, 1210)
    scritta(s, "DA DOVE ARRIVANO I SOLDI", 66, 540, 470)
    schizzi(s, 820, 820, rnd, 3)
    salva(s, n)


def numeri(n, seed):
    rnd = random.Random(seed)
    s = carta(seed).convert("RGBA")
    testata(s, 2, "I NUMERI", rnd)
    c, mc = biglietto(900, 760, [], rnd)
    d = ImageDraw.Draw(c)
    for i in range(10):
        x = 120 + (i % 5) * 165
        y = 90 + (i // 5) * 320
        omino(d, x, y, 200, VIOLA if i == 7 else (150, 148, 150))
    incolla(s, c, mc, 540, 900, -1.5)
    e, me = etichetta("MENO DI 1 SU 10 PASSA", 84, rnd=rnd)
    incolla(s, e, me, 540, 1360, 2)
    salva(s, n)


def imbuto(n, seed):
    rnd = random.Random(seed)
    s = carta(seed).convert("RGBA")
    testata(s, 2, "I NUMERI", rnd)
    righe = [("COMPRANO LA CHALLENGE", 860), ("LA PASSANO", 560), ("VENGONO PAGATI", 300)]
    for i, (t, w) in enumerate(righe):
        col = VIOLA if i == 2 else NERO
        b = Image.new("RGBA", (w, 190), col + (255,))
        incolla(s, b, bordo_strappato(w, 190, rnd, 7), 540, 620 + i * 250, rnd.uniform(-1, 1))
        if i < 2:
            scritta(s, t, 62, 540, 620 + i * 250, col=(255, 255, 255))
    scritta(s, "VENGONO PAGATI", 62, 540, 1370, col=VIOLA)
    freccia(s, 540, 1200, 540, 1290, VIOLA)
    salva(s, n)


def simulato(n, seed):
    rnd = random.Random(seed)
    s = carta(seed).convert("RGBA")
    testata(s, 3, "IL CONTO", rnd)
    c, mc = biglietto(860, 640, [("CONTO 100.000 $", 64, NERO)], rnd)
    d = ImageDraw.Draw(c)
    pts, y = [], 470
    for i in range(30):
        y += rnd.uniform(-34, 26)
        pts.append((60 + i * 25, y))
    d.line(pts, fill=NERO, width=7)
    incolla(s, c, mc, 540, 860, 2)
    timbro(s, "SIMULATO", 560, 900, -14, px=150)
    scritta(s, "IL MERCATO VERO NON LO VEDE", 58, 540, 1300)
    salva(s, n)


def coprono(n, seed):
    rnd = random.Random(seed)
    s = carta(seed).convert("RGBA")
    testata(s, 3, "IL CONTO", rnd)
    d = ImageDraw.Draw(s)
    for i in range(9):
        x = 150 + (i % 3) * 140
        y = 560 + (i // 3) * 230
        omino(d, x, y, 150, (140, 138, 140))
        freccia(s, x + 60, y + 90, 760, 820 + (i // 3 - 1) * 40, (90, 88, 92), 5)
    omino(d, 860, 640, 330, VIOLA)
    scritta(s, "CHI HA PERSO", 60, 290, 1290)
    scritta(s, "PAGA CHI VINCE", 60, 860, 1150, col=VIOLA)
    salva(s, n)


def truffa(n, seed):
    rnd = random.Random(seed)
    s = carta(seed).convert("RGBA")
    testata(s, 4, "È UNA TRUFFA?", rnd)
    p, m = stampa(foto("c_serio"), 700, 820, rnd, fy=0.45)
    incolla(s, p, m, 540, 900, -2)
    schizzi(s, 850, 560, rnd)
    timbro(s, "NO.", 760, 1220, 10, px=170)
    salva(s, n)


def casino(n, seed):
    rnd = random.Random(seed)
    s = carta(seed).convert("RGBA")
    testata(s, 4, "È UNA TRUFFA?", rnd)
    c = Image.new("RGBA", (640, 640), (0, 0, 0, 0))
    d = ImageDraw.Draw(c)
    for i in range(36):  # roulette
        a0, a1 = i * 10, (i + 1) * 10
        d.pieslice([10, 10, 630, 630], a0, a1, fill=NERO if i % 2 else VIOLA)
    d.ellipse([170, 170, 470, 470], fill=(250, 249, 245))
    d.ellipse([290, 290, 350, 350], fill=NERO)
    incolla(s, c, c.split()[3], 540, 830, rnd.uniform(0, 30))
    e, me = etichetta("IL BANCO VINCE SULLA MEDIA", 74, rnd=rnd)
    incolla(s, e, me, 540, 1290, -2)
    scritta(s, "MODELLO DI BUSINESS", 60, 540, 460)
    salva(s, n)


def regole(n, seed):
    rnd = random.Random(seed)
    s = carta(seed).convert("RGBA")
    testata(s, 5, "LE REGOLE", rnd)
    c, mc = biglietto(860, 760, [], rnd)
    d = ImageDraw.Draw(c)
    for i, t in enumerate(["DRAWDOWN GIORNALIERO", "GIORNI MINIMI", "NIENTE NOTIZIE"]):
        y = 90 + i * 220
        d.rectangle([60, y, 160, y + 100], outline=NERO, width=8)
        d.line([72, y + 12, 148, y + 88], fill=VIOLA, width=14)
        d.line([148, y + 12, 72, y + 88], fill=VIOLA, width=14)
        d.text((200, y + 14), t, font=font(64), fill=NERO)
    incolla(s, c, mc, 540, 900, 1.5)
    nastro(s, 220, 540, -20, rnd)
    nastro(s, 860, 540, 18, rnd)
    salva(s, n)


def errore(n, seed):
    rnd = random.Random(seed)
    s = carta(seed).convert("RGBA")
    testata(s, 5, "LE REGOLE", rnd)
    p, m = stampa(foto("c_cade"), 700, 860, rnd, fx=0.4, fy=0.3)
    incolla(s, p, m, 540, 900, 5)
    e, me = etichetta("UN SOLO ERRORE", 90, rnd=rnd)
    incolla(s, e, me, 540, 1330, -3)
    schizzi(s, 230, 560, rnd)
    salva(s, n)


def riacquisto(n, seed):
    rnd = random.Random(seed)
    s = carta(seed).convert("RGBA")
    testata(s, 6, "IL RIACQUISTO", rnd)
    b, mb = biglietto(820, 520, [("COUPON", 60, NERO), ("-20%", 190, VIOLA), ("RIPROVA SUBITO", 62, NERO)], rnd)
    incolla(s, b, mb, 540, 860, -4)
    timbro(s, "BRUCIATA", 760, 560, 14, col=NERO, px=90)
    salva(s, n)


def ciclo(n, seed):
    rnd = random.Random(seed)
    s = carta(seed).convert("RGBA")
    testata(s, 6, "IL RIACQUISTO", rnd)
    d = ImageDraw.Draw(s)
    cx, cy, r = 540, 880, 330
    d.arc([cx - r, cy - r, cx + r, cy + r], 0, 360, fill=NERO, width=10)
    for i, t in enumerate(["COMPRI", "BRUCI", "RICOMPRI"]):
        a = math.radians(-90 + i * 120)
        e, me = etichetta(t, 70, fondo=VIOLA if i == 2 else (250, 249, 245),
                          col=(255, 255, 255) if i == 2 else NERO, rnd=rnd)
        incolla(s, e, me, cx + r * math.cos(a), cy + r * math.sin(a), rnd.uniform(-4, 4))
    scritta(s, "€", 200, cx, cy, col=VIOLA)
    salva(s, n)


def vince(n, seed):
    rnd = random.Random(seed)
    s = carta(seed).convert("RGBA")
    testata(s, 7, "CHI VINCE", rnd)
    p, m = stampa(foto("c_orologio"), 560, 760, rnd, fx=0.55, fy=0.25)
    incolla(s, p, m, 340, 840, -3)
    for i, t in enumerate(["SISTEMA SCRITTO", "RISCHIO FISSO", "ZERO EMOZIONI"]):
        e, me = etichetta(t, 66, fondo=VIOLA if i == 0 else (250, 249, 245),
                          col=(255, 255, 255) if i == 0 else NERO, pad=20, rnd=rnd)
        incolla(s, e, me, 790, 600 + i * 210, rnd.uniform(-5, 5))
    salva(s, n)


def algory(n, seed):
    rnd = random.Random(seed)
    s = carta(seed).convert("RGBA")
    testata(s, 7, "CHI VINCE", rnd)
    p, m = stampa(foto("c_vestito"), 520, 700, rnd, fx=0.6, fy=0.2)
    incolla(s, p, m, 330, 760, 3)
    c, mc = biglietto(520, 560, [("ALGORY", 86, VIOLA)], rnd)
    d = ImageDraw.Draw(c)
    pts, y = [], 470
    for i in range(22):
        y -= rnd.uniform(-8, 22)
        pts.append((40 + i * 21, max(160, y)))
    d.line(pts, fill=NERO, width=7)
    incolla(s, c, mc, 790, 900, -4)
    e, me = etichetta("GENERO · TESTO · LASCIO LAVORARE", 58, rnd=rnd)
    incolla(s, e, me, 540, 1300, 1.5)
    salva(s, n)


def seguimi(n, seed):
    rnd = random.Random(seed)
    s = carta(seed).convert("RGBA")
    p, m = stampa(foto("c_giacca"), 700, 860, rnd, fy=0.25)
    incolla(s, p, m, 540, 820, -2)
    schizzi(s, 220, 470, rnd)
    e, me = etichetta("SEGUIMI", 130, rnd=rnd)
    incolla(s, e, me, 540, 1290, -3)
    scritta(s, "@cthe.trader", 64, 540, 1430)
    salva(s, n)


SCENE = [  # (inizio sulla voce, funzione)
    (0.0, lambda n: intro(n, 11)),
    (4.0, lambda n: intro(n, 11, timbro_si=True)),
    (5.2, lambda n: challenge(n, 12)),
    (10.7, lambda n: incassi(n, 13)),
    (15.0, lambda n: numeri(n, 14)),
    (19.6, lambda n: imbuto(n, 15)),
    (23.0, lambda n: simulato(n, 16)),
    (28.6, lambda n: coprono(n, 17)),
    (32.5, lambda n: truffa(n, 18)),
    (35.6, lambda n: casino(n, 19)),
    (40.3, lambda n: regole(n, 20)),
    (45.2, lambda n: errore(n, 21)),
    (47.4, lambda n: riacquisto(n, 22)),
    (53.4, lambda n: ciclo(n, 23)),
    (55.2, lambda n: vince(n, 24)),
    (63.5, lambda n: algory(n, 25)),
    (68.4, lambda n: seguimi(n, 26)),
    (71.2, lambda n: intro(n, 11)),
]

if __name__ == "__main__":
    for i, (_, f) in enumerate(SCENE):
        f(i + 1)
    print("ok", len(SCENE))
