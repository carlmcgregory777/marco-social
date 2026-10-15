# Valzer "alla Tim Burton" generato col codice (zero crediti).
# Re minore, 3/4, 24 battute che finiscono sulla dominante (La7) -> il loop torna su Rem.
# Uso: python3 burton_waltz.py <durata_s> <out.wav> [variante 0-2]
# Varianti (stessa firma, pezzi diversi -> non usare sempre la stessa):
#  0 = Re minore, carillon + coro (reel Vox «costi»)
#  1 = Mi minore, celesta + clavicembalo, melodia discendente, più lento
#  2 = La minore, carillon acuto + fagotto pizzicato, melodia saltellante, più veloce
import numpy as np, wave, sys
SR = 44100
DUR = float(sys.argv[1]) if len(sys.argv) > 1 else 30.08
OUT = sys.argv[2] if len(sys.argv) > 2 else "burton.wav"
VAR = int(sys.argv[3]) if len(sys.argv) > 3 else 0
TR = [0, 2, -5][VAR]                 # trasposizione: Rem / Mim / Lam
BARS = [24, 20, 28][VAR]             # meno battute = più lento
BAR = DUR / BARS
BEAT = BAR / 3
f = lambda m: 440 * 2 ** ((m - 69) / 12)
rng = np.random.default_rng(7 + VAR)
N = int(DUR * SR) + SR * 3
mix = {k: np.zeros(N) for k in ("box", "pizz", "choir", "bass", "bell")}

def put(track, start, sig):
    s = int(start * SR); e = min(N, s + len(sig)); mix[track][s:e] += sig[: e - s]

def musicbox(m, dur, amp):  # campanella FM tipo carillon/celesta
    t = np.arange(int((dur + 1.2) * SR)) / SR; fc = f(m)
    idx = 2.2 * np.exp(-t * 6)
    s = np.sin(2 * np.pi * fc * t + idx * np.sin(2 * np.pi * fc * 3.5 * t))
    s += 0.25 * np.sin(2 * np.pi * fc * 2.01 * t) * np.exp(-t * 9)
    return s * np.exp(-t * 3.2) * np.minimum(1, t * 400) * amp

def pluck(m, amp, length=0.6):  # pizzicato Karplus-Strong
    p = int(SR / f(m)); n = int(length * SR)
    buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.994
    return out * amp * np.exp(-np.arange(n) / SR * 4)

def formant(x, peaks):  # filtro "uuh" del coro via FFT
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(len(x), 1 / SR)
    H = sum(g * np.exp(-((fr - c) / w) ** 2) for c, w, g in peaks)
    return np.fft.irfft(X * H, len(x))

def choir(ms, dur, amp):
    t = np.arange(int((dur + 0.6) * SR)) / SR; s = np.zeros_like(t)
    for m in ms:
        for d in (-0.08, 0.0, 0.07):  # 3 voci leggermente stonate = coro
            vib = 0.004 * np.sin(2 * np.pi * (5.2 + d * 10) * t + rng.uniform(0, 6))
            ph = np.cumsum(f(m + d) * (1 + vib)) / SR
            s += 2 * (ph % 1) - 1
    s = formant(s, [(320, 90, 1.0), (800, 140, 0.45), (2500, 300, 0.08)])
    env = np.minimum(1, t / 0.35) * np.minimum(1, (len(t) / SR - t) / 0.5)
    return s * env * amp / len(ms)

# Rem | Rem | Solm | La7 | Rem | Sib | Solm | La7  (x3)
CH = [[50, 53, 57], [50, 53, 57], [55, 58, 62], [57, 61, 64], [50, 53, 57], [46, 50, 53], [55, 58, 62], [57, 61, 64]]
MEL0 = [[(69, 1), (74, 1), (77, 1)], [(76, 2), (74, 1)], [(70, 1), (74, 1), (79, 1)], [(76, 1), (73, 1), (69, 1)],
       [(77, 1), (81, 1), (77, 1)], [(74, 2), (77, 1)], [(76, 1), (79, 1), (82, 1)], [(81, 1), (79, 1), (76, 1)]]
MEL1 = [[(81, 2), (77, 1)], [(76, 1), (74, 1), (73, 1)], [(74, 2), (70, 1)], [(73, 3)],
        [(77, 2), (74, 1)], [(74, 1), (72, 1), (70, 1)], [(70, 1), (74, 1), (79, 1)], [(76, 2), (73, 1)]]
MEL2 = [[(74, 1), (77, 0.5), (74, 0.5), (69, 1)], [(74, 1), (77, 0.5), (81, 0.5), (79, 1)], [(79, 1), (82, 0.5), (79, 0.5), (74, 1)], [(73, 1), (76, 1), (79, 1)],
        [(77, 1), (74, 0.5), (77, 0.5), (81, 1)], [(82, 1), (77, 1), (74, 1)], [(79, 0.5), (77, 0.5), (76, 1), (74, 1)], [(73, 1), (69, 1), (73, 1)]]
MEL = [MEL0, MEL1, MEL2][VAR]
CH = [[n + TR for n in c] for c in CH]
MEL = [[(m + TR, d) for m, d in bar] for bar in MEL]
BOX_UP = [12, 12, 24][VAR]

for b in range(BARS):
    t0 = b * BAR; c = CH[b % 8]; phrase = b // 8
    put("bass", t0, pluck(c[0] - (24 if VAR == 2 else 12), 0.9 if VAR != 2 else 1.2, 0.9))           # oom
    for k in (1, 2):                                         # pah-pah
        for m in c[1:]:
            put("pizz", t0 + k * BEAT, pluck(m + (24 if VAR == 1 else 12), 0.35 if VAR != 1 else 0.22, 0.35))
    tb = t0
    for m, beats in MEL[b % 8]:
        put("box", tb, musicbox(m + BOX_UP, beats * BEAT, 0.5 if VAR != 2 else 0.4))
        if phrase == 2 or (VAR == 1 and phrase >= 1): put("box", tb, musicbox(m + BOX_UP + 12, beats * BEAT, 0.18))  # ottava alta nel finale
        tb += beats * BEAT
    if phrase >= (1 if VAR != 2 else 2): put("choir", t0, choir([m + 12 for m in c], BAR, 0.5))
    if b % 8 == 0: put("bell", t0, musicbox(38 + TR, 2.5, 0.35) * 0.8)  # rintocco grave a ogni frase

def reverb(x, sec=2.2, wet=0.3):
    n = int(sec * SR); ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 3.0)
    L = len(x) + n; F = 1 << (L - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, F) * np.fft.rfft(ir, F), F)[: len(x)]
    return x + wet * y / np.max(np.abs(y) + 1e-9) * np.max(np.abs(x) + 1e-9)

dry = mix["box"] * 1.0 + mix["pizz"] * 0.8 + mix["choir"] * 0.55 + mix["bass"] * 0.9 + mix["bell"]
out = reverb(dry)[: int(DUR * SR)]
fade = int(0.03 * SR); out[:fade] *= np.linspace(0, 1, fade); out[-fade:] *= np.linspace(1, 0, fade)
out = out / np.max(np.abs(out)) * 0.8
st = np.stack([out, np.roll(out, int(0.012 * SR))], 1)  # un po' di stereo
w = wave.open(OUT, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((st * 32767).astype(np.int16).tobytes()); w.close()
print("ok", OUT, DUR)
