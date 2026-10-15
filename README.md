# marco-social

Produzione contenuti Instagram per @marco_stanga_trader (trading algoritmico, poi affiliazione Algory).

- `CLAUDE.md` — istruzioni per Claude (lette a ogni sessione).
- `.claude/skills`, `.claude/agents` — skill di marketing/Instagram e agenti economici.
- `theory/` — sintesi Theory University.
- `produzione/script/` — generatori: `slides.mjs` (caroselli da JSON), `render.mjs` (reel da HTML animato), `cover.mjs`, `story.mjs`, `synth.py` (base musicale + effetti), `reel1.html`, `reel2.html`.
- `produzione/contenuti/` — testi dei caroselli (JSON) e timing audio dei reel.
- `produzione/brand/` — personaggio C, foto profilo, copertine.
- `docs/` — kit, piano 30 giorni, stato pubblicazioni.

Uso rapido (dalla cartella produzione): `node script/slides.mjs contenuti/s1.json out/s1` · `node script/render.mjs $PWD/script/reel2.html frames 34.5 out.mp4`.
Gli import di Playwright puntano a `npm root -g`; se cambia percorso, aggiornare la riga import.
