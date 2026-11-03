// Reel affiliato Higgsfield (03/11/2026), schema «sponsor» di Mik Cosentino (higgsfield-aff/copione.md, v3).
// C ritagliato dal verde (webm con trasparenza) sopra i video; grafiche sulla voce Seed Audio.
// Il watermark «Lumina» delle clip resta fuori quadro o sotto il badge Higgsfield: niente zoom sul video di C.
// Tempi in secondi da hfaff-parole.ts (generato da higgsfield-aff/montaggio/monta.py).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { ACCENTO, ANTON, Card3D, Conta, FormatC, INTER, MONO, molla, NERO, Nota, Scena, Sticker, TitoloFisso, VERDE, VIOLA } from "./FormatC";
import { DUR_HF, PAROLE_HF, SCENE_HF, T_HF } from "./hfaff-parole";

const CARTELLA = "hfaff";
const LIME = "#D2FF1F";
const F = (s: number) => Math.round(s * 30);
const PROMPT = "Fammi un video di 10 secondi del mio personaggio che si lancia col paracadute da un aereo, stile film";

// Sfondo scuro con luce viola che respira
const Sfondo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: NERO }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% ${40 + Math.sin(f / 40) * 4}%, ${VIOLA}55, transparent 65%)` }} />
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, #ffffff06 0 2px, transparent 2px 6px)" }} />
    </AbsoluteFill>
  );
};

// Logo Higgsfield (glifo lime + nome)
export const LogoHF: React.FC<{ size?: number; testo?: string }> = ({ size = 44, testo }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.3, background: "#0d0d0fee", border: `2px solid ${LIME}66`, borderRadius: size * 0.5, padding: `${size * 0.18}px ${size * 0.45}px`, boxShadow: `0 10px 30px #000a, 0 0 30px ${LIME}33` }}>
    {testo ? <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: size * 0.55, color: "#ffffffaa" }}>{testo}</span> : null}
    <Img src={staticFile(`${CARTELLA}/hf-lime.svg`)} style={{ width: size, height: size }} />
    <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: size * 0.72, color: "#fff", letterSpacing: -0.5 }}>Higgsfield</span>
  </div>
);

// C ritagliato (1080x1920 con trasparenza). Il badge copre il watermark in basso a destra e si muove con la clip.
// parti: [da s, durata s, inizio nella clip s] → jump cut sulle pause tagliate nella voce
const CKey: React.FC<{ src: string; parti: number[][]; x?: number; y?: number; s?: number; badge?: boolean; sfuma?: number; lati?: number }> = ({ src, parti, x = 0, y = 0, s = 1, badge = false, sfuma, lati = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "0 0", clipPath: lati ? `inset(0 ${lati}px 0 ${lati}px)` : undefined, transform: `translate(${x}px, ${y}px) scale(${s})`, WebkitMaskImage: sfuma ? `linear-gradient(transparent 0, #000 ${sfuma}px)` : undefined }}>
    {parti.map(([da, dur, inizio], i) => (
      <Sequence key={i} from={F(da)} durationInFrames={i === parti.length - 1 ? undefined : F(da + dur) - F(da)}>
        <OffthreadVideo src={staticFile(`${CARTELLA}/${src}`)} startFrom={F(inizio)} transparent muted style={{ width: 1080, height: 1920 }} />
      </Sequence>
    ))}
    {badge ? <div style={{ position: "absolute", left: 838, top: 1814 }}><LogoHF size={44} /></div> : null}
  </div>
);

// v2 (Marco 03/11 sera: «che pena»): C resta sempre in scena. Fotogramma ritagliato fermo (bocca chiusa,
// niente labiale finto sulla voce Seed Audio) che entra dal basso e respira.
const CFermo: React.FC<{ src: string; x: number; y: number; w: number; d?: number }> = ({ src, x, y, w, d = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d) return null;
  const a = molla(f, fps, d, 12, 200);
  const respiro = Math.sin((f - d) / 22) * 6;
  return (
    <Img src={staticFile(`${CARTELLA}/${src}`)} style={{ position: "absolute", left: x, top: y + (1 - a) * 500 + respiro, width: w, transform: `rotate(${Math.sin((f - d) / 37) * 1.2}deg)`, transformOrigin: "50% 100%", filter: `drop-shadow(0 0 40px ${VIOLA}88)` }} />
  );
};

