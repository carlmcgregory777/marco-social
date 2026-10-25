"""Monta il Reel 4 stile Vox: 6 immagini collage (zoom lento), voce, sottotitoli a parole, valzer Burton, x1,1."""
import json
import subprocess
import sys

FPS = 30
VOCE = "voce-julian.mp3"
DUR_VOCE = 22.44
FINE = DUR_VOCE + 0.4
# inizio di ogni immagine (secondi, sulla voce originale)
TAGLI = [0.0, 2.6, 4.4, 6.3, 8.6, 10.3, 11.9, 15.9, 19.4, FINE]
ANIM = {1, 4, 6}
ACCENTO = {"300%", "10", "VERO", "IMMAGINI", "BROKER", "CONTO", "DRAWDOWN", "VERIFICATO", "REALE", "DASHBOARD..."}


def ass_time(t):
    h, r = divmod(t, 3600)
    m, s = divmod(r, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def sottotitoli():
    parole = json.load(open("parole-julian.json", encoding="utf-8"))
    for p in parole:
        p["w"] = p["w"].strip().upper()
    parole[-1]["w"] = "DASHBOARD..."
    unite = []
    for p in parole:
        if p["w"] == "%" and unite:
            unite[-1]["w"] += "%"
            unite[-1]["e"] = p["e"]
        else:
            unite.append(p)
    parole = unite
    righe = []
    i = 0
    while i < len(parole):
        gruppo = [parole[i]]
        # max 3 parole o una pausa
        while len(gruppo) < 3 and i + len(gruppo) < len(parole):
            nx = parole[i + len(gruppo)]
            if nx["s"] - gruppo[-1]["e"] > 0.35 or gruppo[-1]["w"][-1] in ".,":
                break
            gruppo.append(nx)
        fine = parole[i + len(gruppo)]["s"] if i + len(gruppo) < len(parole) else FINE
        testo = " ".join(
            "{\\c&HD66D8B&}" + g["w"] + "{\\c&HFFFFFF&}" if g["w"].strip(".,") in ACCENTO or g["w"] in ACCENTO else g["w"]
            for g in gruppo)
        testo = testo.replace(" '", "'")
        righe.append(f"Dialogue: 0,{ass_time(gruppo[0]['s'])},{ass_time(min(fine, gruppo[-1]['e'] + 0.6))},C,,0,0,0,,{{\\fad(40,0)}}{testo}")
        i += len(gruppo)
    testa = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: C,Impact,92,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,0,0,0,0,100,100,1,0,1,7,3,2,80,80,560,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    open("sub.ass", "w", encoding="utf-8").write(testa + "\n".join(righe) + "\n")


def video():
    parti = []
    filtri = []
    for n in range(9):
        d = TAGLI[n + 1] - TAGLI[n]
        fr = int(round(d * FPS))
        if n + 1 in ANIM:
            parti += ["-i", f"anim{n + 1}.mp4"]
            filtri.append(f"[{n}:v]scale=1080:1920:flags=lanczos,fps={FPS},tpad=stop_mode=clone:stop_duration=3,trim=0:{d:.3f},setpts=PTS-STARTPTS,setsar=1[v{n}]")
        else:
            parti += ["-i", f"img{n + 1}.png"]
            z0, z1 = (1.0, 1.15) if n % 2 == 0 else (1.15, 1.02)
            x = "iw/2-(iw/zoom/2)" if n % 3 else f"(iw-iw/zoom)*on/{fr}"
            filtri.append(f"[{n}:v]scale=1620:2880,zoompan=z='{z0}+({z1}-{z0})*on/{fr}':x='{x}':y='ih/2-(ih/zoom/2)':d={fr}:s=1080x1920:fps={FPS},setsar=1[v{n}]")
    filtri.append("".join(f"[v{n}]" for n in range(9)) + "concat=n=9:v=1:a=0,ass=sub.ass[v]")
    cmd = ["ffmpeg", "-y", "-v", "error", *parti, "-i", VOCE, "-i", "valzer.wav",
           "-filter_complex", ";".join(filtri) +
           f";[9:a]apad,atrim=0:{FINE}[voce];[10:a]volume=0.22,atrim=0:{FINE}[mus];[voce][mus]amix=inputs=2:normalize=0[a]",
           "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
           "r4-lento.mp4"]
    subprocess.run(cmd, check=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", "r4-lento.mp4", "-filter_complex",
                    "[0:v]setpts=PTS/1.1[v];[0:a]atempo=1.1[a]", "-map", "[v]", "-map", "[a]",
                    "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", "R7-dashboard-finte.mp4"], check=True)


if __name__ == "__main__":
    subprocess.run([sys.executable, "-I", "../../script/burton_waltz.py", f"{FINE + 1}", "valzer.wav", "2"], check=True)
    sottotitoli()
    video()
    print("ok")
