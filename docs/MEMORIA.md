# Memoria del progetto @cthe.trader

Leggere all'inizio di ogni sessione. Aggiornare quando Marco decide qualcosa o una scadenza passa.
Promemoria: ricordarli a Marco quando sono vicini (nell'email giornaliera e quando si apre una sessione).

## Documenti chiave (già scritti)
- `docs/war-plan/War-Plan-MS.pdf` (+ .html) — War Plan metodo Theory, 10 pagine. Aggiornarlo il 1° di ogni mese con i numeri veri.
- `docs/business-plan.html` — versione corta del piano (pagina https://claude.ai/artifact/Nft8HFKMQ4z7BqsidHMPVS).
- `docs/STORIE-IN-EVIDENZA.md` — piano delle storie in evidenza (valore ora, conversione dopo il link).
- `docs/PAGINE-COMMENTI.md` — pagine dove commentare (A: gianluigi_ventre, maricaguglielmi_, unger_academy).
- `docs/PIANO-30-GIORNI.md`, `docs/STATO.md`, `docs/kit-instagram-algory.md`.

## Decisioni prese (non rimetterle in discussione senza Marco)
- Visione: il riferimento italiano per i bot di trading testati sul serio, senza promesse. Guerra di guerriglia; nemico = il bot miracoloso.
- Scenari 12 mesi (follower / abbonati / $ anno): C 5k/15/~2.600 (si pianifica qui) · B 15k/75/~15.000 · A 50k/300/~60.000. Big idea 3 anni: 100.000 persone, 3 entrate, 100.000 $/anno.
- Il conto in perdita (−5.439 $) si racconta con trasparenza: «cosa ho sbagliato e come testo adesso».
- Stile video approvato (15/10): Vox con loop + valzer Burton (varianti a rotazione) + ×1,1. Vox max 1 a settimana (~70 crediti); il resto col codice, gratis.
- C sempre in copertina; caroselli con prima slide-copertina 4:5.
- Publora: solo cthe.trader. Guido io pubblica in locale dal telefono, NON con Publora (repo separato `guidoio.social`).
- Per 90 giorni non si cambia strategia: giudizio con i numeri a metà gennaio 2027.
- Prima regola economica: niente pubblicità a pagamento, niente prelievi nel primo anno finché non ci sono 10 abbonati stabili.

## Ipotesi da verificare (aggiornare War Plan quando arrivano)
- Commissione Algory (ipotesi ~30% ricorrente) e durata media abbonato (~6 mesi) → valore ~175 $ per abbonato.
- Conversione follower → abbonati 0,3–0,6% l'anno.
- Tariffe sponsor nella nicchia italiana.

## Promemoria con scadenza
| Quando | Cosa | Chi |
|---|---|---|
| ogni giorno | 2 storie (mattina/pomeriggio), 15' commenti, risposte DM, condividere il post delle 12:30 | Marco |
| 04/11/2026 | recap generale con Marco; Attualità sulle midterm USA (voto del 03/11) stile Cosentino con risultati e reazione dei mercati verificati; rimontare il reel Higgsfield come video nuovo (non ricaricare lo stesso file) e archiviare il vecchio; piano per i follower TikTok (bio con promessa, serie fissa) | Claude + Marco |
| ogni domenica | screenshot statistiche → KPI aggiornati + ok alla settimana | Marco + Claude |
| entro 25/10/2026 | Publora Pro (la quota Starter finisce verso il 26/10) | Marco |
| 24/10/2026 | programmare il Vox «costi» come reel R5 (già pronto, non rifarlo) | Claude |
| prossima settimana | sessione locale sul VPS (commenti, Algory, dati reali del conto) | Marco + Claude |
| 1/11/2026 e poi ogni 1° del mese | aggiornare il War Plan con i numeri veri | Claude |
| quando arriva il link Algory | reel di rivelazione + ManyChat «Commenta BOT» + storia in evidenza SCONTO 20% in prima posizione + aggiornare commissione nel War Plan | Claude + Marco |
| quando Marco dice «fai le copertine in evidenza» | copertine tonde nero/viola, C su INIZIA QUI | Claude |
| dicembre 2026 | stessi reel su TikTok + YouTube Shorts; canale Telegram | Claude + Marco |
| ~15/01/2027 | revisione 90 giorni: siamo in A, B o C? Se C per 2 trimestri, riscrivere il piano su C | Marco + Claude |
| da ~10k follower | media kit e primi sponsor (solo regolamentati) | Claude + Marco |
| subito | creare Brevo + ManyChat (passi in docs/LEAD-E-RISPONDITORE.md) | Marco |
| facoltativo | scollegare guidoio_ da Publora per sicurezza | Marco |
| in sospeso | Guido io: compilare CLAUDE.md e brand.json nella sessione locale | Marco |
- 16/10: storie con sticker → spazio vuoto a misura di sticker + testo guida grigio (regola in CLAUDE.md, sezione Qualità).
- 16/10: link in bio = https://marcostangatrader.netlify.app (sorgente sito/link, Netlify collegato a marco-social, deploy automatico). Lista d'attesa su Netlify → Forms «lista-attesa». Pulsante #ad nascosto (data-dal) da attivare quando arriva il link Algory. Da fare: contaclic GoatCounter.
- 16/10: attività giornaliera spostata su un nuovo compito programmato (trig_012igWqTcTLDC8A68mrXGbCj, 09:53 Roma) che lavora in QUESTA sessione cloud (ha già l'accesso a GitHub). Il vecchio (trig_0192ibqMR9YNF6RGCq6ruvS2) è disattivato: partiva da sessioni nuove senza accesso al repository.
- 17/10: pagina link rifatta stile Linktree. Regalo = checklist PDF «I 4 test prima di mettere un bot sul conto» (sito/link/checklist.html → produzione/script/checklist_pdf.mjs); email su Netlify → Forms «checklist» (il vecchio form «lista-attesa» non si usa più). Nascosti con data-dal, pronti da attivare: TikTok (icona + card), Patreon (idea futura: report mensile del conto), tool #ad (link Algory). Funnel: reel → bio → checklist (email) → al lancio email + pulsante tool.
- 17/10 (sessione locale): sito a norma GDPR. Aggiunte `privacy.html` (titolare Marco Stanghelini, fxmafialtd@gmail.com, Netlify + Brevo) e `note-legali.html` (rischi, #ad, personaggio AI). Casella del consenso con 18+ e link all'informativa. Font ospitati sul sito (niente Google Fonts) e nessun cookie, quindi niente banner. Lead: Netlify Forms + funzione `netlify/functions/submission-created.mjs` che li copia in Brevo quando Marco imposta BREVO_API_KEY e BREVO_LIST_ID. Risponditore ManyChat: flusso CHECKLIST subito, flusso BOT pronto per il lancio. Passi e testi in `docs/LEAD-E-RISPONDITORE.md`. Al lancio del link Algory va aggiunta la Partita IVA nel footer.
- 18/10: REBRAND deciso da Marco. Instagram ora @cthe.trader (stesso nome di TikTok), nome visualizzato «C-The Trader | Algo trader». Bio lasciata in italiano. Sostituito marco_stanga_trader → cthe.trader in tutto il repo, nella pagina link (titolo «C — The Trader») e nel sito c-thetrader.com; PDF checklist rigenerato. Restano invariati: id Publora instagram-17841457719707733, indirizzo marcostangatrader.netlify.app (è nella bio). I post già pubblicati hanno ancora il vecchio handle nelle grafiche. Instagram: il vecchio nome si può riprendere solo entro il 1/11. TikTok in inglese, Instagram in italiano (da rivedere coi paesi del pubblico TikTok).
- 28/10 (cloud): netlify.toml con «ignore»: Netlify pubblica solo se cambiano sito/, netlify/ o netlify.toml. Prima OGNI salvataggio su GitHub (anche solo STATO.md) faceva un deploy e consumava crediti: probabile causa dei crediti finiti il 25/10.

- 30/10/2026: War Plan v1.1 con i numeri di ottobre (pagina 2b): 7.156 views/30 gg, 95 follower, 89% non follower; problema = views→follower. Proposta Traidingdesk (contact@traidingdesk.com, diario MT5): beta metà novembre, lancio 1/12, 20% sconto community 3 mesi + 20% a noi per 12 mesi. Marco non ha ancora risposto. Algory: ancora nessuna risposta, Marco attende approvazione sul Discord.
- 30/10/2026: Marco decide di nominare Algory da subito (strategia «basata su Algory», per sfruttare la visibilità di Vaga). Piano 31/10-29/11 riscritto: 1 ALGORY Vox/sett., 2 spiegoni, 3-4 reel di C; YouTube lungo il 22/11. Diretta 24/7 MT5: YouTube+Twitch sì (OBS su VPS + Restream), TikTok solo da ~1.000 follower.
- 30/10/2026 sera: Traidingdesk, Marco ha risposto lui alla mail (non serve altro da Claude). Guida della diretta 24/7 scritta in docs/LIVE-24-7.md (OBS sulla VPS → Restream → YouTube + Twitch; trappola RDP: uscire con `tscon` invece di chiudere). Programmazione del mese in PIANO-30-GIORNI.md, sezione «Programmazione: cosa faremo e quando» (blocchi settimanali, revisione ogni domenica). Via libera di Marco al reel ALGORY #1.
- 31/10/2026: Marco chiede di inserire nella strategia di C il video di MiK Cosentino «È iniziata la nuova era dei social» (riassunto e applicazione in `theory/reference-cosentino-nuova-era-social.md`). Fatto: colonna «Ruolo» nel calendario, nuovo formato ATTUALITÀ DI C 1/sett. (06, 12, 18, 25/11 al posto di Reel di C), filtro 3 leve, niente Algory forzato, ponte Instagram → YouTube via ManyChat dal 22/11 (parola proposta «30», da confermare). Regola anche in CLAUDE.md.
- 31/10/2026 (dopo): Marco decide «un video al giorno su questa strategia d'ora in poi». Calendario riscritto: dal 02/11 Attualità di C ogni giorno (ruoli a rotazione), ALGORY 1/sett. e YouTube lungo 22/11 invariati, spiegoni nella «Riserva», reel di C come extra dal Redmi. Serve Publora Pro (circa 30 post al mese).

- 31/10/2026 sera: Marco approva la direzione di ALGORY #1 v3 («mi piace molto, possiamo migliorare ma siamo sulla strada giusta»). Attualità di C: stile dei reel di Mik Cosentino (docs/FORMATO-ATTUALITA-C.md). DA DECIDERE: budget crediti per le scene in camera (proposta: 1-2 scene parlate a video, ~50 crediti).
- 01/11/2026: decisioni di Marco su ALGORY #1. Si usa un gancio collaudato. Il set deve sembrare vero, ordinato, con luci realistiche e inquadratura stretta da selfie (regole Cosentino); la stanza disordinata è bocciata («stanza di un disperato»). Parlato stile Cosentino: frasi corte, «tu», domande retoriche, ripetizioni. Montaggio: espressioni e tagli sottolineano le enfasi (zoom di scatto, jump cut, sottotitoli con la chiave evidenziata, colpi sonori). Per i video parlati si usa Dreamina con Seedance 2.5 (Riferimento universale + audio menzionato con @), non fal o Higgsfield.
- 02/11/2026: Marco sposta le pubblicazioni Instagram (Publora) dalle 18:30 alle 12:30 ora italiana (11:30Z in ora solare). ALGORY #1 esce lun 02/11 alle 12:30. Gli Short YouTube già programmati in Studio restano ai loro orari.
- 01/11/2026: Marco: «i video d'ora in poi come quelli di Mik Cosentino, mixando attualità e trading (i mercati sono correlati a quello che accade nel mondo); un reel al giorno, ALGORY 1 a settimana; se un mio dettame va contro l'acquisizione di lead/follower/clienti, adattalo senza cancellare il resto». Fatto: tesi fissa di C, catena notizia → mercati → tuoi soldi → «Priced in.», 8 conflitti risolti e primi temi presi dai reel di Mik in `docs/FORMATO-ATTUALITA-C.md`; fonti in `docs/FONTI-NOTIZIE.md`; lezioni del video «crescere sui social nel 2027» in `theory/reference-cosentino-sistema-2027.md`. Prossimo passo: analizzare i video YouTube di Mik. DA DECIDERE: budget scene parlate; piano Publora Pro (30 post/mese).
- 01/11/2026 (dopo): studiati 7 video YouTube di Mik Cosentino (`theory/reference-cosentino-youtube.md`). DA DECIDERE con Marco: bio + storia in evidenza «Inizia da qui» come funnel; seconda parola chiave (es. «PREZZO») con una risorsa per il pubblico delle Attualità; sequenza email in 6 step dopo la checklist.
- 03/11/2026: Marco chiede di nuovo di analizzare la lezione di Cosentino «crescere sui social nel 2027» (https://www.youtube.com/watch?v=QTeWGtklMfs). Era già in `theory/reference-cosentino-sistema-2027.md` dal 01/11. Riletta tutta e aggiunta la sezione «Integrazione 03/11»: tracciare da quale reel arrivano i lead, ripubblicare gli evergreen dopo 6-8 settimane, sequel solo con un fatto nuovo, analisi dei pattern di C dopo 20-30 Attualità, retargeting solo con un'offerta a pagamento e con l'ok di Marco.
- 03/11/2026: Algory approva Marco come partner (mail di Vaga su fxmafialtd). Algory = affiliazione PRINCIPALE. Link algory.app/index.html?p=stanga, codici STANGA20/STANGA50, 50% ricorrente. Divieti: mai nominare la prop firm nei post Algory, mai clienti dal Discord. Documenti: docs/ALGORY-PARTNER.md, docs/SERIE-ALGORY.md, docs/ROADMAP-6-MESI.md. Piano dei link IN ATTESA dell'ok di Marco.
