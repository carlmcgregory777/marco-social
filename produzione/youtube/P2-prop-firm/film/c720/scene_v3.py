# P2 film v3 stile Hormozi (23/11/2026): nuove inquadrature di C dove prima c'erano clip AI (manichini, B-roll).
# P-Video 1080p su Pruna (0,04 $/s), audio = voce del film [a-PAD, b+PAD], look nuovi in ../look/*-1080.jpg.
import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
QUI = os.path.dirname(os.path.abspath(__file__)); PAD = 0.4
VOCE = os.path.join(QUI, "..", "montaggio", "voce.wav")
LOOK = lambda n: os.path.join(QUI, "..", "look", f"{n}-1080.jpg")
# nome: (inizio, fine, look) in secondi del film (voce originale)
SCENE = {
  "s0": (0.0, 4.6, "largo"), "s3": (10.6, 16.2, "pennarello"), "s9": (40.5, 46.3, "tre4"), "s11": (54.4, 59.2, "tre4"),
  "s16": (78.9, 84.8, "pennarello"), "s20": (100.5, 103.8, "tazza"), "s24": (115.1, 119.3, "tre4"),
  "s42": (231.3, 235.4, "pennarello"), "s46": (256.9, 263.4, "tazza"), "s50": (282.9, 289.2, "pennarello"),
  "s54": (308.3, 317.8, "largo"), "s58": (322.7, 326.3, "tazza"), "s60": (332.1, 337.4, "tre4"), "s67": (374.0, 376.3, "pennarello"),
  "s71": (387.2, 389.5, "largo"), "s74": (394.7, 397.6, "cappello"), "s80": (431.6, 438.9, "tazza"), "s91": (514.4, 520.1, "tazza"),
  "s96": (537.2, 540.4, "largo"), "s108": (613.6, 614.7, "tre4"), "s111": (621.4, 627.4, "pennarello"), "s115": (676.2, 681.8, "largo"),
  "k1": (631.0, 638.0, "largo"), "k2": (641.7, 644.8, "pennarello"), "k3": (648.5, 653.3, "tre4"), "k4": (661.6, 665.1, "largo"),
}
GESTI = ["points calmly toward the camera on the key word", "counts on his fingers while explaining", "raises one eyebrow ironically",
         "opens both palms as if stating the obvious", "leans slightly toward the camera", "taps the air with one finger to stress a point",
         "tilts his head and shrugs lightly", "small natural nods"]
def uno(item):
    k, (nome, (a, b, look)) = item
    out = os.path.join(QUI, "v3", f"{nome}.mp4")
    if os.path.exists(out): return f"{nome} c'è"
    a0 = max(0.0, a - PAD); wav = os.path.join(QUI, "v3", f"{nome}.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a0:.3f}", "-t", f"{b + PAD - a0:.3f}", "-i", VOCE, "-ac", "1", "-ar", "24000", wav], check=True)
    pr = ("The man talks to the camera with energy and a confident, slightly amused smile, lips perfectly synced to the speech, "
          f"lively expressive face, {GESTI[k % len(GESTI)]}. He keeps holding whatever he holds. His face stays exactly identical. Static camera, sharp detailed face.")
    r = subprocess.run([sys.executable, "-u", os.path.join(QUI, "..", "..", "..", "..", "script", "pruna_pvideo.py"), LOOK(look), wav, out, "1080p", pr], capture_output=True, text=True)
    return f"{nome} " + (r.stdout.strip().splitlines() or ["?"])[-1] + (" ERR " + r.stderr[-300:] if r.returncode else "")
if __name__ == "__main__":
    json.dump({n: round(max(0.0, a - PAD), 3) for n, (a, b, l) in SCENE.items()}, open(os.path.join(QUI, "v3", "indice.json"), "w"))
    print("secondi", round(sum(b - a + 2 * PAD for a, b, l in SCENE.values()), 1), flush=True)
    with ThreadPoolExecutor(4) as ex:
        for r in ex.map(uno, enumerate(SCENE.items())): print(r, flush=True)
