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
- ECCEZIONE autorizzata da Marco il 15/10/2026: l'attività giornaliera può produrre e PROGRAMMARE su Publora 1 post al giorno del piano (`docs/PIANO-30-GIORNI.md`) su @cthe.trader, alle 18:30 ora italiana (fino al 24/10: 16:30 UTC; dal 25/10, ora solare: 17:30 UTC), senza chiedere ogni volta. Dopo ogni azione manda una email di riepilogo a fxmafialtd@gmail.com.
- Crediti Higgsfield: se scendono sotto 10, non generare più nulla a pagamento e manda subito una email a Marco per decidere come procedere. Video a pagamento AUTORIZZATI da Marco il 15/10/2026: per i reel puoi usare i modelli top (Seedance 2.5, Katana, Kling 3.0 ecc.), al massimo ~40 crediti per contenuto, sempre lasciando almeno 10 crediti di scorta. Preferisci 1 clip forte (gancio iniziale) al posto di tante clip.
- Se Publora non ha più quota (post mensili o coda piena), non forzare: email a Marco e fermati.
- Leggi i file della Theory solo quando servono, per risparmiare token.

## Publora
- Per Algory usa SOLO `instagram-17841457719707733` (@cthe.trader). Mai `guidoio_` (altro progetto).
- Piano Starter: 15 post al mese in tutto l'account (dal 16/10 guidoio_ NON usa più Publora: pubblica dal telefono in locale, quindi la quota è tutta per cthe.trader), 3 programmati alla volta, massimo 7 giorni avanti, statistiche non incluse.

