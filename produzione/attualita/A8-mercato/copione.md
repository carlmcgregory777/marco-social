# Attualità di C #8: «Il mercato è crollato. E io ieri non l'ho guardato.»

- **Spunto:** reel di Amedeo Iasci (Jashi) https://www.instagram.com/reel/DfZAzr-INyO/ del 05/11/2026 (125 s). Trascrizione in `produzione/motion-transfer/ig-DfZAzr-INyO/trascrizione.txt`.
- **Formato:** **A5** — C a tutto schermo + pannelli con grafiche sopra, parole giganti con la chiave in giallo.
- **Tono:** **accusa, non spiega.** Il bersaglio non è «chi ha paura»: è **chi ha costruito la paura per venderti la soluzione**. Jashi fa «voi siete incazzati per i crolli, io dormo tranquillo» — C va oltre: chi ti vuole spaventato ha un interesse.
- **Tesi di C:** ti fanno guardare il grafico di oggi per venderti il corso di domani. Il crollo di oggi non è una notizia, è un **modello di business**. Chi vive di rendita sul tuo panico non vuole che tu guardi il grafico dal 2013.
- **Leva del giorno:** **Connessione** (ruotare: A5 Chiarezza, A6 Obiezioni, A7 Missione).
- **Frase da inoltrare** (scritta per prima): «Ti fanno guardare il grafico di oggi per venderti il corso di domani.»
- **Paletti:** nessun consiglio operativo, nessuna promessa di rendimento, nessun nome di persona. Si attacca la **condotta** (chi monetizza la paura), non le persone. Niente «Priced in.» (bocciato il 04/11).

## Fatti — VERIFICATI l'08/11/2026 (testo voce: `voce/testo-v2.txt`)

| Fatto (detto nel video) | Dato | Fonte |
|---|---|---|
| «Giovedì l'S&P 500 ha perso più del 4%» | −4,36% giovedì 5/11/2026 (Nasdaq −5,52%) | 24/7 Wall St. 07/11/2026, «worst week since April 2025» |
| «Oggi» | chiusura venerdì 6/11/2026: 7.376,86 (−2,68% nella settimana, 4ª settimana in calo) | Yahoo Finance ^GSPC, 24/7 Wall St. |
| «Sotto il record di meno del 6%, un record di un mese fa» | record di chiusura 7.818,93 il 6/10/2026 → −5,65% | 24/7 Wall St. |
| «Dal 2013 vale circa quattro volte tanto» | 31/12/2013: 1.848,36 → 7.376,86 = ×3,99 (da gennaio 2013: ×4,9) | Yahoo Finance, chiusure mensili in `montaggio/spx-mensile.json` |
| «Anche dopo il 2020, anche dopo il 2022» | minimi mensili: mar 2020 2.584,59 · set 2022 3.585,62, entrambi sopra 1.848 | idem |

**v1 SBAGLIATA:** diceva «siamo ai massimi storici»: falso al 6/11 (−5,65% dal record). Corretto in v2.
Il grafico del video usa le chiusure mensili vere (167 punti).

## v1 — testo della voce (SUPERATO: vedi voce/testo-v2.txt)

[casual] Il mercato è crollato. Hai perso soldi. Sei preoccupato. E adesso ti dico una cosa che non ti aspetti: qualcuno, stanotte, ci ha fatto i soldi sopra la tua preoccupazione. Non è un complotto. È un mestiere.
Guarda questo grafico. Questo è l'S&P 500 oggi. E questo è il 2013, quando ho iniziato. Siamo ai massimi storici. Hai capito bene: ai massimi. E tu sei qui a farti venire l'ansia per una settimana storta.
[excited] E allora la domanda non è perché il mercato scende. La domanda è: chi ha interesse a farti guardare il grafico ogni giorno? Perché un grafico giornaliero è inutile. Non ti dice niente. Zero. Ma ti fa paura. E la paura vende. Vende abbonamenti, vende corsi, vende segnali, vende consulenze. La paura è il prodotto.
E chi ti vende la paura ha un vantaggio che tu non hai: sa che tu la comprerai. Perché funziona sempre. Ti mostrano il rosso, ti dicono «te l'avevo detto», e tu apri il portafoglio. Non per investire. Per comprare la tranquillità che ti hanno appena tolto.
[excited] Ecco la parte che nessuno ti dice. Se avessi comprato nel 2013 e non avessi fatto niente — niente, zero operazioni — oggi saresti in guadagno. Non perché sei bravo. Perché non hai venduto. La tua unica forza è stata non ascoltare nessuno.
Quindi la prossima volta che qualcuno ti chiama per il crollo di oggi, chiedigli una cosa: «e nel 2013 dov'eri?» Perché se ti spaventa oggi e non ti ha avvisato tredici anni fa, non ti sta proteggendo. Ti sta vendendo qualcosa.
E il grafico che ti mostra è sempre quello di ieri. Mai quello di trent'anni.

## Note di montaggio

- **Formato A5:** 15 pannelli, C a tutto schermo, grafiche sul petto, parole giganti sopra la testa.
- **Grafica centrale:** grafico S&P 500 dal 2013 a oggi, con i crolli segnati e la ripresa. **Da generare con dati veri.**
- **Immagine:** `A4-midterm/set/C-microfono.png`. Labiale **InfiniteTalk** con `voce.wav` tagliata.
- **Voce:** Julian `eleven_v4` stab. **0,6**.
- **Chiavi gialle:** CROLLATO, MASSIMI, PAURA, PRODOTTO, 2013, VENDUTO, GUADAGNO, TRENT'ANNI.
- **Copertina:** faccia di C + «IL CROLLO / È IL PRODOTTO» + etichetta viola.
- **Numeri:** il grafico va rifatto con dati reali. Se non si trovano, si toglie il grafico e resta la tesi.
