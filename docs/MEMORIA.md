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
| ogni giorno | 2 storie (mattina/pomeriggio), 15' commenti, risposte DM, condividere il post delle 18:30 | Marco |
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