## Brand @cthe.trader
- Palette: viola #5b3fd6 (accento #8b6dff), nero #0b0a10, bianco, grigio; rosso #ff4d5e solo per perdite/FAIL. Titoli Anton maiuscolo, testo Inter, dettagli JetBrains Mono, marchio «MS».
- Volto della pagina: personaggio AI «C» (caschetto viola a scodella, collo lungo, orecchie a sventola, baffoni neri, sguardo impassibile, giacca nera, camicia viola #5b3fd6, cravatta nera). Scheda Higgsfield job d889c713-1473-478c-b73a-df0a2e57d25f; versione palette job 59c21fa3-ba3f-4da5-b893-1ab7b8c0c703. Usare sempre come riferimento per restare identico. In bio: «🤖 personaggio AI · dietro c'è Marco».
- Voce reel: SEMPRE ElevenLabs via Higgsfield, preset «Julian» 95429266-c0ac-4137-a209-63b8812b0f23 (Marco 25/10: mai cambiarla; ~1 credito per 20 s, generate_audio model text2speech_v2 variant elevenlabs). Caption con «🎙️ Voce generata con AI».
- ALGORY (decisione di Marco del 30/10/2026, sostituisce la vecchia regola «non nominarlo»): da ora si dice apertamente che la strategia di Marco gira su Algory (vero: conto funded gestito dai bot Algory). Reel ALGORY stile Vox 1 a settimana, commento «ALGO». Finché non c'è il link affiliato: niente #ad e niente link, il DM porta alla checklist gratis. Con il link: #ad + avviso di rischio + link nel DM. Calendario in `docs/PIANO-30-GIORNI.md`.

## Qualità (richiesta di Marco)
- Ogni contenuto al massimo livello: gancio forte nei primi 3 s, animazioni dinamiche, sottotitoli, voce + base + effetti, copertina curata.
- Il personaggio AI «C» compare SEMPRE: nelle copertine e, quando possibile, nel gancio del reel (immagine generata con Higgsfield usando come riferimento il job 59c21fa3-ba3f-4da5-b893-1ab7b8c0c703, oppure clip animata se ci sono crediti). Deve restare identico.

- COPERTINE (priorità alta): ogni reel ha una copertina dedicata e ogni carosello una prima slide da copertina. Regole: personaggio C ben visibile (ritagliato, mezzo busto, con espressione legata al tema), titolo grande in Anton di massimo 5–6 parole, un solo colore d'accento viola (rosso solo per perdite), numero della serie (#1, #2…). Deve leggersi anche nel ritaglio 4:5 della griglia (zona centrale 1080×1350 del 1080×1920): controllalo sempre generando l'anteprima ritagliata prima di caricare. La griglia del profilo deve sembrare coerente.
- STORIE CON STICKER (regola di Marco, 16/10/2026): mai riquadri tratteggiati. Lascia uno spazio vuoto grande quanto lo sticker vero (misure su 1080×1920: SONDAGGIO ~600×330, QUIZ ~650×400, DOMANDA ~700×380, CONTO ALLA ROVESCIA ~700×230, LINK ~500×140) e scrivici in piccolo, grigio scuro, cosa mettere (es. «sticker QUIZ · «Sì»/«No» (giusta: No)»): lo sticker lo copre. Nel messaggio a Marco ripeti sempre quale sticker e con che testo.

## Strumenti Higgsfield utilizzabili in cloud
- NO: comandi After Effects/Premiere/Photoshop/Illustrator/Blender/DaVinci/TouchDesigner (richiedono app locali).
- SÌ: faceless narrati (`/vox-mixed-media` stile Vox — preferito per spiegoni; `/stickman-explainer`, `/faceless-paper-diorama`, `/faceless-hand-drawn`), `/marketing-hook-variants` (varianti di gancio), `/marketing-adapt-video`, Katana, Seedance 2.5, Kling 3, Nano Banana Pro, GPT Image 2.
- Prima di un flusso faceless o Katana: mostra il costo stimato. Senza ok di Marco non superare ~40 crediti per contenuto.

## Memoria e promemoria (richiesta di Marco, 16/10/2026)
- All'inizio di OGNI sessione leggi `docs/MEMORIA.md`: decisioni prese, ipotesi da verificare, promemoria con scadenza. Aggiornalo quando Marco decide qualcosa.
- Ricorda a Marco i promemoria quando sono vicini (entro 3 giorni) o quando l'argomento esce in chat; nell'email giornaliera aggiungi una sezione «Promemoria» con quelli in scadenza.
- Piano strategico: `docs/war-plan/War-Plan-MS.pdf` (metodo Theory). Le decisioni lì dentro valgono finché Marco non le cambia.

## Dove sono le cose (repository marco-social)
- Stato pubblicazioni: `docs/STATO.md` — leggilo all'inizio e aggiornalo dopo ogni pubblicazione.
- Storie in evidenza: `docs/STORIE-IN-EVIDENZA.md` — con ogni post prepara la sua storia collegata (stesso giorno, dopo le 18:30) e indicala nell'email.
- Piano del mese: `docs/PIANO-30-GIORNI.md`. Kit e regole Algory: `docs/kit-instagram-algory.md`.
- Script grafiche e reel: `produzione/script/` (vedi README). Media generati: non committare MP4/frame, solo sorgenti e brand.

## Stile video approvato da Marco (15/10/2026)
- Reel Vox: chiusura a LOOP (l'ultima frase si aggancia alla prima), valzer «alla Tim Burton» sotto la voce (`produzione/script/burton_waltz.py`, gratis), video finale velocizzato ×1,1 (ffmpeg setpts=PTS/1.1 + atempo=1.1).
- BUDGET: il Vox costa ~70 crediti → MASSIMO 1 a settimana, solo per i temi più forti. Gli altri reel si fanno col codice (gratis) ma con lo stesso stile: valzer Burton, ×1,1, loop quando possibile, C in copertina.
- MUSICA: NON usare sempre la stessa. `burton_waltz.py <durata> <out.wav> <variante>`: varianti 0/1/2 (Rem/Mim/Lam, melodie e strumenti diversi). Ruotale; se servono più varianti, aggiungerne nello script.
- Caroselli: prima slide = copertina 4:5 con C (`produzione/script/cover_c45.mjs "titolo" "sotto" "#n" pers_C.png out.jpg`), poi le slide con numerazione che conta anche la copertina.

## Caroselli e formato (decisione di Marco, 23/10/2026)
- CAROSELLI SEMPRE CON MUSICA: le API (Publora) non aggiungono musica, quindi i caroselli si pubblicano dall'app sul telefono con un brano scelto da Instagram (o si aggiunge la musica subito dopo, se l'app lo permette).
- MENO CAROSELLI: fanno 6-22 views contro le 90-125 dei reel. Massimo 1-2 a settimana.
- FORMATO: dopo il Vox «costi» si decide la direzione. Se performa bene, si punta sui Vox; i reel di C (motion transfer) restano solo nella scheda Reels, uno al giorno finché ci sono video.

## Algoritmo Instagram (Marco 27/10/2026: tenerlo sempre aggiornato)
- RUOLO (27/10 sera): Social Media Manager + Growth Hacker di @cthe.trader, obiettivo 100.000 follower reali in target, basato sulle linee guida ufficiali Meta/Instagram.
- 5 PILASTRI: 1) condivisioni in DM = metrica regina (ogni contenuto con un motivo per inviarlo a un amico trader); 2) watch time: gancio nei primi 2 s, loop, completamento; 3) originalità assoluta (niente repost, meme altrui, screenshot spogli); 4) Reel di prova a non follower per testare i ganci; 5) SEO prima degli hashtag.
- HASHTAG: al massimo 3 di nicchia; parole chiave nella didascalia e DETTE nel video (trading algoritmico, bot di trading, prop firm, drawdown, backtest).
- COPERTINA DEDICATA su ogni reel (`produzione/script/cover_c.mjs`, in locale con import Playwright locale): su IG «Modifica copertina» → «Aggiungi dal rullino foto».
- Segnali che contano: tempo di visione, condivisioni in DM, salvataggi, like per reach; gancio nei primi 3 s; domanda finale per i commenti; etichetta IA e storia lo stesso giorno.
- Telefono: mai toccare «Promuovi post» (apre le inserzioni a pagamento).
- TIKTOK (Marco 27/10): modus operandi diverso da Instagram. Descrizione cortissima in inglese nello stile «… Priced in.», NIENTE hashtag. Instagram resta in italiano.
- REEL DI C (motion transfer, solo scheda Reels): NIENTE copertina grafica, solo un fotogramma forte di C scelto nel video.
- SISTEMA COSENTINO (Marco 31/10/2026, `theory/reference-cosentino-nuova-era-social.md`): ogni reel = primo incontro con uno sconosciuto; un solo RUOLO per contenuto (Attenzione/Autorità/Educazione/Conversione, scritto nel calendario); filtro 3 leve (indignazione, rivelazione, identificazione) + punto di vista + fatti verificati; mai svolta forzata su Algory fuori dai reel ALGORY; Instagram = porta, YouTube = casa (parola chiave → ManyChat → video lungo, mai «seguimi su YouTube»). Usa la checklist del file prima di ogni copione. DAL 02/11 (Marco 31/10): UN VIDEO AL GIORNO con questo sistema, cioè Attualità di C (notizia del giorno + opinione di C + fonti verificate); ALGORY resta 1 a settimana. Dettagli nel calendario di `docs/PIANO-30-GIORNI.md`.
