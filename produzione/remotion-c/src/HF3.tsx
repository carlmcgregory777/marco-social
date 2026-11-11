// Reel affiliato Higgsfield v3 «Guarda cosa fa Claude con un comando» — versione 2 (10/11/2026 sera).
// Marco ha bocciato la prima («annoia mortalmente»): C stava zitto 20 secondi sopra tre clip lente.
// Ora C parla per tutto il video con battute asciutte, una dimostrazione ogni 2-3 secondi agganciata alla parola
// («Cambiato», «Fatto», «Notte», «Sparita»), filmato grande, timbri, coriandoli. Niente tempi morti.
// Spunto: reel di Mik Cosentino DfieadGI32a (campagna #higgsfieldcreator, parola MIRACOLO).
// Solo fatti verificati sul sito Higgsfield il 10/11/2026: «Fable 5.2 × Higgsfield MCP: Unlimited generations on
// frontier models via Claude MCP for new users» e «Higgsfield Miracle coming soon · Be first: install the MCP».
// Le clip sono quelle ufficiali di higgsfield.ai/miracle (higgsfield-aff/v3/fonte).
// C: labiale InfiniteTalk su sfondo verde, ritagliato in webm con trasparenza (public-hf3/hf3/C-key.webm).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ANTON, INTER, MANO, MONO, molla, NERO, VIOLA } from "./FormatC";
import { FINE_HF3, PAROLE_HF3 } from "./hf3-parole";

const CART = "hf3";
const LIME = "#D2FF1F";
const F = (s: number) => Math.round(s * 30);
const CODA = 1.4;
export const DURATA_HF3 = F(FINE_HF3 + CODA);

// scene agganciate alle parole (secondi sulla voce tagliata, vedi hf3-parole.ts)
type Demo = { da: number; a: number; src: string; inizio: number; vel: number; comando: string; tCmd: number; esito: string; tEsito: number; emoji: string };
const DEMO: Demo[] = [
  { da: 0, a: 4.64, src: "item-1.mp4", inizio: 0, vel: 1.33, comando: "cambia l'albero", tCmd: 3.2, esito: "CAMBIATO", tEsito: 4.0, emoji: "🌳" },
  { da: 4.64, a: 7.86, src: "launch.mp4", inizio: 8.3, vel: 1, comando: "allunga il pelo al cane", tCmd: 4.64, esito: "FATTO", tEsito: 5.82, emoji: "🐕" },
  { da: 7.86, a: 9.54, src: "launch.mp4", inizio: 17.6, vel: 1.9, comando: "fai notte a Parigi", tCmd: 7.86, esito: "NOTTE", tEsito: 8.97, emoji: "🌙" },
  { da: 9.54, a: 11.71, src: "item-2.mp4", inizio: 0, vel: 2, comando: "riporta Dubai al 1996", tCmd: 9.54, esito: "SPARITA", tEsito: 11.1, emoji: "💨" },
];
const T = { cane: 6.37, montatore: 11.71, frase: 13.51, miracle: 14.55, fila: 17.25, illimitate: 19.47, tIll: 21.73, cta: 22.33, tMir: 23.16 };
const CHIAVE = /^(COMANDO|CAMBIATO|FATTO|NOTTE|SPARITA|GIORNI|FRASE|MIRACLE|PRIMA|FILA|ILLIMITATE|MIRACOLO|LINK)$/;

const VID = { top: 236, h: 770 };

