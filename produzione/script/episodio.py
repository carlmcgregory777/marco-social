# Pipeline di un episodio di C (@cthe.trader) — attualita/<episodio>/
#
# Fa TUTTO il lavoro ripetitivo in un colpo, con i parametri letti dal file config.json
# dell'episodio: niente piu' valori a memoria (che il 05/11 hanno causato immagine
# sbagliata, voce sbagliata e labiale fuori tempo).
#
# Uso:  python episodio.py <cartella-episodio> [--solo-check]
# Es.:  python episodio.py ../attualita/A6-oracle
#
# Cosa fa (in ordine):
#   1. controlla config.json e i file che servono (immagine, testo voce, clip labiale)
#   2. taglia le pause della voce e accelera x1,1        -> montaggio/voce.wav
#   3. trascrive le parole con faster-whisper            -> voce/<v>-parole.json
#   4. allinea il testo del COPIONE ai tempi di whisper  -> montaggio/parole-allineate.json
#   5. scrive src/<comp>-parole.ts con PAROLE_, CHIAVE_, DURATA_  (rigenerata SEMPRE)
#   6. genera musica (valzer) e sfx per la durata vera
#   7. copia gli asset in remotion-c/public/<cartella>
#   8. stampa i comandi esatti da lanciare (voce, upload, labiale, render)
#
# NON fa (di proposito, perche' passa da servizi esterni):
#   - generare la voce (sito ElevenLabs o API)
#   - caricare i file su un host pubblico
#   - chiamare InfiniteTalk
#   - il render
# Per ognuno stampa il comando pronto.
import argparse
import json
import os
import re
import shutil
import subprocess
import sys

RADICE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # produzione/
REMOTION = os.path.join(RADICE, "remotion-c")
SR = 44100
GAP_PAUSA = 0.22      # pause piu' lunghe di cosi' vengono accorciate
GAP_NUOVO = 0.10      # a quanto vengono accorciate
VELOCITA = 1.1        # accelerazione finale della voce


def sh(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, check=True, **kw)


