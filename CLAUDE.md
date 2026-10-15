# Istruzioni per Claude (sessione cloud di Marco)

## Risparmio di token (sempre attivo)
- Dalla prima risposta usa la skill `caveman`: risposte brevi, senza giri di parole, con tutti i dati tecnici. Si spegne solo se Marco scrive «stop caveman».
- Delega i compiti semplici (cercare, leggere, rinominare, lanciare script) all'agente `aiutante-rapido` (Haiku) e quelli medi (bozze da una traccia, ricerche web, piccole modifiche) a `aiutante-medio` (Sonnet). Decisioni, sicurezza e revisione finale restano a te. Ogni tanto ricorda a Marco che lo stai facendo.

Marco è italiano, non programmatore: rispondi in italiano semplice, con passi chiari.

## Ogni volta che il compito è di marketing, contenuti, social, copy, sito, funnel o vendita
1. Usa la skill giusta in `.claude/skills/` (per esempio `social`, `copywriting`, `cro`, `offers`, `marketing-psychology`, `video`, `pricing`, `ig-caption-writer`, `ig-hook-extractor`, `ig-humanizer`, `instagram-marketing`). Non serve che Marco te lo chieda.
2. Applica le lezioni della Theory University: leggi prima `theory/reference-theory-university.md` (indice e principi), poi solo il file del corso che serve (`theory/reference-theory-<corso>.md`). Per i testi segui `theory/feedback-copy-theory.md`.
3. Per i reel applica `theory/reference-lezioni-reel-instagram.md`.
4. Nel messaggio finale scrivi in una riga quali skill e lezioni hai usato.

## Regole generali
- Non pubblicare, inviare o comprare niente senza l'ok esplicito di Marco.
- ECCEZIONE autorizzata da Marco il 15/10/2026: l'attività giornaliera può produrre e PROGRAMMARE su Publora 1 post al giorno del piano (`docs/PIANO-30-GIORNI.md`) su @marco_stanga_trader, alle 18:30 ora italiana, senza chiedere ogni volta. Dopo ogni azione manda una email di riepilogo a fxmafialtd@gmail.com.
- Crediti Higgsfield: se scendono sotto 10, non generare più nulla a pagamento e manda subito una email a Marco per decidere come procedere. Niente video a pagamento (Seedance ecc.) senza ok esplicito.
- Se Publora non ha più quota (post mensili o coda piena), non forzare: email a Marco e fermati.
- Leggi i file della Theory solo quando servono, per risparmiare token.

## Publora
- Per Algory usa SOLO `instagram-17841457719707733` (@marco_stanga_trader). Mai `guidoio_` (altro progetto).
- Piano Starter: 15 post al mese in tutto l'account (condivisi con guidoio_), 3 programmati alla volta, massimo 7 giorni avanti, statistiche non incluse.

## Brand @marco_stanga_trader
- Palette: viola #5b3fd6 (accento #8b6dff), nero #0b0a10, bianco, grigio; rosso #ff4d5e solo per perdite/FAIL. Titoli Anton maiuscolo, testo Inter, dettagli JetBrains Mono, marchio «MS».
- Volto della pagina: personaggio AI «C» (caschetto viola a scodella, collo lungo, orecchie a sventola, baffoni neri, sguardo impassibile, giacca nera, camicia viola #5b3fd6, cravatta nera). Scheda Higgsfield job d889c713-1473-478c-b73a-df0a2e57d25f; versione palette job 59c21fa3-ba3f-4da5-b893-1ab7b8c0c703. Usare sempre come riferimento per restare identico. In bio: «🤖 personaggio AI · dietro c'è Marco».
- Voce reel: ElevenLabs via Higgsfield, preset «Julian» 95429266-c0ac-4137-a209-63b8812b0f23. Caption con «🎙️ Voce generata con AI».
- Prima del link Algory: NON nominare Algory. Serie «Dentro il mio sistema». Dopo il link: reel di rivelazione + «Commenta BOT» + #ad + avviso di rischio.

## Dove sono le cose (repository marco-social)
- Stato pubblicazioni: `docs/STATO.md` — leggilo all'inizio e aggiornalo dopo ogni pubblicazione.
- Piano del mese: `docs/PIANO-30-GIORNI.md`. Kit e regole Algory: `docs/kit-instagram-algory.md`.
- Script grafiche e reel: `produzione/script/` (vedi README). Media generati: non committare MP4/frame, solo sorgenti e brand.
