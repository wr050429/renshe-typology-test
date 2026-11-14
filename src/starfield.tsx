// 动态星空背景：fixed 全屏 canvas，画在所有内容之下（zIndex 0，内容层 zIndex 1）。
// 约 140 颗星（固定种子，每次打开同一片星空）+ 淡淡的星座连线 + 偶发流星 +
// 一个很大的淡金色细圆环（带刻度），240 秒转一圈。
// document.hidden 时暂停；prefers-reduced-motion 时只画一帧静态星空；
// canvas 取不到 context 时静默失败，页面不受影响。
import { useEffect, useRef } from "./kit";

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Star = { fx: number; fy: number; r: number; base: number; amp: number; speed: number; phase: number; gold: boolean };
type Meteor = { x: number; y: number; vx: number; vy: number; life: number; max: number };

const SEED = 20261114;
const GOLD = "216,178,92";

export default function Starfield() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext("2d");
    } catch {
      ctx = null;
    }
    if (!ctx) return;
    const c: CanvasRenderingContext2D = ctx;

    const reduced = (() => {
      try {
        return typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      } catch {
        return false;
      }
    })();

    const r = mulberry32(SEED);
    const stars: Star[] = [];
    for (let i = 0; i < 140; i++) {
      stars.push({
        fx: r(), fy: r(),
        r: 0.5 + r() * 1.2,
        base: 0.35 + r() * 0.4,
        amp: 0.12 + r() * 0.25,
        speed: 0.4 + r() * 1.0,
        phase: r() * Math.PI * 2,
        gold: r() < 0.25,
      });
    }
    // 2–3 组星座连线：每组取 4–6 颗星，按 x 排序连起来
    const links: [number, number][] = [];
    const used = new Set<number>();
    for (let g = 0; g < 3; g++) {
      const idx: number[] = [];
      let guard = 0;
      while (idx.length < 5 && guard < 200) {
        guard++;
        const k = Math.floor(r() * stars.length);
        if (!used.has(k)) { used.add(k); idx.push(k); }
      }
      idx.sort((a, b) => stars[a].fx - stars[b].fx);
      for (let j = 0; j + 1 < idx.length; j++) links.push([idx[j], idx[j + 1]]);
    }

    let w = 0, h = 0, dpr = 1, grad: CanvasGradient | null = null;
    let raf = 0;
    let meteors: Meteor[] = [];
    let nextMeteor = 0;
    let start = 0;

    const resize = (): void => {
      try {
        dpr = Math.min(2, window.devicePixelRatio || 1);
        w = window.innerWidth; h = window.innerHeight;
        canvas.width = Math.max(1, Math.round(w * dpr));
        canvas.height = Math.max(1, Math.round(h * dpr));
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        grad = c.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, "#0D1230");
        grad.addColorStop(1, "#141B3D");
      } catch {
        /* 尺寸失败也不影响页面 */
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number): void => {
      if (!grad) return;
      c.fillStyle = grad;
      c.fillRect(0, 0, w, h);

      // 大圆环：淡金色细线 + 刻度，240 秒一圈
      try {
        const cx = w / 2, cy = h * 0.45, rad = Math.max(w, h) * 0.75;
        const rot = (t / 240000) * Math.PI * 2;
        c.save();
        c.translate(cx, cy);
        c.rotate(rot);
        c.strokeStyle = `rgba(${GOLD},0.10)`;
        c.lineWidth = 1;
        c.beginPath(); c.arc(0, 0, rad, 0, Math.PI * 2); c.stroke();
        for (let k = 0; k < 60; k++) {
          const a = (k / 60) * Math.PI * 2;
          const long = k % 5 === 0;
          const r1 = rad - (long ? 12 : 6), r2 = rad;
          c.beginPath();
          c.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
          c.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
          c.stroke();
        }
        c.restore();
      } catch { /* 画环失败不影响其余 */ }

      // 星座连线
      try {
        c.strokeStyle = `rgba(${GOLD},0.28)`;
        c.lineWidth = 1;
        links.forEach(([a, b]) => {
          c.beginPath();
          c.moveTo(stars[a].fx * w, stars[a].fy * h);
          c.lineTo(stars[b].fx * w, stars[b].fy * h);
          c.stroke();
        });
      } catch { /* ignore */ }

      // 星星：闪烁
      stars.forEach((s) => {
        const a = Math.max(0.08, Math.min(1, s.base + s.amp * Math.sin(t * 0.001 * s.speed + s.phase)));
        c.fillStyle = s.gold ? `rgba(${GOLD},${a.toFixed(3)})` : `rgba(237,231,211,${a.toFixed(3)})`;
        c.beginPath();
        c.arc(s.fx * w, s.fy * h, s.r, 0, Math.PI * 2);
        c.fill();
      });

      // 流星
      meteors = meteors.filter((m) => m.life < m.max);
      meteors.forEach((m) => {
        const p = m.life / m.max;
        const alpha = p < 0.2 ? p / 0.2 : 1 - (p - 0.2) / 0.8;
        const x = m.x + m.vx * m.life, y = m.y + m.vy * m.life;
        const tail = 0.12;
        const gx = x - m.vx * tail, gy = y - m.vy * tail;
        const g = c.createLinearGradient(x, y, gx, gy);
        g.addColorStop(0, `rgba(237,231,211,${(0.9 * alpha).toFixed(3)})`);
        g.addColorStop(1, `rgba(237,231,211,0)`);
        c.strokeStyle = g;
        c.lineWidth = 1.6;
        c.beginPath(); c.moveTo(x, y); c.lineTo(gx, gy); c.stroke();
      });
    };

    if (reduced) {
      try { draw(0); } catch { /* 静态帧失败也不影响页面 */ }
      window.removeEventListener("resize", resize);
      return;
    }

    const frame = (now: number): void => {
      if (!start) { start = now; nextMeteor = 8000 + r() * 6000; }
      const t = now - start;
      if (typeof document === "undefined" || !document.hidden) {
        try {
          if (t >= nextMeteor) {
            const mx = r() * w * 0.7 + w * 0.1, my = r() * h * 0.3;
            meteors.push({ x: mx, y: my, vx: 320 + r() * 220, vy: 140 + r() * 120, life: 0, max: 0.8 });
            nextMeteor = t + 8000 + r() * 6000;
          }
          meteors.forEach((m) => { m.life += 1 / 60; });
          draw(t);
        } catch { /* 一帧失败，下一帧继续 */ }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />;
}
