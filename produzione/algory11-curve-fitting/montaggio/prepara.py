# Dentro Algory #11: parole della voce (parole.json, già tagliata e a ×1,12) -> sottotitoli per Remotion,
# più sfx.json per script/synth.py. Corregge gli errori di trascrizione di whisper e unisce gli apostrofi.
# Uso: python prepara.py   (scrive remotion-c/src/algory11-parole.ts e sfx.json)
import json, os

QUI = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(QUI, "..", "..", "remotion-c", "src", "algory11-parole.ts")
p = json.load(open(os.path.join(QUI, "parole.json"), encoding="utf-8"))

# correzioni puntuali per tempo di inizio (whisper ha sentito male)
SOSTITUISCI = {36.3: "Algory", 59.74: "la", 59.8: "sposto", 69.4: "rimescolo", 105.85: "niente.", 98.11: "STANGA50,",
               28.22: "curve", 28.71: "fitting.", 86.13: "edge", 86.34: "fading."}

grezze = [[round(w["s"], 2), SOSTITUISCI.get(round(w["s"], 2), w["w"]).strip()] for w in p]

# unisci pezzi che whisper spezza: «l» + «'ultimo», «70» + «%»
unite = []
for s, x in grezze:
    if unite and (x.startswith("'") or x == "%"):
        unite[-1][1] += x
    elif unite and unite[-1][1] == "l" and s - unite[-1][0] < 0.3:
        unite[-1][1] = "l" + x
    else:
        unite.append([s, x])

res, g = [], 0
for s, x in unite:
    pulita = x.rstrip(".,?!")
    res.append([s, pulita, g])
    if x != pulita:
        g += 1

def quando(parola, dopo=0.0):
    return next(a for a, w, _ in res if w.lower() == parola.lower() and a >= dopo)

ENFASI = [quando("LA"), quando("perfetta"), quando("sfascia"), quando("colpevole"), quando("Fuori"), quando("98"),
          quando("nessuno"), quando("7", 66), quando("mille"), quando("ciao"), quando("edge"), quando("STANGA50")]
# cambi di scheda (whoosh)
TAGLI = [11.81, 29.16, 34.36, 53.19, 67.2, 79.16, 94.31, 102.55]

ts = ("// Dentro Algory #11: parole della voce Julian (voce.wav, pause tagliate, ×1,12)\n"
      "// generato da algory11-curve-fitting/montaggio/prepara.py: [secondi, parola, frase]\n"
      "export const PAROLE_A11: [number, string, number][] = " + json.dumps(res, ensure_ascii=False) + ";\n"
      "export const ENFASI_A11 = " + json.dumps(ENFASI) + ";\n")
open(SRC, "w", encoding="utf-8").write(ts)
dur = round(p[-1]["e"] + 1.8, 2)
json.dump({"dur": dur, "whoosh": TAGLI, "impact": ENFASI, "riser": [53.19], "ticks": []}, open(os.path.join(QUI, "sfx.json"), "w"))
print(dur, "s;", " ".join(w for _, w, _ in res))