// Titolo del gancio grande in Anton, l'ultima parola nel riquadro viola
const TitoloGancio: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const riga = (i: number) => molla(f, fps, i * 5, 12, 240);
  const st = (i: number): React.CSSProperties => ({ transform: `scale(${0.5 + 0.5 * riga(i)})`, opacity: Math.min(1, riga(i) * 1.5), fontFamily: ANTON, color: "#fff", textTransform: "uppercase", lineHeight: 1.02, textShadow: "0 6px 30px #000d" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}>
      <div style={{ ...st(0), fontSize: 96 }}>Questo video</div>
      <div style={{ ...st(1), fontSize: 112 }}>non l'ha girato</div>
      <div style={{ ...st(2), marginTop: 10 }}><span style={{ fontSize: 150, background: VIOLA, padding: "0 28px", boxShadow: `0 0 60px ${VIOLA}aa` }}>nessuno</span></div>
    </div>
  );
};

// Video che entra come un pop-up (dalla testa di C verso il suo posto)
const Popup: React.FC<{ d: number; src: string; x: number; y: number; w: number; h: number; rot: number; inizio?: number; etichetta?: string }> = ({ d, src, x, y, w, h, rot, inizio = 0, etichetta }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d) return null;
  const a = molla(f, fps, d, 11, 190);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `translate(${(1 - a) * (540 - x - w / 2)}px, ${(1 - a) * 700}px) scale(${0.2 + 0.8 * a}) rotate(${rot * a}deg)`, opacity: Math.min(1, a * 2) }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 34, overflow: "hidden", border: "5px solid #fff", boxShadow: `0 30px 80px #000d, 0 0 60px ${ACCENTO}66` }}>
        <Sequence from={d}>
          <OffthreadVideo src={staticFile(`${CARTELLA}/${src}`)} startFrom={inizio} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Sequence>
      </div>
      {etichetta ? <div style={{ position: "absolute", left: 0, right: 0, bottom: -34, textAlign: "center" }}><span style={{ fontFamily: ANTON, fontSize: 46, color: "#fff", background: VIOLA, padding: "4px 18px", borderRadius: 12, textTransform: "uppercase" }}>{etichetta}</span></div> : null}
    </div>
  );
};

// 1 · gancio: il video finito a tutto schermo, C in green screen in basso a destra
const Gancio: React.FC = () => {
  const r = (k: string) => F(T_HF[k]);
  return (
    <>
      <OffthreadVideo src={staticFile(`${CARTELLA}/mt03.mp4`)} muted style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #0008 0%, transparent 30%, transparent 60%, #000a 100%)" }} />
      <CKey src="A-gancio.webm" parti={SCENE_HF.gancio[2]} x={400} y={720} s={0.66} />
      <TitoloGancio />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center" }}><LogoHF size={44} testo="fatto con" /></div>
      <Sticker d={r("esisto")} fino={r("artificiale") - 2} top={980} size={96} bg={VIOLA} rot={-4}>Non esisto</Sticker>
      <Sticker d={r("artificiale")} top={980} size={84} bg={VIOLA} rot={-3}>Creato con l'AI</Sticker>
    </>
  );
};

// 2 · «Vuoi fare un video così? …o così?»: due pop-up sopra, C sotto che li guarda
const Cosi: React.FC = () => {
  const base = SCENE_HF.cosi[0];
  return (
    <>
      <Sfondo />
      <CKey src="B-cosi.webm" parti={SCENE_HF.cosi[2]} y={860} sfuma={260} lati={90} />
      <Popup d={3} src="mt04.mp4" x={40} y={110} w={470} h={836} rot={-4} inizio={30} />
      <Popup d={F(T_HF.cosi2 - base) - 4} src="mt07.mp4" x={570} y={150} w={470} h={836} rot={4} inizio={60} />
    </>
  );
};

