# Tappeto sobrio per i temi seri (A2 Roma): accordi lenti in Re minore, niente batteria.
# Uso: python musica.py <durata s> <out.wav>
import sys, wave
import numpy as np

SR = 44100
dur = float(sys.argv[1]); out = sys.argv[2]
f = lambda m: 440 * 2 ** ((m - 69) / 12)
accordi = [[50, 53, 57], [46, 50, 53], [48, 52, 55], [45, 49, 52]]  # Dm Bb C A
bar = 4.0
n = int(dur * SR); y = np.zeros(n)
t = np.arange(int(bar * SR * 1.5)) / SR
env = np.minimum(1, t / 1.2) * np.minimum(1, (t[-1] - t) / 1.5)
for k in range(int(dur / bar) + 1):
    c = accordi[k % 4]; s = int(k * bar * SR)
    seg = sum(np.sin(2 * np.pi * f(m) * t + 0.4 * np.sin(2 * np.pi * 0.15 * t)) + 0.3 * np.sin(2 * np.pi * f(m + 12) * t * 1.002) for m in c) * 0.05
    seg += np.sin(2 * np.pi * f(c[0] - 12) * t) * 0.10
    seg *= env
    e = min(n, s + len(seg)); y[s:e] += seg[:e - s]
fade = int(1.5 * SR); y[:fade] *= np.linspace(0, 1, fade); y[-fade:] *= np.linspace(1, 0, fade)
y = y / np.abs(y).max() * 0.8
st = np.stack([y, y], 1)
with wave.open(out, "w") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
