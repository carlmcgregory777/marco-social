# Reel affiliato Higgsfield: traccia voce montata, tempi delle parole per i sottotitoli, effetti e musica.
# Voce: audio delle clip Lumina (A gancio, B «così… o così?», C CTA) + Seed Audio nelle grafiche (T2..T5).
# Uso: python montaggio/monta.py  (dalla cartella higgsfield-aff). Prima: montaggio/trascrivi.py → parole.json
import json, subprocess, sys, wave
import numpy as np

sys.path.insert(0, "C:/Users/stang/code/marco-social/produzione/script")
from synth import whoosh, impact, riser, tick, place

SR = 44100
HF = "C:/Users/stang/code/marco-social/produzione/higgsfield-aff/"
PUB = "C:/Users/stang/code/marco-social/produzione/remotion-c/public/hfaff/"
SRC = "C:/Users/stang/code/marco-social/produzione/remotion-c/src/hfaff-parole.ts"
PW = json.load(open(HF + "montaggio/parole.json", encoding="utf-8"))

def leggi(f):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.int16).astype(float) / 32768

def rms(x):
    x = x[np.abs(x) > 0.01]
    return np.sqrt((x ** 2).mean())

# (nome scena, file voce, inizio s, fine s, silenzio dopo s)
PEZZI = [
    ("gancio", "A", 0.00, 8.10, 0.0),
    ("cosi", "B", 0.00, 4.10, 0.0),
    ("senza", "T2", 2.62, None, 0.0),
    ("passi", "T3", 0.00, None, 1.3),   # dopo «eccolo» il video a tutto schermo
    ("pensa", "T4", 0.00, None, 0.0),
    ("guida", "T5", 0.00, None, 0.0),
    ("cta", "C", 0.00, 5.10, 0.4),
]

# ritmo serrato (Marco 03/11): ogni pausa tra le parole oltre PAUSA si taglia, anche nelle clip di C (jump cut)
PAUSA, DOPO, PRIMA = 0.24, 0.07, 0.08
q = lambda s: round(s * 30) / 30

def parti(x, a, b):
    # silenzi veri dal volume (finestre da 10 ms sotto -44 dB rispetto al picco), non dai tempi di whisper
    h = int(0.01 * SR)
    seg = x[int(a * SR):int(b * SR)]
    e = np.array([np.sqrt((seg[k:k + h] ** 2).mean()) for k in range(0, len(seg) - h, h)])
    voce = e > np.abs(seg).max() * 0.006
    idx = np.flatnonzero(voce)
    inizio, fine = a + max(0, idx[0] * 0.01 - 0.09), a + min(len(e), idx[-1] + 1) * 0.01 + 0.08
    out, k0 = [], idx[0]
    for k1, k2 in zip(idx, idx[1:]):
        if (k2 - k1) * 0.01 > PAUSA:
            out.append((q(inizio), q(a + k1 * 0.01 + DOPO))); inizio = a + k2 * 0.01 - PRIMA
    out.append((q(inizio), q(min(b, fine))))
    return [(x0, x1 - x0) for x0, x1 in out if x1 - x0 > 0.05]

rif = rms(leggi(HF + "voce/T3.wav"))
out, scene, parole, t = [], {}, [], 0.0
for nome, f, a, b, dopo in PEZZI:
    x = leggi(HF + f"voce/{f}.wav")
    b = b if b is not None else len(x) / SR
    g = rif / rms(x[int(a * SR):int(b * SR)])
    t0, pz = t, []
    for a2, d2 in parti(x, a, b):
        n2 = int(round(d2 * SR))
        seg = x[int(a2 * SR):int(a2 * SR) + n2].copy() * g
        seg = np.pad(seg, (0, n2 - len(seg)))
        n = int(0.008 * SR)
        seg[:n] *= np.linspace(0, 1, n); seg[-n:] *= np.linspace(1, 0, n)
        out.append(seg)
        pz.append([round(t - t0, 4), round(d2, 4), a2])
        t += d2
    # ogni parola va nel primo pezzo che tocca (whisper può farla iniziare dentro una pausa tagliata)
    for wa, wb, w in PW[f]:
        if not (a - 0.05 <= wa < b):
            continue
        r0, d2, a2 = next((p for p in pz if wb > p[2] + 0.02 and wa < p[2] + p[1]), pz[-1])
        parole.append([round(t0 + r0 + min(max(0, wa - a2), d2 - 0.05), 2), w, nome])
    out.append(np.zeros(int(round(dopo * SR))))
    t += dopo
    scene[nome] = [round(t0, 4), round(t - t0, 4), pz]
y = np.concatenate(out)
y = y / np.abs(y).max() * 0.9
with wave.open(PUB + "voce.wav", "w") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y * 32767).astype(np.int16).tobytes())

