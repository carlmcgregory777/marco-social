# G1 v2 «L'ultima copia» (21/11/2026): interfaccia da videogioco copiata dal reel Mondarama
# (minimappa scura con percorso viola luminoso, stelle piccole, dialoghi colorati per personaggio,
# timer, oggetti che brillano, titolo missione e MISSIONE COMPIUTA) + montaggio delle clip + audio.
# Uso: python hud2.py <out.mp4>
import math, os, random, subprocess
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H, FPS = 1080, 1920, 30
QUI = os.path.dirname(os.path.abspath(__file__))
ANTON = os.path.join(QUI, "..", "..", "vox", "ep1", "src", "Anton-Regular.ttf")
SEMI = r"C:\Windows\Fonts\seguisb.ttf" if os.path.exists(r"C:\Windows\Fonts\seguisb.ttf") else r"C:\Windows\Fonts\segoeuib.ttf"
VIOLA = (150, 70, 255)
GIALLO, AZZURRO, BIANCO = (245, 228, 91), (140, 210, 255), (255, 255, 255)

def dur(f):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                                capture_output=True, text=True).stdout.strip())

# Scene: (sorgente, durata usata). s1 = poster.
SCENE = [("c1", 3.0), ("c2", 8.0), ("c3", 4.6), ("c4", 4.0), ("c5", 3.4), ("c6", 4.4), ("c7", 3.6),
         ("c8", 3.4), ("c9", 4.4), ("c10", 4.0), ("still:s11", 10.6)]
T0 = []
_t = 0.0
for _, d in SCENE:
    T0.append(_t); _t += d
DURATA = _t
def S(i, off):  # tempo assoluto: scena i (numerata come i file, 1 = poster) + offset
    return T0[i - 1] + off

# Battute: (file, tempo, chi, testo). Colori come nel riferimento: contatto giallo, C azzurro, gli altri bianco.
VOCE = os.path.join(QUI, "voce")
BATTUTE = [
    ("k1", S(2, 0.4), "K", "C, è uscito GTA VI. A Milano è rimasta una copia sola."),
    ("k2", S(2, 5.3), "K", "Il negozio chiude tra due minuti. Corri!"),
    ("c1", S(3, 0.4), "C", "Scusa, mi serve."),
    ("r1", S(3, 2.4), "N", "Ehi! Il mio motorino!"),
    ("k3", S(4, 0.4), "K", "Corso Buenos Aires. Taglia per il centro!"),
    ("p1", S(5, 0.6), "N", "Ehi, attento!"),
    ("g1", S(6, 0.3), "N", "Quella copia è mia, vecchio!"),
    ("c2", S(6, 2.7), "C", "Vedremo."),
    ("k4", S(7, 0.4), "K", "Hai la polizia dietro. Non fermarti!"),
    ("x1", S(10, 0.3), "N", "Ultima copia. 79,99 €."),
    ("c3", S(11, 0.3), "C", "Rockstar ha incassato 3,79 miliardi di dollari. In un giorno."),
    ("c4", S(11, 6.4), "C", "Io ho vinto una copia. Loro hanno vinto la missione."),
]
BATTUTE = [(k, t, chi, tx, dur(os.path.join(VOCE, k + ".mp3"))) for k, t, chi, tx in BATTUTE]

STELLE = [(0, 0), (S(3, 2.2), 1), (S(5, 0.6), 2), (S(7, 0.2), 4), (S(8, 1.0), 4), (S(9, 0), 0)]
TIMER_DA, TIMER_A, TIMER_SEC = S(2, 7.6), S(9, 1.4), 120  # il timer scende da 2:00 e si ferma quando prende la copia
TITOLO = (S(2, 5.2), S(2, 7.9))                            # titolo della missione
CHECK = (S(8, 0.2), S(8, 3.0), "Negozio di videogiochi")
COMPIUTA = S(9, 1.4)
CIFRA = (S(11, 0.6), S(11, 6.2))                           # scheda 3,79 miliardi
# Oggetti che brillano: (da, a, x, y) in coordinate 1080x1920 (posizioni scelte sui fotogrammi)
PICKUP = [(S(8, 0.0), S(8, 3.4), 820, 820), (S(9, 0.0), S(9, 1.4), 230, 860)]

LOGO = Image.open(os.path.join(QUI, "logo.png")).convert("RGBA")

def F(p, s):
    return ImageFont.truetype(p, s)
