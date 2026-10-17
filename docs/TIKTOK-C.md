# TikTok @cthe.trader («C-The trader») — impostazioni e stile

Creato da Marco il 17/10/2026. Scopo: video virali di C che portano traffico su Instagram @marco_stanga_trader.

## Profilo (impostato il 17/10 dal telefono)
- Foto: produzione/brand/foto_profilo_personaggio.jpg (la stessa di Instagram).
- Bio: «Instagram : marco_stanga_trader» — solo testo, nessun link cliccabile: TikTok non può bloccarlo. Il link nel profilo TikTok arriva solo a 1.000 follower.
- Instagram rimanda a TikTok: bio «- TikTok: cthe.trader» + icona e scheda sulla pagina link (sito/link).
- Su TikTok niente Algory, niente link affiliati, niente promesse di guadagno: solo il personaggio.

## Regole fisse (decise da Marco)
- OUTFIT SEMPRE UGUALE: abito nero slim, camicia viola #5b3fd6, cravatta nera sottile, scarpe oxford nere, calze nere. Mai cambiarlo.
- Faccia di C sempre identica a produzione/brand/pers_C.png (caschetto viola, puntino tra le sopracciglia, baffoni neri, orecchie grandi, collo lungo, sguardo impassibile).
- Didascalie nello stile di jean_philanthrope: UNA riga corta, impassibile, più il tormentone fisso di C. Posizione sempre attiva (luoghi della finanza). Etichetta «contenuto generato dall'IA» sempre attiva.
- Motion transfer: Seedance 2.5 su fal, stessi parametri del video «strada azzurro» di Bianca (task reference, 720p, 9:16, generate_audio=false, bitrate_mode=high), immagine di C in alta definizione come @Image1, video di base muto come @Video1. Mostrare a Marco immagine, prompt e video di base PRIMA di generare.

- VIDEO DI BASE DA TIKTOK (regola di Marco, 17/10): prima di tutto tagliare la parte nera finale con il logo e il suono di TikTok (ffmpeg blackdetect + controllo dell'audio finale). Così niente jingle nel risultato.
- Pipeline: taglio → video muto → Seedance 2.5 (come sopra) → upscale 1080p con Higgsfield (bytedance_video_upscale, preset aigc, 24 fps) → audio rimesso con ffmpeg.
- Tormentone deciso: «Priced in.» Stile Londra.

## Da decidere con Marco

## Video fatti
- mt01 (17/10): scalinata con colonne. Base: video di Marco (Downloads/video_2026-10-17_21-31-31.mp4). Immagine: produzione/brand/C_intero.jpg (C a figura intera dalla scheda Higgsfield d889c713, outfit cambiato con google/nano-banana-2.1/edit 2K, puntini in più tolti a mano). Seedance 2.5 request 01a14b8a-7f87-7aa0-a624-1d08130c9f5b, seed 543907823. File: produzione/tiktok/mt01/fal-C-con-audio.mp4 (non nel repo). Non ancora pubblicato.
- Per i prossimi video usare sempre produzione/brand/C_intero.jpg come @Image1.
- mt02 (17/10): POV in Ferrari (Downloads/generation (7).mp4, niente nero finale). Seedance 2.5 request 01a14ba2-c80d-7813-96bb-58a0f7f71d05, seed 216037707; upscale Higgsfield fe0da0d0. File: produzione/tiktok/mt02/C-mt02-1080.mp4. Viso meno fedele del mt01 (luce forte, caschetto poco visibile). Labiale: Marco ha risolto ritardando l'audio di 0,31 s → finale produzione/tiktok/mt02/C-mt02-1080-finale.mp4. Non pubblicato.
- LABIALE (lezione 17/10): se non coincide, prima prova gratis spostando l'audio di pochi decimi (ffmpeg adelay) e fai sentire a Marco; il lip-sync a pagamento (fal-ai/sync-lipsync/v3, ~1,30 $ per 10 s) solo se lo spostamento non basta.

## jean_philanthrope (analisi 17/10, da urlebird)
- 10 video pubblici in circa 4 settimane (il primo «Jab, crochet» 15,7 M): 3 nella 4ª settimana fa, 3 nella 3ª, 3 nella 2ª, 1 nell'ultima → circa 2-3 video a settimana, in calo nell'ultima.
- 283 K follower e 4 M like con 10 video. Visualizzazioni: 1,5–15,7 M a video.
- Didascalie: una frase + «Oui Madame.» (a volte solo il luogo: «Tour Eiffel. Oui Madame.»). Temi: Parigi, moda, ballo con i pugni («Jab, crochet»), ristoranti di lusso.
