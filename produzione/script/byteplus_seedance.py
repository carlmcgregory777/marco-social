"""Seedance 2.5 su BytePlus ModelArk: C al posto della persona nel video base (motion transfer).

Uso: python byteplus_seedance.py <url_immagine_C> <url_video_base> <prompt.txt> <durata_s> <uscita.mp4>
La chiave si legge dalla variabile utente ARK_API_KEY (messa da strumenti/imposta-chiave-byteplus.cmd).
ATTENZIONE: ogni lancio costa (circa 4-5 $ per 14 s a 720p con video base): lanciarlo solo con l'ok di Marco.
"""
import json
import os
import subprocess
import sys
import time
import urllib.request

BASE = "https://ark.ap-southeast.bytepluses.com/api/v3"
MODELLO = "dreamina-seedance-2-5-260628"


def chiave():
    k = os.environ.get("ARK_API_KEY")
    if not k:
        k = subprocess.run(
            ["powershell.exe", "-NoProfile", "-Command",
             "[Environment]::GetEnvironmentVariable('ARK_API_KEY','User')"],
            capture_output=True, text=True).stdout.strip()
    if not k:
        sys.exit("ARK_API_KEY mancante: lancia strumenti/imposta-chiave-byteplus.cmd")
    return k


def chiama(metodo, percorso, corpo=None):
    req = urllib.request.Request(
        BASE + percorso, method=metodo,
        data=json.dumps(corpo).encode() if corpo else None,
        headers={"Content-Type": "application/json", "Authorization": "Bearer " + chiave()})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def main():
    img, vid, file_prompt, durata, uscita = sys.argv[1:6]
    prompt = open(file_prompt, encoding="utf-8").read().strip()
    corpo = {
        "model": MODELLO,
        "content": [
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": img}, "role": "reference_image"},
            {"type": "video_url", "video_url": {"url": vid}, "role": "reference_video"},
        ],
        "resolution": "720p",
        "ratio": "9:16",
        "duration": int(durata),
        "watermark": False,
        "generate_audio": False,
    }
    task = chiama("POST", "/contents/generations/tasks", corpo)["id"]
    print("task", task, flush=True)
    while True:
        time.sleep(15)
        t = chiama("GET", "/contents/generations/tasks/" + task)
        stato = t.get("status")
        print(stato, flush=True)
        if stato == "succeeded":
            url = t["content"]["video_url"]
            urllib.request.urlretrieve(url, uscita)
            print("salvato", uscita, "uso:", json.dumps(t.get("usage")), flush=True)
            return
        if stato in ("failed", "expired", "cancelled"):
            sys.exit("errore: " + json.dumps(t.get("error")))


if __name__ == "__main__":
    main()