F_SUB, F_TIT, F_TIT2, F_TIM, F_MC, F_MC2, F_CP = F(SEMI, 46), F(ANTON, 120), F(SEMI, 40), F(ANTON, 64), F(ANTON, 140), F(SEMI, 46), F(ANTON, 70)

def ease(x):
    x = max(0.0, min(1.0, x)); return 1 - (1 - x) ** 3

def ombra_testo(im, xy, tx, f, fill, anchor="mm", blur=6, alpha=200, stroke=0):
    lay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ImageDraw.Draw(lay).text((xy[0] + 2, xy[1] + 3), tx, font=f, fill=(0, 0, 0, alpha), anchor=anchor, stroke_width=stroke + 2, stroke_fill=(0, 0, 0, alpha))
    im.alpha_composite(lay.filter(ImageFilter.GaussianBlur(blur)))
    ImageDraw.Draw(im).text(xy, tx, font=f, fill=fill, anchor=anchor, stroke_width=stroke, stroke_fill=(0, 0, 0, 255))

def a_capo(tx, f, maxw):
    d = ImageDraw.Draw(Image.new("L", (1, 1)))
    righe, r = [], ""
    for p in tx.split():
        prova = (r + " " + p).strip()
        if d.textlength(prova, font=f) > maxw and r:
            righe.append(r); r = p
        else:
            r = prova
    return righe + [r]

# ---------- minimappa (stile riferimento) ----------
R = 172
random.seed(4)
ISOLATI = []
for gx in range(-6, 7):
    for gy in range(-6, 7):
        if random.random() < 0.85:
            w, h = random.randint(60, 120), random.randint(60, 120)
            ISOLATI.append((gx * 150 + random.randint(-15, 15), gy * 150 + random.randint(-15, 15), w, h))
PERCORSO = [(-75, 450), (-75, 225), (75, 225), (75, 75), (75, -75), (225, -75), (225, -300)]

def lungo(p):
    return sum(math.dist(p[i], p[i + 1]) for i in range(len(p) - 1))

def punto(p, s):
    for i in range(len(p) - 1):
        l = math.dist(p[i], p[i + 1])
        if s <= l:
            a, b = p[i], p[i + 1]
            return (a[0] + (b[0] - a[0]) * s / l, a[1] + (b[1] - a[1]) * s / l)
        s -= l
    return p[-1]

