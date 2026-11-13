# Musica «a crescendo» ed effetti sonori per i video YouTube stile Hormozi/MrBeast (13/11/2026).
# Sostituisce il valzer nei video lunghi: la musica cresce a sezioni e si ferma di colpo prima della frase finale.
#
# Uso:
#   python musica_regia.py musica <out.wav> <durata> <bpm> <t1,t2,t3,...>
#       i tempi (secondi) sono gli inizi delle sezioni: 1 = entra la cassa, 2 = clap e pad, 3 = DROP (riser prima),
#       4 = STOP (resta solo un bordone teso), la fine chiude con un colpo.
#   python musica_regia.py sfx <cartella>       crea whoosh, swish, pop, scribble, impact, boom, ding, tick, riser
import os, sys
import numpy as np
from scipy.signal import butter, sosfilt
import wave

SR = 44100
rng = np.random.default_rng(7)


def salva(path, x, stereo=True):
    x = np.asarray(x, dtype=np.float64)
    m = np.max(np.abs(x)) or 1
    if m > 0.98:
        x = x / m * 0.98
    if x.ndim == 1 and stereo:
        x = np.stack([x, x], 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(2 if stereo else 1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def filtro(x, tipo, f, ordine=2):
    if isinstance(f, (list, tuple)):
        f = [min(max(v, 20), SR / 2 - 100) for v in f]
    else:
        f = min(max(f, 20), SR / 2 - 100)
    return sosfilt(butter(ordine, f, btype=tipo, fs=SR, output="sos"), x)


def t_(d):
    return np.arange(int(d * SR)) / SR


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def adsr(n, a=0.005, r=0.1):
    e = np.ones(n)
    A, R = min(n, int(a * SR)), min(n, int(r * SR))
    if A: e[:A] = np.linspace(0, 1, A)
    if R: e[-R:] *= np.linspace(1, 0, R) ** 2
    return e


def metti(buf, x, at, g=1.0):
    s = int(at * SR)
    if s >= len(buf) or s + len(x) <= 0:
        return
    if s < 0:
        x = x[-s:]; s = 0
    e = min(len(buf), s + len(x))
    buf[s:e] += x[: e - s] * g


# ---------------- strumenti ----------------
def cassa(d=0.45, forte=1.0):
    t = t_(d)
    f = 48 + 140 * np.exp(-t * 38)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5)
    click = filtro(rng.standard_normal(len(t)), "highpass", 2500) * np.exp(-t * 300) * 0.25
    return (x + click) * forte


def clap():
    t = t_(0.3)
    n = rng.standard_normal(len(t))
    e = np.zeros(len(t))
    for k, o in enumerate([0, 0.012, 0.024]):
        s = int(o * SR); e[s:] += np.exp(-(t[: len(t) - s]) * (60 if k < 2 else 18))
    return filtro(n, "bandpass", [900, 5000]) * e * 0.5


def hat(aperto=False):
    t = t_(0.35 if aperto else 0.06)
    return filtro(rng.standard_normal(len(t)), "highpass", 7000) * np.exp(-t * (12 if aperto else 90)) * 0.22


def basso(m, d):
    t = t_(d)
    f = hz(m)
    x = np.tanh(2.2 * (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * 2 * f * t)))
    return filtro(x, "lowpass", 420) * adsr(len(t), 0.004, 0.05) * 0.5


def pluck(m, d=0.22):
    t = t_(d)
    f = hz(m)
    saw = 2 * ((f * t) % 1) - 1
    x = filtro(saw, "lowpass", 3800) * np.exp(-t * 14)
    return x * 0.16


def pad(note, d):
    t = t_(d)
    x = sum(np.sin(2 * np.pi * hz(m) * t * (1 + dt)) for m in note for dt in (-0.004, 0.004))
    return filtro(x, "lowpass", 1800) * adsr(len(t), 0.25, 0.4) * 0.05


def stab(note, d=0.3):
    t = t_(d)
    x = sum(2 * ((hz(m) * t) % 1) - 1 for m in note)
    return filtro(x, "lowpass", 5000) * np.exp(-t * 6) * 0.09


def crash():
    t = t_(2.2)
    return filtro(rng.standard_normal(len(t)), "highpass", 4000) * np.exp(-t * 2.2) * 0.35


def riser(d=2.0):
    t = t_(d)
    n = rng.standard_normal(len(t))
    y = np.zeros(len(t)); blocco = 2048
    for i in range(0, len(t), blocco):  # rumore che si apre
        fc = 300 + (8000 - 300) * (i / len(t)) ** 2
        y[i:i + blocco] = filtro(n[i:i + blocco], "bandpass", [fc * 0.6, fc * 1.4], 1)
    tono = np.sin(2 * np.pi * np.cumsum(200 + 900 * (t / d) ** 2) / SR) * 0.15
    return (y * 0.5 + tono) * (t / d) ** 2


