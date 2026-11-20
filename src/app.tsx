import { Page, useState, useMemo, useEffect, useRef, type ChangeEvent, type CSSProperties } from "./kit";
import Starfield from "./starfield";
import { soundEnabled, setSoundEnabled, playFlip, playReveal, playNote, noteAt, playPiano } from "./sound";
import {
  Q, PO, FN, AXN, EN, INS, GL, AGES, DISCLAIMER, MODE_META,
  type Ans, type Item, type PItem, type Fact, type Mode, type Presentation,
  questionsFor, includesPlayoffs, answersForMode, present, pk2, h2hOf,
} from "./model";
import { buildReading, type Reading, type ReadingBlock } from "./profiles";

const PAPER = "#171E42", PAPER2 = "#1B2350", WASH = "rgba(232,200,120,0.14)", INK = "#EDE7D3", MUTED = "#9AA3C7", DIM = "#6E76A3", SUN = "#E8C878", WARN = "#D96A5A", TRACK = "#232B52";
const GOLD = "#D8B25C";
const GOLD_MID = "#D8A84E";
const GOLD_DEEP = "#C9962E";
const HAIR = "rgba(216,178,92,0.25)";
const SERIF = 'Georgia, "Times New Roman", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif';
const SITE = "wr050429.github.io/renshe-typology-test";

type ShareCard = { name: string; code: string; stack: string; note: string; heading: string; subtitle: string; axes: { label: string; value: number }[]; enn: Fact[]; ins: Fact[]; warns: string[]; footer: string; done: number; total: number; seed: number };

function hashStr(s: string): number { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

// 种子随机数与洗牌（旧版 app.tsx 原样恢复：28a520d 重构时误删了这两段定义，
// 但 paintCard、题目顺序、加赛顺序三处仍在调用，导致首屏渲染直接抛错白屏）
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function shuffle<T>(arr: T[], r: () => number): T[] { const b = arr.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = b[i]; b[i] = b[j]; b[j] = t; } return b; }

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const lines: string[] = [];
  text.split("\n").forEach((para: string) => {
    if (!para) { lines.push(""); return; }
    const toks: string[] = para.match(/[\x21-\x7e]+|\s+|[^\s\x21-\x7e]/g) || [para];
    let line = "";
    toks.forEach((tk: string) => {
      const trial = line + tk;
      if (line && ctx.measureText(trial).width > maxW) { lines.push(line.replace(/\s+$/, "")); line = tk.replace(/^\s+/, ""); } else line = trial;
      while (line.length > 1 && ctx.measureText(line).width > maxW) { let k = line.length - 1; while (k > 1 && ctx.measureText(line.slice(0, k)).width > maxW) k--; lines.push(line.slice(0, k)); line = line.slice(k); }
    });
    if (line) lines.push(line);
  });
  return lines.length ? lines : [""];
}

