# P-Video diretto su api.pruna.ai (22/11/2026): foto + audio -> video parlato con labiale.
# Prezzo: 0,02 $/s a 720p, 0,04 $/s a 1080p (draft: 0,005 / 0,01). Chiave: variabile utente PRUNA_API_KEY (mai stampata).
# Uso: python pruna_pvideo.py <foto.jpg> <audio.wav> <out.mp4> [1080p|720p] [prompt]
import json, os, sys, time, urllib.request, uuid, winreg

API = "https://api.pruna.ai/v1"
UA = "marco-social/1.0"

def chiave():
    return winreg.QueryValueEx(winreg.OpenKey(winreg.HKEY_CURRENT_USER, "Environment"), "PRUNA_API_KEY")[0].strip()

def richiesta(url, data=None, headers=None, metodo=None, timeout=120):
    h = {"apikey": chiave(), "User-Agent": UA, **(headers or {})}
    return urllib.request.urlopen(urllib.request.Request(url, data=data, headers=h, method=metodo), timeout=timeout)

def carica(path):
    b = "----" + uuid.uuid4().hex
    corpo = (f"--{b}\r\nContent-Disposition: form-data; name=\"content\"; filename=\"{os.path.basename(path)}\"\r\n"
             f"Content-Type: application/octet-stream\r\n\r\n").encode() + open(path, "rb").read() + f"\r\n--{b}--\r\n".encode()
    r = json.load(richiesta(f"{API}/files", corpo, {"Content-Type": f"multipart/form-data; boundary={b}"}, "POST", 300))
    return r["urls"]["get"]

def genera(foto, audio, out, res="1080p", prompt=None):
    prompt = prompt or ("The man talks to the camera with a warm, friendly, slightly amused smile, lips perfectly synced to the speech, "
                        "natural head movements and expressive hand gestures. His face stays exactly identical. Static camera, sharp detailed face.")
    inp = {"prompt": prompt, "image": carica(foto), "audio": carica(audio), "resolution": res, "fps": 24,
           "save_audio": False, "prompt_upsampling": False, "draft": False}
    r = json.load(richiesta(f"{API}/predictions", json.dumps({"input": inp}).encode(),
                            {"Content-Type": "application/json", "Model": "p-video"}, "POST"))
    url = r.get("get_url") or f"{API}/predictions/status/{r['id']}"
    print("job", r.get("id"), flush=True)
    t0 = time.time()
    while time.time() - t0 < 1800:
        time.sleep(5)
        s = json.load(richiesta(url))
        st = s.get("status")
        if st == "succeeded":
            open(out, "wb").write(richiesta(s["generation_url"], timeout=600).read())
            print("ok", out, "tempo s", int(time.time() - t0), flush=True)
            return
        if st in ("failed", "canceled"):
            raise SystemExit("ERRORE: " + json.dumps(s)[:600])
    raise SystemExit("tempo scaduto")

if __name__ == "__main__":
    a = sys.argv[1:]
    genera(a[0], a[1], a[2], a[3] if len(a) > 3 else "1080p", a[4] if len(a) > 4 else None)
