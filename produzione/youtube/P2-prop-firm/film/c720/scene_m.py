# P2 film: rifà le inquadrature medie e larghe (z="m","l") di C con P-Video 1080p diretto su Pruna (22/11/2026).
# Ogni scena = audio della voce [a-PAD, b+PAD], foto cs1/cs2 alternate, gesti a rotazione, sorriso leggero.
import json, os, re, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
QUI = os.path.dirname(os.path.abspath(__file__))
PAD = 0.4
dati = open(os.path.join(QUI, "..", "..", "..", "..", "remotion-c", "src", "p2film-dati.ts"), encoding="utf-8").read()
SHOT = json.loads(re.search(r"export const SHOT: any\[\] = (\[.*?\]);", dati, re.S).group(1))
VOCE = os.path.join(QUI, "..", "montaggio", "voce.wav")
GESTI = ["small natural nods", "counts on his fingers while explaining", "points calmly toward the camera on the key word",
         "opens both palms as if stating the obvious", "raises one eyebrow ironically", "leans slightly toward the camera",
         "tilts his head and shrugs lightly", "taps the air with one finger to stress a point"]
def uno(i, k):
    sh = SHOT[i]; out = os.path.join(QUI, "m", f"{i}.mp4")
    if os.path.exists(out): return f"{i} c'è"
    a = max(0.0, sh["a"] - PAD); d = sh["b"] + PAD - a
    wav = os.path.join(QUI, "m", f"{i}.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-t", f"{d:.3f}", "-i", VOCE, "-ac", "1", "-ar", "24000", wav], check=True)
    foto = os.path.join(QUI, "cm.jpg" if k % 2 == 0 else "cs2.jpg")
    pr = ("The man talks to the camera with a warm, friendly, slightly amused smile, lips perfectly synced to the speech, "
          f"lively natural expression, {GESTI[k % len(GESTI)]}. His face stays exactly identical. Static camera, sharp detailed face.")
    r = subprocess.run([sys.executable, "-u", os.path.join(QUI, "..", "..", "..", "..", "script", "pruna_pvideo.py"), foto, wav, out, "1080p", pr],
                       capture_output=True, text=True, env={**os.environ, "RUNPOD_B64": "1"})
    return f"{i} " + (r.stdout.strip().splitlines() or ["?"])[-1] + (" ERR " + r.stderr[-300:] if r.returncode else "")
if __name__ == "__main__":
    os.makedirs(os.path.join(QUI, "m"), exist_ok=True)
    S = [i for i, x in enumerate(SHOT) if x["tipo"] == "parla" and x.get("z") in ("m", "l") and not (147.4 <= x["a"] < 227.5)]
    json.dump({str(i): round(max(0.0, SHOT[i]["a"] - PAD), 3) for i in S}, open(os.path.join(QUI, "m", "indice.json"), "w"))
    with ThreadPoolExecutor(4) as ex:
        for r in ex.map(uno, S, range(len(S))): print(r, flush=True)
