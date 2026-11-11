# Attualità #4 midterm: parole della voce (parole.json, già tagliata e a ×1,1) -> sottotitoli per Remotion,
# più sfx.json per script/synth.py. Corregge gli errori di trascrizione di whisper e unisce gli apostrofi.
# Uso: python prepara.py   (scrive remotion-c/src/a4midterm-parole.ts e sfx.json)
import json, os

QUI = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(QUI, "..", "..", "..", "remotion-c", "src", "a4midterm-parole.ts")
p = json.load(open(os.path.join(QUI, "parole.json"), encoding="utf-8"))

# correzioni puntuali per tempo di inizio (whisper ha sentito male)
SOSTITUISCI = {10.02: "stammi", 37.72: "l'è", 79.06: "alle", 79.16: "midterm,", 30.55: "repubblicano,"}
TOGLI = {10.33, 10.44}

grezze = []
for w in p:
    s = round(w["s"], 2)
    if s in TOGLI:
        continue
    grezze.append([s, SOSTITUISCI.get(s, w["w"]).strip()])

# unisci pezzi che whisper spezza: «c» + «'entra», «10» + «.000», «sull» + «'S» + «.P.»
unite = []
for s, x in grezze:
    if unite and (x.startswith("'") or x.startswith(".")):
        unite[-1][1] += x
    else:
        unite.append([s, x])

res, g = [], 0
for s, x in unite:
    x = x.replace("sull'S.P.", "sull'S&P")
    pulita = x.rstrip(".,?!")
    res.append([s, pulita, g])
    if x != pulita:
        g += 1

def quando(parola, dopo=0.0):
    return next(a for a, w, _ in res if w.lower() == parola.lower() and a >= dopo)

ENFASI = [quando("contentissimo"), quando("tubo"), quando("ciao"), quando("invece"), quando("24%"), quando("15.000"), quando("niente", 110)]
TAGLI = [6.85, 54.2, 58.3, 110.95]

ts = ("// Attualità #4 midterm: parole della voce Julian (voce.wav, pause tagliate, ×1,1)\n"
      "// generato da attualita/A4-midterm/montaggio/prepara.py: [secondi, parola, frase]\n"
      "export const PAROLE_A4: [number, string, number][] = " + json.dumps(res, ensure_ascii=False) + ";\n"
      "export const ENFASI_A4 = " + json.dumps(ENFASI) + ";\n")
open(SRC, "w", encoding="utf-8").write(ts)
dur = round(p[-1]["e"] + 0.4, 2)
json.dump({"dur": dur, "whoosh": TAGLI, "impact": ENFASI, "riser": [53.5], "ticks": []}, open(os.path.join(QUI, "sfx.json"), "w"))
print(dur, "s;", " ".join(w for _, w, _ in res))