// Parola che viene barrata: «senza …»
const Barrata: React.FC<{ d: number; y: number; testo: string }> = ({ d, y, testo }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d) return null;
  const a = molla(f, fps, d, 12, 230);
  const riga = interpolate(f, [d + 8, d + 16], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", transform: `scale(${0.6 + 0.4 * a})`, opacity: Math.min(1, a * 1.5) }}>
      <span style={{ position: "relative", fontFamily: ANTON, fontSize: 130, color: "#ffffffdd", textTransform: "uppercase" }}>
        {testo}
        <span style={{ position: "absolute", left: -20, top: "52%", height: 16, width: `calc(${riga}% + 40px * ${riga / 100})`, background: ACCENTO, borderRadius: 8, boxShadow: `0 0 30px ${ACCENTO}` }} />
      </span>
    </div>
  );
};

// 3 · «Senza camera. Senza montaggio. Senza metterci la faccia. Bastano due passaggi.»
const Senza: React.FC = () => {
  const r = (k: string) => F(T_HF[k] - SCENE_HF.senza[0]);
  return (
    <>
      <Sfondo />
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", fontFamily: MONO, fontSize: 36, color: ACCENTO, letterSpacing: 6 }}>NON TI SERVE:</div>
      <Barrata d={r("camera") - 6} y={340} testo="la camera" />
      <Barrata d={r("montaggio") - 6} y={540} testo="il montaggio" />
      <Barrata d={r("faccia") - 10} y={740} testo="la tua faccia" />
      <Sticker d={r("due")} top={1000} size={170} bg={VIOLA} rot={-4}>2 passaggi</Sticker>
      <CFermo src="c-fermo.png" x={560} y={1180} w={560} d={2} />
    </>
  );
};

// Zoom lento sul punto che conta della schermata (sul telefono le schermate intere non si leggono)
const Zoom: React.FC<{ da: number; ox: number; oy: number; s: number; durata?: number; children: React.ReactNode }> = ({ da, ox, oy, s, durata = 18, children }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [da, da + durata], [1, s], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const p = (k - 1) / Math.max(0.001, s - 1);
  // il punto scelto scivola verso il centro dello schermo mentre si ingrandisce
  return <AbsoluteFill style={{ transformOrigin: `${ox}px ${oy}px`, transform: `translate(${(540 - ox) * p}px, ${(800 - oy) * p}px) scale(${k})` }}>{children}</AbsoluteFill>;
};

// Cursore finto che si muove tra due punti e clicca
const Cursore: React.FC<{ tappe: [number, number, number][] }> = ({ tappe }) => {
  const f = useCurrentFrame();
  const visti = tappe.filter(([d]) => d <= f);
  if (!visti.length) return null;
  const i = visti.length - 1;
  const [d, x, y] = tappe[i];
  const [, px, py] = tappe[Math.max(0, i - 1)];
  const k = interpolate(f, [d, d + 12], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const clic = interpolate(f, [d + 12, d + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cx = px + (x - px) * k, cy = py + (y - py) * k;
  return (
    <>
      {clic > 0 && clic < 1 ? <div style={{ position: "absolute", left: cx - 50 * clic, top: cy - 50 * clic, width: 100 * clic, height: 100 * clic, borderRadius: "50%", border: `5px solid ${ACCENTO}`, opacity: 1 - clic }} /> : null}
      <svg width="54" height="54" viewBox="0 0 24 24" style={{ position: "absolute", left: cx - 6, top: cy - 4, filter: "drop-shadow(0 4px 8px #000a)" }}>
        <path d="M4 2 L4 20 L9 15 L12.5 22 L15.5 20.5 L12 13.8 L19 13.8 Z" fill="#fff" stroke="#000" strokeWidth="1.4" />
      </svg>
    </>
  );
};

// Intestazione del passaggio: «PASSO 1 · …»
const Passo: React.FC<{ d: number; n: string; testo: string; fino?: number }> = ({ d, n, testo, fino }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d || (fino !== undefined && f >= fino)) return null;
  const a = molla(f, fps, d, 12, 220);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 190, display: "flex", alignItems: "center", gap: 26, opacity: a, transform: `translateX(${(1 - a) * -80}px)` }}>
      <div style={{ width: 130, height: 130, borderRadius: 30, background: VIOLA, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANTON, fontSize: 100, color: "#fff", boxShadow: `0 0 50px ${VIOLA}` }}>{n}</div>
      <div style={{ fontFamily: ANTON, fontSize: 78, lineHeight: 1, color: "#fff", textTransform: "uppercase" }}>{testo}</div>
    </div>
  );
};

