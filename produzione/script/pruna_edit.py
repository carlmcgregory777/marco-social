# p-image-edit su api.pruna.ai (23/11/2026): modifica una foto con un prompt. 0,01 $ a immagine. Chiave PRUNA_API_KEY.
# Uso: python pruna_edit.py <foto> <out.jpg> "<prompt>" [aspect_ratio=16:9]
import json, sys, time
from pruna_pvideo import API, carica, richiesta

def modifica(foto, out, prompt, ar="16:9"):
    inp = {"prompt": prompt, "images": [carica(foto)], "aspect_ratio": ar, "turbo": False}
    r = json.load(richiesta(f"{API}/predictions", json.dumps({"input": inp}).encode(), {"Content-Type": "application/json", "Model": "p-image-edit"}, "POST"))
    url = r.get("get_url") or f"{API}/predictions/status/{r['id']}"
    for _ in range(120):
        time.sleep(3)
        s = json.load(richiesta(url))
        if s.get("status") == "succeeded":
            open(out, "wb").write(richiesta(s["generation_url"]).read()); print("ok", out); return
        if s.get("status") in ("failed", "canceled"): raise SystemExit("ERRORE " + json.dumps(s)[:400])
    raise SystemExit("tempo scaduto")

if __name__ == "__main__":
    a = sys.argv[1:]
    modifica(a[0], a[1], a[2], a[3] if len(a) > 3 else "16:9")
