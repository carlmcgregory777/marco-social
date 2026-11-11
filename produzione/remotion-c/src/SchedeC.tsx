// Formato «schede + C» (08/11/2026): lo stesso layout di A6 v5, senza fonte, per gli episodi
// dove C parla tutto il video (A8, A9, i prossimi).
//  - schede in ALTO (0-860), C in BASSO con testa e microfono interi; «pieno» = C a tutto schermo
//  - schede agganciate alle parole (attualita/<EP>/montaggio/schede.py → src/<cartella>-schede.ts)
//  - una scheda ogni 2-4 s, nessuna vuota; finale animato
// Mattoni: tit, tre, lista, vs, via, giornale, timbro, grafico (dati veri in s.punti), video (filmato vero della notizia).
import React from "react";
import { AbsoluteFill, Audio, Freeze, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENTO, ANTON, INTER, MANO, MONO, molla, NERO, VERDE, VIOLA } from "./FormatC";

export const F = (s: number) => Math.round(s * 30);
const ROSSO_R = "#e0494f";
const GIALLO = "#ffd84d";
const ZONA_C = 860;
const OUTRO = 2.2;

export type Scheda = { t: number; fino: number; tipo: string; [k: string]: any };
type Parola = [number, string, number];

export type EpisodioC = {
  cartella: string;
  numero: number;
  parole: Parola[];
  chiave: RegExp;
  schede: Scheda[];
  fine: number; // fine dell'ultima parola (s)
  finale: { righe: string[]; nota: string }; // "*parola" = riquadro viola
};

export const durataEpisodio = (e: EpisodioC) => F(e.fine + 0.35 + OUTRO);

const trova = (sc: Scheda[], t: number) => sc.find((x) => t >= x.t && t < x.fino);

// ---------- C che parla ----------
const CParla: React.FC<{ e: EpisodioC }> = ({ e }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const s = trova(e.schede, t);
  const pieno = !s || s.tipo === "pieno";
  const n = e.parole.filter((p, i) => (i === 0 || e.parole[i - 1][2] !== p[2]) && p[0] <= t).length;
  const z = (n % 2 === 0 ? 1.0 : 1.06) + 0.01 * Math.sin(f / 70);
  const stile: React.CSSProperties = pieno
    ? { position: "absolute", left: 0, top: -8, width: 1080, height: 1936 }
    : { position: "absolute", left: 0, top: ZONA_C - 310, width: 1080, height: 1936 };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ ...stile, transform: `scale(${z})`, transformOrigin: "50% 30%" }}>
        <OffthreadVideo src={staticFile(`${e.cartella}/C-parla.mp4`)} muted style={{ width: "100%", height: "100%" }} />
      </div>
    </AbsoluteFill>
  );
};

const ZonaAlta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: ZONA_C + 90 }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${NERO} 0%, #120f22 ${(ZONA_C / (ZONA_C + 90)) * 100 - 6}%, transparent 100%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: ZONA_C, backgroundImage: "linear-gradient(#ffffff0b 2px, transparent 2px), linear-gradient(90deg, #ffffff0b 2px, transparent 2px)", backgroundSize: "60px 60px", backgroundPosition: `0 ${(f * 0.6) % 60}px`, maskImage: "linear-gradient(180deg, #000 70%, transparent)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: ZONA_C, background: `radial-gradient(circle at 50% 45%, ${VIOLA}40, transparent 65%)` }} />
    </div>
  );
};

// ---------- mattoni ----------
const entra = (f: number, fps: number, d: number, k = 0) => molla(f, fps, d + k * 4, 12, 230);

const Riga: React.FC<{ testo: string; size: number }> = ({ testo, size }) => {
  const i = testo.search(/[*!]/);
  if (i < 0) return <span>{testo}</span>;
  const col = testo[i] === "*" ? VIOLA : ROSSO_R;
  return (
    <span>
      {testo.slice(0, i)}
      <span style={{ background: col, padding: `0 ${size * 0.14}px`, borderRadius: size * 0.12, boxShadow: `0 0 50px ${col}aa`, display: "inline-block", lineHeight: 1.0 }}>{testo.slice(i + 1)}</span>
    </span>
  );
};

