# Dentro Algory #9: ritagli dal reel di Vaga (DfuxnIMAR1n), sotto le sue scritte inglesi (y da 640), rallentati.
import subprocess, os
QUI = os.path.dirname(os.path.abspath(__file__)); F = os.path.join(QUI, "..", "fonte")
SRC = os.path.join(F, "vaga-DfuxnIMAR1n.mp4")
# nome, inizio, durata, rallentamento, x del ritaglio 720x1280
CLIP = [("radar", 3.5, 1.0, 2.5, 180), ("ventaglio", 10.0, 2.0, 1.5, 180), ("nuvola", 12.0, 1.0, 2.5, 180),
        ("verde", 14.5, 1.0, 2.5, 180), ("gener", 16.5, 1.5, 2.0, 180), ("tabella", 17.5, 1.5, 2.0, 180),
        ("pulsanti", 19.0, 1.0, 2.5, 180), ("bagliore", 21.5, 1.5, 2.0, 180), ("fades", 23.0, 1.0, 2.5, 180),
        ("vault", 24.0, 1.5, 2.0, 180), ("multi", 26.0, 1.0, 2.5, 180), ("nuvola40", 27.0, 1.0, 2.5, 180),
        ("settings", 28.0, 1.0, 2.5, 180), ("passaporto", 29.0, 1.5, 2.0, 180), ("tester", 30.5, 1.0, 2.5, 180),
        ("quarto", 32.5, 1.0, 3.0, 210), ("verdi", 33.5, 1.0, 2.5, 180), ("radar10", 35.5, 1.0, 2.5, 180),
        ("scala", 36.5, 1.0, 2.5, 180), ("radarv", 38.5, 1.0, 2.5, 180), ("ruota", 39.5, 1.0, 3.0, 180)]
for n, s, d, k, x in CLIP:
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-ss", str(s), "-t", str(d), "-i", SRC, "-an",
                    "-vf", f"crop=720:1280:{x}:{560 if n == 'quarto' else 640},scale=1080:1920:flags=lanczos,setpts={k}*PTS,fps=30",
                    "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", os.path.join(F, n + ".mp4")], check=True)
    print(n)