const Sfondo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: NERO }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% ${62 + Math.sin(f / 45) * 4}%, ${VIOLA}77, transparent 60%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 8% 100%, ${LIME}22, transparent 45%)` }} />
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, #ffffff05 0 2px, transparent 2px 6px)" }} />
    </AbsoluteFill>
  );
};

const Glifo: React.FC<{ size: number }> = ({ size }) => <Img src={staticFile(`${CART}/hf-lime.svg`)} style={{ width: size, height: size }} />;

const Riga: React.FC<{ t: string; size: number; box?: string; col?: string }> = ({ t, size, box = VIOLA, col = "#fff" }) => (
  <div style={{ fontFamily: ANTON, fontSize: size, lineHeight: 1.2, color: "#fff", textTransform: "uppercase", textShadow: "0 6px 30px #000d", whiteSpace: "nowrap" }}>
    {t.split(" ").map((w, i) => w.startsWith("*")
      ? <span key={i} style={{ background: box, color: col, padding: "0 16px", marginRight: 12, boxShadow: `0 0 50px ${box}aa`, textShadow: "none" }}>{w.slice(1)}</span>
      : <span key={i} style={{ marginRight: 12 }}>{w}</span>)}
  </div>
);

const Barra: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 132, display: "flex", justifyContent: "center" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#141318f2", border: "2px solid #ffffff22", borderRadius: 40, padding: "12px 28px", boxShadow: "0 12px 40px #000a" }}>
      <span style={{ color: "#e8825a", fontSize: 38, lineHeight: 1 }}>✳</span>
      <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 34, color: "#fff" }}>Claude</span>
      <span style={{ fontFamily: MONO, fontSize: 26, color: "#ffffff99" }}>Fable 5.2</span>
      <span style={{ fontFamily: INTER, fontSize: 32, color: "#ffffff66" }}>×</span>
      <Glifo size={40} />
      <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 34, color: "#fff" }}>Higgsfield</span>
    </div>
  </div>
);

// riquadro del filmato: scatta (zoom + lampo) sulla parola dell'esito
const Riquadro: React.FC<{ children: React.ReactNode; colpi: number[]; bordo?: string }> = ({ children, colpi, bordo = "#ffffff44" }) => {
  const f = useCurrentFrame();
  let z = 1;
  let lampo = 0;
  for (const c of colpi) {
    const k = f - F(c);
    if (k >= 0 && k < 10) {
      z = 1 + 0.06 * (1 - k / 10);
      lampo = Math.max(0, 0.55 - k * 0.11);
    }
  }
  return (
    <div style={{ position: "absolute", left: 0, top: VID.top, width: 1080, height: VID.h, overflow: "hidden", borderTop: `4px solid ${bordo}`, borderBottom: `4px solid ${bordo}`, background: "#000", boxShadow: "0 30px 90px #000d", transform: `scale(${z})` }}>
      {children}
      <AbsoluteFill style={{ background: "#fff", opacity: lampo }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 160, background: "linear-gradient(180deg, transparent, #000b)" }} />
      <div style={{ position: "absolute", left: 16, bottom: 12, fontFamily: MONO, fontSize: 22, color: "#fff", background: "#000a", borderRadius: 8, padding: "3px 10px" }}>anteprima ufficiale Higgsfield · Miracle in arrivo</div>
    </div>
  );
};

const Clip: React.FC<{ src: string; inizio: number; vel: number }> = ({ src, inizio, vel }) => (
  <OffthreadVideo src={staticFile(`${CART}/${src}`)} startFrom={F(inizio)} playbackRate={vel} muted style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
);

// comando scritto + timbro dell'esito
const Comando: React.FC<{ d: Demo }> = ({ d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = f - F(d.tCmd);
  if (k < 0) return null;
  const a = molla(f, fps, F(d.tCmd), 13, 240);
  const n = Math.min(d.comando.length, Math.floor(k / 0.55));
  const fatto = f >= F(d.tEsito);
  const b = fatto ? molla(f, fps, F(d.tEsito), 8, 300) : 0;
  return (
    <>
      <div style={{ position: "absolute", left: 30, top: VID.top + 26, transform: `translateY(${(1 - a) * -60}px)`, opacity: a, display: "flex", alignItems: "center", gap: 14, background: "#16151cf5", border: `3px solid ${fatto ? LIME : "#ffffff44"}`, borderRadius: 36, padding: "18px 28px", boxShadow: "0 14px 40px #000c" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0d0d0f", borderRadius: 18, padding: "6px 14px" }}>
          <Glifo size={36} /><span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 30, color: LIME }}>Miracle</span>
        </span>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 46, color: "#fff" }}>{d.comando.slice(0, n)}{n < d.comando.length ? "▌" : ""}</span>
      </div>
      {fatto ? (
        <div style={{ position: "absolute", right: 34, top: VID.top + VID.h - 250, transform: `scale(${2.4 - 1.4 * b}) rotate(-7deg)`, opacity: Math.min(1, b * 2), fontFamily: ANTON, fontSize: d.esito.length > 6 ? 118 : 150, lineHeight: 1.12, color: "#0b0a10", background: LIME, padding: "0 34px", borderRadius: 26, boxShadow: `0 0 100px ${LIME}aa, 0 24px 50px #000c` }}>
          {d.esito} <span style={{ fontSize: d.esito.length > 6 ? 86 : 110 }}>{d.emoji}</span>
        </div>
      ) : null}
    </>
  );
};

