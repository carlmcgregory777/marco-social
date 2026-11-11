# Runpod Public Endpoints (pagamento a richiesta, saldo Runpod di Marco).
# La chiave si legge dalla variabile utente RUNPOD_API_KEY (registro di Windows) e non viene mai stampata.
# I file locali vengono caricati su litterbox.catbox.moe (link pubblico che scade dopo 1 ora):
# autorizzato da Marco il 04/11/2026 («Sì, link di 1 ora»), solo per immagini e voce di C da pubblicare.
#
# Uso:
#   python runpod_pe.py set  <foto.png> <prompt.txt> <out.png> [aspect 9:16] [res 2k]     Nano Banana 2 Edit (~0,13 $ a 2k)
#   python runpod_pe.py talk <foto.png> <audio.wav|mp3> <out.mp4> [480p|720p] [prompt]    InfiniteTalk (0,25 / 0,50 $ a video)
#   python runpod_pe.py clip <foto.png> <prompt.txt> <out.mp4> [secondi 4-12] [480p|720p]  Seedance 1.5 Pro I2V, camera fissa, muto (0,052 $/s a 720p)
import json, os, sys, time, urllib.request, uuid, winreg

UA = {"User-Agent": "marco-social/1.0"}

def chiave():
    return winreg.QueryValueEx(winreg.OpenKey(winreg.HKEY_CURRENT_USER, "Environment"), "RUNPOD_API_KEY")[0].strip()

def carica(path):
    """Carica un file su litterbox (scade in 1 ora) e restituisce l'URL pubblico."""
    b = "----" + uuid.uuid4().hex
    nome = os.path.basename(path)
    corpo = (f"--{b}\r\nContent-Disposition: form-data; name=\"reqtype\"\r\n\r\nfileupload\r\n"
             f"--{b}\r\nContent-Disposition: form-data; name=\"time\"\r\n\r\n1h\r\n"
             f"--{b}\r\nContent-Disposition: form-data; name=\"fileToUpload\"; filename=\"{nome}\"\r\n"
             f"Content-Type: application/octet-stream\r\n\r\n").encode() + open(path, "rb").read() + f"\r\n--{b}--\r\n".encode()
    r = urllib.request.Request("https://litterbox.catbox.moe/resources/internals/api.php", data=corpo,
                               headers={**UA, "Content-Type": f"multipart/form-data; boundary={b}"})
    for prova in range(5):  # litterbox a volte risponde 500/504 (09/11/2026): riprova, il caricamento non costa
        try:
            url = urllib.request.urlopen(r, timeout=300).read().decode().strip()
            break
        except Exception as e:
            print("caricamento: tentativo", prova + 1, "fallito:", e, flush=True)
            if prova == 4:
                raise
            time.sleep(30)
    if not url.startswith("http"):
        raise SystemExit("caricamento fallito: " + url[:200])
    return url

def chiama(endpoint, inp, attesa=2400):
    h = {**UA, "Authorization": "Bearer " + chiave(), "Content-Type": "application/json"}
    r = urllib.request.Request(f"https://api.runpod.ai/v2/{endpoint}/run", data=json.dumps({"input": inp}).encode(), headers=h)
    job = json.load(urllib.request.urlopen(r, timeout=120))
    jid = job["id"]
    print("job", jid, job.get("status"), flush=True)
    t0 = time.time()
    while time.time() - t0 < attesa:
        time.sleep(10)
        s = json.load(urllib.request.urlopen(urllib.request.Request(f"https://api.runpod.ai/v2/{endpoint}/status/{jid}", headers=h), timeout=60))
        st = s.get("status")
        if st in ("COMPLETED", "FAILED", "CANCELLED", "TIMED_OUT"):
            return s
        print(" ", st, int(time.time() - t0), "s", flush=True)
    raise SystemExit("tempo scaduto, job " + jid)

def fine(s, out):
    if s.get("status") != "COMPLETED":
        raise SystemExit("ERRORE: " + json.dumps(s)[:800])
    o = s["output"]
    open(out, "wb").write(urllib.request.urlopen(urllib.request.Request(o["result"], headers=UA), timeout=600).read())
    print("ok", out, "costo $", o.get("cost"), "tempo s", round(s.get("executionTime", 0) / 1000))

if __name__ == "__main__":
    modo = sys.argv[1]
    if modo == "set":
        foto, prompt, out = sys.argv[2:5]
        ar = sys.argv[5] if len(sys.argv) > 5 else "9:16"
        res = sys.argv[6] if len(sys.argv) > 6 else "2k"
        inp = {"images": [carica(foto)], "prompt": open(prompt, encoding="utf-8").read(), "resolution": res, "aspect_ratio": ar, "output_format": "png"}
        fine(chiama("google-nano-banana-2-edit", inp), out)
    elif modo == "talk":
        foto, audio, out = sys.argv[2:5]
        size = sys.argv[5] if len(sys.argv) > 5 else "720p"
        pr = sys.argv[6] if len(sys.argv) > 6 else "a man talking naturally to the camera into a podcast microphone, relaxed, small natural head movements and hand gestures"
        fine(chiama("infinitetalk", {"prompt": pr, "image": carica(foto), "audio": carica(audio), "size": size, "enable_safety_checker": True}), out)
    elif modo == "clip":
        foto, prompt, out = sys.argv[2:5]
        dur = int(sys.argv[5]) if len(sys.argv) > 5 else 5
        res = sys.argv[6] if len(sys.argv) > 6 else "720p"
        inp = {"prompt": open(prompt, encoding="utf-8").read(), "image": carica(foto), "duration": dur, "resolution": res,
               "aspect_ratio": "16:9", "camera_fixed": True, "generate_audio": False, "seed": -1}
        fine(chiama("seedance-v1-5-pro-i2v", inp), out)
