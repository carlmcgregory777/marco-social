# A6 v5 (07/11/2026): formato «Guarda questo» con il servizio Bloomberg come fonte.
# Taglia voce.wav (uscita di episodio.py) nei pezzi che restano dopo la fonte:
#   A  = «Guarda questo.»                     [0, 0.75]
#   B1 = «Il contratto più grande ... artificiale.»   [8.85, 14.35]
#   B2 = «E qualcuno lo sapeva. ... fino in fondo»    [18.31, fine]
# (la parte tagliata la dice Bloomberg: 7 miliardi, Tencent, 100.000 chip, 5 anni, FT).
# Scrive:
#   voce-intera.wav   copia di voce.wav com'era (una volta sola)
#   voce-c.wav        A+B1+B2 di fila  -> si usa per il LABIALE (InfiniteTalk)
#   voce-a.wav, voce-b.wav  i due tronconi da mettere prima e dopo la fonte
#   parole-c.json     parole con i tempi rimappati su voce-c
#   src/a6oracle-parole.ts  rigenerato sui tempi di voce-c
import json, os, shutil, sys
import numpy as np
import soundfile as sf

QUI = os.path.dirname(os.path.abspath(__file__))
EP = os.path.dirname(QUI)
sys.path.insert(0, os.path.join(EP, "..", "..", "script"))
import episodio  # noqa: E402

A = (0.0, 0.75)
B1 = (8.85, 14.35)
B2 = (18.31, None)
DISSOLVENZA = 0.02

intera = os.path.join(QUI, "voce-intera.wav")
if not os.path.exists(intera):
    shutil.copy2(os.path.join(QUI, "voce.wav"), intera)
x, sr = sf.read(intera)
fine = len(x) / sr


def pezzo(a, b):
    b = fine if b is None else b
    y = x[int(a * sr):int(b * sr)].copy()
    n = int(DISSOLVENZA * sr)
    rampa = np.linspace(0, 1, n)
    if y.ndim > 1:
        rampa = rampa[:, None]
    y[:n] *= rampa
    y[-n:] *= rampa[::-1]
    return y, b - a


ya, da = pezzo(*A)
yb1, db1 = pezzo(*B1)
yb2, db2 = pezzo(*B2)
yb = np.concatenate([yb1, yb2])
sf.write(os.path.join(QUI, "voce-a.wav"), ya, sr)
sf.write(os.path.join(QUI, "voce-b.wav"), yb, sr)
sf.write(os.path.join(QUI, "voce-c.wav"), np.concatenate([ya, yb]), sr)

# rimappo le parole sui tempi di voce-c
par = json.load(open(os.path.join(QUI, "parole-allineate.json"), encoding="utf-8"))
mappa = [(A[0], A[1], 0.0), (B1[0], B1[1], da), (B2[0], fine, da + db1)]
out = []
for w in par:
    for a, b, off in mappa:
        if a - 0.01 <= w["s"] < b:
            out.append({"w": w["w"], "s": round(w["s"] - a + off, 3), "e": round(min(w["e"], b) - a + off, 3)})
            break
json.dump(out, open(os.path.join(QUI, "parole-c.json"), "w", encoding="utf-8"), ensure_ascii=False)

cfg = json.load(open(os.path.join(EP, "config.json"), encoding="utf-8"))
episodio.passo5_parole(EP, cfg, out)
print(f"A {da:.2f}s | B {db1 + db2:.2f}s | voce-c {da + db1 + db2:.2f}s | parole {len(par)} -> {len(out)}")
