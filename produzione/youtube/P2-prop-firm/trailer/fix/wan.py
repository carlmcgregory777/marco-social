# Wan 2.6 I2V 1080p con audio (labiale) su Runpod — trailer P2, 17/11/2026
import os, sys
sys.path.insert(0, r"C:\Users\stang\code\marco-social\produzione\script")
import runpod_pe as R
foto, audio, out = sys.argv[1:4]
pr = ("The man sits at the desk and talks calmly and seriously straight to the camera, lips perfectly synced to the speech, "
      "small natural head movements and subtle hand gestures. His face stays exactly identical: purple bowl-cut hair, protruding ears, "
      "thick black moustache, small mole between the eyebrows. Static camera, sharp detailed face.")
inp = {"prompt": pr, "image": R.carica(foto), "audio": R.carica(audio), "size": "1080p", "duration": 5,
       "shot_type": "single", "seed": -1, "enable_prompt_expansion": False,
       "negative_prompt": "face morphing, distorted face, extra fingers, blurry, text, subtitles"}
R.fine(R.chiama("wan-2-6-i2v", inp), out)