// Chat finta: la richiesta si scrive da sola, poi invio e barra di generazione
const Chat: React.FC<{ d: number; scrivi: number; invio: number; fine: number }> = ({ d, scrivi, invio, fine }) => {
  const f = useCurrentFrame();
  if (f < d) return null;
  const n = Math.floor(interpolate(f, [scrivi, invio - 6], [0, PROMPT.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const inviato = f >= invio;
  const p = interpolate(f, [invio + 8, fine], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  return (
    <Card3D d={d} x={50} y={400} w={980} h={980}>
      <div style={{ padding: 44, height: "100%", display: "flex", flexDirection: "column", gap: 30, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: INTER, fontSize: 34, color: "#ffffffcc" }}>
          <span style={{ fontSize: 44, color: "#d97757" }}>✳</span> Nuova chat · <span style={{ color: LIME }}>Higgsfield collegato</span>
        </div>
        {inviato ? (
          <>
            <div style={{ alignSelf: "flex-end", maxWidth: "85%", background: "#2a2440", borderRadius: 28, padding: "24px 30px", fontFamily: INTER, fontSize: 38, lineHeight: 1.3, color: "#fff" }}>{PROMPT}</div>
            <div style={{ fontFamily: INTER, fontSize: 34, color: "#ffffffaa" }}>Sto generando il video con Higgsfield…</div>
            <div style={{ height: 26, borderRadius: 13, background: "#ffffff1a", overflow: "hidden" }}>
              <div style={{ width: `${p}%`, height: "100%", background: `linear-gradient(90deg, ${VIOLA}, ${LIME})`, boxShadow: `0 0 30px ${LIME}` }} />
            </div>
            <div style={{ fontFamily: MONO, fontSize: 40, color: LIME }}>{Math.round(p)}%</div>
          </>
        ) : (
          <div style={{ marginTop: "auto", border: `3px solid ${ACCENTO}`, borderRadius: 30, padding: "26px 30px", fontFamily: INTER, fontSize: 40, lineHeight: 1.3, color: "#fff", minHeight: 300, position: "relative" }}>
            {PROMPT.slice(0, n)}<span style={{ opacity: f % 20 < 10 ? 1 : 0, color: ACCENTO }}>|</span>
            <div style={{ position: "absolute", right: 24, bottom: 20, width: 80, height: 80, borderRadius: 40, background: f >= invio - 4 ? LIME : "#d97757", color: "#000", fontSize: 46, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${f >= invio - 4 ? 0.85 : 1})` }}>↑</div>
          </div>
        )}
      </div>
    </Card3D>
  );
};

// Il video che appare a tutto schermo su «eccolo»
const Eccolo: React.FC = () => {
  const f = useCurrentFrame();
  const lampo = interpolate(f, [0, 6], [1, 0], { extrapolateRight: "clamp" });
  const s = interpolate(f, [0, 10], [1.25, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile(`${CARTELLA}/mt03.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center" }}><LogoHF size={48} testo="fatto con" /></div>
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: lampo }} />
    </AbsoluteFill>
  );
};

// 4 · i due passaggi sullo schermo vero (schermate ritagliate: niente dati privati)
const Passi: React.FC = () => {
  const r = (k: string) => F(T_HF[k] - SCENE_HF.passi[0]);
  const k = 960 / 669; // scala della schermata dei connettori
  const cx = (x: number) => 60 + x * k, cy = (y: number) => 470 + y * k;
  return (
    <>
      <Sfondo />
      <Passo d={0} n="1" testo="Iscriviti e collega" fino={r("due2")} />
      <Sequence from={r("iscrivi") - 4} durationInFrames={r("apri") - r("iscrivi") + 4}>
        <Zoom da={0} ox={540} oy={670} s={1.15} durata={90}>
          <Card3D d={0} x={40} y={430} w={1000} h={482} colore={LIME}>
            <Img src={staticFile(`${CARTELLA}/home.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Card3D>
        </Zoom>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1010, textAlign: "center" }}><LogoHF size={64} /></div>
      </Sequence>
      <Sequence from={r("apri") - 4} durationInFrames={r("due2") - r("apri") + 4}>
        <Zoom da={r("cerchi") - r("apri") - 6} ox={cx(540)} oy={cy(80)} s={2.1}>
          <Card3D d={0} x={60} y={470} w={960} h={749}>
            <Img src={staticFile(`${CARTELLA}/connettori.png`)} style={{ width: "100%", height: "100%" }} />
          </Card3D>
          <Cursore tappe={[[0, 300, 1300], [r("cerchi") - r("apri"), cx(470), cy(50)], [r("colleghi") - r("apri"), cx(605), cy(112)]]} />
        </Zoom>
        <Nota x={60} y={350} d={r("connettori") - r("apri") + 4} rot={-2} size={54}>Impostazioni → Connettori → «Higgsfield»</Nota>
        <Sticker d={r("fatto") - r("apri")} top={1060} size={120} bg={VERDE} rot={-3}>Fatto ✓</Sticker>
      </Sequence>
      <Sequence durationInFrames={r("eccolo")}><CFermo src="c-su.png" x={620} y={1200} w={500} d={4} /></Sequence>
      <Passo d={r("due2")} n="2" testo="Scrivi cosa vuoi" />
      <Chat d={r("due2") + 2} scrivi={r("scrivi")} invio={r("invio")} fine={r("eccolo") - 4} />
      <Sequence from={r("eccolo")}><Eccolo /></Sequence>
    </>
  );
};

// 5 · «Pensa cosa ci fai tu»: tre esempi veri, poi l'obiezione del tempo
const Pensa: React.FC = () => {
  const r = (k: string) => F(T_HF[k] - SCENE_HF.pensa[0]);
  const f = useCurrentFrame();
  const via = interpolate(f, [r("settimane") - 14, r("settimane") - 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Sfondo />
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: ANTON, fontSize: 92, color: "#fff", textTransform: "uppercase", opacity: via }}>Pensa cosa ci fai <span style={{ background: VIOLA, padding: "0 18px", borderRadius: 12 }}>tu</span></div>
      <AbsoluteFill style={{ opacity: via }}>
        <Popup d={Math.min(4, r("negozio") - 10)} src="ex-guido.mp4" x={30} y={430} w={320} h={569} rot={-3} etichetta="Il tuo locale" />
        <Popup d={r("clienti") - 14} src="ex-forge.mp4" x={380} y={470} w={320} h={569} rot={2} etichetta="I tuoi clienti" />
        <Popup d={r("personaggio") - 8} src="ex-c.mp4" x={730} y={430} w={320} h={569} rot={4} etichetta="Un personaggio" />
      </AbsoluteFill>
      <Sticker d={r("settimane") - 4} top={560} size={150} rot={3}>Settimane</Sticker>
      <Nota x={170} y={790} d={r("settimane") + 10} size={74}>per capire cosa chiedere</Nota>
      <Sticker d={r("devi") - 8} top={900} size={150} bg={VIOLA} rot={-4}>Tu no.</Sticker>
      <CFermo src="c-fermo.png" x={600} y={1200} w={520} d={2} />
    </>
  );
};

// 6 · la guida gratuita «Il kit di C»
const Guida: React.FC = () => {
  const r = (k: string) => F(T_HF[k] - SCENE_HF.guida[0]);
  return (
    <>
      <Sfondo />
      <Card3D d={2} x={90} y={300} w={560} h={792}><Img src={staticFile(`${CARTELLA}/kit1.png`)} style={{ width: "100%", height: "100%" }} /></Card3D>
      <Card3D d={r("collega")} x={450} y={470} w={560} h={792}><Img src={staticFile(`${CARTELLA}/kit4.png`)} style={{ width: "100%", height: "100%" }} /></Card3D>
      <Sticker d={r("guida")} top={190} size={100} bg={VIOLA} rot={-3}>Guida gratis</Sticker>
      <Conta d={r("venti")} da={0} a={20} durata={20} top={1270} suffisso=" richieste pronte" size={88} />
    </>
  );
};

// Freccia che indica il pulsante dei commenti nella colonna di destra (TikTok ~y 1130, Instagram ~y 1290)
const AiCommenti: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d) return null;
  const a = molla(f, fps, d, 10, 220);
  const spinta = Math.sin((f - d) / 3.2) * 14;
  return (
    <div style={{ position: "absolute", left: 300, top: 1080, width: 640, height: 260, opacity: Math.min(1, a * 1.6), transform: `translateX(${(1 - a) * -200 + spinta}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 40, background: "#fff", borderRadius: 34, padding: "18px 30px", boxShadow: "0 18px 50px #000c", display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 54, height: 54, borderRadius: 27, background: `linear-gradient(${ACCENTO},${VIOLA})` }} />
        <span style={{ fontFamily: INTER, fontWeight: 900, fontSize: 60, color: "#111" }}>VIDEO</span>
      </div>
      <svg width="300" height="160" viewBox="0 0 300 160" style={{ position: "absolute", left: 400, top: 20, overflow: "visible" }}>
        <path d="M10 90 C 90 20, 190 20, 270 80" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" style={{ filter: "drop-shadow(0 4px 10px #000c)" }} />
        <path d="M232 52 L 280 86 L 226 108" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// 7 · CTA: C a tutto schermo, «VIDEO» va scritto nei commenti (pulsante a destra)
const Cta: React.FC = () => {
  const r = (k: string) => F(T_HF[k] - SCENE_HF.cta[0]);
  return (
    <>
      <Sfondo />
      <CKey src="C-cta.webm" parti={SCENE_HF.cta[2]} badge />
      <Sticker d={r("parola") - 4} top={880} size={110} bg={VIOLA} rot={-3}>Commenta «VIDEO»</Sticker>
      <AiCommenti d={r("video") - 2} />
      <div style={{ position: "absolute", left: 60, top: 1380, fontFamily: MONO, fontSize: 26, color: "#ffffffaa", textShadow: "0 2px 8px #000" }}>#ad · link affiliato nella guida</div>
    </>
  );
};

const sc = (k: string, el: React.ReactNode): Scena => ({ from: F(SCENE_HF[k][0]), dur: F(SCENE_HF[k][0] + SCENE_HF[k][1]) - F(SCENE_HF[k][0]), grafica: el });
const SCENE: Scena[] = [
  sc("gancio", <Gancio />),
  sc("cosi", <Cosi />),
  sc("senza", <Senza />),
  sc("passi", <Passi />),
  sc("pensa", <Pensa />),
  sc("guida", <Guida />),
  sc("cta", <Cta />),
];

const CHIAVE = /^(VIDEO|NESSUNO|ESISTO|UN'INTELLIGENZA|ARTIFICIALE|COSÌ|CAMERA|MONTAGGIO|FACCIA|DUE|HIGGSFIELD|CLAUDE|CONNETTORI|FATTO|ITALIANO|INVIO|ECCOLO|TU|SETTIMANE|GUIDA|VENTI)$/;

export const DURATA_HF = F(DUR_HF);

export const HFAFF: React.FC = () => (
  <FormatC
    scene={SCENE}
    parole={PAROLE_HF}
    chiave={CHIAVE}
    cartella={CARTELLA}
    etichetta=""
    titolo={<></>}
    piccoli
    enfasi={[T_HF.esisto, T_HF.due, T_HF.eccolo, T_HF.devi]}
    sottotitoliTop={(t) => (t >= SCENE_HF.cosi[0] && t < SCENE_HF.senza[0] ? 990 : 1440)}
    musicaVol={0.07}
  />
);

// Copertina (Marco 03/11: logo Higgsfield, titolo forte ma vero, niente estetica «AI slop»):
// fotogramma vero del video, la richiesta in una bolla di chat come prova, titolo Anton nella zona 4:5.
export const CoverHF: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NERO }}>
    <Img src={staticFile(`${CARTELLA}/cover-foto.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 38%, #0b0a10dd 62%, #0b0a10 85%)" }} />
    <div style={{ position: "absolute", left: 70, right: 170, top: 700, background: "#ffffff", borderRadius: "40px 40px 40px 10px", padding: "26px 34px", boxShadow: "0 24px 60px #000c", transform: "rotate(-2deg)" }}>
      <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 40, lineHeight: 1.25, color: "#111" }}>«Fammi un video di me che mi lancio col paracadute, stile film»</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1040, textAlign: "center", fontFamily: ANTON, fontSize: 150, lineHeight: 1, color: "#fff", textTransform: "uppercase" }}>L'ho fatto con</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1215, textAlign: "center" }}>
      <span style={{ display: "inline-block", fontFamily: ANTON, fontSize: 230, lineHeight: 1.08, color: "#fff", textTransform: "uppercase", background: VIOLA, padding: "0 36px", boxShadow: `0 20px 60px #000c, 0 0 80px ${VIOLA}88` }}>una frase</span>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1500, textAlign: "center" }}><LogoHF size={66} /></div>
    <div style={{ position: "absolute", left: 60, top: 1838, fontFamily: ANTON, fontSize: 38, color: "#ffffffe6" }}>@cthe.trader</div>
    <div style={{ position: "absolute", left: 56, top: 64, width: 92, height: 92, background: VIOLA, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANTON, fontSize: 56, color: "#fff" }}>MS</div>
  </AbsoluteFill>
);

// Copertina v2 (03/11 sera): fotogramma del gancio (C che si lancia) + lo stesso titolo del gancio, tutto nella zona 4:5
export const CoverHF2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NERO }}>
    <Img src={staticFile(`${CARTELLA}/cover2-foto.png`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "translateY(120px) scale(1.08)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 40%, #0b0a10cc 60%, #0b0a10 82%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1060, textAlign: "center", fontFamily: ANTON, fontSize: 140, lineHeight: 1, color: "#fff", textTransform: "uppercase", textShadow: "0 8px 30px #000" }}>Non l'ha girato</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1225, textAlign: "center" }}>
      <span style={{ display: "inline-block", fontFamily: ANTON, fontSize: 220, lineHeight: 1.08, color: "#fff", textTransform: "uppercase", background: VIOLA, padding: "0 36px", boxShadow: `0 20px 60px #000c, 0 0 80px ${VIOLA}88` }}>nessuno</span>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1510, textAlign: "center" }}><LogoHF size={60} testo="fatto con" /></div>
    <div style={{ position: "absolute", left: 60, top: 1838, fontFamily: ANTON, fontSize: 38, color: "#ffffffe6" }}>@cthe.trader</div>
    <div style={{ position: "absolute", left: 56, top: 64, width: 92, height: 92, background: VIOLA, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ANTON, fontSize: 56, color: "#fff" }}>MS</div>
  </AbsoluteFill>
);
