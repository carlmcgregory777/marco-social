# Trappola 2 v2 (22/11/2026): C in camera, come nel resto del film. P-Video 1080p su Pruna, audio = voce-v2.wav [a-PAD, b+PAD].
# Tempi = secondi della voce v2 (parole-v2.json). s = primo piano (cs1), m = tre quarti (cm / cs2 alternate). Costo ~0,04 $/s.
import os, subprocess, sys, json
from concurrent.futures import ThreadPoolExecutor
QUI = os.path.dirname(os.path.abspath(__file__)); C720 = os.path.join(QUI, "..", "c720")
PAD = 0.4
PARLA = [(2.8, 6.3, "s"), (8.0, 13.2, "m"), (18.4, 22.2, "s"), (30.4, 33.2, "s"), (33.2, 35.5, "m"), (40.1, 41.3, "s"),
         (48.6, 52.8, "m"), (56.6, 57.5, "s"), (63.8, 67.1, "m"), (71.9, 73.7, "s"), (78.2, 81.1, "m"),
         # v3 stile Hormozi: più tempo in camera
         (6.3, 8.0, "m"), (27.2, 30.4, "m"), (36.7, 40.1, "s"), (69.0, 71.9, "m")]
GESTI = ["points calmly toward the camera on the key word", "counts on his fingers while explaining", "raises one eyebrow ironically",
         "opens both palms as if stating the obvious", "leans slightly toward the camera", "taps the air with one finger to stress a point",
         "tilts his head and shrugs lightly", "small natural nods"]
VOCE = os.path.join(QUI, "voce", "voce-v2.wav")
def uno(k):
    a, b, z = PARLA[k]; out = os.path.join(QUI, "c", f"{k}.mp4")
    if os.path.exists(out): return f"{k} c'è"
    a0 = max(0.0, a - PAD); wav = os.path.join(QUI, "c", f"{k}.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a0:.3f}", "-t", f"{b + PAD - a0:.3f}", "-i", VOCE, "-ac", "1", "-ar", "24000", wav], check=True)
    foto = os.path.join(C720, "cs1.jpg" if z == "s" else ("cm.jpg" if k % 2 else "cs2.jpg"))
    pr = ("The man talks to the camera with energy and a confident, slightly amused smile, lips perfectly synced to the speech, "
          f"lively expressive face, {GESTI[k % len(GESTI)]}. His face stays exactly identical. Static camera, sharp detailed face.")
    r = subprocess.run([sys.executable, "-u", os.path.join(QUI, "..", "..", "..", "..", "script", "pruna_pvideo.py"), foto, wav, out, "1080p", pr],
                       capture_output=True, text=True)
    return f"{k} " + (r.stdout.strip().splitlines() or ["?"])[-1] + (" ERR " + r.stderr[-300:] if r.returncode else "")
if __name__ == "__main__":
    json.dump({str(k): round(max(0.0, a - PAD), 3) for k, (a, b, z) in enumerate(PARLA)}, open(os.path.join(QUI, "c", "indice.json"), "w"))
    print("secondi da generare", round(sum(b - a + 2 * PAD for a, b, z in PARLA), 1))
    with ThreadPoolExecutor(4) as ex:
        for r in ex.map(uno, range(len(PARLA))): print(r, flush=True)
