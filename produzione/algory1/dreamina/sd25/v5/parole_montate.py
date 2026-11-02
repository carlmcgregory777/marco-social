# Tempi delle parole sulla traccia montata: parole delle clip (whisper sulle clip) e della voce v5, spostate
import json
SC = "C:/Users/stang/AppData/Local/Temp/claude/C--Users-stang-code/520441b8-f7bc-4933-a5cd-7715f0f08165/scratchpad/"
voce = json.load(open(SC + "parole5.json", encoding="cp1252"))
clip = json.load(open("parole-clip.json", encoding="utf-8"))
scene = json.load(open("scene-v5.json"))
FIX = {"centomila": "100.000", "diciannove": "19", "algo": "ALGO", "Algo": "ALGO", "En": "E", "Comenta": "Commenta", "comenta": "Commenta", "sudati": "su dati"}
w = []
for s in scene:
    sp = s["from"] - s["inizio"]
    if s["src"] == "voce":
        src = [[t, x] for t, x in voce]
    else:
        # una parola che inizia nel silenzio tagliato conta se finisce dopo il taglio
        src = [[max(a, s["inizio"]) if b > s["inizio"] + 0.1 else a, x] for a, b, x in clip[s["src"]]]
    for t, x in src:
        if s["inizio"] - 0.15 <= t < s["inizio"] + s["dur"] - 0.05:
            w.append([round(max(s["from"], t + sp), 2), x])
# unisce i pezzi spezzati da whisper
out, i = [], 0
while i < len(w):
    t, x = w[i]
    x = FIX.get(x, x)
    nx = w[i + 1][1] if i + 1 < len(w) else ""
    if x in ("0", "0,") and nx.startswith(",25") or x == "0,25":
        j = i + 1
        while j < len(w) and w[j][1] in (",25", "25", "%", "%,", ",25%", "25%", "per", "cento", "%."): j += 1
        out.append([t, "0,25%"]); i = j; continue
    if x == "100" and nx.lower() in ("mila", "mila,"):
        out.append([t, "100.000"]); i += 2; continue
    if x == "l" and nx == "'ho":
        out.append([t, "l'ho"]); i += 2; continue
    if x == "su dati":
        out += [[t, "su"], [round(t + 0.18, 2), "dati"]]; i += 1; continue
    out.append([t, x]); i += 1
fine = {"bot", "fanno."}
res, g = [], 0
for t, x in out:
    p = x.rstrip(".,?")
    res.append([t, p, g])
    if x != p or x in fine: g += 1
print(json.dumps(res, ensure_ascii=True))
ts = "// Voce v5 montata (voce-v5-montata.wav: audio delle clip + voce ElevenLabs nelle grafiche): [secondi, parola, frase]\nexport const PAROLE5: [number, string, number][] = " + json.dumps(res, ensure_ascii=False) + ";\n"
open("C:/Users/stang/code/marco-social/produzione/remotion-c/src/algory1v5-parole.ts", "w", encoding="utf-8").write(ts)