// scritta a mano che entra (la battuta sul cane)
const Battuta: React.FC<{ t: number; fino: number; testo: string }> = ({ t, fino, testo }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < F(t) || f >= F(fino)) return null;
  const a = molla(f, fps, F(t), 12, 220);
  return <div style={{ position: "absolute", left: 40, top: VID.top + VID.h - 380, fontFamily: MANO, fontWeight: 700, fontSize: 78, color: "#fff", transform: `rotate(-4deg) scale(${a})`, transformOrigin: "0 100%", textShadow: "0 4px 20px #000" }}>{testo}</div>;
};

const Coriandoli: React.FC<{ da: number }> = ({ da }) => {
  const f = useCurrentFrame() - F(da);
  if (f < 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 70 }).map((_, i) => {
        const ang = random(`a${i}`) * Math.PI * 2;
        const v = 14 + random(`v${i}`) * 26;
        const x = 540 + Math.cos(ang) * v * f * 0.9;
        const y = 640 + Math.sin(ang) * v * f * 0.9 + 0.55 * f * f;
        const col = [LIME, "#fff", "#8b6dff", "#ff4d5e"][i % 4];
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 18, height: 30, background: col, borderRadius: 4, transform: `rotate(${f * (8 + (i % 7))}deg)`, opacity: Math.max(0, 1 - f / 55) }} />;
      })}
    </AbsoluteFill>
  );
};

const PASSI = ["Claude → Impostazioni → Connettori", "Aggiungi connettore personalizzato", "Incolla  mcp.higgsfield.ai/mcp", "Connetti. Fatto."];

