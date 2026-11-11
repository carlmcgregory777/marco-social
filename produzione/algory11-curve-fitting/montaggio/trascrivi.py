# Dentro Algory #11: tempi delle parole della voce intera (faster_whisper small)
import json, sys
from faster_whisper import WhisperModel
m = WhisperModel("small", compute_type="int8")
segs, _ = m.transcribe(sys.argv[1], language="it", word_timestamps=True)
W = [dict(w=w.word.strip(), s=round(w.start, 2), e=round(w.end, 2)) for s in segs for w in s.words]
json.dump(W, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False, indent=0)
print(" ".join(x["w"] for x in W))