# correzioni di whisper (accenti persi, nomi propri)
U = "\ufffd"
FIX = {"voi": "Vuoi", "cos" + U: "così", U: "è", "scrivela": "Scrivila", "xfield": "Higgsfield", "cloud": "Claude", "20": "venti"}
res, g, i = [], 0, 0
while i < len(parole):
    t0, x, sc = parole[i]
    nx = parole[i + 1][1] if i + 1 < len(parole) else ""
    if nx.startswith("'"):
        x += nx; i += 1
    elif x.lower() == "un" and nx.lower() == "intelligenza":
        x = "un'intelligenza"; i += 1
    p = x.rstrip(".,?!")
    p = FIX.get(p.lower(), p).strip(".")
    res.append([t0, p, g])
    nuova = x != x.rstrip(".,?!") or (i + 1 < len(parole) and parole[i + 1][2] != sc)
    if nuova: g += 1
    i += 1

def quando(parola, dopo=0.0):
    return next(a for a, p, _ in res if p.lower() == parola.lower() and a >= dopo)

T = {
    "nessuno": quando("nessuno"), "esisto": quando("esisto"), "artificiale": quando("un'intelligenza"),
    "cosi2": quando("così", scene["cosi"][0] + 1.2), "camera": quando("camera"), "montaggio": quando("montaggio"), "faccia": quando("faccia"),
    "due": quando("due", scene["senza"][0]), "uno": quando("Uno"), "iscrivi": quando("iscrivi"), "apri": quando("apri"),
    "connettori": quando("connettori"), "cerchi": quando("cerchi"), "colleghi": quando("colleghi"), "fatto": quando("Fatto"),
    "due2": quando("Due", scene["passi"][0]), "chat": quando("chat"), "scrivi": quando("scrivi"), "invio": quando("Invio"),
    "e": quando("E", quando("Invio")), "eccolo": quando("Eccolo"), "pensa": quando("pensa"), "negozio": quando("negozio"),
    "clienti": quando("clienti"), "personaggio": quando("personaggio"), "settimane": quando("settimane"), "devi": quando("devi"),
    "guida": quando("guida"), "collega": quando("collega"), "venti": quando("venti"), "copiare": quando("copiare"),
    "parola": quando("parola"), "video": quando("video", scene["cta"][0]), "sotto": quando("sotto"),
}
dur = round(t, 2)
ts = ("// Reel affiliato Higgsfield (03/11/2026): voce montata (voce.wav) e tempi in secondi\n"
      "// generato da higgsfield-aff/montaggio/monta.py: [secondi, parola, frase]\n"
      "export const PAROLE_HF: [number, string, number][] = " + json.dumps(res, ensure_ascii=False) + ";\n"
      "export const SCENE_HF: Record<string, [number, number, number[][]]> = " + json.dumps(scene) + ";\n"
      "export const T_HF: Record<string, number> = " + json.dumps(T) + ";\n"
      "export const DUR_HF = " + str(dur) + ";\n")
open(SRC, "w", encoding="utf-8").write(ts)

# effetti: whoosh sui tagli, impatto su «non esisto» e sulla rivelazione, riser prima di «eccolo»,
# ding su «fatto», pop sulle spunte e sui riquadri, tasti mentre la richiesta si scrive
def ding():
    tt = np.arange(int(0.9 * SR)) / SR
    return (np.sin(2 * np.pi * 1318.5 * tt) + 0.5 * np.sin(2 * np.pi * 1975.5 * tt)) * np.exp(-tt * 5) * 0.35
def pop():
    tt = np.arange(int(0.12 * SR)) / SR
    return np.sin(2 * np.pi * (900 - 2500 * tt) * tt) * np.exp(-tt * 40) * 0.5
sfx = np.zeros(int((dur + 1) * SR))
for nome in ["cosi", "senza", "passi", "pensa", "guida", "cta"]:
    place(sfx, whoosh(), scene[nome][0] - 0.35)
place(sfx, impact() * 0.6, T["esisto"])
place(sfx, riser(), T["eccolo"] - 2.5)
place(sfx, impact(), T["eccolo"])
place(sfx, ding(), T["fatto"])
for k in ["cosi2", "camera", "montaggio", "faccia", "negozio", "clienti", "personaggio", "venti"]:
    place(sfx, pop(), T[k])
place(sfx, pop(), scene["cosi"][0] + 0.1)
for tt in np.arange(T["scrivi"], T["invio"] - 0.2, 0.075):
    place(sfx, tick() * (0.6 + 0.4 * np.random.rand()), tt)
place(sfx, pop() * 1.5, T["invio"])
sfx = sfx / np.abs(sfx).max() * 0.9
with wave.open(PUB + "sfx.wav", "w") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((sfx * 32767).astype(np.int16).tobytes())
subprocess.run([sys.executable, "C:/Users/stang/code/marco-social/produzione/script/burton_waltz.py", str(dur + 1), PUB + "musica.wav", "2"], check=True)
print(dur, "s")
print(" ".join(p for _, p, _ in res))
print(json.dumps(T))
print(json.dumps(scene))