// ---------- scene nella zona del filmato ----------
const SceneAlte: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const sp = (s: number, d = 11, k = 240) => molla(f, fps, F(s), d, k);
  return (
    <>
      {/* 4 dimostrazioni */}
      {t < T.montatore ? (
        <Riquadro colpi={DEMO.map((d) => d.tEsito)} bordo={LIME}>
          {DEMO.map((d, i) => (
            <Sequence key={i} from={F(d.da)} durationInFrames={F(d.a) - F(d.da)} layout="none">
              <Clip src={d.src} inizio={d.inizio} vel={d.vel} />
            </Sequence>
          ))}
        </Riquadro>
      ) : null}
      {DEMO.map((d, i) => (t >= d.da && t < d.a ? <Comando key={i} d={d} /> : null))}
      <Battuta t={T.cane} fino={DEMO[1].a} testo="(il cane non era d'accordo)" />

      {/* «un montatore ti chiedeva tre giorni. qui basta una frase.» */}
      {t >= T.montatore && t < T.miracle ? (
        <>
          <Riquadro colpi={[T.frase]}>
            <Sequence from={F(T.montatore)} layout="none"><Clip src="launch.mp4" inizio={12.2} vel={1.5} /></Sequence>
            <AbsoluteFill style={{ background: "#0b0a10aa" }} />
          </Riquadro>
          <div style={{ position: "absolute", left: 0, right: 0, top: VID.top + 150, textAlign: "center" }}>
            <div style={{ display: "inline-block", position: "relative", fontFamily: ANTON, fontSize: 200, color: "#ffffffcc", transform: `scale(${0.6 + 0.4 * sp(T.montatore + 0.7)})`, opacity: Math.min(1, sp(T.montatore + 0.7) * 2) }}>
              3 GIORNI
              {t >= T.frase ? <div style={{ position: "absolute", left: -20, right: -20, top: "52%", height: 18, background: "#ff4d5e", transform: `scaleX(${sp(T.frase, 14, 300)}) rotate(-4deg)`, transformOrigin: "0 50%" }} /> : null}
            </div>
            <div />
            {t >= T.frase + 0.1 ? <div style={{ marginTop: 6, transform: `scale(${2 - sp(T.frase + 0.1, 9, 300)}) rotate(-4deg)`, display: "inline-block", fontFamily: ANTON, fontSize: 230, lineHeight: 1.1, color: "#0b0a10", background: LIME, padding: "0 40px", borderRadius: 30, boxShadow: `0 0 110px ${LIME}aa` }}>1 FRASE</div> : null}
          </div>
        </>
      ) : null}

      {/* «si chiama Miracle e sta arrivando dentro Claude» */}
      {t >= T.miracle && t < T.fila ? (
        <>
          <Riquadro colpi={[T.miracle + 0.35]} bordo={LIME}>
            <Sequence from={F(T.miracle)} layout="none"><Clip src="launch.mp4" inizio={21.4} vel={2} /></Sequence>
            <AbsoluteFill style={{ background: "#0b0a1077" }} />
          </Riquadro>
          <div style={{ position: "absolute", left: 0, right: 0, top: VID.top + 190, textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 26, transform: `scale(${0.5 + 0.5 * sp(T.miracle + 0.35, 9, 280)})` }}>
              <Glifo size={170} />
              <span style={{ fontFamily: ANTON, fontSize: 230, color: "#fff", textShadow: `0 0 80px ${LIME}88, 0 10px 40px #000` }}>MIRACLE</span>
            </div>
            <div style={{ marginTop: 16, opacity: sp(T.miracle + 1.2) }}>
              <span style={{ fontFamily: ANTON, fontSize: 84, color: "#0b0a10", background: LIME, padding: "4px 28px", borderRadius: 18, display: "inline-block", transform: "rotate(-3deg)" }}>IN ARRIVO DENTRO CLAUDE</span>
            </div>
          </div>
        </>
      ) : null}

      {/* «chi collega Higgsfield adesso è in prima fila» */}
      {t >= T.fila && t < T.illimitate ? (
        <div style={{ position: "absolute", left: 40, right: 40, top: VID.top + 10 }}>
          <Riga t="Prima fila: *collegalo" size={96} box={LIME} col="#0b0a10" />
          <div style={{ marginTop: 24 }}>
            {PASSI.map((p, i) => {
              const a = sp(T.fila + 0.15 + i * 0.4, 12, 260);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 20, transform: `translateX(${(1 - a) * -300}px)`, opacity: Math.min(1, a * 1.5), background: "#17161df2", border: `3px solid ${i === 3 ? LIME : "#ffffff22"}`, borderRadius: 26, padding: "22px 26px" }}>
                  <span style={{ fontFamily: ANTON, fontSize: 56, color: "#0b0a10", background: LIME, width: 76, height: 76, borderRadius: 38, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontFamily: i === 2 ? MONO : INTER, fontWeight: 800, fontSize: 46, color: "#fff" }}>{p}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* «per i nuovi utenti le generazioni sono illimitate» */}
      {t >= T.illimitate && t < T.cta ? (
        <>
          <div style={{ position: "absolute", left: 40, right: 40, top: VID.top + 20, borderRadius: 44, padding: "44px 44px 54px", background: "linear-gradient(180deg, #1c2408 0%, #101010 75%)", border: `4px solid ${LIME}`, boxShadow: `0 0 110px ${LIME}66, 0 40px 80px #000c`, transform: `scale(${0.8 + 0.2 * sp(T.illimitate)})` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Glifo size={70} />
              <span style={{ fontFamily: MONO, fontSize: 32, color: LIME, letterSpacing: 3 }}>FABLE 5.2 × HIGGSFIELD MCP</span>
            </div>
            <div style={{ marginTop: 26 }}><Riga t="Per i nuovi utenti" size={92} /></div>
            <div style={{ marginTop: 8 }}><Riga t="generazioni" size={150} /></div>
            <div style={{ marginTop: 12, transform: `scale(${t >= T.tIll ? 2 - sp(T.tIll, 8, 300) : 0}) rotate(-3deg)`, transformOrigin: "30% 50%" }}><Riga t="*illimitate" size={190} box={LIME} col="#0b0a10" /></div>
          </div>
          <Coriandoli da={T.tIll} />
        </>
      ) : null}

      {/* CTA */}
      {t >= T.cta ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: VID.top + 10, textAlign: "center" }}>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 48, color: "#ffffffcc", opacity: sp(T.cta) }}>Vuoi la guida e il link per collegarlo?</div>
          <div style={{ fontFamily: ANTON, fontSize: 170, color: "#fff", textTransform: "uppercase", marginTop: 10, transform: `scale(${0.6 + 0.4 * sp(T.cta)})`, textShadow: "0 6px 30px #000d" }}>Commenta</div>
          {t >= T.tMir ? <div style={{ display: "inline-block", marginTop: 4, transform: `scale(${(2.2 - 1.2 * sp(T.tMir, 8, 300)) * (1 + Math.max(0, Math.sin(f / 6)) * 0.04)}) rotate(-3deg)`, fontFamily: ANTON, fontSize: 210, lineHeight: 1.1, color: "#0b0a10", background: LIME, padding: "0 46px", borderRadius: 36, boxShadow: `0 0 120px ${LIME}aa, 0 30px 60px #000c` }}>MIRACOLO</div> : null}
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 50, color: "#fff", marginTop: 44, opacity: sp(T.tMir + 0.6) }}>e ti mando tutto in DM</div>
        </div>
      ) : null}
    </>
  );
};

