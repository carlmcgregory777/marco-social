"""Monta l'episodio 1 Vox: scene collage (zoom lento), voce Julian, sottotitoli a parole
in Anton nero con parole chiave viola, valzer Burton variante 0, x1,1."""
import json
import subprocess
import sys

from scene import SCENE

FPS = 30
VOCE = "voce-ep1.mp3"
FINE = 74.86 + 0.3
TAGLI = [t for t, _ in SCENE] + [FINE]
CORREZIONI = {"PASSANO": "PASSA NON", "ALGORI,": "ALGORY,", "CASINO.": "CASINÒ.", "1.": "UNO.", "2.": "DUE.", "3.": "TRE.", "4.": "QUATTRO.", "5.": "CINQUE.", "6.": "SEI.", "7.": "SETTE."}
ACCENTO = {"PROP", "FIRM", "PERDI", "PERDI?", "CHALLENGE", "QUOTE", "10", "SIMULATO", "CASINÒ", "BANCO",
           "MEDIA", "DRAWDOWN", "ERRORE", "RIACQUISTO", "SISTEMA", "ALGORY", "SEGUIMI", "PERSO", "TRUFFA",
           "NO", "DAVVERO", "ZERO", "SCRITTO"}


def ass_time(t):
    h, r = divmod(t, 3600)
    m, s = divmod(r, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def sottotitoli():
    parole = json.load(open("parole-ep1.json", encoding="utf-8"))
    for p in parole:
        p["w"] = p["w"].strip().upper()
        p["w"] = CORREZIONI.get(p["w"], p["w"])
    righe = []
    i = 0
    while i < len(parole):
        gruppo = [parole[i]]
        # max 3 parole o una pausa
        while len(gruppo) < 3 and i + len(gruppo) < len(parole):
            nx = parole[i + len(gruppo)]
            if nx["s"] - gruppo[-1]["e"] > 0.35 or gruppo[-1]["w"][-1] in ".,?":
                break
            gruppo.append(nx)
        fine = parole[i + len(gruppo)]["s"] if i + len(gruppo) < len(parole) else FINE
        testo = " ".join(
            "{\\c&HD63F5B&}" + g["w"] + "{\\c&H16110F&}" if g["w"].strip(".,?") in ACCENTO else g["w"]
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
Style: C,Anton,118,&H0016110F,&H0016110F,&H00EEF4F6,&H50000000,0,0,0,0,100,100,1,0,1,5,0,2,80,80,350,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    open("sub.ass", "w", encoding="utf-8").write(testa + "\n".join(righe) + "\n")


def video():
    n_sc = len(SCENE)
    parti = []
    filtri = []
    for n in range(n_sc):
        d = TAGLI[n + 1] - TAGLI[n]
        fr = int(round(d * FPS))
        z0, z1 = (1.0, 1.08) if n % 2 == 0 else (1.08, 1.0)
        z = f"{z0}+({z1}-{z0})*on/{fr}"
        parti += ["-i", f"scene/s{n + 1:02d}.png"]
        filtri.append(
            f"[{n}:v]scale=1620:2880,zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={fr}:s=1080x1920:fps={FPS},setsar=1[v{n}]")
    filtri.append("".join(f"[v{n}]" for n in range(n_sc)) + f"concat=n={n_sc}:v=1:a=0,ass=sub.ass:fontsdir=src[v]")
    cmd = ["ffmpeg", "-y", "-v", "error", *parti, "-i", VOCE, "-i", "valzer.wav",
           "-filter_complex", ";".join(filtri) +
           f";[{n_sc}:a]apad,atrim=0:{FINE}[voce];[{n_sc + 1}:a]volume=0.20,atrim=0:{FINE}[mus];[voce][mus]amix=inputs=2:normalize=0[a]",
           "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
           "ep1-lento.mp4"]
    subprocess.run(cmd, check=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", "ep1-lento.mp4", "-filter_complex",
                    "[0:v]setpts=PTS/1.1[v];[0:a]atempo=1.1[a]", "-map", "[v]", "-map", "[a]",
                    "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", "EP1-prop-firm-perdi.mp4"], check=True)


if __name__ == "__main__":
    subprocess.run([sys.executable, "-I", "../../script/burton_waltz.py", f"{FINE + 1}", "valzer.wav", "0"], check=True)
    sottotitoli()
    video()
    print("ok")
