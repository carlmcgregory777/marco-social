# Controlla un video di C che parla: movimento della bocca secondo per secondo (23/11/2026).
# P-Video a volte fa uno zoom e congela la bocca (A27, 10-16 s): sotto 2,5 = C fermo mentre la voce va avanti.
# Uso: python controlla_labiale.py <video.mp4> [x y w h zona bocca, default per 1080x1920 e 1080x1080]
import subprocess, sys, json
import numpy as np
v = sys.argv[1]
w, h = map(int, subprocess.run(["ffprobe","-v","error","-select_streams","v","-show_entries","stream=width,height","-of","csv=p=0",v],capture_output=True,text=True).stdout.strip().split(",")[:2])
x, y, cw, ch = (map(int, sys.argv[2:6]) if len(sys.argv) > 5 else ((int(w*0.33), int(h*0.30), int(w*0.34), int(h*0.15)) if h > w else (int(w*0.33), int(h*0.33), int(w*0.34), int(h*0.22))))
raw = subprocess.run(["ffmpeg","-v","error","-i",v,"-vf",f"fps=10,crop={cw}:{ch}:{x}:{y},scale=60:40,format=gray","-f","rawvideo","-"],capture_output=True).stdout
f = np.frombuffer(raw, np.uint8).reshape(-1,40,60).astype(float)
d = np.abs(np.diff(f, axis=0)).mean(axis=(1,2))
fermi = [s//10 for s in range(0, len(d), 10) if d[s:s+10].mean() < 2.5]
print("secondi con C fermo:", fermi if fermi else "nessuno")