// ---------- colonna sinistra: titolo del gancio, poi i sottotitoli a 2 parole ----------
const Colonna: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  if (t < 3.2) {
    const r = (i: number) => molla(f, fps, 2 + i * 5, 11, 240);
    const st = (i: number): React.CSSProperties => ({ transform: `scale(${0.5 + 0.5 * r(i)})`, transformOrigin: "0 50%", opacity: Math.min(1, r(i) * 1.6) });
    return (
      <div style={{ position: "absolute", left: 36, top: 1060 }}>
        <div style={st(0)}><Riga t="Guarda" size={104} /></div>
        <div style={st(1)}><Riga t="cosa fa" size={104} /></div>
        <div style={st(2)}><Riga t="Claude" size={104} /></div>
        <div style={{ ...st(3), marginTop: 6 }}><Riga t="con *un" size={104} box={LIME} col="#0b0a10" /></div>
        <div style={{ ...st(3), marginTop: 6 }}><Riga t="*comando" size={104} box={LIME} col="#0b0a10" /></div>
      </div>
    );
  }
  if (t > FINE_HF3 + 0.3) return null;
  const viste = PAROLE_HF3.filter(([a]) => t >= a);
  if (!viste.length) return null;
  const ult = viste[viste.length - 1];
  const gruppo = PAROLE_HF3.filter((p) => p[2] === ult[2]);
  const i = gruppo.indexOf(ult);
  const blocco = gruppo.slice(Math.floor(i / 2) * 2, Math.floor(i / 2) * 2 + 2);
  const a = molla(f, fps, F(blocco[0][0]), 12, 320);
  return (
    <div style={{ position: "absolute", left: 36, width: 470, top: 1090, fontFamily: INTER, fontWeight: 900, fontSize: 84, lineHeight: 1.02, letterSpacing: -2, transform: `scale(${0.85 + 0.15 * a})`, transformOrigin: "0 0", textShadow: "0 8px 30px #000c" }}>
      {blocco.map(([s0, p], k) => {
        const pulita = p.replace(/[.,!?]/g, "");
        const lunga = pulita.length > 9;
        return <div key={k} style={{ color: CHIAVE.test(pulita.toUpperCase()) ? LIME : "#fff", opacity: t >= s0 ? 1 : 0, fontSize: lunga ? (84 * 9) / pulita.length : 84, WebkitTextStroke: "3px #0009", paintOrder: "stroke fill" }}>{pulita.toLowerCase()}</div>;
      })}
    </div>
  );
};

