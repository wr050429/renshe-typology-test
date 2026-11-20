// 白屏回归检查：加载构建产物 app.js，在 jsdom 里真实渲染。
// 2026-11-20 白屏事故：28a520d 重构 app.tsx 时误删了 rng/shuffle 的定义，
// esbuild 不做类型检查，构建照常通过，但首屏渲染在 useMemo 里抛
// ReferenceError: rng is not defined，#root 全空，只剩深蓝背景。
// 本测试保证：构建产物能渲染出封面，且单测本能能走通到结果页。
// 注意：jsdom 不做布局，390px 横向溢出不在此测，由真机/浏览器复核；
// jsdom 也没有 canvas 2d/toBlob，点“生成分享图”只断言不抛错，不测出图。
// 全局弹琴检查用假 AudioContext：只记录代码请求的音高（frequency.setValueAtTime
// 的参数），不断言真音频；能断言“点按触发了发音”和“音高随横向位置变化”。
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const ROOT = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const appJs = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let failures = 0;
const check = (name, ok, extra = "") => {
  console.log((ok ? "ok   " : "FAIL ") + name + (extra ? "  — " + extra : ""));
  if (!ok) failures++;
};

function makeDom(width) {
  const errors = [];
  const freqs = [];
  const dom = new JSDOM(html, {
    url: "https://wr050429.github.io/renshe-typology-test/",
    runScripts: "outside-only",
    pretendToBeVisual: true,
    viewport: { width, height: 844 },
  });
  const { window } = dom;
  window.console.error = (...a) => errors.push(a.map(String).join(" "));
  window.addEventListener("error", (e) => errors.push("window.onerror: " + e.message));
  // 假 AudioContext：只记录每次 tone() 请求的音高，供弹琴检查断言调用与音高
  window.AudioContext = class {
    constructor() { this.state = "running"; this.currentTime = 0; this.destination = {}; }
    createGain() { return { gain: { value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
    createOscillator() { return { type: "", frequency: { setValueAtTime(f) { freqs.push(f); }, exponentialRampToValueAtTime() {} }, connect() {}, start() {}, stop() {} }; }
    resume() { return Promise.resolve(); }
  };
  window.HTMLCanvasElement.prototype.getContext = function () {
    return new Proxy(
      {},
      {
        get: (t, k) => {
          if (k === "measureText") return () => ({ width: 0 });
          if (k === "createLinearGradient" || k === "createRadialGradient")
            return () => ({ addColorStop: () => {} });
          return () => {};
        },
        set: () => true,
      }
    );
  };
  try {
    window.eval(appJs);
  } catch (e) {
    errors.push("EVAL THROW: " + e.message);
  }
  const btn = (label) =>
    [...window.document.querySelectorAll("button")].find((b) => b.textContent.includes(label));
  const text = () => window.document.body.textContent;
  return { dom, window, errors, btn, text, tones: () => freqs.length, lastFreq: () => freqs[freqs.length - 1] };
}

(async () => {
  const d = makeDom(1280);
  await sleep(800);
  check("首屏无报错", d.errors.length === 0, d.errors.join(" | "));
  const root = d.window.document.getElementById("root");
  check("root 已渲染出内容", !!root && root.children.length > 0);
  check("封面标题", d.text().includes("人设类型学合测"));
  check(
    "四个测法入口",
    ["开始完整合测", "单测八维", "单测九型", "单测本能"].every((l) => !!d.btn(l))
  );
  check("封面题量 101 题", d.text().includes("完整合测 101 题"));
  check("音效开关", !!d.btn("音效"));
  check("星空画布", !!d.window.document.querySelector("canvas"));

  // 全局弹琴：空白处 pointerdown 按横向位置发音（左低右高，C4–C6）
  const tones0 = d.tones();
  const tap = (x) => d.window.document.body.dispatchEvent(new d.window.MouseEvent("pointerdown", { bubbles: true, clientX: x }));
  const vw = d.window.innerWidth; // jsdom 的 innerWidth 未必等于 viewport 设定，按实际值算点位
  tap(10);
  check("全局弹琴：左端点按发 C4", d.tones() === tones0 + 1 && d.lastFreq() === 261.63, "freq=" + d.lastFreq());
  tap(Math.floor(vw / 2));
  check("全局弹琴：中间点按发 C5", d.tones() === tones0 + 2 && d.lastFreq() === 523.25, "freq=" + d.lastFreq());
  tap(vw - 10);
  check("全局弹琴：右端点按发 C6", d.tones() === tones0 + 3 && d.lastFreq() === 1046.5, "freq=" + d.lastFreq());

  // 单测本能走通：18 题（最像 + 最不像）→ 结果页
  d.btn("单测本能").click();
  await sleep(300);
  check("本能第一题", d.text().includes("第 1 / 18 题"));
  let answered = 0;
  for (let i = 0; i < 18; i++) {
    const opt = [...d.window.document.querySelectorAll("button")].find((b) =>
      /^a\./.test(b.textContent.trim())
    );
    if (!opt) {
      check("本能第 " + (i + 1) + " 题有选项", false);
      break;
    }
    opt.click();
    await sleep(120);
    const least = [...d.window.document.querySelectorAll("button")].find((b) =>
      b.textContent.startsWith("最不像：")
    );
    if (least) least.click();
    await sleep(450);
    answered++;
  }
  await sleep(600);
  check("本能答完 18 题", answered === 18, "answered=" + answered);
  check("结果页有详细解读", d.text().includes("详细解读"));
  check("结果页有分享图按钮", !!d.btn("生成分享图"));
  check("全流程无报错", d.errors.length === 0, d.errors.join(" | "));
  d.btn("生成分享图").click();
  await sleep(400);
  check("生成分享图不抛错", d.errors.length === 0, d.errors.join(" | "));
  d.dom.window.close();

  // 手机 390px：封面能渲染、无报错（布局溢出由真机复核，jsdom 不量布局）
  const m = makeDom(390);
  await sleep(800);
  check("手机封面渲染", m.text().includes("人设类型学合测"));
  check("手机无报错", m.errors.length === 0, m.errors.join(" | "));

  // 选项按钮不叠加全局音：pointerdown 落在选项上不发全局音，点击仍有自己的顺序单音
  m.btn("单测本能").click();
  await sleep(300);
  const mOpt = [...m.window.document.querySelectorAll("button")].find((b) =>
    /^a\./.test(b.textContent.trim())
  );
  if (!mOpt) {
    check("手机本能第一题有选项", false);
  } else {
    const t0 = m.tones();
    mOpt.dispatchEvent(new m.window.MouseEvent("pointerdown", { bubbles: true, clientX: 100 }));
    check("选项 pointerdown 不叠加全局音", m.tones() === t0, "tones=" + m.tones());
    mOpt.click();
    await sleep(120);
    check("选项点击仍有自己的顺序单音", m.tones() === t0 + 1 && m.lastFreq() === 523.25, "freq=" + m.lastFreq());
    m.window.document.body.dispatchEvent(new m.window.MouseEvent("pointerdown", { bubbles: true, clientX: 10 }));
    check("手机空白处点按发 C4", m.tones() === t0 + 2 && m.lastFreq() === 261.63, "freq=" + m.lastFreq());
  }
  m.dom.window.close();

  console.log(failures === 0 ? "\nall render tests passed" : `\n${failures} render test(s) failed`);
  process.exit(failures ? 1 : 0);
})().catch((e) => {
  console.error("render test crashed:", e);
  process.exit(2);
});
