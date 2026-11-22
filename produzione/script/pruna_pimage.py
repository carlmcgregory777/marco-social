# P-Image-Edit diretto su api.pruna.ai (22/11/2026): foto di C + prompt -> nuova immagine (stessa persona, set nuovo).
# Uso: python pruna_pimage.py <foto.jpg> <prompt.txt> <out.jpg> [aspect 1:1]
import json, sys, time
sys.path.insert(0, __import__("os").path.dirname(__file__))
from pruna_pvideo import API, richiesta, carica

def genera(foto, prompt, out, ar="1:1"):
    inp = {"prompt": open(prompt, encoding="utf-8").read().strip(), "images": [carica(foto)], "aspect_ratio": ar, "turbo": False}
    r = json.load(richiesta(f"{API}/predictions", json.dumps({"input": inp}).encode(),
                            {"Content-Type": "application/json", "Model": "p-image-edit"}, "POST"))
    url = r.get("get_url") or f"{API}/predictions/status/{r['id']}"
    print("job", r.get("id"), flush=True)
    for _ in range(240):
        time.sleep(3)
        s = json.load(richiesta(url))
        if s.get("status") == "succeeded":
            open(out, "wb").write(richiesta(s["generation_url"], timeout=300).read()); print("ok", out); return
        if s.get("status") in ("failed", "canceled"):
            raise SystemExit("ERRORE: " + json.dumps(s)[:600])
    raise SystemExit("tempo scaduto")

if __name__ == "__main__":
    a = sys.argv[1:]
    genera(a[0], a[1], a[2], a[3] if len(a) > 3 else "1:1")
