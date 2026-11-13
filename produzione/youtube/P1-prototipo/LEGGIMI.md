# P1 — prototipo «stile Hormozi» (13/11/2026)

Video YouTube 16:9 di 46 s per provare lo stile analizzato in `produzione/studio-hormozi/ANALISI-HORMOZI.md`.

- Copione: `voce/testo-v1.txt` (nessun dato numerico: è una dimostrazione di stile). Voce Julian con `script/genera-voce-p1.ps1`.
- Pipeline voce: `python script/episodio.py ../youtube/P1-prototipo` (config.json) → montaggio/voce.wav e parole.
- Set: `set/C-studio.png` (Nano Banana da `set/rif-C.png` + `set/prompt-studio.txt`, 0,13 $).
- Labiale: InfiniteTalk 720p con montaggio/voce-16k.wav (0,25 $), poi upscale 1080p in `remotion-c/public-p1/p1/C-parla.mp4`.
- Doodle: un foglio di 8 icone (`doodle/prompt-icone.txt`, 0,13 $) → `script/doodle_svg.py` → tratti in `remotion-c/src/p1-doodle.ts` + PNG in `public-p1/p1/doodle/`.
- Composizione: `remotion-c/src/P1HORMOZI.tsx` (3 camere finte, doodle che si disegnano, grafico-framework, DEFINIZIONE, tweet, sottopancia).
- Render: `npx remotion bundle src/index.ts --public-dir=public-p1 --out-dir=build-p1` e poi `npx remotion render build-p1 P1HORMOZI ...`.
- Costo totale: 0,51 $ (Runpod) + voce ElevenLabs.