// C ritagliato a destra; scatta in avanti sulle parole forti, più grande nella CTA
const C: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const cta = interpolate(t, [T.cta - 0.2, T.cta + 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  let colpo = 0;
  for (const c of [...DEMO.map((d) => d.tEsito), T.frase, T.tIll, T.tMir]) {
    const k = f - F(c);
    if (k >= 0 && k < 9) colpo = Math.max(colpo, 0.07 * (1 - k / 9));
  }
  const tagli = [0, 3.28, 4.64, 7.86, 9.54, 11.71, 14.55, 17.25, 19.47, 22.33].filter((x) => x <= t).length;
  const s = (0.6 + (tagli % 2) * 0.035 + 0.05 * cta) * (1 + colpo);
  const x = 1080 - 1080 * s + 150 - 70 * cta;
  const y = 1920 - 1920 * s + 70;
  const entra = molla(f, 30, 0, 14, 170);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "0 0", transform: `translate(${x}px, ${y + (1 - entra) * 500}px) scale(${s})`, filter: `drop-shadow(0 0 36px ${VIOLA}cc) drop-shadow(0 20px 40px #000c)` }}>
      <OffthreadVideo src={staticFile(`${CART}/C-key.webm`)} transparent muted style={{ width: 1080, height: 1920 }} />
    </div>
  );
};

export const HF3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Sfondo />
      <Barra />
      <C />
      <SceneAlte />
      <Colonna />
      <div style={{ position: "absolute", left: 36, top: 1500, fontFamily: MONO, fontSize: 24, color: "#ffffff77" }}>#adv · link affiliato</div>
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 8, width: `${(f / DURATA_HF3) * 100}%`, background: `linear-gradient(90deg,${VIOLA},${LIME})` }} />
    </AbsoluteFill>
  );
};

// Copertina: gancio + C grande
export const CoverHF3: React.FC = () => (
  <AbsoluteFill>
    <Sfondo />
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "#141318f2", border: "2px solid #ffffff22", borderRadius: 40, padding: "12px 28px", marginBottom: 30 }}>
        <span style={{ color: "#e8825a", fontSize: 38 }}>✳</span>
        <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 34, color: "#fff" }}>Claude</span>
        <span style={{ fontFamily: INTER, fontSize: 32, color: "#ffffff66" }}>×</span>
        <Glifo size={40} />
        <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 34, color: "#fff" }}>Higgsfield</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Riga t="Montaggio" size={150} />
        <Riga t="con un" size={150} />
        <div style={{ marginTop: 18 }}><Riga t="*comando" size={170} box={LIME} col="#0b0a10" /></div>
      </div>
    </div>
    <Img src={staticFile(`${CART}/C-cover.png`)} style={{ position: "absolute", left: 190, top: 900, width: 700, filter: `drop-shadow(0 0 60px ${VIOLA}cc)` }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 80%, #0b0a10 100%)" }} />
  </AbsoluteFill>
);
