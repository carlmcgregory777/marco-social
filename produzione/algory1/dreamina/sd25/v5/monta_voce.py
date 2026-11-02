# Traccia voce v5: nelle scene parlate l'audio dello spezzone Seedance (labiale esatto),
# nelle grafiche la voce ElevenLabs voce-v5.wav. Livelli pareggiati sull'RMS del parlato.
import subprocess, numpy as np, wave, json
SR = 44100
def leggi(f):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.int16).astype(float) / 32768
voce = leggi("../../voce-test/voce-v5.wav")
# (sorgente, inizio s, durata s, file clip per Remotion)
PEZZI = [
    ("T1.mp4", 0.45, 4.50), ("voce", 4.15, 4.30),
    ("T2.mp4", 0.00, 5.00), ("voce", 13.45, 6.65),
    ("T3.mp4", 0.00, 4.85), ("voce", 24.40, 4.95),
    ("T4.mp4", 0.00, 5.95), ("voce", 34.50, 3.60),
    ("T5.mp4", 0.30, 4.76),
]
def rms(x):
    x = x[np.abs(x) > 0.01]
    return np.sqrt((x ** 2).mean())
rif = rms(voce)
out, scene, t = [], [], 0.0
for src, a, d in PEZZI:
    x = voce if src == "voce" else leggi(src)
    seg = x[int(a * SR):int((a + d) * SR)].copy()
    seg = np.pad(seg, (0, int(d * SR) - len(seg)))
    if src != "voce":
        seg *= rif / rms(seg)
    n = int(0.01 * SR)
    seg[:n] *= np.linspace(0, 1, n); seg[-n:] *= np.linspace(1, 0, n)
    out.append(seg)
    scene.append({"src": src, "from": round(t, 3), "dur": d, "inizio": a})
    t += d
y = np.concatenate(out)
y = y / max(1e-9, np.abs(y).max()) * 0.9
with wave.open("voce-v5-montata.wav", "w") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y * 32767).astype(np.int16).tobytes())
json.dump(scene, open("scene-v5.json", "w"), indent=1)
print(round(t, 2), scene)
