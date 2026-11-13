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

## v2 (13/11/2026) — richiesta di Marco: più regia, tagli energici, riprese dall'alto, niente valzer
- 4 riprese vere: `set/prompt-{largo,alto-mappa,alto-lista,laterale}.txt` (Nano Banana, 0,13 $ l'una; la checklist rifatta in italiano) animate con Seedance 1.5 Pro 720p 5 s (`clip/prompt-*.txt`, 0,26 $ l'una).
- Labiale ripulito: `hqdn3d` + lanczos a 2560×1440 + `cas` (InfiniteTalk su Runpod esce solo a 480p).
- Musica a crescendo ed effetti: `script/musica_regia.py` (cassa da «mappa», clap da «Secondo», drop su «Quarto», stop su «Quindi», colpo finale).
- Regia in `P1HORMOZI.tsx`: lista SHOT, punch-in a ogni stacco, whip-pan sul grafico con zoom sulla casella nuova, flash sul drop, shake sugli impatti, testi BOTTA, coda su nero.
- Render a 1440p (`--scale=1.3334`): YouTube dà più bitrate ai video 1440p.
- Costo v2: 0,13×5 + 0,26×4 = 1,70 $ (totale prototipo 2,21 $).
