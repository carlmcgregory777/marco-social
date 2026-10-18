# Lead e risponditore automatico (preparati il 17/10/2026)

## Dove finiscono i lead
1. **Netlify → Forms → «checklist»**: ogni iscrizione resta lì (email, @instagram, consenso, data). Piano gratuito: 100 iscrizioni al mese. Backup: Forms → checklist → «Download as CSV».
2. **Brevo** (lista email vera, azienda UE, gratis con contatti illimitati e 300 email al giorno): la funzione `netlify/functions/submission-created.mjs` copia da sola ogni nuovo iscritto nella lista. Se Brevo non è configurato, non fa niente e il modulo funziona lo stesso.

Il consenso si raccoglie sul sito (casella obbligatoria + `privacy.html`). Il risponditore manda le persone al sito: niente email chieste in DM.

### Da fare una volta (Marco, ~10 minuti)
Le chiavi le inserisce Marco: Claude non scrive password o chiavi API.
1. Crea un account gratuito su brevo.com con fxmafialtd@gmail.com.
2. Contatti → Liste → «Crea una lista» → nome `Checklist bot`. Segna il numero (ID) della lista.
3. Contatti → Impostazioni → Attributi dei contatti → crea 3 attributi di tipo Testo: `INSTAGRAM`, `FONTE`, `CONSENSO`.
4. In alto a destra → «SMTP e API» → «Chiavi API» → «Genera una nuova chiave API». Copiala.
5. app.netlify.com → sito marcostangatrader → Site configuration → Environment variables → aggiungi `BREVO_API_KEY` (la chiave) e `BREVO_LIST_ID` (il numero della lista).
6. Deploys → «Trigger deploy» → «Deploy site».
7. Importa chi si è già iscritto: Netlify Forms → CSV → Brevo → Contatti → Importa → lista `Checklist bot`.
8. Brevo → Automazioni → «Messaggio di benvenuto»: quando un contatto entra in `Checklist bot`, invia l'email qui sotto. Mittente: Marco · @cthe.trader. Il link «cancellati» Brevo lo aggiunge da solo.
9. Dimmi «Brevo fatto»: faccio un'iscrizione di prova e controllo che arrivi.

### Email di benvenuto (Brevo)
Oggetto: La tua checklist dei 4 test

> Ciao,
>
> ecco la checklist che uso prima di far toccare a un bot i soldi del mio conto: https://marcostangatrader.netlify.app/checklist-4-test.pdf
>
> Se un bot ne fallisce anche uno solo, per me è fuori. La seconda pagina è quella che mi è costata di più: 2.424 $ di costi che il backtest non mostrava e 245 $ per un ordine pendente dimenticato.
>
> Ogni giorno alle 18:30 su Instagram aggiungo un pezzo del mio sistema, perdite comprese.
>
> Una domanda: qual è il bot o la strategia che stai valutando adesso? Rispondi a questa email: le leggo tutte io.
>
> Marco (dietro C)
>
> Il trading comporta un rischio elevato di perdita. Contenuto educativo, non consulenza finanziaria.

## Risponditore automatico (ManyChat, collegato a Instagram)
Serve ManyChat, il servizio ufficiale che Meta permette per i DM automatici e per «commenta una parola → ricevi il link». Partire dal piano gratuito; controllare il prezzo del Pro al momento, servirà solo se il gratuito non basta.

### Da fare una volta (Marco, ~5 minuti)
1. Vai su manychat.com → «Get started» → Instagram → accedi con @cthe.trader (NON con guidoio_) e accetta i permessi.
2. Sul telefono: Instagram → Impostazioni → Messaggi e risposte alle storie → Strumenti collegati → attiva «Consenti accesso ai messaggi».
3. Dimmi «ManyChat fatto»: ti guido a creare i flussi con i testi qui sotto (o li creo io dal browser con te).

### Flusso 1, ATTIVO SUBITO: parola CHECKLIST
- Trigger: commento con «CHECKLIST» sotto qualsiasi post o reel, oppure DM o risposta a una storia con «CHECKLIST».
- Risposta pubblica al commento (a rotazione): «Te l'ho mandata in DM 📩» · «Controlla i messaggi 👀» · «Fatto, è nei DM».
- DM:
> Eccola 👇 La checklist dei 4 test che faccio prima di mettere un bot sul conto. Inserisci la tua email e ti arriva il PDF subito:
> https://marcostangatrader.netlify.app/#checklist
>
> Se un bot ne fallisce anche uno solo, per me è fuori.
- Nei post e nei reel la chiamata all'azione diventa: «Commenta CHECKLIST e te la mando».

### Flusso 2, PRONTO MA SPENTO: parola BOT (dal giorno del link Algory)
- Trigger: commento o DM con «BOT». Si accende con il reel di rivelazione.
- DM:
> Ecco il tool con cui creo e testo i miei bot #ad (link affiliato: se ti iscrivi ricevo una commissione, a te non costa di più): [LINK ALGORY]
>
> Prima di usarlo, fai i 4 test della checklist: https://marcostangatrader.netlify.app/#checklist
>
> Il trading comporta un rischio elevato di perdita. Non è una consulenza finanziaria.

### Risposta predefinita ai DM
> Ciao! Sono Marco, quello dietro C. Ti rispondo io appena posso, di solito in giornata. Se vuoi la checklist dei 4 test scrivi CHECKLIST.

## Regole
- Niente promesse di guadagno e niente scarsità finta (Omnibus, Theory).
- Ogni messaggio con il link affiliato porta #ad e l'avviso di rischio.
- Quando arriva il link Algory, nel footer del sito va aggiunta la Partita IVA di Marco (attività commerciale).