const Sopra: React.FC<{ d: number; children: React.ReactNode; top?: number }> = ({ d, children, top = 150 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [d, d + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", left: 40, right: 40, top, textAlign: "center", fontFamily: MONO, fontSize: 34, letterSpacing: 5, color: ACCENTO, opacity: o }}>{children}</div>;
};

// la riga più lunga decide il corpo, così nessuna esce dallo schermo
const corpo = (righe: string[], grande?: boolean) => {
  const max = Math.max(...righe.map((r) => r.replace(/[*!]/g, "").length));
  const base = grande ? 200 : righe.length >= 3 ? 122 : 150;
  return Math.min(base, Math.floor(1700 / Math.max(1, max)));
};

const Tit: React.FC<{ s: Scheda; d: number }> = ({ s, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const righe: string[] = s.righe;
  const size = corpo(righe, s.grande);
  const h = righe.length * size * 1.08;
  const top = (s.sopra ? 215 : 150) + (560 - h) / 2 - 30;
  const respiro = 1 + 0.025 * interpolate(f, [d, F(s.fino) - F(s.t) + d], [0, 1], { extrapolateRight: "clamp" });
  return (
    <>
      {s.sopra ? <Sopra d={d}>{s.sopra}</Sopra> : null}
      <div style={{ position: "absolute", left: 30, right: 30, top, textAlign: "center", fontFamily: ANTON, fontSize: size, lineHeight: 1.08, color: "#fff", textTransform: "uppercase", transform: `scale(${respiro})` }}>
        {righe.map((r, k) => {
          const a = entra(f, fps, d, k);
          return (
            <div key={k} style={{ transform: `translateY(${(1 - a) * 90}px) scale(${0.7 + 0.3 * a})`, opacity: Math.min(1, a * 1.8), textShadow: "0 10px 30px #000c" }}>
              <Riga testo={r} size={size} />
            </div>
          );
        })}
      </div>
    </>
  );
};

// voci che entrano una alla volta, ognuna sulla sua parola
const Lista: React.FC<{ s: Scheda; d: number }> = ({ s, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voci = s.voci as [number, string][];
  const passo = Math.min(170, 600 / voci.length);
  const size = Math.min(120, Math.floor(1500 / Math.max(...voci.map((v) => v[1].length))));
  return (
    <>
      {s.sopra ? <Sopra d={d}>{s.sopra}</Sopra> : null}
      {voci.map(([t, testo], k) => {
        const dk = d + F(t) - F(s.t);
        if (f < dk) return null;
        const a = molla(f, fps, dk, 10, 260);
        const ultima = voci.filter(([tt]) => f >= d + F(tt) - F(s.t)).length - 1 === k;
        return (
          <div key={k} style={{ position: "absolute", left: 40, right: 40, top: (s.sopra ? 230 : 170) + k * passo, textAlign: "center", fontFamily: ANTON, fontSize: size, lineHeight: 1, color: ultima ? GIALLO : "#ffffffcc", transform: `translateX(${(1 - a) * (k % 2 ? 300 : -300)}px) scale(${ultima ? 1 : 0.92})`, opacity: Math.min(1, a * 1.6), textShadow: "0 10px 30px #000c" }}>{testo}</div>
        );
      })}
    </>
  );
};

const Riquadro: React.FC<{ d: number; x: number; w: number; titolo: string; sotto: string; esito?: "ok" | "ko"; da?: "sx" | "dx" }> = ({ d, x, w, titolo, sotto, esito, da = "sx" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < d) return null;
  const a = molla(f, fps, d, 12, 230);
  const col = esito === "ko" ? ROSSO_R : esito === "ok" ? VERDE : ACCENTO;
  const timbro = esito ? molla(f, fps, d + 8, 9, 300) : 0;
  const ts = Math.min(104, Math.floor(820 / Math.max(1, titolo.length)));
  return (
    <div style={{ position: "absolute", left: x, top: 190, width: w, height: 420, borderRadius: 32, background: "#15122aee", border: `6px solid ${col}`, boxShadow: `0 24px 70px #000c, 0 0 60px ${col}55`, transform: `translateX(${(1 - a) * (da === "sx" ? -200 : 200)}px) scale(${0.8 + 0.2 * a})`, opacity: Math.min(1, a * 1.7), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20 }}>
      <div style={{ fontFamily: ANTON, fontSize: ts, color: "#fff", lineHeight: 1.05 }}>{titolo}</div>
      {sotto ? <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: sotto.length > 16 ? 42 : 52, color: "#ffffffdd", marginTop: 18, lineHeight: 1.12 }}>{sotto}</div> : null}
      {esito ? <div style={{ position: "absolute", top: -50, right: -26, width: 110, height: 110, borderRadius: 55, background: col, color: "#fff", fontFamily: INTER, fontWeight: 900, fontSize: 70, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${timbro}) rotate(${(1 - timbro) * 90}deg)`, boxShadow: "0 10px 30px #000a" }}>{esito === "ok" ? "✓" : "✗"}</div> : null}
    </div>
  );
};

const Vs: React.FC<{ s: Scheda; d: number }> = ({ s, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const db = d + F(s.t_b ?? s.t + 1.2) - F(s.t);
  const conEsito = s.ko_a || s.ko_b;
  const ea = s.ko_a ? "ko" : s.ko_b ? "ok" : undefined;
  const eb = s.ko_b ? "ko" : s.ko_a ? "ok" : undefined;
  const ne = s.diverso ? molla(f, fps, db + 6, 8, 300) : 0;
  return (
    <>
      <Riquadro d={d} x={40} w={480} titolo={s.a[0]} sotto={s.a[1]} esito={conEsito && f >= db ? ea : undefined} />
      <Riquadro d={db} x={560} w={480} titolo={s.b[0]} sotto={s.b[1]} esito={eb} da="dx" />
      {s.diverso && f >= db ? <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", fontFamily: ANTON, fontSize: 220, color: GIALLO, transform: `scale(${ne})`, textShadow: "0 10px 40px #000" }}>≠</div> : null}
    </>
  );
};

const Via: React.FC<{ s: Scheda; d: number }> = ({ s, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = entra(f, fps, d);
  const riga = interpolate(f, [d + 10, d + 20], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const db = s.t_b !== undefined ? d + F(s.t_b) - F(s.t) : Infinity;
  const b = f >= db ? molla(f, fps, db, 9, 280) : 0;
  const size = Math.min(140, Math.floor(1500 / Math.max(1, s.testo.length)));
  const nsize = s.nuovo ? Math.min(210, Math.floor(1600 / Math.max(1, s.nuovo.length))) : 0;
  return (
    <>
      <div style={{ position: "absolute", left: 30, right: 30, top: s.nuovo ? 170 + b * -10 : 300, textAlign: "center", transform: `scale(${(0.7 + 0.3 * a) * (1 - 0.3 * b)})`, opacity: Math.min(1, a * 1.8) * (1 - 0.45 * b) }}>
        <span style={{ position: "relative", fontFamily: ANTON, fontSize: size, color: "#fff", textShadow: "0 10px 30px #000c" }}>
          {s.testo}
          <span style={{ position: "absolute", left: -20, top: "52%", height: size * 0.12, width: `calc(${riga}% + 40px)`, background: ROSSO_R, borderRadius: 10, transform: "rotate(-4deg)", boxShadow: "0 4px 14px #000a" }} />
        </span>
      </div>
      {s.nuovo && b > 0 ? (
        <div style={{ position: "absolute", left: 30, right: 30, top: 400, textAlign: "center", fontFamily: ANTON, fontSize: nsize, color: GIALLO, transform: `scale(${0.4 + 0.6 * b}) rotate(${(1 - b) * -8}deg)`, textShadow: "0 12px 40px #000" }}>{s.nuovo}</div>
      ) : null}
    </>
  );
};

const Giornale: React.FC<{ s: Scheda; d: number }> = ({ s, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = molla(f, fps, d, 11, 200);
  const deriva = interpolate(f - d, [0, 150], [0, 1], { extrapolateRight: "clamp" });
  const w = interpolate(f, [d + 14, d + 30], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <div style={{ position: "absolute", left: 70, width: 940, top: 170, height: 400, background: "#f4f1ea", borderRadius: 10, boxShadow: "0 30px 80px #000e", transform: `translateY(${(1 - a) * 300}px) rotate(${-2.5 + deriva * 1.2}deg) scale(${1 + deriva * 0.03})`, padding: "34px 50px", color: "#111" }}>
        <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 6, borderBottom: "3px solid #111", paddingBottom: 12 }}>{s.testata}</div>
        <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: s.titolo.length > 40 ? 64 : 76, lineHeight: 1.08, marginTop: 26 }}>{s.titolo}</div>
      </div>
      <div style={{ position: "absolute", left: 90, right: 40, top: 610, fontFamily: MANO, fontWeight: 700, fontSize: 56, color: GIALLO, transform: "rotate(-3deg)", clipPath: `inset(-20% ${100 - w}% -20% 0)`, whiteSpace: "nowrap", textShadow: "0 4px 16px #000" }}>{s.nota}</div>
    </>
  );
};

const Timbro: React.FC<{ s: Scheda; d: number }> = ({ s, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const db = d + F(s.t_b) - F(s.t);
  const a = molla(f, fps, d, 10, 320);
  const b = f >= db ? molla(f, fps, db, 10, 320) : 0;
  const scossa = f >= db && f < db + 8 ? Math.sin(f * 3) * 14 : 0;
  const stampo = (testo: string, col: string, rot: number, k: number, top: number) => (
    <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", opacity: Math.min(1, k * 2) }}>
      <span style={{ display: "inline-block", fontFamily: ANTON, fontSize: 150, color: col, border: `12px solid ${col}`, borderRadius: 24, padding: "0 40px", transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * k})`, textShadow: "0 0 30px #0008", background: "#0b0a10aa" }}>{testo}</span>
    </div>
  );
  return (
    <div style={{ transform: `translateX(${scossa}px)` }}>
      {stampo(s.primo, VERDE, -7, a, 170)}
      {b > 0 ? stampo(s.secondo, ROSSO_R, 5, b, 430) : null}
    </div>
  );
};

// Grafico con dati veri: s.punti = [["2013-01-01", 1498.11], ...] (chiusure mensili)
// s.segni = [{t, i, testo, col}]: etichette che compaiono sulla loro parola, ancorate al punto i
// s.grosso = {t, testo}: scritta grande che entra sulla sua parola
const Grafico: React.FC<{ s: Scheda; d: number }> = ({ s, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const punti = s.punti as [string, number][];
  const vals = punti.map((p) => p[1]);
  const lo = Math.min(...vals) * 0.9, hi = Math.max(...vals) * 1.04;
  const X0 = 70, X1 = 1010, Y0 = 590, Y1 = 250;
  const xy = (i: number): [number, number] => [X0 + ((X1 - X0) * i) / (punti.length - 1), Y0 - ((Y0 - Y1) * (vals[i] - lo)) / (hi - lo)];
  const disegno = s.subito ? 1 : interpolate(f, [d, d + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const n = Math.max(2, Math.round(disegno * punti.length));
  const path = punti.slice(0, n).map((_, i) => xy(i)).map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [lx, ly] = xy(n - 1);
  const area = `${path} L${lx.toFixed(1)},${Y0} L${X0},${Y0} Z`;
  const segni = (s.segni ?? []) as { t: number; i: number; testo: string; col?: string; su?: boolean }[];
  const grosso = s.grosso as { t: number; testo: string } | undefined;
  const dg = grosso ? d + F(grosso.t) - F(s.t) : Infinity;
  const g = f >= dg ? molla(f, fps, dg, 9, 280) : 0;
  const anni = ["2013", "2016", "2019", "2022", "2025"];
  return (
    <>
      <Sopra d={d} top={130}>{s.titolo}</Sopra>
      <svg width={1080} height={ZONA_C} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={VERDE} stopOpacity={0.45} />
            <stop offset="100%" stopColor={VERDE} stopOpacity={0} />
          </linearGradient>
        </defs>
        <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke="#ffffff33" strokeWidth={3} />
        {anni.map((a) => {
          const i = punti.findIndex((p) => p[0].startsWith(a));
          if (i < 0) return null;
          const [x] = xy(i);
          return <text key={a} x={x} y={Y0 + 46} fill="#ffffff88" fontFamily={MONO} fontSize={28} textAnchor="middle">{a}</text>;
        })}
        <path d={area} fill="url(#gArea)" />
        <path d={path} fill="none" stroke={VERDE} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 14px ${VERDE})` }} />
        <circle cx={lx} cy={ly} r={14} fill="#fff" />
        {segni.map((m, k) => {
          const dm = d + F(m.t) - F(s.t);
          if (f < dm) return null;
          const a = molla(f, fps, dm, 10, 260);
          const [x, y] = xy(m.i);
          const col = m.col === "rosso" ? ROSSO_R : m.col === "giallo" ? GIALLO : "#fff";
          const ty = m.su ? y - 60 : y + 80;
          return (
            <g key={k} opacity={Math.min(1, a * 1.6)}>
              <circle cx={x} cy={y} r={16 * a} fill={col} />
              <text x={Math.min(Math.max(x, 140), 940)} y={ty} fill={col} fontFamily={ANTON} fontSize={64 * (0.6 + 0.4 * a)} textAnchor="middle" style={{ paintOrder: "stroke", stroke: "#000", strokeWidth: 10 }}>{m.testo}</text>
            </g>
          );
        })}
      </svg>
      {grosso && g > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", fontFamily: ANTON, fontSize: 230, color: GIALLO, transform: `scale(${0.3 + 0.7 * g}) rotate(${(1 - g) * -10}deg)`, textShadow: "0 12px 40px #000", WebkitTextStroke: "4px #000" }}>{grosso.testo}</div>
      ) : null}
      {s.fonte ? <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: 186, fontFamily: MONO, fontSize: 24, color: "#ffffff77", letterSpacing: 2 }}>{s.fonte}</div> : null}
    </>
  );
};

// ---------- filmato vero della notizia (10/11/2026, Marco: «mostrare rende meglio che spiegare») ----------
// s.src (file in public/<cartella>), s.inizio (s nel file), s.vel, s.tutto (a tutto schermo, C fuori campo),
// s.zoom / s.fx / s.fy (ritaglio), s.righe (titolo Anton, * viola ! rosso), s.falso (titolo «da clip virale»),
// s.etichetta, s.credito, s.ferma (s dopo l'inizio: fermo immagine), s.timbro + s.t_b (timbro rosso sulla parola)
const Filmato: React.FC<{ s: Scheda; d: number; w: number; h: number }> = ({ s, d, w, h }) => {
  const zoom = s.zoom || 1;
  const vw = w * zoom;
  const vh = Math.max((w * zoom * 9) / 16, h);
  const fx = s.fx === undefined ? 0.5 : s.fx;
  const fy = s.fy === undefined ? 0.5 : s.fy;
  const st: React.CSSProperties = { position: "absolute", width: vw, height: vh, left: -(vw - w) * fx, top: -(vh - h) * fy, objectFit: "cover" };
  const v = <OffthreadVideo src={staticFile(s.src)} startFrom={F(s.inizio || 0)} playbackRate={s.vel || 1} muted style={st} />;
  return (
    <Sequence from={d} layout="none">
      {s.ferma ? (
        <>
          <Sequence durationInFrames={F(s.ferma)} layout="none">{v}</Sequence>
          <Sequence from={F(s.ferma)} layout="none"><Freeze frame={F(s.ferma) - 1}>{v}</Freeze></Sequence>
        </>
      ) : v}
    </Sequence>
  );
};

const TimbroVideo: React.FC<{ s: Scheda; d: number; top: number }> = ({ s, d, top }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!s.timbro) return null;
  const db = d + F(s.t_b) - F(s.t);
  if (f < db) return null;
  const k = molla(f, fps, db, 10, 320);
  const size = Math.min(150, Math.floor(1500 / s.timbro.length));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center" }}>
      <span style={{ display: "inline-block", fontFamily: ANTON, fontSize: size, color: ROSSO_R, border: `12px solid ${ROSSO_R}`, borderRadius: 24, padding: "0 36px", transform: `rotate(-6deg) scale(${2.2 - 1.2 * k})`, background: "#0b0a10dd", textTransform: "uppercase", opacity: Math.min(1, k * 2) }}>{s.timbro}</span>
    </div>
  );
};

const TitoloVideo: React.FC<{ s: Scheda; d: number; top: number }> = ({ s, d, top }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!s.righe) return null;
  const righe = s.righe as string[];
  if (s.falso) {
    // come i titoli delle clip virali: fascia nera, testo bianco con le grazie
    const a = Math.min(1, molla(f, fps, d, 14, 200) * 1.4);
    return (
      <div style={{ position: "absolute", left: 50, right: 50, top, opacity: a, background: "#000", padding: "22px 26px", textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 58, lineHeight: 1.15, color: "#fff", boxShadow: "0 12px 40px #000c" }}>
        {righe.map((r, k) => <div key={k}>{r}</div>)}
      </div>
    );
  }
  const size = Math.min(170, Math.floor(1700 / Math.max(...righe.map((r) => r.replace(/[*!]/g, "").length))));
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top, textAlign: "center", fontFamily: ANTON, fontSize: size, lineHeight: 1.1, color: "#fff", textTransform: "uppercase", textShadow: "0 8px 30px #000" }}>
      {righe.map((r, k) => {
        const a = entra(f, fps, d, k);
        return <div key={k} style={{ transform: `scale(${0.6 + 0.4 * a})`, opacity: Math.min(1, a * 1.5) }}><Riga testo={r} size={size} /></div>;
      })}
    </div>
  );
};

const Credito: React.FC<{ testo: string }> = ({ testo }) => (
  <div style={{ position: "absolute", left: 14, bottom: 12, fontFamily: MONO, fontSize: 22, color: "#fff", background: "#000a", borderRadius: 8, padding: "3px 10px" }}>{testo}</div>
);

// filmato nella zona alta, C sotto che parla
const VideoAlto: React.FC<{ s: Scheda; d: number }> = ({ s, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = molla(f, fps, d, 13, 220);
  const W = 1020;
  const H = 574;
  return (
    <>
      <div style={{ position: "absolute", left: 30, top: 108, width: W, height: H, borderRadius: 26, overflow: "hidden", border: "4px solid #ffffff55", boxShadow: `0 24px 70px #000c, 0 0 60px ${VIOLA}66`, transform: `scale(${0.9 + 0.1 * a})`, opacity: Math.min(1, a * 1.6), background: "#000" }}>
        <Filmato s={s} d={d} w={W} h={H} />
        {s.credito ? <Credito testo={s.credito} /> : null}
        {s.etichetta ? <div style={{ position: "absolute", right: 14, top: 12, fontFamily: ANTON, fontSize: 44, color: "#fff", background: s.rosso ? ROSSO_R : VIOLA, borderRadius: 10, padding: "2px 16px", textTransform: "uppercase" }}>{s.etichetta}</div> : null}
      </div>
      <TimbroVideo s={s} d={d} top={300} />
    </>
  );
};

// filmato a tutto schermo: ferma lo scorrimento; C è solo voce
const VideoTutto: React.FC<{ s: Scheda; d: number }> = ({ s, d }) => {
  const f = useCurrentFrame();
  const H = 1160;
  const top = 420;
  const z = 1 + (f - d) * 0.0012;
  return (
    <AbsoluteFill style={{ backgroundColor: "#050508" }}>
      {/* sfondo: lo stesso filmato sfocato, così non restano fasce nere */}
      <AbsoluteFill style={{ overflow: "hidden", filter: "blur(28px) brightness(0.45)", transform: "scale(1.15)" }}>
        <Filmato s={{ ...s, zoom: 3.2 }} d={d} w={1080} h={1920} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, #0b0a10ee 0%, transparent 28%, transparent 80%, #0b0a10 100%)` }} />
      <div style={{ position: "absolute", left: 0, top, width: 1080, height: H, overflow: "hidden", background: "#000", boxShadow: "0 0 80px #000" }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: "50% 50%" }}>
          <Filmato s={{ ...s, zoom: s.zoom || 1.92 }} d={d} w={1080} h={H} />
        </div>
        {s.credito ? <Credito testo={s.credito} /> : null}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 420, background: "linear-gradient(180deg, transparent, #000c)" }} />
      </div>
      <TitoloVideo s={s} d={d} top={s.falso ? 150 : 140} />
      <TimbroVideo s={s} d={d} top={820} />
    </AbsoluteFill>
  );
};

const DISEGNA: Record<string, React.FC<{ s: Scheda; d: number }>> = { tit: Tit, tre: Lista, lista: Lista, vs: Vs, via: Via, giornale: Giornale, timbro: Timbro, grafico: Grafico, video: VideoAlto };

// ---------- sottotitoli: 2 parole alla volta ----------
const Sottotitoli: React.FC<{ e: EpisodioC }> = ({ e }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  if (t > e.fine + 0.3) return null;
  const s = trova(e.schede, t);
  const tutto = !!s && s.tipo === "video" && s.tutto;
  const pieno = !s || s.tipo === "pieno" || tutto;
  const viste = e.parole.filter(([a]) => t >= a);
  if (!viste.length) return null;
  const ult = viste[viste.length - 1];
  const gruppo = e.parole.filter((p) => p[2] === ult[2]);
  const i = gruppo.indexOf(ult);
  const blocco = gruppo.slice(Math.floor(i / 2) * 2, Math.floor(i / 2) * 2 + 2);
  const a = molla(f, fps, F(blocco[0][0]), 12, 320);
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top: tutto ? 1250 : pieno ? 130 : 690, textAlign: "center", fontFamily: INTER, fontWeight: 900, fontSize: tutto ? 96 : pieno ? 118 : 74, lineHeight: 1.0, letterSpacing: -2, transform: `scale(${0.85 + 0.15 * a})`, textShadow: "0 8px 30px #000c" }}>
      {pieno
        ? blocco.map(([s0, p], k) => <div key={k} style={{ color: e.chiave.test(p.toUpperCase()) ? GIALLO : "#fff", opacity: t >= s0 ? 1 : 0, WebkitTextStroke: "3px #0009", paintOrder: "stroke fill" }}>{p.toLowerCase()}</div>)
        : <span>{blocco.map(([s0, p], k) => <span key={k} style={{ color: e.chiave.test(p.toUpperCase()) ? GIALLO : "#fff", opacity: t >= s0 ? 1 : 0 }}>{p.toLowerCase()}{k === 0 ? " " : ""}</span>)}</span>}
    </div>
  );
};

