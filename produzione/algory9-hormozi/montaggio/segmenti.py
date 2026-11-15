# Dentro Algory #9 stile Hormozi: i pezzi in cui C parla in camera (il resto è schermate/grafiche).
# Li incolla in un solo audio (<30 s, limite di Higgsfield Intone) e salva la mappa tempo-video -> tempo-clip.
import json, subprocess, os
QUI = os.path.dirname(os.path.abspath(__file__))
P = json.load(open(os.path.join(QUI, "parole-allineate.json"), encoding="utf8"))
def idx(w, n=1, da=0):
    for i in range(da, len(P)):
        if P[i]["w"].strip(".,:?!").lower() == w.lower():
            n -= 1
            if n == 0: return i
    raise SystemExit(w)
# (prima parola, ultima parola) — cercate in ordine
PEZZI = [("Il", "bello."), ("È", "tu."), ("Quindi", "Ferrari."), ("Se", "poco."), ("Se", "guadagnato."),
         ("Non", "sentimento:"), ("Ecco", "gradini."), ("Il", "Algory.")]
out, i, pos = [], 0, 0.3
for a, b in PEZZI:
    ia = idx(a, 1, i); ib = idx(b.strip(".,:?!"), 1, ia)
    s, e = max(0, P[ia]["s"] - 0.15), P[ib]["e"] + 0.2
    out.append({"da": round(s, 2), "a": round(e, 2), "clip": round(pos, 2)})
    pos += (e - s) + 0.3
    i = ib + 1
json.dump(out, open(os.path.join(QUI, "segmenti.json"), "w"), indent=1)
fc = "".join(f"[0]atrim={o['da']}:{o['a']},asetpts=PTS-STARTPTS,apad=pad_dur=0.3[s{k}];" for k, o in enumerate(out))
fc += "anullsrc=r=44100:cl=mono,atrim=0:0.3[z];[z]" + "".join(f"[s{k}]" for k in range(len(out))) + f"concat=n={len(out)+1}:v=0:a=1[o]"
subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", os.path.join(QUI, "voce.wav"), "-filter_complex", fc,
                "-map", "[o]", "-ac", "1", "-ar", "44100", os.path.join(QUI, "voce-camera.wav")], check=True)
for o in out: print(o)
print("totale", round(pos, 2), "s")