function paintCard(ctx: CanvasRenderingContext2D, d: ShareCard, H: number, real: boolean): number {
  const W = 1080, pad = 96, maxW = W - pad * 2;
  const f = (size: number, italic?: boolean): void => { ctx.font = `${italic ? "italic " : ""}400 ${size}px ${SERIF}`; };
  const spaced = (t: string, x: number, yy: number, sp: number, align: string): void => {
    const chars = Array.from(t); let w = 0;
    chars.forEach((c: string) => { w += ctx.measureText(c).width; });
    w += sp * Math.max(0, chars.length - 1);
    let cx = align === "left" ? x : align === "right" ? x - w : x - w / 2;
    chars.forEach((c: string) => { ctx.fillText(c, cx, yy); cx += ctx.measureText(c).width + sp; });
  };
  // 金色规则线：笔直的几何直线
  const rule = (yy: number, lw: number): void => {
    ctx.strokeStyle = GOLD; ctx.lineWidth = lw; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(pad, yy); ctx.lineTo(pad + maxW, yy); ctx.stroke();
  };
  const cen = (t: string, yy: number): void => { ctx.fillText(t, (W - ctx.measureText(t).width) / 2, yy); };
  const figHead = (x: number, w: number, yy: number, no: string, title: string, latin: string): void => {
    f(16); ctx.fillStyle = INK; spaced(`${no} · ${title}`, x, yy, 4, "left");
    f(17, true); ctx.fillStyle = DIM; ctx.fillText(latin, x + w - ctx.measureText(latin).width, yy);
  };
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  if (real) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0D1230"); g.addColorStop(1, "#141B3D");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const r = rng(d.seed);
    const n = Math.round((W * H) / 80);
    for (let i = 0; i < n; i++) {
      const a = 0.15 + r() * 0.6; const s = 0.6 + r() * 1.4;
      ctx.fillStyle = r() < 0.3 ? `rgba(216,178,92,${a.toFixed(3)})` : `rgba(237,231,211,${a.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(r() * W, r() * H, s, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.strokeRect(40, 40, W - 80, H - 80);
    ctx.lineWidth = 0.8; ctx.strokeRect(50, 50, W - 100, H - 100);
  }
  let y = 84;
  f(16); ctx.fillStyle = INK; spaced(d.heading || "人设类型学合测 · 轴向版", pad, y, 5, "left"); spaced("PL. I", W - pad, y, 4, "right");
  y += 32; rule(y, 1.2);
  y += 14; f(17, true); ctx.fillStyle = DIM; ctx.fillText(d.subtitle || "Specimen personae · 八维 × 九型 × 本能", pad, y);
  const prog = `已答 ${d.done} / ${d.total}`; ctx.fillText(prog, W - pad - ctx.measureText(prog).width, y);
  y += 70;
  if (d.name) { f(36); ctx.fillStyle = MUTED; wrapText(ctx, d.name, maxW).forEach((l: string) => { cen(l, y); y += 48; }); y += 10; }
  const code = d.code || "· · · ·";
  let size = d.code ? (d.code.length <= 4 ? 190 : 118) : 120;
  f(size); while (size > 40 && ctx.measureText(code).width > maxW) { size -= 4; f(size); }
  ctx.fillStyle = d.code ? INK : DIM; cen(code, y); y += Math.round(size * 1.06);
  if (d.stack) { f(34, true); ctx.fillStyle = MUTED; wrapText(ctx, d.stack, maxW).forEach((l: string) => { cen(l, y); y += 46; }); }
  y += 8; f(19); ctx.fillStyle = DIM;
  wrapText(ctx, d.note, maxW - 120).forEach((l: string) => { spaced(l, W / 2, y, 3, "center"); y += 30; });
  y += 20;
  // 标题处的小星座分隔符：五颗星，中间最亮、两边渐淡的递进式鎏金
  (() => {
    const pts: [number, number][] = [[W / 2 - 70, y + 8], [W / 2 - 35, y], [W / 2, y + 10], [W / 2 + 35, y + 2], [W / 2 + 70, y + 8]];
    ctx.strokeStyle = "rgba(216,178,92,0.7)"; ctx.lineWidth = 1; ctx.lineCap = "round";
    ctx.beginPath();
    pts.forEach(([x, yy], i) => {
      if (i === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
    });
    ctx.stroke();
    const tiers = [
      { c: "rgba(201,150,46,0.45)", r: 2.5 },
      { c: "rgba(216,178,92,0.7)", r: 2.8 },
      { c: "rgba(232,200,120,1)", r: 3.8 },
      { c: "rgba(216,178,92,0.7)", r: 2.8 },
      { c: "rgba(201,150,46,0.45)", r: 2.5 },
    ];
    ctx.fillStyle = "rgba(232,200,120,0.15)";
    ctx.beginPath(); ctx.arc(W / 2, y + 10, 9, 0, Math.PI * 2); ctx.fill();
    pts.forEach(([x, yy], i) => { ctx.fillStyle = tiers[i].c; ctx.beginPath(); ctx.arc(x, yy, tiers[i].r, 0, Math.PI * 2); ctx.fill(); });
  })();
  y += 46;
  rule(y, 1.2); rule(y + 5, 0.6); y += 38;
  if (d.axes.length) {
    figHead(pad, maxW, y, "FIG. I", "功能轴", "axes functionum"); y += 46;
    d.axes.forEach((a: { label: string; value: number }) => {
      f(26, true); ctx.fillStyle = INK; ctx.fillText(a.label, pad, y);
      const val = String(Math.round(a.value)); f(26); ctx.fillText(val, W - pad - ctx.measureText(val).width, y);
      const bx = pad + 140, bw = maxW - 140 - 76, by = y + 7, bh = 16;
      ctx.fillStyle = TRACK; ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = GOLD; ctx.fillRect(bx, by, bw * Math.max(0, Math.min(1, a.value / 100)), bh);
      ctx.strokeStyle = GOLD; ctx.lineWidth = 0.8; ctx.strokeRect(bx, by, bw, bh);
      ctx.fillStyle = "rgba(216,178,92,0.5)";
      [0.25, 0.5, 0.75].forEach((t: number) => { ctx.fillRect(bx + bw * t, by - 6, 1, 6); ctx.fillRect(bx + bw * t, by + bh, 1, 6); });
      y += 54;
    });
    y += 10; rule(y, 0.6); y += 36;
  }
  const gap = 56, both = d.enn.length > 0 && d.ins.length > 0;
  const colW = both ? (maxW - gap) / 2 : maxW;
  const y0 = y;
  const col = (x: number, yy: number, no: string, title: string, latin: string, items: Fact[]): number => {
    if (!items.length) return yy;
    figHead(x, colW, yy, no, title, latin); yy += 48;
    items.forEach((it: Fact) => {
      f(15); ctx.fillStyle = DIM; spaced(it.label, x, yy, 3, "left"); yy += 24;
      f(28); ctx.fillStyle = INK; wrapText(ctx, it.value, colW).forEach((l: string) => { ctx.fillText(l, x, yy); yy += 38; });
      yy += 14;
    });
    return yy;
  };
  let yl = y0, yr = y0;
  if (d.enn.length && d.ins.length) {
    yl = col(pad, y0, "FIG. II", "九型", "enneagramma", d.enn);
    yr = col(pad + colW + gap, y0, "FIG. III", "本能", "instinctus", d.ins);
    ctx.fillStyle = "rgba(216,178,92,0.35)"; ctx.fillRect(pad + colW + gap / 2, y0, 0.8, Math.max(yl, yr) - y0 - 14);
    y = Math.max(yl, yr) + 6;
  } else if (d.enn.length) {
    y = col(pad, y0, "FIG. II", "九型", "enneagramma", d.enn) + 6;
  } else if (d.ins.length) {
    y = col(pad, y0, "FIG. III", "本能", "instinctus", d.ins) + 6;
  }
  f(16, true); ctx.fillStyle = DIM;
  wrapText(ctx, "详细解读见原页，本图只保留测量结果。", maxW).forEach((l: string) => { ctx.fillText(l, pad, y); y += 26; });
  y += 8;
  if (d.warns.length) {
    rule(y, 0.6); y += 28;
    f(16); ctx.fillStyle = WARN; spaced("※ 提醒 · CAVEAT", pad, y, 4, "left"); y += 38;
    f(21);
    d.warns.forEach((w: string) => { ctx.fillText("—", pad, y); wrapText(ctx, w, maxW - 32).forEach((l: string) => { ctx.fillText(l, pad + 32, y); y += 32; }); y += 8; });
    y += 6;
  }
  y += 14; rule(y, 1.2); y += 20;
  f(17, true); ctx.fillStyle = DIM; ctx.fillText(d.footer, pad, y);
  const rt = "本图在本机生成，结果未上传"; f(16); ctx.fillText(rt, W - pad - ctx.measureText(rt).width, y);
  return y + 100;
}

function drawResultCard(d: ShareCard): HTMLCanvasElement {
  const scratch = document.createElement("canvas"); scratch.width = 1080; scratch.height = 200;
  const m = scratch.getContext("2d"); if (!m) throw new Error("canvas");
  const H = Math.ceil(paintCard(m, d, 0, false));
  const dpr = 2; const c = document.createElement("canvas"); c.width = 1080 * dpr; c.height = H * dpr;
  const ctx = c.getContext("2d"); if (!ctx) throw new Error("canvas");
  ctx.scale(dpr, dpr); paintCard(ctx, d, H, true);
  return c;
}

const opt = (sel: boolean): CSSProperties => ({ display: "block", width: "100%", boxSizing: "border-box", textAlign: "left", whiteSpace: "normal", wordBreak: "break-word", padding: "10px 14px", marginTop: 8, borderRadius: 1, border: `1px solid ${sel ? GOLD : "rgba(216,178,92,0.30)"}`, boxShadow: sel ? `inset 3px 0 0 ${SUN}, 0 0 12px rgba(232,200,120,0.18)` : "none", background: sel ? WASH : "transparent", color: INK, fontFamily: SERIF, fontSize: 15.5, lineHeight: 1.6, cursor: "pointer" });
const chip = (sel: boolean): CSSProperties => ({ display: "inline-block", padding: "5px 10px", borderRadius: 0, border: `1px solid ${sel ? GOLD : HAIR}`, background: sel ? WASH : "transparent", color: sel ? INK : MUTED, fontFamily: SERIF, fontSize: 13, lineHeight: 1.45, textAlign: "left", whiteSpace: "normal", cursor: "pointer" });
const pbtn = (primary: boolean): CSSProperties => ({ padding: "9px 16px", borderRadius: 0, border: `1px solid ${GOLD}`, background: primary ? GOLD : "transparent", color: primary ? "#0D1230" : INK, fontFamily: SERIF, fontSize: 14.5, letterSpacing: "0.08em", cursor: "pointer" });
const tag: CSSProperties = { fontSize: 12, letterSpacing: "0.22em", color: DIM };

const head = (no: string, title: string, latin: string, cap?: string) => (
  <div style={{ marginTop: 44 }}>
    <div style={{ borderTop: `1px solid ${GOLD}`, borderBottom: `1px solid ${GOLD}`, height: 3 }} />
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "2px 16px", padding: "10px 0 4px" }}>
      <span style={tag}>{no}</span>
      <span style={{ fontStyle: "italic", fontSize: 13, color: DIM }}>{latin}</span>
    </div>
    <div style={{ fontSize: 26, lineHeight: 1.3, color: INK, letterSpacing: "0.04em" }}>{title}</div>
    {cap ? <div style={{ fontSize: 13, color: MUTED, marginTop: 4, lineHeight: 1.6 }}>{cap}</div> : null}
  </div>
);
const tbl = (cols: string[], rows: string[][], right: number) => (
  <div style={{ overflowX: "auto", marginTop: 14 }}>
    <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14, color: INK, fontFamily: SERIF }}>
      <thead><tr>{cols.map((c: string, i: number) => <th key={i} style={{ textAlign: i >= right ? "right" : "left", padding: "6px 8px", fontWeight: 400, fontSize: 12, letterSpacing: "0.12em", color: DIM, borderTop: `1px solid ${GOLD}`, borderBottom: `1px solid ${GOLD}`, whiteSpace: "nowrap" }}>{c}</th>)}</tr></thead>
      <tbody>{rows.map((r: string[], j: number) => <tr key={j}>{r.map((c: string, i: number) => <td key={i} style={{ textAlign: i >= right ? "right" : "left", padding: "6px 8px", borderBottom: `1px solid ${j === rows.length - 1 ? GOLD : HAIR}`, fontVariantNumeric: "tabular-nums" }}>{c}</td>)}</tr>)}</tbody>
    </table>
  </div>
);
const bar = (label: string, v: number, key: string) => (
  <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${HAIR}` }}>
    <span style={{ width: 58, flex: "0 0 auto", fontStyle: "italic", fontSize: 16 }}>{label}</span>
    <div style={{ flex: "1 1 auto", minWidth: 0, position: "relative", height: 12, boxSizing: "border-box", background: TRACK, border: `1px solid ${GOLD}` }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.max(0, Math.min(100, v))}%`, background: GOLD }} />
      {[25, 50, 75].map((t: number) => <div key={t} style={{ position: "absolute", left: `${t}%`, top: -5, height: 4, width: 1, background: "rgba(216,178,92,0.5)" }} />)}
    </div>
    <span style={{ width: 34, flex: "0 0 auto", textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 15 }}>{Math.round(v)}</span>
  </div>
);
const fact = (label: string, value: string) => (
  <div key={label} style={{ padding: "8px 0", borderBottom: `1px solid ${HAIR}` }}>
    <div style={{ fontSize: 11.5, letterSpacing: "0.2em", color: DIM }}>{label}</div>
    <div style={{ fontSize: 18, lineHeight: 1.45, marginTop: 2, wordBreak: "break-word" }}>{value}</div>
  </div>
);

// 是否偏好减少动态：动画只画静态最终帧
function prefersReduced(): boolean {
  try {
    return typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}
// 直线四角星芒
function sparkle(x: number, y: number, len: number): string {
  return `M ${x},${(y - len).toFixed(1)} L ${x},${(y + len).toFixed(1)} M ${(x - len).toFixed(1)},${y} L ${(x + len).toFixed(1)},${y}`;
}
// 三颗光晕递进：由外向内加深、加亮、加浓，中心如星核。
const HALO_TIERS = [
  { id: "haloOuter", color: SUN, opacity: 0.34, extra: 10 },
  { id: "haloMid", color: GOLD_MID, opacity: 0.55, extra: 13 },
  { id: "haloInner", color: GOLD_DEEP, opacity: 0.8, extra: 16 },
];

// 个人星图（结果页 PL. I 顶部）：三圈同心轨道，外圈八维、中圈九型、内圈本能。
// 动态星轨：环上星点沿各自的环缓慢公转（外慢内快、方向不同）；三颗最强星另在中心附近做三体舞动
// （三条不同椭圆轨道、不同周期与相位，参数化轨道，非引力仿真），彼此连淡淡的金色三角线。
// 光晕跟着各自的星走；三颗光晕由外向内递进（香槟金 0.34 / 金 0.55 / 深鎏金 0.8）。
function StarMap(props: { f: Record<string, number>; e: Record<string, number>; i: Record<string, number>; stack: string[]; showF?: boolean; showE?: boolean; showI?: boolean }) {
  const CX = 200, CY = 200;
  const [reduced] = useState<boolean>(() => prefersReduced());
  const [t, setT] = useState<number>(0);
  const tRef = useRef<number>(0);
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = 0;
    let lastSet = 0;
    const step = (now: number): void => {
      if (!document.hidden) {
        if (!last) last = now;
        const dt = Math.min(0.1, (now - last) / 1000);
        last = now;
        tRef.current += dt;
        if (now - lastSet >= 50) { lastSet = now; setT(tRef.current); }
      } else {
        last = 0;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);
  const showF = props.showF !== false, showE = props.showE !== false, showI = props.showI !== false;
  const raw = [
    showF ? { r: 170, name: "八维", items: FN.map((k: string) => ({ label: k, v: props.f[k] || 0 })), speed: (2 * Math.PI) / 120, kind: "f" } : null,
    showE ? { r: 115, name: "九型", items: EN.map((k: string) => ({ label: k.slice(1), v: props.e[k] || 0 })), speed: -(2 * Math.PI) / 80, kind: "e" } : null,
    showI ? { r: 60, name: "本能", items: INS.map((k: string) => ({ label: k, v: props.i[k] || 0 })), speed: (2 * Math.PI) / 50, kind: "i" } : null,
  ].filter(Boolean) as { r: number; name: string; items: { label: string; v: number }[]; speed: number; kind: string }[];
  const radii = raw.length === 3 ? [170, 115, 60] : raw.length === 2 ? [150, 80] : [115];
  const rings = raw.map((ring, i) => ({ ...ring, r: radii[i] }));
  const eightRing = rings.find((r) => r.kind === "f");
  const pt = (r: number, j: number, n: number, speed: number): [number, number] => {
    const a = (-90 + (j * 360) / n) * (Math.PI / 180) + speed * t;
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
  };
  const angOf = (j: number, n: number, speed: number): number => (-90 + (j * 360) / n) * (Math.PI / 180) + speed * t;
  const tops = rings.map((ring) => {
    let bi = 0;
    ring.items.forEach((it, j) => { if (it.v > ring.items[bi].v) bi = j; });
    return bi;
  });
  const stackPts = eightRing
    ? props.stack
      .map((k: string) => FN.indexOf(k))
      .filter((j: number) => j >= 0)
      .map((j: number) => pt(eightRing.r, j, 8, eightRing.speed))
    : [];
  // 中心三体舞动：三颗金点（取三圈最强星的 tier 色），三条椭圆轨道、不同周期与相位
  const TRIO = [
    { a: 48, b: 24, w: (2 * Math.PI) / 9, ph: 0, tier: 0 },
    { a: 36, b: 30, w: -(2 * Math.PI) / 13, ph: 2.1, tier: 1 },
    { a: 26, b: 18, w: (2 * Math.PI) / 7, ph: 4.2, tier: 2 },
  ];
  const trioPts = TRIO.map((o) => [CX + o.a * Math.cos(o.w * t + o.ph), CY + o.b * Math.sin(o.w * t + o.ph)] as [number, number]);
  return (
    <svg viewBox="0 0 400 400" role="img" aria-label="个人星图" style={{ display: "block", width: "100%", maxWidth: 400, height: "auto", margin: "6px auto 0" }}>
      <defs>
        <radialGradient id="haloOuter">
          <stop offset="0%" stopColor={SUN} stopOpacity="1" />
          <stop offset="55%" stopColor={SUN} stopOpacity="0.45" />
          <stop offset="100%" stopColor={SUN} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="haloMid">
          <stop offset="0%" stopColor={GOLD_MID} stopOpacity="1" />
          <stop offset="55%" stopColor={GOLD_MID} stopOpacity="0.45" />
          <stop offset="100%" stopColor={GOLD_MID} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="haloInner">
          <stop offset="0%" stopColor={GOLD_DEEP} stopOpacity="1" />
          <stop offset="45%" stopColor={GOLD_DEEP} stopOpacity="0.5" />
          <stop offset="100%" stopColor={GOLD_DEEP} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="coreGlow">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.08" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="stackGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={SUN} />
          <stop offset="100%" stopColor={GOLD_DEEP} />
        </linearGradient>
      </defs>
      <circle cx={CX} cy={CY} r={192} fill="url(#coreGlow)" />
      {rings.map((ring, ri) => (
        <g key={ri}>
          <circle cx={CX} cy={CY} r={ring.r} fill="none" stroke="rgba(216,178,92,0.4)" strokeWidth="1" />
          <text x={CX} y={CY - ring.r + 18} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontStyle="italic" fill={GOLD} fontFamily={SERIF}>{ring.name}</text>
        </g>
      ))}
      <polygon points={trioPts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")} fill="none" stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.35" />
      {trioPts.map(([x, y], k) => {
        const tier = HALO_TIERS[TRIO[k].tier];
        return (
          <g key={`trio-${k}`}>
            <circle cx={x} cy={y} r={11} fill={`url(#${tier.id})`} fillOpacity={tier.opacity * 0.8} />
            <circle cx={x} cy={y} r={3.5} fill={tier.color} />
          </g>
        );
      })}
      <circle cx={CX} cy={CY} r="3" fill={GOLD} />
      {stackPts.length > 1 ? (
        <polyline points={stackPts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")} fill="none" stroke="url(#stackGold)" strokeWidth="1.2" strokeOpacity="0.75" strokeLinejoin="round" strokeLinecap="round" />
      ) : null}
      {rings.map((ring, ri) =>
        ring.items.map((it, j) => {
          const [x, y] = pt(ring.r, j, ring.items.length, ring.speed);
          const vv = Math.max(0, Math.min(100, it.v));
          const dotR = 2.5 + (vv / 100) * 5;
          const op = 0.4 + (vv / 100) * 0.6;
          const isTop = tops[ri] === j;
          const tier = HALO_TIERS[ri];
          const ang = angOf(j, ring.items.length, ring.speed);
          const lx = CX + (ring.r + dotR + 11) * Math.cos(ang);
          const ly = CY + (ring.r + dotR + 11) * Math.sin(ang);
          const anchor = lx < CX - 4 ? "end" : lx > CX + 4 ? "start" : "middle";
          const tick = !isTop && j % 3 === 0 && Math.sin(ang) > 0.3;
          return (
            <g key={`${ri}-${j}`}>
              {isTop ? <circle cx={x} cy={y} r={dotR + tier.extra} fill={`url(#${tier.id})`} fillOpacity={tier.opacity} /> : null}
              {isTop ? <circle cx={x} cy={y} r={dotR + 5} fill="none" stroke={tier.color} strokeWidth="1" strokeOpacity={tier.opacity} /> : null}
              {isTop ? <path d={sparkle(x, y, dotR + 9)} fill="none" stroke={tier.color} strokeWidth="1" strokeOpacity={tier.opacity} strokeLinecap="round" /> : null}
              {tick ? <path d={`M ${x},${(y - dotR - 7).toFixed(1)} L ${x},${(y - dotR - 2).toFixed(1)} M ${(x - 2.5).toFixed(1)},${(y - dotR - 4.5).toFixed(1)} L ${(x + 2.5).toFixed(1)},${(y - dotR - 4.5).toFixed(1)}`} stroke="rgba(216,178,92,0.4)" strokeWidth="0.8" strokeLinecap="round" /> : null}
              <circle cx={x} cy={y} r={dotR} fill={isTop || it.v >= 50 ? GOLD : "#EDE7D3"} fillOpacity={op} />
              <text x={lx} y={ly} textAnchor={anchor} dominantBaseline="middle" fontSize="11" fill={isTop ? GOLD : INK} fillOpacity={isTop ? 1 : 0.75} fontFamily={SERIF}>{it.label}</text>
            </g>
          );
        })
      )}
    </svg>
  );
}

