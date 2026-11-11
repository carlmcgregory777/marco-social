# Prepara i pezzi audio per InfiniteTalk: media (C-medio) sui segmenti M e I, larga (C-seduto) sui segmenti L.
# I segmenti G (grafica a tutto schermo) non servono. Pezzi da max ~118 s, tagliati solo tra un segmento e l'altro.
# Uscita: labiale/<inq>-<n>.wav e labiale/indice.json = [{inq, file, pezzi: [{a, b, off}]}]
#   a, b = tempi in voce.wav; off = dove inizia quel tratto dentro il pezzo audio (e quindi nel video).
import json, os, subprocess, numpy as np
QUI = os.path.dirname(os.path.abspath(__file__)); os.chdir(QUI)
os.makedirs('labiale', exist_ok=True)
SR = 48000; PAD = 0.25; MAX = 118
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', 'voce.wav', '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True)
a = np.frombuffer(r.stdout, np.int16)
S = json.load(open('segmenti.json', encoding='utf-8'))
QUALI = {'medio': ('M', 'I'), 'largo': ('L',)}
indice = []
for inq, tipi in QUALI.items():
    spans = []
    for s in S:
        if s['tipo'] not in tipi: continue
        if spans and abs(spans[-1][1] - s['a']) < 0.01: spans[-1][1] = s['b']
        else: spans.append([s['a'], s['b']])
    gruppi = [[]]; dur = 0
    for sp in spans:
        d = sp[1] - sp[0] + PAD
        if gruppi[-1] and dur + d > MAX: gruppi.append([]); dur = 0
        gruppi[-1].append(sp); dur += d
    for n, g in enumerate(gruppi):
        out = []; pezzi = []; t = 0.0
        for (x, y) in g:
            pezzi.append(dict(a=round(x, 3), b=round(y, 3), off=round(t, 3)))
            seg = a[int(x * SR):int(y * SR)]
            out += [seg, np.zeros(int(PAD * SR), np.int16)]; t += len(seg) / SR + PAD
        f = f'labiale/{inq}-{n}.wav'
        open('tmp.raw', 'wb').write(np.concatenate(out).tobytes())
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', 'tmp.raw', f], check=True)
        indice.append(dict(inq=inq, file=f, durata=round(t, 2), pezzi=pezzi))
        print(f, round(t, 1), 's', len(pezzi), 'tratti')
os.remove('tmp.raw')
json.dump(indice, open('labiale/indice.json', 'w', encoding='utf-8'), indent=1)
