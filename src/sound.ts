// 音效：WebAudio 合成，不加任何音频文件。
// AudioContext 懒创建（第一次用户手势时才建，满足自动播放策略）；主增益 0.12。
// 开关状态存 localStorage（key: renshe-sound，默认开）。
// 任何环境缺失（无 AudioContext、无 localStorage）都静默失败，页面不受影响。
const KEY = "renshe-sound";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

export function soundEnabled(): boolean {
  try {
    const v = localStorage.getItem(KEY);
    return v === null ? true : v !== "0";
  } catch {
    return true;
  }
}

export function setSoundEnabled(on: boolean): void {
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    /* 存不下也无妨，默认开 */
  }
}

function ensureCtx(): AudioContext | null {
  try {
    if (typeof window === "undefined") return null;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.12;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, delay: number, dur: number, type: OscillatorType, vol: number): void {
  const c = ensureCtx();
  if (!c || !master) return;
  try {
    const t0 = c.currentTime + delay;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(master);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  } catch {
    /* 单个音失败不影响其余 */
  }
}

/** 答题 chime：E5 → A5 两音正弦拨奏，约 0.4 秒 */
export function playChime(): void {
  if (!soundEnabled()) return;
  tone(659.25, 0, 0.22, "sine", 0.5);
  tone(880, 0.12, 0.3, "sine", 0.5);
}

/** 六声音阶 do re mi fa sol la（C5–A5）；超出六个用高八度 do′ re′…顺延 */
export const SCALE = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1396.91, 1567.98, 1760.0];
/** 取音阶第 i 个音（循环） */
export function noteAt(i: number): number {
  return SCALE[i % SCALE.length];
}
/** 单音拨奏：正弦，0.35 秒淡出 */
export function playNote(freq: number): void {
  if (!soundEnabled()) return;
  tone(freq, 0, 0.35, "sine", 0.5);
}

/** 翻页 flip：轻柔的三角波下滑 */
export function playFlip(): void {
  if (!soundEnabled()) return;
  const c = ensureCtx();
  if (!c || !master) return;
  try {
    const t = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(520, t);
    o.frequency.exponentialRampToValueAtTime(340, t + 0.12);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.25, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + 0.18);
  } catch {
    /* ignore */
  }
}

/** 出结果 reveal：C–E–G–C 四音琶音 */
export function playReveal(): void {
  if (!soundEnabled()) return;
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.14, 0.5, "sine", 0.45));
}