def minimappa(t):
    S2 = R * 2
    base = Image.new("RGBA", (S2, S2), (34, 34, 40, 235))
    d = ImageDraw.Draw(base)
    prog = ease((t - S(3, 2.0)) / (S(8, 1.5) - S(3, 2.0))) if t > S(3, 2.0) else 0
    pos = punto(PERCORSO, prog * lungo(PERCORSO))
    sc = 0.75
    P = lambda q: (R + (q[0] - pos[0]) * sc, R + (q[1] - pos[1]) * sc)
    for x, y, w, h in ISOLATI:
        a, b = P((x, y)), P((x + w, y + h))
        d.rectangle((a[0], a[1], b[0], b[1]), fill=(58, 58, 66, 255))
    # percorso viola con bagliore
    glow = Image.new("RGBA", (S2, S2), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    pts = [P(q) for q in PERCORSO]
    gd.line(pts, fill=VIOLA + (255,), width=26, joint="curve")
    base.alpha_composite(glow.filter(ImageFilter.GaussianBlur(9)))
    d.line(pts, fill=(170, 100, 255, 255), width=14, joint="curve")
    # destinazione
    dx, dy = P(PERCORSO[-1])
    dx, dy = max(30, min(S2 - 30, dx)), max(30, min(S2 - 30, dy))
    d.ellipse((dx - 22, dy - 22, dx + 22, dy + 22), fill=VIOLA + (255,), outline=(255, 255, 255, 255), width=5)
    d.ellipse((dx - 8, dy - 8, dx + 8, dy + 8), fill=(255, 255, 255, 255))
    # giocatore
    d.polygon([(R, R - 20), (R + 15, R + 16), (R, R + 8), (R - 15, R + 16)], fill=(255, 255, 255, 255))
    m = Image.new("L", (S2, S2), 0)
    ImageDraw.Draw(m).ellipse((0, 0, S2 - 1, S2 - 1), fill=255)
    out = Image.new("RGBA", (S2 + 8, S2 + 8), (0, 0, 0, 0))
    ImageDraw.Draw(out).ellipse((0, 0, S2 + 7, S2 + 7), fill=(20, 20, 24, 200))
    out.paste(base, (4, 4), m)
    od = ImageDraw.Draw(out)
    od.ellipse((40, 40, 58, 58), outline=(255, 255, 255, 230), width=4)  # nord
    return out

def stella(d, cx, cy, r, piena):
    pts = []
    for i in range(10):
        rr = r if i % 2 == 0 else r * 0.45
        a = -math.pi / 2 + i * math.pi / 5
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d.polygon(pts, fill=(255, 255, 255, 255) if piena else (90, 90, 100, 200), outline=(0, 0, 0, 160))

def stelle_n(t):
    n = 0
    for t0, k in STELLE:
        if t >= t0:
            n = k
    return n

def pickup(im, t, t0, x, y):
    """Icona di una scatola di gioco che fluttua con alone dorato e scintille."""
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    yy = y + 10 * math.sin((t - t0) * 4)
    for r, a in [(120, 60), (85, 90), (55, 130)]:
        d.ellipse((x - r, yy - r, x + r, yy + r), fill=(255, 200, 60, a))
    lay = lay.filter(ImageFilter.GaussianBlur(22))
    d = ImageDraw.Draw(lay)
    d.rounded_rectangle((x - 34, yy - 46, x + 34, yy + 46), 8, fill=(20, 20, 26, 255), outline=(255, 215, 90, 255), width=5)
    d.text((x, yy), "VI", font=F(ANTON, 44), fill=(255, 120, 200, 255), anchor="mm")
    random.seed(int(t * 10))
    for _ in range(8):
        a = random.random() * 6.28; rr = 60 + random.random() * 70
        sx, sy = x + rr * math.cos(a), yy + rr * math.sin(a)
        d.line((sx - 7, sy, sx + 7, sy), fill=(255, 240, 180, 230), width=3)
        d.line((sx, sy - 7, sx, sy + 7), fill=(255, 240, 180, 230), width=3)
    im.alpha_composite(lay)

def hud(t):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    if t < T0[1]:  # apertura: logo GTA VI Milano che entra con un rimbalzo, come nel riferimento
        if t >= 0.4:
            x = (t - 0.4) / 0.35
            sc = 0.55 + 0.45 * (1 - math.cos(min(x, 1) * math.pi) / 2 - 0.5) * 2 if x < 1 else 1 + 0.03 * math.sin((t - 0.75) * 6) * math.exp(-(t - 0.75) * 3)
            sc = max(0.05, min(1.12, 0.6 + 0.4 * ease(x) + 0.12 * math.sin(min(x, 1) * math.pi)))
            lw = int(LOGO.width * 0.72 * sc)
            lg = LOGO.resize((lw, int(LOGO.height * lw / LOGO.width)), Image.LANCZOS)
            a = 1 - ease((t - (T0[1] - 0.5)) / 0.3)
            if a < 1:
                lg.putalpha(lg.getchannel("A").point(lambda v: int(v * a)))
            im.alpha_composite(lg, ((W - lg.width) // 2, 760 - lg.height // 2))
        return im
    mm = minimappa(t)
    im.alpha_composite(mm, (44, H - 120 - mm.height))
    d = ImageDraw.Draw(im)
    n = stelle_n(t)
    lamp = any(t0 <= t < t0 + 1.2 and k > 0 for t0, k in STELLE)
    for i in range(5):
        piena = i < n and not (lamp and i == n - 1 and int(t * 8) % 2)
        stella(d, W - 330 + i * 56, 330, 22, piena)
    # timer in basso a destra
    if TIMER_DA <= t:
        rest = TIMER_SEC - (min(t, TIMER_A) - TIMER_DA) * 4.2  # il tempo del gioco corre più veloce
        rest = max(0, rest)
        s = f"{int(rest // 60)}:{int(rest % 60):02d}"
        col = (255, 80, 90, 255) if rest < 30 and int(t * 4) % 2 else (255, 255, 255, 255)
        if t < COMPIUTA + 0.1:
            ombra_testo(im, (W - 60, H - 210), "CHIUSURA NEGOZIO", F(SEMI, 30), (255, 255, 255, 220), anchor="rm")
            ombra_testo(im, (W - 60, H - 150), s, F_TIM, col, anchor="rm")
    # titolo della missione
    if TITOLO[0] <= t < TITOLO[1]:
        a = ease((t - TITOLO[0]) / 0.3) * (1 - ease((t - TITOLO[1] + 0.3) / 0.3))
        lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ombra_testo(lay, (W / 2, 690), "MISSIONE", F_TIT2, GIALLO + (255,), stroke=2)
        ombra_testo(lay, (W / 2, 790), "L'ULTIMA COPIA", F_TIT, BIANCO + (255,), stroke=5)
        ombra_testo(lay, (W / 2, 895), "Prendi l'ultima copia di GTA VI a Milano", F(SEMI, 36), BIANCO + (255,), stroke=1)
        lay.putalpha(lay.getchannel("A").point(lambda v: int(v * a)))
        im.alpha_composite(lay)
    # checkpoint
    if CHECK[0] <= t < CHECK[1]:
        a = ease((t - CHECK[0]) / 0.3)
        ombra_testo(im, (W / 2, 520), "ARRIVO", F(SEMI, 38), GIALLO + (int(255 * a),), stroke=1)
        ombra_testo(im, (W / 2, 590), CHECK[2].upper(), F_CP, BIANCO + (int(255 * a),), stroke=4)
    for t0, t1, x, y in PICKUP:
        if t0 <= t < t1:
            pickup(im, t, t0, x, y)
    # dialoghi (solo l'ultima battuta iniziata)
    att = [b for b in BATTUTE if b[1] - 0.05 <= t]
    for k, t0, chi, tx, du in att[-1:]:
        if t < t0 + du + 0.4:
            col = {"K": GIALLO, "C": AZZURRO, "N": BIANCO}[chi]
            righe = a_capo(tx, F_SUB, W - 260)
            for j, r in enumerate(righe):
                ombra_testo(im, (W / 2, 1420 + j * 58 - 29 * (len(righe) - 1)), r, F_SUB, col + (255,))
    # MISSIONE COMPIUTA
    if COMPIUTA <= t < COMPIUTA + 3.0 + 1.0:
        a = ease((t - COMPIUTA) / 0.3) * (1 - ease((t - COMPIUTA - 3.4) / 0.4))
        sc = 1.2 - 0.2 * ease((t - COMPIUTA) / 0.3)
        lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ombra_testo(lay, (W / 2, 820), "MISSIONE COMPIUTA", F(ANTON, 118), (255, 200, 40, 255), stroke=5)
        ombra_testo(lay, (W / 2, 930), "+1 COPIA DI GTA VI", F_MC2, BIANCO + (255,), stroke=2)
        lay = lay.resize((int(W * sc), int(H * sc)), Image.LANCZOS)
        ox, oy = (lay.width - W) // 2, (lay.height - H) // 2
        lay = lay.crop((ox, oy, ox + W, oy + H))
        lay.putalpha(lay.getchannel("A").point(lambda v: int(v * a)))
        im.alpha_composite(lay)
    # scheda della cifra (finale)
    if CIFRA[0] <= t < CIFRA[1]:
        a = ease((t - CIFRA[0]) / 0.35)
        x = int(-700 + 760 * a)
        lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ld = ImageDraw.Draw(lay)
        ld.rounded_rectangle((x, 380, x + 720, 600), 26, fill=(255, 255, 255, 240))
        ld.text((x + 36, 420), "ROCKSTAR · PRIMO GIORNO", font=F(SEMI, 32), fill=(110, 110, 120, 255), anchor="lm")
        ld.text((x + 36, 515), "3,79 MLD $", font=F(ANTON, 110), fill=(20, 20, 26, 255), anchor="lm")
        ld.text((x + 36, 578), "vendite al dettaglio · fonte Take-Two 20/11", font=F(SEMI, 24), fill=(120, 120, 130, 255), anchor="lm")
        im.alpha_composite(lay)
    return im

def base():
    """Unisce poster + clip a 1080x1920 30 fps, ognuna tagliata (o rallentata) alla durata della scena."""
    ins, fil = [], []
    for i, (src, d) in enumerate(SCENE):
        if not src.startswith("still:") and src != "c1" and not os.path.exists(os.path.join(QUI, "clip", src + ".mp4")):
            src = "still:s" + src[1:]  # anteprima: clip non ancora generata, uso l'immagine ferma
        if src.startswith("still:"):  # immagine ferma con lenta spinta in avanti (finale, niente labiale)
            ins += ["-i", os.path.join(QUI, "set", src[6:] + ".png")]
            fil.append(f"[{i}]scale=1188:2112,zoompan=z='1+0.0012*on':x='iw/2-(iw/zoom/2)':y='ih/3-(ih/zoom/3)':d={int(d * FPS)}:s={W}x{H}:fps={FPS},format=yuv420p,setsar=1[s{i}]")
            continue
        if src == "c1":  # volo sul Duomo della v1
            ins += ["-i", os.path.join(QUI, "..", "clip", "c1.mp4")]
            fil.append(f"[{i}]scale={W}:{H}:flags=lanczos,unsharp=5:5:0.6,fps={FPS},format=yuv420p,setsar=1,trim=0:{d},setpts=PTS-STARTPTS[s{i}]")
            continue
        else:
            f = os.path.join(QUI, "clip", src + ".mp4")
            k = max(1.0, d / dur(f))  # se la clip è più corta della scena la rallento un poco
            fil.append(f"[{i}]setpts=PTS*{k:.4f},scale={W}:{H}:flags=lanczos,unsharp=5:5:0.6,fps={FPS},format=yuv420p,setsar=1,trim=0:{d},setpts=PTS-STARTPTS[s{i}]")
            ins += ["-i", f]
    fil.append("".join(f"[s{i}]" for i in range(len(SCENE))) + f"concat=n={len(SCENE)}:v=1:a=0[v]")
    out = os.path.join(QUI, "base.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(fil), "-map", "[v]", "-c:v", "libx264", "-crf", "16", "-an", out], check=True)
    return out

def audio(out_wav):
    AU = os.path.join(QUI, "..", "audio")
    ins, fil = [], []
    for i, (k, t0, chi, tx, du) in enumerate(BATTUTE):
        ins += ["-i", os.path.join(VOCE, k + ".mp3")]
        f = "highpass=f=300,lowpass=f=3400,volume=1.5" if chi == "K" else "volume=1.1"
        fil.append(f"[{i}:a]{f},adelay={int(t0 * 1000)}|{int(t0 * 1000)}[v{i}]")
    n = len(BATTUTE)
    tagli = [T0[i] - 0.1 for i in range(1, len(SCENE))]
    extra = [("musica-v2.wav", 0.0, 0.25), ("ding.wav", TITOLO[0], 0.8), ("riser.wav", S(2, 6.2), 0.4),
             ("impact.wav", S(3, 0.9), 0.7), ("ding.wav", CHECK[0], 0.7), ("pop.wav", S(9, 1.2), 0.9),
             ("impact.wav", COMPIUTA, 0.9), ("whoosh.wav", CIFRA[0], 0.6)] + [("whoosh.wav", t, 0.35) for t in tagli]
    for j, (f, t0, v) in enumerate(extra):
        ins += ["-i", os.path.join(AU, f)]
        fil.append(f"[{n + j}:a]volume={v},adelay={int(t0 * 1000)}|{int(t0 * 1000)}[x{j}]")
    mix = "".join(f"[v{i}]" for i in range(n)) + "".join(f"[x{j}]" for j in range(len(extra)))
    fil.append(f"{mix}amix=inputs={n + len(extra)}:normalize=0,alimiter=limit=0.9,apad=whole_dur={DURATA}[a]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(fil), "-map", "[a]", "-t", str(DURATA), out_wav], check=True)

def main(out):
    b = base()
    wav = out[:-4] + "-audio.wav"
    audio(wav)
    lettore = subprocess.Popen(["ffmpeg", "-v", "error", "-i", b, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                          "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p",
                          "-c:a", "aac", "-b:a", "192k", "-shortest", out], stdin=subprocess.PIPE)
    for i in range(int(DURATA * FPS)):
        raw = lettore.stdout.read(W * H * 3)
        if len(raw) < W * H * 3:
            break
        fr = Image.frombytes("RGB", (W, H), raw)
        t = i / FPS
        if T0[1] - 0.6 <= t < T0[1] + 0.35:  # tuffo verso la piazza e atterraggio
            z = 1 + 1.6 * ease((t - (T0[1] - 0.6)) / 0.6) if t < T0[1] else 1.35 - 0.35 * ease((t - T0[1]) / 0.35)
            cw, ch = int(W / z), int(H / z)
            fr = fr.crop(((W - cw) // 2, int((H - ch) * 0.6), (W - cw) // 2 + cw, int((H - ch) * 0.6) + ch)).resize((W, H), Image.BILINEAR)
            if t < T0[1]:
                fr = fr.filter(ImageFilter.GaussianBlur(1 + 6 * ease((t - (T0[1] - 0.6)) / 0.6)))
        fr = fr.convert("RGBA")
        fr.alpha_composite(hud(i / FPS))
        p.stdin.write(fr.convert("RGB").tobytes())
    p.stdin.close(); p.wait(); lettore.kill()
    print("OK", out, round(DURATA, 1), "s")

if __name__ == "__main__":
    import sys
    main(sys.argv[1])
