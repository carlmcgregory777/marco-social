# Coda TikTok · clip del film P2 — una al giorno alle 18:00 dal Redmi

Marco, 23/11/2026: «Ogni giorno dal Redmi» (le 9 clip del film P2 anche su TikTok, oltre al reel del giorno).
Su YouTube Shorts e Instagram le stesse clip sono già programmate alle 18:00 negli stessi giorni.
Procedura del telefono: sezione «Come si pubblica dal Redmi» di `docs/CODA-TIKTOK.md`.

| giorno | clip | video sul telefono | copertina | stato |
|---|---|---|---|---|
| 24/11 | 1 · le 7 trappole | P2c1.mp4 | P2c1-cop.jpg | DA FARE |
| 25/11 | 2 · trappola 1 | P2c2.mp4 | P2c2-cop.jpg | DA FARE |
| 26/11 | 3 · trappola 2 | P2c3.mp4 | P2c3-cop.jpg | DA FARE |
| 27/11 | 4 · trappola 3 | P2c4.mp4 | P2c4-cop.jpg | DA FARE |
| 28/11 | 5 · trappola 4 | P2c5.mp4 | P2c5-cop.jpg | DA FARE |
| 29/11 | 6 · trappola 5 | P2c6.mp4 | P2c6-cop.jpg | DA FARE |
| 30/11 | 7 · trappola 6 | P2c7.mp4 | P2c7-cop.jpg | DA FARE |
| 01/12 | 8 · trappola 7 | P2c8.mp4 | P2c8-cop.jpg | DA FARE |
| 02/12 | 9 · cosa fanno i 7 | P2c9.mp4 | P2c9-cop.jpg | DA FARE |

## File da copiare sul telefono (se non ci sono già)
- Video: `produzione/youtube/P2-prop-firm/clip/out/P2-clip<n>.mp4` → `/sdcard/DCIM/Camera/P2c<n>.mp4`
- Copertina: `produzione/youtube/P2-prop-firm/clip/cop/P2-clip<n>-cop.jpg` → `/sdcard/DCIM/Camera/P2c<n>-cop.jpg`
- Dopo ogni `adb push`: `adb shell am broadcast -a android.intent.action.MEDIA_SCANNER_SCAN_FILE -d file:///sdcard/DCIM/Camera/<nome>`

## Descrizioni (senza accenti, apostrofi né simbolo di percentuale: con adb non si scrivono)
Hashtag per tutte: `#propfirm` `#trading` `#challenge`
1. `Su 100 che comprano una challenge da prop firm, solo 7 vengono pagati. Le 7 trappole, una per una. Film completo su YouTube: cerca C The Trader`
2. `Trappola 1: il conto da 100.000 dollari della prop firm non esiste. Lo scrivono loro nelle FAQ. Film completo su YouTube: cerca C The Trader`
3. `Trappola 2: il limite giornaliero conta anche le posizioni aperte e la mezzanotte del server. Ti chiude il conto mentre dormi. Film completo su YouTube: cerca C The Trader`
4. `Trappola 3: a +9 ti manca un punto e raddoppi la size. La challenge funziona come un torneo. Film completo su YouTube: cerca C The Trader`
5. `Trappola 4: hai perso e arriva lo sconto per riprovare. In media 3 tentativi a testa, circa 800 dollari. Film completo su YouTube: cerca C The Trader`
6. `Trappola 5: le regole che contano sono quelle con gli aggettivi. Eccessivo lo decidono loro. Film completo su YouTube: cerca C The Trader`
7. `Trappola 6: quando vinci tu, la prop firm ci perde. Il modello funziona in questo modo. Film completo su YouTube: cerca C The Trader`
8. `Trappola 7: chi ti ha consigliato la prop firm ci guadagna. Codici sconto, classifiche e stelline. Film completo su YouTube: cerca C The Trader`
9. `Cosa fanno i 7 su 100 che vengono pagati: rischio piccolo e fisso, regole scritte prima, un budget per i tentativi. Film completo su YouTube: cerca C The Trader`
