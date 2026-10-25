# TikTok @cthe.trader («C-The trader») — impostazioni e stile

Creato da Marco il 17/10/2026. Scopo: video virali di C che portano traffico su Instagram @cthe.trader.

## Profilo (impostato il 17/10 dal telefono)
- Foto: produzione/brand/foto_profilo_personaggio.jpg (la stessa di Instagram).
- Bio: «Instagram : cthe.trader» — solo testo, nessun link cliccabile: TikTok non può bloccarlo. Il link nel profilo TikTok arriva solo a 1.000 follower.
- Instagram rimanda a TikTok: bio «- TikTok: cthe.trader» + icona e scheda sulla pagina link (sito/link).
- Su TikTok niente Algory, niente link affiliati, niente promesse di guadagno: solo il personaggio.

## Regole fisse (decise da Marco)
- OUTFIT SEMPRE UGUALE: abito nero slim, camicia viola #5b3fd6, cravatta nera sottile, scarpe oxford nere, calze nere. Mai cambiarlo.
- Faccia di C sempre identica a produzione/brand/pers_C.png (caschetto viola, puntino tra le sopracciglia, baffoni neri, orecchie grandi, collo lungo, sguardo impassibile).
- Didascalie nello stile di jean_philanthrope: UNA riga corta, impassibile, più il tormentone fisso di C. Posizione sempre attiva (luoghi della finanza). Etichetta «contenuto generato dall'IA» sempre attiva.
- Motion transfer: Seedance 2.5 su fal, stessi parametri del video «strada azzurro» di Bianca (task reference, 720p, 9:16, generate_audio=false, bitrate_mode=high), immagine di C in alta definizione come @Image1, video di base muto come @Video1. Mostrare a Marco immagine, prompt e video di base PRIMA di generare.