// 封面天文环（浑天仪）：三圈同心圆环，半径呼应星图 170/115/60 的比例。
// 入场：圆环依次描绘（stroke-dashoffset，约 1 秒）→ 整组极缓慢旋转 → 标签淡入 → 标题淡入；
// 总时长 1.5 秒内；prefers-reduced-motion 时直接显示最终态，无动画。
const ARM_CX = 160, ARM_CY = 160;
const ARM_RINGS = [
  { r: 136, label: "八维", stars: [[-30, 3.5], [150, 2.5]] as [number, number][] },
  { r: 92, label: "九型", stars: [[60, 3], [210, 2.5]] as [number, number][] },
  { r: 48, label: "本能", stars: [[-90, 3]] as [number, number][] },
];
function Armillary(props: { reduced: boolean }) {
  const reduced = props.reduced;
  return (
    <svg viewBox="0 0 320 320" role="img" aria-label="天文环" style={{ display: "block", width: "min(300px, 78vw)", height: "auto", margin: "10px auto 0" }}>
      <style>{`@keyframes armDraw { to { stroke-dashoffset: 0; } } @keyframes armSpin { to { transform: rotate(360deg); } } @keyframes armFade { from { opacity: 0; } to { opacity: 1; } }`}</style>
      <g style={reduced ? undefined : { transformBox: "view-box", transformOrigin: "160px 160px", animation: "armSpin 240s linear 1s infinite" }}>
        {ARM_RINGS.map((ring, ri) => {
          const C = 2 * Math.PI * ring.r;
          return (
            <circle key={`r${ri}`} cx={ARM_CX} cy={ARM_CY} r={ring.r} fill="none" stroke="rgba(216,178,92,0.45)" strokeWidth="1"
              style={reduced ? undefined : { strokeDasharray: C, strokeDashoffset: C, animation: `armDraw 0.35s ease-out ${ri * 0.3}s forwards` }} />
          );
        })}
        {ARM_RINGS.map((ring, ri) => ring.stars.map(([deg, sr], si) => {
          const a = (deg * Math.PI) / 180;
          return <circle key={`s${ri}-${si}`} cx={ARM_CX + ring.r * Math.cos(a)} cy={ARM_CY + ring.r * Math.sin(a)} r={sr} fill={GOLD} />;
        }))}
        {ARM_RINGS.map((ring, ri) => [45, 135, 225, 315].map((deg) => {
          const a = (deg * Math.PI) / 180;
          return <line key={`k${ri}-${deg}`} x1={ARM_CX + (ring.r - 4) * Math.cos(a)} y1={ARM_CY + (ring.r - 4) * Math.sin(a)} x2={ARM_CX + (ring.r + 4) * Math.cos(a)} y2={ARM_CY + (ring.r + 4) * Math.sin(a)} stroke="rgba(216,178,92,0.5)" strokeWidth="1" strokeLinecap="round" />;
        }))}
      </g>
      <circle cx={ARM_CX} cy={ARM_CY} r={3.5} fill={GOLD} />
      {ARM_RINGS.map((ring, ri) => (
        <text key={`t${ri}`} x={ARM_CX} y={ARM_CY - ring.r + 16} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontStyle="italic" fill={GOLD} fontFamily={SERIF}
          style={reduced ? undefined : { opacity: 0, animation: `armFade 0.4s ease-out ${1.05 + ri * 0.08}s forwards` }}>{ring.label}</text>
      ))}
    </svg>
  );
}

