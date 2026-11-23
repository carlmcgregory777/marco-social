# Trascrive l'audio del film finale con i tempi parola per parola (per tagli e sottotitoli delle clip).
import json, sys
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=4)
segs, _ = m.transcribe(sys.argv[1], language="it", word_timestamps=True, vad_filter=False)
out = [{"w": w.word.strip(), "a": round(w.start, 2), "b": round(w.end, 2)} for s in segs for w in s.words]
json.dump(out, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False)
print(len(out))
