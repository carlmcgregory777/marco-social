"""Voce più serrata (pause tagliate + x1,12), tempi parola per parola e scene per Remotion.
Uscita: spot-animati/public/propfirm/voce.mp3 e tempi.json."""
import json
import subprocess

from faster_whisper import WhisperModel

OUT = "C:/Users/stang/code/spot-animati/public/propfirm/"
TEMPO = 1.12

subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", "voce-ep1.mp3", "-af",
                "silenceremove=stop_periods=-1:stop_duration=0.18:stop_threshold=-42dB:stop_silence=0.12,"
                f"atempo={TEMPO},loudnorm=I=-15:TP=-1.5", "-ar", "44100", OUT + "voce.mp3"], check=True)

m = WhisperModel("small", device="cpu", compute_type="int8")
seg, _ = m.transcribe(OUT + "voce.mp3", language="it", word_timestamps=True,
                      initial_prompt="Le prop firm guadagnano quando perdi? Challenge, drawdown, Algory.")
parole = [{"w": w.word.strip(), "s": round(w.start, 2), "e": round(w.end, 2)} for s in seg for w in s.words]

CORR = {"pagi": "Paghi", "casino?": "casinò.", "'altra.": "'altra.", "passano": "passa non", "algori,": "Algory,", "algori": "Algory", "casino.": "casinò.", "casino,": "casinò,"}
for p in parole:
    p["w"] = CORR.get(p["w"].lower(), p["w"])

# scena -> parola (minuscola, senza punteggiatura) con cui comincia, nell'ordine
INIZI = [("gancio", None), ("challenge", "1"), ("numeri", "2"), ("conto", "3"), ("truffa", "4"),
         ("regole", "5"), ("riacquisto", "6"), ("vince", "7"), ("algory", "il"), ("cta", "vuoi"), ("loop", "perché")]
NUMERI = {"uno": "1", "due": "2", "tre": "3", "quattro": "4", "cinque": "5", "sei": "6", "sette": "7"}
pul = lambda w: NUMERI.get(w.lower().strip(".,?!:"), w.lower().strip(".,?!:"))

k = 0
for i, p in enumerate(parole):
    if k + 1 < len(INIZI) and pul(p["w"]) == INIZI[k + 1][1] and (INIZI[k + 1][0] != "algory" or i > 0 and pul(parole[i - 1]["w"]) == "io"):
        k += 1
    p["scena"] = INIZI[k][0]
durata = round(parole[-1]["e"] + 0.35, 2)
scene = {}
for i, p in enumerate(parole):
    a, _ = scene.get(p["scena"], (p["s"], 0))
    scene[p["scena"]] = [a if p["scena"] in scene else (0 if i == 0 else p["s"] - 0.1), 0]
ids = [s for s, _ in INIZI]
for j, s in enumerate(ids):
    scene[s][1] = scene[ids[j + 1]][0] if j + 1 < len(ids) else durata
json.dump({"durata": durata, "scene": scene, "parole": parole}, open(OUT + "tempi.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(durata, {s: [round(x, 1) for x in v] for s, v in scene.items()})
print(" ".join(p["w"] for p in parole))