type Shot = { url: string; blob: Blob };
type StepItem = { kind: "q"; q: Item; opts: { i: number; t: string }[] } | { kind: "p"; p: PItem; n: number };
const quiet: CSSProperties = { background: "transparent", border: "none", padding: 0, color: MUTED, fontFamily: SERIF, fontSize: 13.5, fontStyle: "italic", textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer" };


function ReadingPanel(reading: Reading | null) {
  if (!reading) return null;
  const sum: CSSProperties = { cursor: "pointer", listStyle: "none", color: INK, fontFamily: SERIF, fontSize: 16, lineHeight: 1.5, padding: "10px 0" };
  const fold = (block: ReadingBlock, open: boolean) => (
    <details key={block.id} open={open} style={{ marginTop: 10, borderBottom: `1px solid ${HAIR}`, paddingBottom: 8 }}>
      <summary style={sum}>
        <span style={{ letterSpacing: "0.04em" }}>{block.title}</span>
        <span style={{ display: "block", fontSize: 12.5, letterSpacing: "0.12em", color: block.locked ? SUN : DIM, marginTop: 4 }}>{block.badge}</span>
      </summary>
      {block.sections.map((s) => (
        <div key={s.title} style={{ marginTop: 12, paddingBottom: 8 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.2em", color: DIM }}>{s.title}</div>
          <div style={{ fontSize: 15.5, lineHeight: 1.75, marginTop: 6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{s.body}</div>
        </div>
      ))}
    </details>
  );
  const firstLocked = reading.blocks.find((b) => b.locked);
  return (
    <div>
      {head("§ 解读", "详细解读", "interpretatio", "免费，无付费墙。先看测量证据，再对照理论档案。")}
      <div style={{ marginTop: 12, fontSize: 14.5, lineHeight: 1.75, color: MUTED }}>{reading.disclaimer}</div>
      <div style={{ marginTop: 18, border: `1px solid ${GOLD}`, padding: "12px 14px", background: PAPER2 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.2em", color: DIM }}>本次测量 · 与理论解释分开</div>
        {reading.measured.map((x: Fact) => (
          <div key={x.label} style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", marginTop: 8, fontSize: 14.5, lineHeight: 1.6 }}>
            <span style={{ color: DIM, minWidth: 96 }}>{x.label}</span>
            <span style={{ flex: "1 1 180px", minWidth: 0, wordBreak: "break-word" }}>{x.value}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, fontSize: 14.5, lineHeight: 1.75, color: MUTED, fontStyle: "italic" }}>{reading.theoryNote}</div>
      {reading.blocks.map((b) => fold(b, !!(firstLocked && b.id === firstLocked.id)))}
      {reading.catalog && reading.catalog.length ? (
        <details style={{ marginTop: 18, border: `1px solid ${HAIR}`, padding: "8px 12px" }}>
          <summary style={sum}>{reading.catalogNote || "查阅全部九型档案"}</summary>
          {reading.catalog.map((b) => fold(b, false))}
        </details>
      ) : null}
    </div>
  );
}

export default function App() {
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 1e9));
  const [ans, setAns] = useState<Ans>({});
  const [mode, setMode] = useState<Mode>("all");
  const [ansMode, setAnsMode] = useState<Mode | null>(null);
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [shareFlash, setShareFlash] = useState<string>("");
  const [shot, setShot] = useState<Shot | null>(null);
  const [soundOn, setSoundOn] = useState<boolean>(() => soundEnabled());
  const [reducedMotion] = useState<boolean>(() => prefersReduced());
  const activeQ = useMemo(() => questionsFor(mode), [mode]);
  const order = useMemo(() => { const r = rng(seed); return shuffle(activeQ, r).map((q: Item) => ({ q, opts: shuffle(q.o.map((o: [string, string], i: number) => ({ i, t: o[1] })), r) })); }, [seed, activeQ]);
  const P = useMemo(() => present(ans, mode, age), [ans, mode, age]);
  const reading = useMemo(() => buildReading(P), [P]);
  const R = P.R;
  const poOrder = useMemo(() => { const r = rng(seed + 7); return shuffle(PO, r).map((p: PItem) => (r() < 0.5 ? { ...p, o: [p.o[1], p.o[0]] as [string, string][] } : p)); }, [seed]);
  const clearCard = (): void => { setShot((cur: Shot | null) => { if (cur) URL.revokeObjectURL(cur.url); return null; }); setShareFlash(""); };
  const setA = (id: string, v: number | string): void => { const n: Ans = { ...ans }; if (n[id] === v) delete n[id]; else n[id] = v; setAns(n); clearCard(); };
  const [stage, setStage] = useState<string>("cover");
  const [step, setStep] = useState<number>(0);
  const timer = useRef<number | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  const stopTimer = (): void => { if (timer.current !== null) { window.clearTimeout(timer.current); timer.current = null; } };
  const reset = (): void => { stopTimer(); setAns({}); setAnsMode(null); setMode("all"); setSeed(Math.floor(Math.random() * 1e9)); setName(""); setAge(""); clearCard(); setStep(0); setStage("cover"); };
  const startMode = (m: Mode, resume: boolean): void => {
    stopTimer();
    const same = resume && ansMode === m && Object.keys(answersForMode(ans, m)).some((k: string) => !k.endsWith("_l") && ans[k] !== undefined);
    if (!same) {
      setAns({});
      setSeed(Math.floor(Math.random() * 1e9));
      setStep(0);
      clearCard();
    }
    setMode(m);
    setAnsMode(m);
    setStage("q");
    if (!same) setStep(0);
  };

  const { top, locked, mbti, code, stack, note, gapO, gapW, fnDone, needPairs, ageNote, sketch, axes, enn, ins, warn, heading, subtitle, filePrefix, showEight, showEnnea, showInstinct, total, iS } = P;
  const nm = (k: string): string => k.slice(1);
  const h2h = (a: string, b: string): { x: number; y: number } => h2hOf(ans, a, b);

  const seq: StepItem[] = [
    ...order.map((row: { q: Item; opts: { i: number; t: string }[] }): StepItem => ({ kind: "q", q: row.q, opts: row.opts })),
    ...(includesPlayoffs(mode) ? poOrder.filter((p: PItem) => needPairs.includes(pk2(p.a, p.b))) : []).map((p: PItem, n: number): StepItem => ({ kind: "p", p, n })),
  ];
  const stepId = (s: StepItem): string => (s.kind === "q" ? s.q.id : s.p.id);
  const unanswered = seq.map((s: StepItem, i: number) => (ans[stepId(s)] === undefined ? i : -1)).filter((i: number) => i >= 0);
  const cur = Math.min(step, Math.max(0, seq.length - 1));
  useEffect(() => { if (stage === "q" && step >= seq.length) { setStage("result"); setStep(Math.max(0, seq.length - 1)); } }, [stage, step, seq.length]);
  useEffect(() => { if (stage === "result") playReveal(); }, [stage]);
  // 全局触屏弹琴：页面任意位置 pointerdown 都按横向位置发一个钢琴音
  // （左低右高，C 大调 C4–C6 共 15 个音，同一 x 永远是同一个音，能弹旋律）。
  // 答题选项按钮自带顺序单音，用 data-opt 标记，全局处理跳过它们，
  // 避免一个点击响两声；其余按钮、空白处、封面、结果页都走全局音。
  // 音效开关在 playNote 里统一检查，关了就全静音。
  useEffect(() => {
    const onPointer = (e: PointerEvent): void => {
      const t = e.target as HTMLElement | null;
      if (t && typeof t.closest === "function" && t.closest("[data-opt]")) return;
      playPiano(e.clientX, window.innerWidth);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, []);
  useEffect(() => { const el = topRef.current; if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start" }); }, [stage, step]);
  useEffect(() => () => stopTimer(), []);
  const go = (i: number): void => { stopTimer(); playFlip(); setStep(i); setStage("q"); };
  const next = (): void => { stopTimer(); playFlip(); setStep(cur + 1); };
  const prev = (): void => { stopTimer(); playFlip(); if (cur > 0) setStep(cur - 1); else setStage("cover"); };
  const pick = (id: string, v: number | string, adv: boolean, note?: number): void => {
    const off = ans[id] === v; setA(id, v); stopTimer();
    if (!off && note !== undefined) playNote(note);
    if (!off && adv) { const from = cur; timer.current = window.setTimeout(() => { timer.current = null; setStep(from + 1); }, 260); }
  };

  const sharePayload = (): ShareCard => ({ name: name.trim(), code, stack, note, heading, subtitle, axes, enn, ins, warns: warn.slice(), footer: SITE, done: P.done, total, seed: hashStr(`${code}|${name.trim()}|${P.done}|${mode}`) });
  const fileName = (): string => `${filePrefix}-${name.trim() || (showEight && fnDone >= 20 ? top.t : (code || "结果"))}.png`;
  const generateCard = (): void => {
    if (P.done < 1) { setShareFlash("先答几题再生成"); return; }
    try {
      const drawn = drawResultCard(sharePayload());
      drawn.toBlob((blob: Blob | null) => {
        if (!blob) { setShareFlash("生成图片失败"); return; }
        const url = URL.createObjectURL(blob);
        setShot((cur: Shot | null) => { if (cur) URL.revokeObjectURL(cur.url); return { url, blob }; });
        setShareFlash("图已生成。下载不了时，长按或右键保存下面的图。");
      }, "image/png");
    } catch {
      setShareFlash("这个环境不能生成图片");
    }
  };
  const downloadCard = (): void => {
    if (!shot) return;
    try {
      const a = document.createElement("a");
      a.href = shot.url;
      a.download = fileName();
      a.click();
    } catch {
      setShareFlash("这个环境不能下载，请长按或右键保存下面的图");
    }
  };
  const shareImage = (): void => {
    if (!shot) return;
    const nav = navigator as unknown as { share?: (d: { files: File[]; title: string; text: string }) => Promise<void>; canShare?: (d: { files: File[] }) => boolean };
    const go = async (): Promise<void> => {
      try {
        const file = new File([shot.blob], fileName(), { type: "image/png" });
        if (nav.share && (!nav.canShare || nav.canShare({ files: [file] }))) {
          await nav.share({ files: [file], title: name.trim() ? `${heading} · ${name.trim()}` : heading, text: sketch });
          return;
        }
      } catch (err: unknown) {
        const aborted = typeof err === "object" && err !== null && "name" in err && (err as { name: string }).name === "AbortError";
        if (aborted) return;
      }
      downloadCard();
    };
    void go();
  };

  const pct = total ? Math.round((100 * P.done) / total) : 0;
  const qText: CSSProperties = { color: INK, fontSize: 17, lineHeight: 1.6, marginTop: 4, wordBreak: "break-word" };
  const qBox: CSSProperties = { padding: "18px 0 16px", borderBottom: `1px solid ${HAIR}` };
  const romanN = (n: number): string => { const m: [number, string][] = [[50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]; let s = ""; let v = n; m.forEach((p: [number, string]) => { while (v >= p[0]) { s += p[1]; v -= p[0]; } }); return s; };

  return (
    <Page title={heading} lang="zh-Hans" width="column" summary={`八维按功能轴和主导方向排栈，九型和本能按动机选最像的一项、按选中率计分。可完整合测或单测其中一项。合测 ${questionsFor("all").length} 题。测完可生成分享图，详细解读免费、无付费墙。`}>
      <Starfield />
      <div ref={topRef} style={{ position: "relative", zIndex: 1, background: "rgba(23,30,66,0.92)", color: INK, fontFamily: SERIF, border: `1px solid ${GOLD}`, boxShadow: `inset 0 0 0 6px ${PAPER}, inset 0 0 0 7px rgba(216,178,92,0.4)`, padding: "26px clamp(16px, 5vw, 44px) 34px", maxWidth: 800, margin: "0 auto", boxSizing: "border-box", lineHeight: 1.6 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "4px 16px" }}>
          <span style={{ fontSize: 12.5, letterSpacing: "0.26em" }}>{heading}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12.5, letterSpacing: "0.18em" }}>{stage === "q" ? `第 ${cur + 1} / ${seq.length} 题 · 已答 ${P.done}/${total}` : `已答 ${P.done}/${total}`}</span>
            <button type="button" onClick={() => { const nx = !soundOn; setSoundEnabled(nx); setSoundOn(nx); }} style={{ padding: "4px 10px", borderRadius: 0, border: `1px solid ${GOLD}`, background: "transparent", color: INK, fontFamily: SERIF, fontSize: 12.5, letterSpacing: "0.12em", cursor: "pointer" }}>{`音效 ${soundOn ? "开" : "关"}`}</button>
          </span>
        </div>
        <div style={{ marginTop: 8, height: 1, background: GOLD }} />
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }} aria-label={`进度 ${pct}%`}>
          {Array.from({ length: 24 }, (_, i) => {
            const lit = pct >= ((i + 1) / 24) * 100;
            return <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: lit ? SUN : "rgba(216,178,92,0.25)", boxShadow: lit ? "0 0 6px rgba(232,200,120,0.8)" : "none" }} />;
          })}
        </div>

        {stage === "cover" ? (
        <div>
        <div style={{ padding: "34px 0 6px" }}>
          <Armillary reduced={reducedMotion} />
          <div style={tag}>TYPOLOGIA · EDITIO AXIALIS · Nº 01</div>
          <div style={{ fontSize: "clamp(40px, 9vw, 66px)", lineHeight: 1.08, marginTop: 14, letterSpacing: "0.02em", ...(reducedMotion ? {} : { opacity: 0, animation: "armFade 0.5s ease-out 0.9s forwards" }) }}>人设类型学合测</div>
          <div style={{ fontSize: "clamp(22px, 4.6vw, 32px)", fontStyle: "italic", lineHeight: 1.25, color: MUTED, marginTop: 6 }}>Specimen personae, axibus ordinatum</div>
          <div style={{ marginTop: 18, paddingTop: 12, borderTop: `1px solid ${HAIR}`, fontSize: 15.5, color: INK }}>{`三重星环：同一场景里几个方向正面竞争，按你最像的做法计分。完整合测 ${questionsFor("all").length} 题（八维 ${questionsFor("eight").length}、九型 ${questionsFor("ennea").length}、本能 ${questionsFor("instinct").length}），也可以只测其中一项。每次重置都会打乱题目和选项顺序。测完有免费详细解读，并可以生成只含测量结果的分享图。`}</div>
        </div>

        {head("§ I", "怎么答", "modus respondendi")}
        <div style={{ fontSize: 15.5, marginTop: 10 }}>选最像你平常、而不是理想中的那个。八维题如果两个方向都不是你平时的做法，选「都不是」比硬选更合适；这类题选多了，有效样本会变窄，类型结果请当草稿。九型和本能题另有「我不知道」（不计分）和「都不是」（每个选项各扣一点）。社交、团队、自由安排类的题多两个按钮：「我做更有意思那个」「我做更让我舒服那个」，不计入功能分。本能题选完「最像」后，还可以再点一个「最不像」，用来排第二、第三。切换或重开一种模式会清空该次作答，避免和另一种模式的答案串在一起。</div>
        <div style={{ fontSize: 14.5, color: MUTED, marginTop: 10, fontStyle: "italic" }}>{`一次一题。普通题选中后自动翻到下一题，本能题选完「最像」「最不像」再翻页。随时可以回到上一题改答案，答完才出结果。`}</div>
        <div style={{ marginTop: 16, fontSize: 14, lineHeight: 1.75, color: MUTED }}>{DISCLAIMER}</div>
        <div style={{ marginTop: 18, paddingTop: 12, borderTop: `1px solid ${HAIR}` }}>
          <div style={{ fontSize: 12, letterSpacing: "0.2em", color: DIM }}>年龄段 · 可选，不计分</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {AGES.map((g: string) => <button type="button" key={g} onClick={() => { setAge(g); clearCard(); }} style={chip(age === g)}>{g}</button>)}
            <button type="button" onClick={() => { setAge(""); clearCard(); }} style={chip(age === "")}>不填</button>
          </div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 6, fontStyle: "italic" }}>只用来在结果里加一句提醒、写在分享图上；不改分数，也不上传。</div>
        </div>
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.2em", color: DIM }}>选择一种测法</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginTop: 10 }}>
            {(["all", "eight", "ennea", "instinct"] as Mode[]).map((m: Mode) => {
              const resume = ansMode === m && Object.keys(answersForMode(ans, m)).some((k: string) => !k.endsWith("_l") && ans[k] !== undefined);
              return <button type="button" key={m} onClick={() => startMode(m, resume)} style={pbtn(m === "all")}>{resume ? `继续${MODE_META[m].title} →` : (m === "all" ? "开始完整合测 →" : `${MODE_META[m].title} →`)}</button>;
            })}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginTop: 12 }}>
            {P.done > 0 && ansMode === mode ? <button type="button" onClick={reset} style={pbtn(false)}>重置并重新打乱</button> : null}
            {P.done > 0 && ansMode === mode ? <button type="button" onClick={() => { stopTimer(); setStage("result"); }} style={quiet}>查看目前结果</button> : null}
          </div>
        </div>
        </div>
        ) : null}

        {stage === "q" && seq.length > 0 ? (() => {
          const s = seq[cur];
          const id = stepId(s);
          const a = ans[id];
          const isI = s.kind === "q" && s.q.g === "i";
          const three = s.kind === "q" && (s.q.g === "e" || s.q.g === "i");
          const last = cur >= seq.length - 1;
          // 本题按钮按出现顺序依次取音：选项 do/re/mi/fa，其余 chip 接着 sol/la/do′…顺延
          const nOpt = s.kind === "q" ? s.opts.length : s.p.o.length;
          const nLeast = isI && s.kind === "q" && typeof a === "number" ? s.opts.filter((op: { i: number; t: string }) => op.i !== a).length : 0;
          let nbi = nOpt + nLeast;
          const bottomNote = (): number => { const n = noteAt(nbi); nbi += 1; return n; };
          const noteFun = s.kind === "q" && s.q.st ? bottomNote() : 0;
          const noteComfy = s.kind === "q" && s.q.st ? bottomNote() : 0;
          const noteIdk = three ? bottomNote() : 0;
          const noteNone = bottomNote();
          return (
            <div style={{ minHeight: 420 }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "2px 12px", marginTop: 30 }}>
                <span style={{ fontStyle: "italic", fontSize: 16, color: DIM }}>{s.kind === "q" ? `No. ${cur + 1}` : `加赛 ${romanN(s.n + 1)}`}</span>
                <span style={tag}>{s.kind === "q" ? GL[s.q.g] : "九型 · 加赛"}</span>
              </div>
              {s.kind === "p" ? <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>只在分数差不到 15 时出现；只用来分胜负，不改选中率</div> : null}
              <div style={{ color: INK, fontSize: "clamp(20px, 4.4vw, 26px)", lineHeight: 1.5, marginTop: 12, wordBreak: "break-word" }}>{s.kind === "q" ? s.q.s : s.p.s}</div>
              {isI ? <div style={{ fontSize: 12, letterSpacing: "0.2em", color: DIM, marginTop: 14 }}>第一步 · 最像</div> : null}
              <div style={{ marginTop: isI ? 2 : 12 }}>
                {s.kind === "q"
                  ? s.opts.map((op: { i: number; t: string }, j: number) => (
                      <button type="button" key={op.i} data-opt onClick={() => pick(id, op.i, !isI, noteAt(j))} style={opt(a === op.i)}><span style={{ fontStyle: "italic", color: DIM, marginRight: 8 }}>{`${"abcd"[j]}.`}</span>{op.t}</button>
                    ))
                  : s.p.o.map((o: [string, string], i: number) => (
                      <button type="button" key={i} data-opt onClick={() => pick(id, i, true, noteAt(i))} style={opt(a === i)}><span style={{ fontStyle: "italic", color: DIM, marginRight: 8 }}>{`${"ab"[i]}.`}</span>{o[1]}</button>
                    ))}
              </div>
              {isI && s.kind === "q" && typeof a === "number" ? (
                <div style={{ marginTop: 16, padding: "12px 14px", border: `1px solid ${GOLD}`, background: PAPER2 }}>
                  <div style={{ fontSize: 12, letterSpacing: "0.2em", color: DIM }}>第二步 · 最不像（可选）</div>
                  <div style={{ fontSize: 13.5, color: MUTED, marginTop: 2 }}>本能题选完「最像」不会自动翻页。点一个最不像的，会直接进入下一题；不想选就点「下一题」。</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                    {s.opts.filter((op: { i: number; t: string }) => op.i !== a).map((op: { i: number; t: string }, j: number) => <button type="button" key={"l" + op.i} data-opt onClick={() => pick(id + "_l", op.i, true, noteAt(nOpt + j))} style={chip(ans[id + "_l"] === op.i)}>{`最不像：${op.t}`}</button>)}
                  </div>
                </div>
              ) : null}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                {s.kind === "q" && s.q.st ? <button type="button" data-opt onClick={() => pick(id, "fun", true, noteFun)} style={chip(a === "fun")}>我做更有意思那个</button> : null}
                {s.kind === "q" && s.q.st ? <button type="button" data-opt onClick={() => pick(id, "comfy", true, noteComfy)} style={chip(a === "comfy")}>我做更让我舒服那个</button> : null}
                {three ? <button type="button" data-opt onClick={() => pick(id, "idk", true, noteIdk)} style={chip(a === "idk")}>我不知道</button> : null}
                <button type="button" data-opt onClick={() => pick(id, "none", true, noteNone)} style={chip(a === "none")}>{s.kind === "q" ? "都不是" : "都不像"}</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10, marginTop: 28, paddingTop: 14, borderTop: `1px solid ${HAIR}` }}>
                <button type="button" onClick={prev} style={pbtn(false)}>{cur === 0 ? "← 回到封面" : "← 上一题"}</button>
                <button type="button" onClick={next} style={pbtn(true)}>{last ? "完成，看结果" : "下一题 →"}</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", marginTop: 14, alignItems: "baseline" }}>
                {unanswered.length > 0 && unanswered[0] !== cur ? <button type="button" onClick={() => go(unanswered[0])} style={quiet}>{`跳到第一道未答题（还有 ${unanswered.length} 题）`}</button> : null}
                {P.done > 0 ? <button type="button" onClick={() => { stopTimer(); setStage("result"); }} style={quiet}>查看目前结果</button> : null}
              </div>
            </div>
          );
        })() : null}

        {stage === "result" ? (
          <div>
        {unanswered.length > 0 ? (
          <div style={{ marginTop: 26, padding: "10px 14px", border: `1px solid ${WARN}`, color: WARN, fontSize: 14, display: "flex", flexWrap: "wrap", gap: "6px 14px", alignItems: "baseline" }}>
            <span style={{ flex: "1 1 220px", minWidth: 0 }}>{`还有 ${unanswered.length} 题没答，下面先按已答部分计分。`}</span>
            <button type="button" onClick={() => go(unanswered[0])} style={{ ...quiet, color: WARN }}>去答未答的题</button>
          </div>
        ) : null}
        {head("PL. I", "结果标本", "specimen")}
        <div style={{ marginTop: 16, border: `1px solid ${GOLD}`, padding: 5 }}>
          <div style={{ border: `1px solid rgba(216,178,92,0.4)`, padding: "18px clamp(14px, 4vw, 32px) 22px", background: PAPER }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2px 12px", fontSize: 11.5, letterSpacing: "0.22em" }}>
              <span>{heading}</span><span>PL. I</span>
            </div>
            <div style={{ height: 1, background: GOLD, marginTop: 6 }} />
            <StarMap f={R.f} e={R.e} i={R.i} stack={showEight ? top.s : []} showF={showEight} showE={showEnnea} showI={showInstinct} />
            {name.trim() ? <div style={{ textAlign: "center", fontSize: 21, color: MUTED, marginTop: 22, wordBreak: "break-word" }}>{name.trim()}</div> : null}
            <div style={{ textAlign: "center", fontSize: code.length > 4 ? "clamp(38px, 10vw, 68px)" : "clamp(60px, 16vw, 116px)", lineHeight: 1.05, letterSpacing: "0.03em", marginTop: name.trim() ? 6 : 26, color: code ? INK : DIM, wordBreak: "break-word" }}>{code || "· · · ·"}</div>
            {stack ? <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 19, color: MUTED, marginTop: 6 }}>{stack}</div> : null}
            <div style={{ textAlign: "center", fontSize: 12, letterSpacing: "0.2em", color: DIM, marginTop: 8 }}>{note}</div>
            <div style={{ width: 96, height: 2, background: SUN, margin: "16px auto 0" }} />
            <div style={{ marginTop: 22, borderTop: `1px solid ${GOLD}`, borderBottom: `1px solid ${GOLD}`, height: 3 }} />
            {showEight ? (
            <div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2px 12px", marginTop: 14 }}>
              <span style={{ fontSize: 12, letterSpacing: "0.2em" }}>FIG. I · 功能轴</span><span style={{ fontStyle: "italic", fontSize: 13, color: DIM }}>axes functionum</span>
            </div>
            <div style={{ marginTop: 4 }}>{axes.map((x: { label: string; value: number }) => bar(x.label, x.value, x.label))}</div>
            <div style={{ fontSize: 13, color: MUTED, marginTop: 8, lineHeight: 1.6 }}>{`八维：${mbti}（领先其他类型 ${gapO} 分、领先内外向孪生 ${gapW} 分；${locked ? "已锁" : "要求 5 分和 3 分"}）`}</div>
            </div>
            ) : null}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 28px", marginTop: 18 }}>
              {showEnnea ? (
              <div style={{ flex: "1 1 240px", minWidth: 0 }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2px 12px", paddingBottom: 4, borderBottom: `1px solid ${GOLD}` }}>
                  <span style={{ fontSize: 12, letterSpacing: "0.2em" }}>FIG. II · 九型</span><span style={{ fontStyle: "italic", fontSize: 13, color: DIM }}>enneagramma</span>
                </div>
                {enn.map((x: Fact) => fact(x.label, x.value))}
              </div>
              ) : null}
              {showInstinct ? (
              <div style={{ flex: "1 1 240px", minWidth: 0 }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2px 12px", paddingBottom: 4, borderBottom: `1px solid ${GOLD}` }}>
                  <span style={{ fontSize: 12, letterSpacing: "0.2em" }}>FIG. III · 本能</span><span style={{ fontStyle: "italic", fontSize: 13, color: DIM }}>instinctus</span>
                </div>
                {ins.map((x: Fact) => fact(x.label, x.value))}
              </div>
              ) : null}
            </div>
            {warn.length > 0 ? (
              <div style={{ marginTop: 20, borderTop: `1px solid ${WARN}`, paddingTop: 10, color: WARN }}>
                <div style={{ fontSize: 12, letterSpacing: "0.22em" }}>※ 污染提醒 · CAVEAT</div>
                {warn.map((w: string, i: number) => <div key={i} style={{ display: "flex", gap: 10, fontSize: 14.5, lineHeight: 1.6, marginTop: 6 }}><span>—</span><span style={{ flex: 1, minWidth: 0, wordBreak: "break-word" }}>{w}</span></div>)}
              </div>
            ) : null}
            {ageNote ? (
              <div style={{ marginTop: 16, borderTop: `1px solid ${HAIR}`, paddingTop: 10, color: MUTED }}>
                <div style={{ fontSize: 12, letterSpacing: "0.22em", color: DIM }}>※ 年龄提示 · NOTA</div>
                <div style={{ fontSize: 14.5, lineHeight: 1.6, marginTop: 6, fontStyle: "italic", wordBreak: "break-word" }}>{ageNote}</div>
              </div>
            ) : null}
            <div style={{ height: 1, background: GOLD, marginTop: 20 }} />
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2px 12px", marginTop: 8, fontSize: 12.5, color: DIM }}>
              <span style={{ fontStyle: "italic" }}>{SITE}</span><span>结果只在本机计算，不上传</span>
            </div>
          </div>
        </div>

        {ReadingPanel(reading)}

        {head("§ IV", "分享图", "imago communicanda", "分享图只保留测量结果，不含长篇解读。结果不会存到网上。生成一张图后，可以下载或发给别人；想写角色名的话，会出现在图上。")}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginTop: 14 }}>
          <input value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} placeholder="角色名（可选）" aria-label="角色名" style={{ flex: "1 1 180px", minWidth: 0, padding: "8px 2px", border: "none", borderBottom: `1px solid ${GOLD}`, borderRadius: 0, background: "transparent", color: INK, fontFamily: SERIF, fontSize: 16, outline: "none" }} />
          <button type="button" onClick={generateCard} style={pbtn(true)}>生成分享图</button>
          {shot ? <button type="button" onClick={downloadCard} style={pbtn(false)}>下载图片</button> : null}
          {shot ? <button type="button" onClick={shareImage} style={pbtn(false)}>分享</button> : null}
        </div>
        {shareFlash ? <div style={{ color: shareFlash.startsWith("图已") ? MUTED : WARN, fontSize: 13, marginTop: 8, wordBreak: "break-word" }}>{shareFlash}</div> : null}
        {shot ? <img src={shot.url} alt="测试结果分享图" style={{ display: "block", width: "100%", height: "auto", marginTop: 14, border: `1px solid ${GOLD}` }} /> : null}

        {showEnnea && needPairs.length > 0 ? head("附录 ·", "九型加赛对局", "certamen decretorium", "加赛只用来分胜负，不改选中率") : null}
        {showEnnea && needPairs.length > 0 ? tbl(["对局", "比分", "胜方"], needPairs.map((k: string) => { const [a, b] = k.split("-"); const r = h2h(a, b); return [`${nm(a)} 对 ${nm(b)}`, `${r.x} : ${r.y}`, r.x === r.y ? "平" : `${nm(r.x > r.y ? a : b)} 号`]; }), 1) : null}

        {showEight ? head("附录 A", "栈的候选", "stirpes candidatae", "栈分 = 主导 36% + 辅助 26% + 第三 8% + 劣势 2% + 主导所在轴 4% + 辅助所在轴 3% + 主导内外向（方向题）7% + 先感知还是先判断（方向题）2% + 先后题 12%；主导或辅助低于 15 的栈打 6 折") : null}
        {showEight ? tbl(["类型", "栈", "栈分"], R.ts.slice(0, 5).map((t: { t: string; s: string[]; v: number }) => [t.t, t.s.join("-"), String(t.v)]), 2) : null}

        {showEight ? head("附录 B", "八维选中率", "functiones octo") : null}
        {showEight ? <div style={{ marginTop: 8 }}>{FN.slice().sort((x: string, y: string) => R.f[y] - R.f[x]).map((k: string) => bar(k, R.f[k], k))}</div> : null}
        {showEight ? tbl(["功能轴", "轴分"], Object.keys(R.ax).map((k: string) => [AXN[k], R.ax[k].toFixed(0)]), 1) : null}

        {showEnnea ? head("附录 C", "九型选中率", "enneagramma", "分 = 100 × (选中 − 0.25 × 都不是) ÷ 有效出现；有效出现 = 出现 − 不知道；有效出现少于 4 的型不排名") : null}
        {showEnnea ? tbl(["型", "分", "选中", "都不是", "不知道", "出现"], EN.slice().sort((x: string, y: string) => R.e[y] - R.e[x]).map((k: string) => [`${nm(k)} 号`, String(R.e[k]), String(R.es[k] || 0), String(R.en[k] || 0), String(R.ek[k] || 0), String((R.ea[k] || 0) + (R.ek[k] || 0))]), 1) : null}

        {showInstinct ? head("附录 D", "本能选中率", "instinctus") : null}
        {showInstinct ? tbl(["本能", "分", "最像", "最不像", "都不是", "不知道", "出现"], iS.map((k: string) => [k, String(R.i[k]), String(R.is[k] || 0), String(R.il[k] || 0), String(R.inn[k] || 0), String(R.ik[k] || 0), String((R.ia[k] || 0) + (R.ik[k] || 0))]), 1) : null}

        {head("附录 E", "角色人设速写", "adumbratio", "可直接复制")}
        <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: SERIF, fontSize: 14.5, lineHeight: 1.7, color: INK, padding: "12px 14px", marginTop: 12, border: `1px solid ${GOLD}`, background: PAPER2, userSelect: "all" }}>{sketch}</div>

        {head("附录 F", "出题参考", "fontes")}
        <div style={{ marginTop: 8 }}>
          {[
            { title: "Sakinorva 认知功能测试（轴向算法）", site: "sakinorva.net", href: "https://sakinorva.net/functions" },
            { title: "IDRlabs 认知功能测试", site: "idrlabs.com", href: "https://www.idrlabs.com/cognitive-function/test.php" },
            { title: "Sakinorva 与 Keys2Cognition 的效度对比", site: "typologytriad.wordpress.com", href: "https://typologytriad.wordpress.com/2020/06/16/tcf-series-part-2-evaluating-sakinorva-and-keys2cognition-test/" },
            { title: "RHETI：成对强迫选择", site: "enneagraminstitute.com", href: "https://www.enneagraminstitute.com/rheti/" },
            { title: "IVQ：三选一本能问卷", site: "enneagraminstitute.com", href: "https://www.enneagraminstitute.com/ivq/" },
          ].map((l: { title: string; site: string; href: string }, i: number) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" style={{ display: "flex", flexWrap: "wrap", gap: "2px 12px", alignItems: "baseline", padding: "9px 0", borderBottom: `1px solid ${HAIR}`, color: INK, textDecoration: "none" }}>
              <span style={{ fontStyle: "italic", color: DIM, fontSize: 14 }}>{`${i + 1}.`}</span>
              <span style={{ flex: "1 1 200px", minWidth: 0, fontSize: 15, borderBottom: `1px solid rgba(216,178,92,0.35)` }}>{l.title}</span>
              <span style={{ fontStyle: "italic", color: DIM, fontSize: 13 }}>{l.site}</span>
            </a>
          ))}
        </div>

          <div style={{ marginTop: 36, paddingTop: 14, borderTop: `1px solid ${HAIR}`, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <button type="button" onClick={() => go(cur)} style={pbtn(false)}>← 回到题目</button>
            {unanswered.length > 0 ? <button type="button" onClick={() => go(unanswered[0])} style={pbtn(false)}>{`去答未答的 ${unanswered.length} 题`}</button> : null}
            <button type="button" onClick={reset} style={pbtn(false)}>重置并重新打乱</button>
          </div>
          </div>
        ) : null}

        <div style={{ marginTop: 40, borderTop: `1px solid ${GOLD}`, borderBottom: `1px solid ${GOLD}`, height: 3 }} />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2px 12px", marginTop: 10, fontSize: 12, letterSpacing: "0.16em", color: DIM }}>
          <span>{SITE}</span><span>不保存 · 不上传</span>
        </div>
      </div>
    </Page>
  );
}
