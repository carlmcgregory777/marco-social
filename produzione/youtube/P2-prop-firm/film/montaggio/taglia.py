# L0 YouTube: pause > 0,45 s -> 0,30 s (ritmo YouTube, non da reel), accelerata x1,04, loudnorm -14.
# Ingresso: voce-grezza.wav + parole-grezze.json. Uscita: voce.wav (48 kHz) e parole.json (tempi finali).
import json, subprocess, numpy as np, os
QUI = os.path.dirname(os.path.abspath(__file__)); os.chdir(QUI)
SR = 44100; SOGLIA = 0.45; GAP = 0.30; VEL = 1.04
W = json.load(open('parole-grezze.json', encoding='utf-8'))
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', 'voce-grezza.wav', '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True)
a = np.frombuffer(r.stdout, np.int16).astype(np.float32) / 32768
pz = []; s = W[0]['s'] - 0.08; e = W[0]['e']
for w in W[1:]:
    if w['s'] - e > SOGLIA: pz.append((s, e + 0.12)); s = w['s'] - 0.10
    e = w['e']
pz.append((s, e + 0.4))
out = []; mappa = []; t = 0.0
for (s, e) in pz:
    s = max(0, s); seg = a[int(s * SR):int(e * SR)].copy()
    n = int(0.010 * SR); seg[:n] *= np.linspace(0, 1, n); seg[-n:] *= np.linspace(1, 0, n)
    mappa.append((s, e, t)); out.append(seg); out.append(np.zeros(int(GAP * SR), np.float32)); t += len(seg) / SR + GAP
y = np.concatenate(out)
open('tmp.raw', 'wb').write((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', 'tmp.raw', '-filter:a', f'atempo={VEL},loudnorm=I=-14:TP=-1.5', '-ar', '48000', 'voce.wav'], check=True)
os.remove('tmp.raw')
def m(x):
    for s, e, t0 in mappa:
        if s - 0.12 <= x <= e + 0.12: return (t0 + max(0, x - s)) / VEL
    return None
P = [dict(w=w['w'], s=round(m(w['s']), 3), e=round(m(w['e']), 3)) for w in W]
json.dump(P, open('parole.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('durata', round(t / VEL, 2), 'pezzi', len(pz))