- VIDEO DI BASE DA TIKTOK (regola di Marco, 17/10): prima di tutto tagliare la parte nera finale con il logo e il suono di TikTok (ffmpeg blackdetect + controllo dell'audio finale). Così niente jingle nel risultato.
- Pipeline: taglio → video muto → Seedance 2.5 (come sopra) → upscale 1080p con Higgsfield (bytedance_video_upscale, preset aigc, 24 fps) → audio rimesso con ffmpeg.
- MODELLO FISSO (Marco, 18/10): solo Seedance 2.5, l'unico con qualità pari a Genjutsu. Niente Kling/Wan. Si risparmia cambiando fornitore, non modello: fal ~0,46 $/s a 720p, BytePlus ModelArk diretto ~0,23 $/s, Dreamina 64 crediti/s a 720p.
- Tormentone deciso: «Priced in.» Stile Londra.

## Da decidere con Marco

## Video fatti
- mt01 (17/10): scalinata con colonne. Base: video di Marco (Downloads/video_2026-10-17_21-31-31.mp4). Immagine: produzione/brand/C_intero.jpg (C a figura intera dalla scheda Higgsfield d889c713, outfit cambiato con google/nano-banana-2.1/edit 2K, puntini in più tolti a mano). Seedance 2.5 request 01a14b8a-7f87-7aa0-a624-1d08130c9f5b, seed 543907823. File: produzione/tiktok/mt01/fal-C-con-audio.mp4 (non nel repo). Pubblicato il 17/10 (219 views la sera stessa).
- Per i prossimi video usare sempre produzione/brand/C_intero.jpg come @Image1.
- mt02 (17/10): POV in Ferrari (Downloads/generation (7).mp4, niente nero finale). Seedance 2.5 request 01a14ba2-c80d-7813-96bb-58a0f7f71d05, seed 216037707; upscale Higgsfield fe0da0d0. File: produzione/tiktok/mt02/C-mt02-1080.mp4. Viso meno fedele del mt01 (luce forte, caschetto poco visibile). Labiale: Marco ha risolto ritardando l'audio di 0,31 s → finale produzione/tiktok/mt02/C-mt02-1080-finale.mp4. Pubblicato da Marco il 18/10 con suono motore Ferrari.
- LABIALE (lezione 17/10): se non coincide, prima prova gratis spostando l'audio di pochi decimi (ffmpeg adelay) e fai sentire a Marco; il lip-sync a pagamento (fal-ai/sync-lipsync/v3, ~1,30 $ per 10 s) solo se lo spostamento non basta.

## jean_philanthrope (analisi 17/10, da urlebird)
- 10 video pubblici in circa 4 settimane (il primo «Jab, crochet» 15,7 M): 3 nella 4ª settimana fa, 3 nella 3ª, 3 nella 2ª, 1 nell'ultima → circa 2-3 video a settimana, in calo nell'ultima.
- 283 K follower e 4 M like con 10 video. Visualizzazioni: 1,5–15,7 M a video.
- Didascalie: una frase + «Oui Madame.» (a volte solo il luogo: «Tour Eiffel. Oui Madame.»). Temi: Parigi, moda, ballo con i pugni («Jab, crochet»), ristoranti di lusso.
- mt02: pubblicato da Marco il 18/10 dall'app, con suono motore Ferrari scelto da lui. Didascalia «Leasing. Priced in.». L'app non permette di programmare su questo account: per programmare usare TikTok Studio dal computer.
- mt03 (18/10): lancio dall'elicottero (Downloads/video_2026-10-18_10-59-11.mp4). Seedance 2.5 su DREAMINA (canvas 0d867cf8-928a-4a18-b738-7916e1fce69b «C the trader - TikTok», nodo node_hba4hewd2a), m2v 720p 13 s, 832 crediti: il filtro 20114 NON è scattato (C è un personaggio non realistico). Faccia impassibile ok. Upscale Higgsfield impossibile (2,35 crediti): 1080p con ffmpeg lanczos+unsharp. File: produzione/tiktok/mt03/C-mt03-1080.mp4. Pubblicato il 19/10 da TikTok Studio (browser del PC), didascalia «Exit strategy. Priced in.», etichetta IA attiva; caricato C-mt03-1080-web.mp4 (ricompresso a 8 MB per il limite di 10 MB del caricamento).
- Statistiche al 19/10 sera: mt01 «Priced in.» 600 views e 50 like, mt02 «Leasing» 597 views e 30 like.
- mt04 (24-25/10): nodo Dreamina node_x2jr64se0b «mt04 C Ferrari Londra» sulla tela 0d867cf8 (m2v, seedance_2.5, 720p, 9:16, 14 s, base = nodo node_d6b1ep82aw da produzione/tiktok/mt04/base15.mp4, immagine node_8rwxf43pm6). Preventivo 928 crediti (64/s a 720p; 480p bozza = 24/s). Due avvii RIFIUTATI con serviceCode 20005 prima di partire (nessun credito scalato): probabilmente saldo insufficiente. Non riprovare finché Marco non conferma il saldo.
- mt04 FATTO 25/10 su un NUOVO account Dreamina (profilo CLI «nuovo», tela 92997bbb-0dc6-44b6-82b4-fb5fae96384a, nodo node_bdbxg3n5cr): Seedance 2.5 m2v 720p 14 s, 928 crediti (sui 1.321 del nuovo account). Ferrari 458 rossa a Kensington, faccia impassibile ok. Upscale 1080p con ffmpeg lanczos+unsharp, audio originale (audio-originale.m4a). File: produzione/tiktok/mt04/C-mt04-1080.mp4. Non pubblicato.
- BytePlus ModelArk: chiave in ARK_API_KEY (strumenti/imposta-chiave-byteplus.cmd), script produzione/script/byteplus_seedance.py pronto. Seedance 2.5 si attiva solo comprando almeno 30 $ (AI Savings Plan o resource pack): non comprato al 25/10. File di riferimento temporanei su cthetrader.netlify.app/r/ (da togliere).
