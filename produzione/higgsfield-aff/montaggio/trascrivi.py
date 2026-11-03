# Tempi delle parole (faster_whisper) per voce/A,B,C (audio delle clip) e T2..T5 (Seed Audio)
import json
from faster_whisper import WhisperModel
m = WhisperModel("small", compute_type="int8")
out = {}
for n in ["A", "B", "C", "T2", "T3", "T4", "T5"]:
    segs, _ = m.transcribe(f"voce/{n}.wav", language="it", word_timestamps=True)
    out[n] = [[round(w.start, 2), round(w.end, 2), w.word.strip()] for s in segs for w in s.words]
    print(n, " ".join(w[2] for w in out[n]))
json.dump(out, open("montaggio/parole.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