def durata(percorso):
    r = sh(["ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "csv=p=0", percorso])
    return float(r.stdout.decode().strip())


def leggi_config(cartella):
    p = os.path.join(cartella, "config.json")
    if not os.path.exists(p):
        sys.exit(f"MANCA {p}\nCrealo con i campi: composizione, cartella_public, immagine, "
                 f"testo_voce, clip_labiale, inquadratura")
    cfg = json.load(open(p, encoding="utf-8"))
    obbligatori = ["composizione", "cartella_public", "immagine", "testo_voce"]
    mancanti = [k for k in obbligatori if not cfg.get(k)]
    if mancanti:
        sys.exit("config.json incompleto, mancano: " + ", ".join(mancanti))
    return cfg


def passo1_controlli(cartella, cfg):
    print("\n[1/8] controlli")
    ok = True
    for chiave in ("immagine", "testo_voce"):
        p = cfg[chiave] if os.path.isabs(cfg[chiave]) else os.path.join(RADICE, cfg[chiave])
        esiste = os.path.exists(p)
        print(f"   {'OK ' if esiste else 'NO '} {chiave}: {p}")
        ok = ok and esiste
    if not ok:
        sys.exit("mancano file: sistemo i percorsi in config.json")
    # la voce grezza: cerco l'mp3 piu' recente in voce/
    voci = []
    dvoce = os.path.join(cartella, "voce")
    if os.path.isdir(dvoce):
        voci = sorted((os.path.join(dvoce, f) for f in os.listdir(dvoce)
                       if f.endswith(".mp3")), key=os.path.getmtime, reverse=True)
    if not voci:
        sys.exit(f"nessun mp3 in {dvoce}: genera prima la voce (comando in fondo)")
    cfg["_voce_grezza"] = voci[0]
    print(f"   OK  voce grezza: {os.path.basename(voci[0])} ({durata(voci[0]):.1f} s)")
    return cfg


def passo2_taglia(cartella, cfg):
    print("\n[2/8] taglio pause e x1,1")
    import numpy as np
    V = cfg["_voce_grezza"]
    # parole della voce grezza (servono per trovare le pause)
    wjson = V[:-4] + "-parole.json"
    if not os.path.exists(wjson):
        print("   trascrivo la voce grezza (per le pause)...")
        from faster_whisper import WhisperModel
        m = WhisperModel("small", device="cpu", compute_type="int8")
        segs, _ = m.transcribe(V, language="it", word_timestamps=True, vad_filter=False)
        W = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)}
             for s in segs for w in (s.words or [])]
        json.dump(W, open(wjson, "w", encoding="utf-8"), ensure_ascii=False)
    else:
        W = json.load(open(wjson, encoding="utf-8"))
    r = sh(["ffmpeg", "-v", "error", "-i", V, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"])
    a = np.frombuffer(r.stdout, np.int16).astype(np.float32) / 32768
    pz, s, e = [], W[0]["s"] - 0.05, W[0]["e"]
    for w in W[1:]:
        if w["s"] - e > GAP_PAUSA:
            pz.append((s, e + 0.06)); s = w["s"] - 0.05
        e = w["e"]
    pz.append((s, e + 0.15))
    out, mappa, t = [], [], 0.0
    for (s0, e0) in pz:
        s0 = max(0, s0); seg = a[int(s0 * SR):int(e0 * SR)].copy()
        n = int(0.008 * SR)
        seg[:n] *= np.linspace(0, 1, n); seg[-n:] *= np.linspace(1, 0, n)
        mappa.append((s0, e0, t)); out.append(seg)
        out.append(np.zeros(int(GAP_NUOVO * SR), np.float32))
        t += len(seg) / SR + GAP_NUOVO
    y = np.concatenate(out)
    mont = os.path.join(cartella, "montaggio")
    os.makedirs(mont, exist_ok=True)
    raw = os.path.join(mont, "tmp.raw")
    open(raw, "wb").write((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())
    voce_wav = os.path.join(mont, "voce.wav")
    sh(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", raw,
        "-filter:a", f"atempo={VELOCITA},loudnorm=I=-14:TP=-1.5", "-ar", "48000", voce_wav])
    os.remove(raw)

    def m(x):
        for s0, e0, t0 in mappa:
            if s0 - 0.06 <= x <= e0 + 0.06:
                return (t0 + max(0, x - s0)) / VELOCITA
        return None

    P = [{"w": w["w"], "s": round(m(w["s"]), 3), "e": round(m(w["e"]), 3)} for w in W]
    json.dump(P, open(os.path.join(mont, "parole.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=0)
    d = durata(voce_wav)
    print(f"   voce.wav: {d:.2f} s ({len(pz)} pezzi)")
    return d


def passo4_allinea(cartella, cfg):
    print("\n[4/8] allineo il COPIONE ai tempi (zero storpiature)")
    import difflib
    testo = open(os.path.join(RADICE, cfg["testo_voce"]) if not os.path.isabs(cfg["testo_voce"])
                 else cfg["testo_voce"], encoding="utf-8").read()
    testo = re.sub(r"\[[a-z]+\]", " ", testo)
    vere = [w for w in re.split(r"\s+", testo) if w.strip()]
    p = json.load(open(os.path.join(cartella, "montaggio", "parole.json"), encoding="utf-8"))

    def norm(x):
        return re.sub(r"[^a-z0-9]", "", x.lower())

    A = [norm(w["w"]) for w in p]; B = [norm(w) for w in vere]
    sm = difflib.SequenceMatcher(None, A, B, autojunk=False)
    out = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            for k in range(i2 - i1):
                out.append({"w": vere[j1 + k], "s": p[i1 + k]["s"], "e": p[i1 + k]["e"]})
        elif tag == "replace":
            t0, t1 = p[i1]["s"], p[i2 - 1]["e"]; n = j2 - j1; passo = (t1 - t0) / max(n, 1)
            for k in range(n):
                out.append({"w": vere[j1 + k], "s": round(t0 + k * passo, 3),
                            "e": round(t0 + (k + 1) * passo, 3)})
        elif tag == "insert":
            rif = p[i1 - 1]["e"] if i1 > 0 else 0.0
            for k in range(j2 - j1):
                out.append({"w": vere[j1 + k], "s": round(rif + 0.01 * k, 3),
                            "e": round(rif + 0.01 * k + 0.25, 3)})
    json.dump(out, open(os.path.join(cartella, "montaggio", "parole-allineate.json"),
                        "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    print(f"   copione {len(vere)} parole | whisper {len(p)} | allineate {len(out)}")
    # 10/11/2026 (A15): whisper ha saltato 35 s di parlato e il taglio pause li ha buttati via.
    if len(p) < 0.85 * len(vere):
        sys.exit(f"ERRORE: whisper ha sentito solo {len(p)} parole su {len(vere)} del copione: "
                 f"ha saltato un pezzo di voce e il taglio pause l'ha eliminato.\n"
                 f"Cancella voce/*-parole.json, ritrascrivi con condition_on_previous_text=False e rilancia.")
    if len(out) != len(vere):
        print(f"   ATTENZIONE: allineate {len(out)} invece di {len(vere)}")
    return out


def passo5_parole(cartella, cfg, allineate):
    print("\n[5/8] scrivo i sottotitoli per Remotion")
    comp = cfg["composizione"]
    res, g = [], 0
    for w in allineate:
        x = w["w"].strip()
        if not x:
            continue
        pulita = x.rstrip(".,?!;:") or x
        res.append([round(w["s"], 2), pulita, g])
        if x != pulita:
            g += 1
    durata_s = round(allineate[-1]["e"] + 0.4, 2)
    chiave = cfg.get("chiave", [])
    righe = [
        f"// {comp}: parole della voce (voce.wav, pause tagliate, x1,1)",
        "// generato da produzione/script/episodio.py — testo dal COPIONE, tempi da whisper",
        f"export const PAROLE_{comp}: [number, string, number][] = "
        + json.dumps(res, ensure_ascii=False) + ";",
        "",
        f"export const CHIAVE_{comp} = /^(" + "|".join(chiave) + ")$/;" if chiave
        else f"export const CHIAVE_{comp} = /^()$/;",
        "",
        f"export const DURATA_{comp}_S = {durata_s};",
        "",
    ]
    dest = os.path.join(REMOTION, "src", f"{comp.lower()}-parole.ts")
    open(dest, "w", encoding="utf-8").write("\n".join(righe))
    print(f"   {os.path.basename(dest)}: {len(res)} parole, {g} frasi")
    print(f"   DURATA_{comp}_S = {durata_s} s -> {round(durata_s * 30)} frame")
    return durata_s


def passo6_musica(cartella, cfg, durata_s):
    print("\n[6/8] musica e sfx")
    pub = os.path.join(REMOTION, "public", cfg["cartella_public"])
    os.makedirs(pub, exist_ok=True)
    variante = str(cfg.get("valzer", 3))
    sh(["python", os.path.join(RADICE, "script", "burton_waltz.py"),
        str(durata_s), os.path.join(pub, "musica.wav"), variante])
    allineate = json.load(open(os.path.join(cartella, "montaggio", "parole-allineate.json"),
                               encoding="utf-8"))
    tagli = cfg.get("tagli", [])
    enf = []
    for frase in cfg.get("enfasi", []):
        for w in allineate:
            if frase.lower() in w["w"].lower():
                enf.append(round(w["s"], 2)); break
    scarto = os.path.join(pub, "_scarto.wav")
    cfg_sfx = os.path.join(cartella, "montaggio", "sfx.json")
    json.dump({"dur": durata_s, "whoosh": tagli, "impact": enf,
               "riser": cfg.get("riser", []), "ticks": []},
              open(cfg_sfx, "w"), ensure_ascii=False)
    sh(["python", os.path.join(RADICE, "script", "synth.py"), cfg_sfx, scarto,
        os.path.join(pub, "sfx.wav")])
    os.remove(scarto)
    print(f"   musica.wav (valzer {variante}) + sfx.wav | {len(tagli)} whoosh, {len(enf)} impatti")


def passo7_asset(cartella, cfg):
    print("\n[7/8] copio gli asset per il render")
    pub = os.path.join(REMOTION, "public", cfg["cartella_public"])
    os.makedirs(pub, exist_ok=True)
    shutil.copy2(os.path.join(cartella, "montaggio", "voce.wav"), os.path.join(pub, "voce.wav"))
    clip = cfg.get("clip_labiale")
    if clip:
        p = clip if os.path.isabs(clip) else os.path.join(RADICE, clip)
        if os.path.exists(p):
            shutil.copy2(p, os.path.join(pub, "C-parla.mp4"))
            sh(["ffmpeg", "-y", "-v", "error", "-ss", "0", "-i", p, "-frames:v", "1",
                "-q:v", "2", os.path.join(pub, "cover-frame.png")])
            print(f"   C-parla.mp4 ({durata(p):.2f} s) + cover-frame.png")
            # controllo che il labiale sia a tempo
            d1, d2 = durata(p), durata(os.path.join(pub, "voce.wav"))
            if abs(d1 - d2) > 0.5:
                print(f"   ATTENZIONE: clip {d1:.2f}s vs voce {d2:.2f}s — il labiale sara' fuori tempo!")
                print(f"   La clip va rigenerata con voce.wav, non con l'mp3 grezzo.")
            else:
                print(f"   labiale a tempo (diff {abs(d1-d2)*1000:.0f} ms)")
        else:
            print(f"   NO clip labiale: {p} (non ancora generata)")
    else:
        print("   NO clip labiale indicata in config.json")


def passo8_comandi(cartella, cfg, durata_s):
    comp = cfg["composizione"]
    ep = os.path.basename(cartella)
    img = cfg["immagine"] if os.path.isabs(cfg["immagine"]) else os.path.join(RADICE, cfg["immagine"])
    voce = os.path.join(cartella, "montaggio", "voce.wav")
    clip = os.path.join(cartella, "clip", "C-parla.mp4")
    finale = os.path.join(cartella, "finale")
    cover = cfg.get("copertina", "Cover" + comp)
    print("\n[8/8] comandi da lanciare\n")
    print("--- voce (sito ElevenLabs: Julian, Eleven v4, stability 0.6) ---")
    print(f"   testo: {cfg['testo_voce']}")
    print(f"   scarica l'mp3 in: {os.path.join(cartella, 'voce')}")
    print("\n--- labiale (InfiniteTalk, 720p, $0.25) — SEMPRE con voce.wav, MAI con l'mp3 ---")
    print(f'   cd "{os.path.join(RADICE, "script")}"')
    print(f'   python runpod_pe.py talk "{img}" "{voce}" "{clip}" 720p')
    print("\n--- render (dopo il labiale, che va copiato con lo script stesso) ---")
    print(f'   cd "{REMOTION}"')
    print(f'   npx remotion render {comp} "{finale}\\{ep}.mp4" --concurrency=1 --crf=20 --audio-bitrate=192k')
    print("\n--- copertina ---")
    print(f'   npx remotion still {cover} "{finale}\\{ep}-copertina.png"')
    print(f'   ffmpeg -y -i "{finale}\\{ep}-copertina.png" -q:v 2 "{finale}\\{ep}-copertina.jpg"')
    print("\n--- audio finale (-14 LUFS) ---")
    print(f'   ffmpeg -y -i "{finale}\\{ep}.mp4" -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 '
          f'-c:a aac -b:a 192k "{finale}\\{ep}-FINALE.mp4"')
    print(f"\n   durata attesa del video: {durata_s} s ({round(durata_s*30)} frame)")
    print("\n   PRIMA del render: chiudi i browser zombie e controlla il disco")
    print('   Get-Process chrome-headless-shell -EA SilentlyContinue | Stop-Process -Force')
    print('   Get-PSDrive C | Select-Object @{n="GB";e={[math]::Round($_.Free/1GB,2)}}')


def main():
    ap = argparse.ArgumentParser(description="Pipeline di un episodio di C")
    ap.add_argument("cartella", help="cartella dell'episodio, es. ../attualita/A6-oracle")
    ap.add_argument("--solo-check", action="store_true", help="controlla e basta")
    a = ap.parse_args()
    cartella = os.path.abspath(a.cartella)
    if not os.path.isdir(cartella):
        sys.exit(f"cartella non trovata: {cartella}")
    print(f"=== EPISODIO {os.path.basename(cartella)} ===")
    cfg = leggi_config(cartella)
    cfg["_cartella"] = cartella
    cfg = passo1_controlli(cartella, cfg)
    if a.solo_check:
        print("\nsolo controllo: nessun file modificato")
        return
    d = passo2_taglia(cartella, cfg)
    passo4_allinea(cartella, cfg)
    allineate = json.load(open(os.path.join(cartella, "montaggio", "parole-allineate.json"),
                               encoding="utf-8"))
    passo5_parole(cartella, cfg, allineate)
    passo6_musica(cartella, cfg, d)
    passo7_asset(cartella, cfg)
    passo8_comandi(cartella, cfg, d)
    print("\nFATTO. Restano solo: voce, upload, labiale, render.")


if __name__ == "__main__":
    main()
