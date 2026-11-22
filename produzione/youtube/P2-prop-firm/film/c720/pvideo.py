# P-Video (Pruna) su Runpod: foto + audio -> video parlato, 1080p (0,04 $/s). 21/11/2026
import sys
sys.path.insert(0, r"C:\Users\stang\code\marco-social\produzione\script")
import runpod_pe as R
foto, audio, out = sys.argv[1:4]
res = sys.argv[4] if len(sys.argv) > 4 else "1080p"
pr = sys.argv[5] if len(sys.argv) > 5 else ("The man sits at the desk and talks calmly and seriously straight to the camera, lips perfectly synced to the speech, "
      "natural head movements and expressive hand gestures. His face stays exactly identical. Static camera, sharp detailed face.")
inp = {"prompt": pr, "image": R.carica(foto), "audio": R.carica(audio), "resolution": res, "fps": 24,
       "save_audio": True, "prompt_upsampling": False}
R.fine(R.chiama("p-video", inp), out)