const Blocco: React.FC<{ e: EpisodioC }> = ({ e }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = trova(e.schede, f / fps);
  const tutto = !!s && s.tipo === "video" && s.tutto;
  const diviso = s && s.tipo !== "pieno" && !tutto;
  const El = s ? DISEGNA[s.tipo] : undefined;
  const d = s ? F(s.t) : 0;
  const lampo = s ? interpolate(f - d, [0, 4], [0.28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <AbsoluteFill>
      <CParla e={e} />
      {diviso ? <ZonaAlta /> : <AbsoluteFill style={{ background: "linear-gradient(180deg, #000a 0%, transparent 30%)" }} />}
      {diviso && El ? <div key={s!.t} style={{ position: "absolute", inset: 0 }}><El s={s!} d={d} /></div> : null}
      {tutto ? <div key={s!.t} style={{ position: "absolute", inset: 0 }}><VideoTutto s={s!} d={d} /></div> : null}
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: lampo, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

const Finale: React.FC<{ e: EpisodioC }> = ({ e }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = molla(f, fps, 0, 12, 200);
  const b = molla(f, fps, 10, 9, 300);
  const c = molla(f, fps, 24, 12, 220);
  const z = 1 + f * 0.0025;
  const pulsa = 1 + 0.04 * Math.sin(f / 3);
  const righe = e.finale.righe;
  const size = Math.min(150, Math.floor(1700 / Math.max(...righe.map((r) => r.replace("*", "").length))));
  return (
    <AbsoluteFill style={{ backgroundColor: NERO, backgroundImage: `radial-gradient(circle at 50% 45%, ${VIOLA}88, ${NERO} 70%)`, opacity: Math.min(1, a * 1.5) }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 560, textAlign: "center", fontFamily: ANTON, fontSize: size, lineHeight: 1.12, color: "#fff", textTransform: "uppercase", transform: `scale(${z})`, textShadow: "0 10px 40px #000" }}>
        {righe.map((r, k) => {
          const i = r.indexOf("*");
          const ultima = k === righe.length - 1;
          const st = ultima ? { transform: `scale(${0.3 + 0.7 * b})` } : { transform: `translateY(${(1 - a) * (-120 + k * 60)}px)` };
          return (
            <div key={k} style={st}>
              {i < 0 ? r : <>{r.slice(0, i)}<span style={{ display: "inline-block", background: VIOLA, padding: "0 26px", borderRadius: 20, lineHeight: 1.0, transform: `scale(${pulsa}) rotate(-2deg)`, boxShadow: `0 0 80px ${ACCENTO}` }}>{r.slice(i + 1)}</span></>}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1180, textAlign: "center", fontFamily: MANO, fontWeight: 700, fontSize: 70, color: GIALLO, transform: `scale(${c}) rotate(-3deg)` }}>{e.finale.nota}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1320, textAlign: "center", fontFamily: MONO, fontSize: 40, letterSpacing: 4, color: "#ffffffcc", opacity: c }}>@cthe.trader</div>
    </AbsoluteFill>
  );
};

export const ReelSchedeC: React.FC<{ e: EpisodioC }> = ({ e }) => {
  const dur = durataEpisodio(e);
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: NERO, fontFamily: INTER }}>
      <Blocco e={e} />
      <Sottotitoli e={e} />
      <Sequence from={F(e.fine + 0.35)}>
        <Finale e={e} />
      </Sequence>
      <div style={{ position: "absolute", left: 50, top: 70, fontFamily: MONO, fontSize: 26, color: "#ffffffbb", letterSpacing: 3, textShadow: "0 2px 8px #000" }}>ATTUALITÀ DI C · #{e.numero}</div>
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 45%, transparent 62%, #0009 100%)" }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 8, width: `${(f / dur) * 100}%`, background: `linear-gradient(90deg,${VIOLA},${ACCENTO})` }} />
      <Audio src={staticFile(`${e.cartella}/voce.wav`)} volume={1} />
      <Audio src={staticFile(`${e.cartella}/musica.wav`)} volume={0.06} />
      <Audio src={staticFile(`${e.cartella}/sfx.wav`)} volume={0.35} />
    </AbsoluteFill>
  );
};

export const CoverSchedeC: React.FC<{ cartella: string }> = ({ cartella }) => (
  <AbsoluteFill style={{ backgroundColor: NERO }}>
    <Img src={staticFile(`${cartella}/cover-frame.png`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }} />
  </AbsoluteFill>
);
