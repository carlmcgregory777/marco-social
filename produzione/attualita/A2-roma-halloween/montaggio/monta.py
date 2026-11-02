# Attualità #2 Roma Halloween: traccia voce montata (audio delle clip nelle scene parlate, voce Seed Audio
# di Lumina nelle grafiche), tempi delle parole per i sottotitoli, enfasi ed effetti. Stesso schema di A1 Polonia.
# Uso: python monta.py  (dalla cartella montaggio). Prima: whisper sulle clip → clip/Tn-parole.json
import json, shutil, subprocess, wave
import numpy as np

SR = 44100
A2 = "C:/Users/stang/code/marco-social/produzione/attualita/A2-roma-halloween/"
PUB = "C:/Users/stang/code/marco-social/produzione/remotion-c/public/a2roma/"
SRC = "C:/Users/stang/code/marco-social/produzione/remotion-c/src/a2roma-parole.ts"

def leggi(f):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.int16).astype(float) / 32768

def parole(f):
    for enc in ("utf-8", "cp1252"):
        try:
            return json.load(open(f, encoding=enc))
        except UnicodeDecodeError:
            pass

voce = leggi(A2 + "voce/voce.wav")  # A + B già a ×1,1
PV = parole(A2 + "voce/voce-parole.json")
# (sorgente, inizio s, durata s): tagli nei silenzi tra le frasi
PEZZI = [
    ("T1.mp4", 0.00, 4.00),   # «Roma, notte di Halloween. Leggi bene questo titolo.»
    ("voce", 3.75, 11.05),    # G1 «Tredici anni…» fino a «…due uomini arrestati.»
    ("voce", 14.80, 5.35),    # G2 «I carabinieri…» fino a «…si parla d'altro.»
    ("voce", 20.10, 5.70),    # G3 «Io di mestiere costruisco sistemi…» fino a «…non sbaglia mai.»
    ("T3.mp4", 0.00, 5.00),   # «Una regola che nessuno fa rispettare… suggerimento.»
    ("T4.mp4", 0.00, 8.00),   # «Non mi interessa da dove viene chi sbaglia… senza paura.»
]

def rms(x):
    x = x[np.abs(x) > 0.01]
    return np.sqrt((x ** 2).mean())

def parole_di(src):
    return PV if src == "voce" else parole(A2 + "clip/" + src.replace(".mp4", "-parole.json"))

PAUSA, DOPO, PRIMA = 0.30, 0.08, 0.06
q = lambda s: round(s * 30) / 30

def sottopezzi(src, a, d):
    w = [(wa, wb) for wa, wb, _ in parole_di(src) if a - 0.1 <= wa < a + d - 0.05]
    tagli = [(pb + DOPO, na - PRIMA) for (_, pb), (na, _) in zip(w, w[1:]) if na - pb > PAUSA]
    pezzi, inizio = [], max(a, w[0][0] - 0.1) if w else a
    for c0, c1 in tagli:
        pezzi.append((q(inizio), q(c0))); inizio = c1
    fine = min(a + d, w[-1][1] + 0.25) if w else a + d
    pezzi.append((q(inizio), q(fine)))
    return [(x0, x1 - x0) for x0, x1 in pezzi if x1 - x0 > 0.05]

rif = rms(voce)
out, scene, t = [], [], 0.0
for k, (src, a, d) in enumerate(PEZZI):
    x = voce if src == "voce" else leggi(A2 + "clip/" + src)
    g = 1.0 if src == "voce" else rif / rms(x[int(a * SR):int((a + d) * SR)])
    for a2, d2 in sottopezzi(src, a, d):
        seg = x[int(a2 * SR):int(a2 * SR) + int(round(d2 * SR))].copy() * g
        seg = np.pad(seg, (0, int(round(d2 * SR)) - len(seg)))
        n = int(0.008 * SR)
        seg[:n] *= np.linspace(0, 1, n); seg[-n:] *= np.linspace(1, 0, n)
        out.append(seg)
        scene.append({"src": src, "pezzo": k, "from": round(t, 4), "dur": round(d2, 4), "inizio": round(a2, 4)})
        t += d2
# mezzo secondo di silenzio in coda: il finale respira
out.append(np.zeros(int(0.5 * SR)))
scene[-1]["dur"] = round(scene[-1]["dur"] + 0.5, 4)
t += 0.5
y = np.concatenate(out)
y = y / max(1e-9, np.abs(y).max()) * 0.9
with wave.open(PUB + "voce-montata.wav", "w") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y * 32767).astype(np.int16).tobytes())
for s in scene:
    if s["src"] != "voce":
        shutil.copy(A2 + "clip/" + s["src"], PUB + s["src"])
json.dump(scene, open("scene.json", "w"), indent=1)

# whisper ha salvato le lettere accentate come U+FFFD
U = "�"
FIX = {"l" + U: "lì", "'" + U: "'è", U: "è", "dimestiere": "di mestiere", "13": "tredici", "31": "trentun", "stevere": "Trastevere"}
def fix(x):
    p = x.rstrip(".,?")
    return FIX.get(p.lower(), p) + x[len(p):]
w = []
for s in scene:
    sp = s["from"] - s["inizio"]
    for a, b, x in parole_di(s["src"]):
        a = max(a, s["inizio"]) if b > s["inizio"] + 0.1 else a
        if s["inizio"] - 0.15 <= a < s["inizio"] + s["dur"] - 0.05:
            w.append([round(max(s["from"], a + sp), 2), fix(x.strip())])
res, i, g = [], 0, 0
while i < len(w):
    t0, x = w[i]
    nx = w[i + 1][1] if i + 1 < len(w) else ""
    if nx.startswith("'"):
        x = x + nx; i += 1
    elif x.lower() == "tra" and nx.lower().startswith("trastevere"):
        x = nx; i += 1
    p = x.rstrip(".,?")
    res.append([t0, p, g])
    if x != p: g += 1
    i += 1

def quando(parola, dopo=0.0):
    return next(a for a, p, _ in res if p.lower() == parola.lower() and a >= dopo)

ENFASI = [quando("titolo"), quando("arrestati"), quando("suggerimento"), quando("paghi")]
ts = ("// Attualità #2 Roma Halloween: voce montata (voce-montata.wav = audio delle clip + voce Seed Audio nelle grafiche)\n"
      "// generato da attualita/A2-roma-halloween/montaggio/monta.py: [secondi, parola, frase]\n"
      "export const PAROLE_A2: [number, string, number][] = " + json.dumps(res, ensure_ascii=False) + ";\n"
      "export const ENFASI_A2 = " + json.dumps(ENFASI) + ";\n"
      "export const SCENE_A2 = " + json.dumps(scene) + ";\n")
open(SRC, "w", encoding="utf-8").write(ts)
tagli = [s["from"] for p, s in zip(scene, scene[1:]) if s["pezzo"] != p["pezzo"]]
json.dump({"dur": round(t, 2), "whoosh": tagli, "impact": ENFASI, "riser": [tagli[-2]], "ticks": []}, open("sfx.json", "w"))
print(round(t, 2), "s;", " ".join(p for _, p, _ in res))
print("enfasi", ENFASI)