# ---------------- musica ----------------
def musica(out, dur, bpm, tempi):
    t1, t2, t3, t4 = tempi
    b = 60 / bpm
    n = int((dur + 1.5) * SR)
    L = np.zeros(n)
    # La minore: Am - F - C - G (radici)
    giro = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [52, 55, 60]), (55, [55, 59, 62])]
    arp_pat = [0, 12, 7, 12, 3, 12, 7, 15]
    passo = b / 2
    k = 0; tt = 0.0
    while tt < dur:
        battuta = int(tt / (4 * b)); rad, acc = giro[battuta % 4]
        dentro_stop = tt >= t4
        drop = t3 <= tt < t4
        if not dentro_stop:
            # arpeggio (sempre, più brillante dopo il drop)
            metti(L, pluck(rad + 12 + arp_pat[k % 8] - (12 if k % 8 > 5 else 0)), tt, 1.3 if drop else 0.8)
            # basso a crome dopo t1
            if tt >= t1:
                metti(L, basso(rad - 12 + (12 if (drop and k % 4 == 3) else 0), passo * 0.9), tt, 1.0)
            if k % 2 == 0:  # sui quarti
                if tt >= t1:
                    metti(L, cassa(forte=1.15 if drop else 1.0), tt, 0.9)
                else:  # intro: battito sordo
                    metti(L, filtro(cassa(), "lowpass", 180), tt, 0.7)
            else:
                if tt >= 1.4:
                    metti(L, hat(aperto=tt >= t2), tt, 1.0 if tt >= t1 else 0.5)
            if tt >= t2 and k % 4 == 2:
                metti(L, clap(), tt, 1.0)
            if tt >= t2 and k % 8 == 0:
                metti(L, pad([m + 12 for m in acc], 4 * b), tt, 1.0)
            if drop and k % 8 in (0, 3, 6):
                metti(L, stab([m + 12 for m in acc]), tt, 1.0)
        k += 1; tt += passo
    # riser prima del drop, crash sul drop
    metti(L, riser(2.0), t3 - 2.0, 0.6)
    metti(L, crash(), t3, 0.9)
    metti(L, cassa(0.9, 1.6), t3, 0.9)
    # dopo lo STOP: bordone basso teso + battito lento + tono che sale verso la fine
    td = t_(dur - t4)
    bord = (np.sin(2 * np.pi * hz(33) * td) + 0.3 * np.sin(2 * np.pi * hz(45) * td)) * adsr(len(td), 0.3, 0.3) * 0.18
    metti(L, bord, t4)
    x = t4 + 0.05
    while x < dur - 0.3:
        metti(L, filtro(cassa(), "lowpass", 140), x, 0.8); x += 2 * b
    metti(L, riser(dur - t4) * 0.5, t4)
    # colpo finale
    metti(L, cassa(1.2, 1.8), dur, 1.0); metti(L, crash(), dur, 0.8)
    # un filo di larghezza stereo: ritardo di 12 ms a destra
    R = np.concatenate([np.zeros(int(0.012 * SR)), L])[:n]
    salva(out, np.stack([L, 0.85 * L + 0.15 * R], 1))
    print("musica", out, round(dur, 2), "s")


# ---------------- effetti ----------------
def sfx(cart):
    os.makedirs(cart, exist_ok=True)
    def sweep(d, f0, f1, g=0.6):
        t = t_(d)
        nz = rng.standard_normal(len(t)); y = np.zeros(len(t)); bl = 1024
        for i in range(0, len(t), bl):
            p = i / len(t); fc = f0 * (f1 / f0) ** p
            y[i:i + bl] = filtro(nz[i:i + bl], "bandpass", [fc * 0.5, fc * 1.6], 1)
        e = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5
        return y * e * g
    salva(f"{cart}/whoosh.wav", sweep(0.55, 300, 4000))
    salva(f"{cart}/swish.wav", sweep(0.22, 1500, 6000, 0.35))
    t = t_(0.12); salva(f"{cart}/pop.wav", np.sin(2 * np.pi * np.cumsum(900 * np.exp(-t * 25) + 300) / SR) * np.exp(-t * 35) * 0.6)
    # pennarello: rumore a raffiche
    t = t_(0.9); nz = filtro(rng.standard_normal(len(t)), "bandpass", [1800, 6000])
    mod = (np.sin(2 * np.pi * 9 * t) * 0.5 + 0.5) ** 2 * (0.6 + 0.4 * rng.random(len(t)))
    salva(f"{cart}/scribble.wav", nz * mod * adsr(len(t), 0.02, 0.1) * 0.35)
    t = t_(0.9); imp = np.sin(2 * np.pi * np.cumsum(40 + 120 * np.exp(-t * 20)) / SR) * np.exp(-t * 5)
    salva(f"{cart}/impact.wav", imp + filtro(rng.standard_normal(len(t)), "lowpass", 1500) * np.exp(-t * 18) * 0.4)
    t = t_(1.6); salva(f"{cart}/boom.wav", np.sin(2 * np.pi * np.cumsum(32 + 80 * np.exp(-t * 6)) / SR) * np.exp(-t * 2.2) + filtro(rng.standard_normal(len(t)), "lowpass", 600) * np.exp(-t * 6) * 0.5)
    t = t_(0.7); salva(f"{cart}/ding.wav", (np.sin(2 * np.pi * 1760 * t) + 0.4 * np.sin(2 * np.pi * 2637 * t)) * np.exp(-t * 7) * 0.35)
    t = t_(0.03); salva(f"{cart}/tick.wav", filtro(rng.standard_normal(len(t)), "bandpass", [2000, 7000]) * np.exp(-t * 200) * 0.5)
    salva(f"{cart}/riser.wav", riser(2.0) * 0.7)
    print("sfx in", cart)


if __name__ == "__main__":
    if sys.argv[1] == "musica":
        musica(sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), [float(v) for v in sys.argv[5].split(",")])
    else:
        sfx(sys.argv[2])
