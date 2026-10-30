"""Materiali per la versione Remotion: carta, foto strappate di C (PNG trasparenti), foglio per la transizione."""
import random

from PIL import Image

from scene import bordo_strappato, carta, stampa

OUT = "C:/Users/stang/code/spot-animati/public/propfirm/"

# carta più grande del video: la camera ci si muove sopra
c = carta(7).resize((1300, 2300), Image.BICUBIC)
c.save(OUT + "carta.jpg", quality=90)

FOTO = {  # nome: (file, larghezza, altezza, fx, fy)
    "close": ("c_close", 760, 900, 0.5, 0.35),
    "bust": ("c_bust", 600, 740, 0.5, 0.3),
    "serio": ("c_serio", 700, 820, 0.5, 0.45),
    "cade": ("c_cade", 700, 860, 0.4, 0.3),
    "orologio": ("c_orologio", 640, 820, 0.55, 0.25),
    "vestito": ("c_vestito", 600, 780, 0.6, 0.2),
    "giacca": ("c_giacca", 700, 860, 0.5, 0.25),
    "auto": ("c_auto", 640, 780, 0.5, 0.4),
}
for nome, (f, w, h, fx, fy) in FOTO.items():
    rnd = random.Random(hash(nome) % 1000)
    p, m = stampa(Image.open(f"src/{f}.png"), w, h, rnd, fx, fy)
    p.putalpha(m)
    p.save(OUT + f"foto_{nome}.png")

# foglio con entrambi i bordi corti strappati: passa sullo schermo dal basso verso l'alto
rnd = random.Random(3)
f = carta(9).resize((1300, 2500)).convert("RGBA")
m = bordo_strappato(1300, 2500, rnd, 40)
f.putalpha(m)
f.save(OUT + "foglio.png")
print("ok")
