import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import {
  Q, PO, EN, INS, FN, TYPES,
  questionsFor, includesPlayoffs, answersForMode, score, present,
  optionKeysOf, playoffPairSet, playoffCountByPair, expectedPlayoffPairs,
  appearance, eUnlockThreshold, iUnlockThreshold, DISCLAIMER,
  type Ans, type Mode, type Item,
} from "../src/model";
import {
  ENNEA_PROFILES, TYPE_PROFILES, INS_PROFILES, STACK_NOTES, AXIS_NOTES,
  enneaProfileComplete, allEnneaCatalog, buildReading,
} from "../src/profiles";

let failed = 0;
function eq(name: string, got: unknown, want: unknown): void {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) {
    failed++;
    console.error("FAIL", name, "\n  got ", got, "\n  want", want);
  } else console.log("ok  ", name);
}
function ok(name: string, cond: boolean, detail?: unknown): void {
  if (!cond) {
    failed++;
    console.error("FAIL", name, detail ?? "");
  } else console.log("ok  ", name);
}

const root = path.resolve(__dirname, "..");
const legacy = JSON.parse(fs.readFileSync(path.join(root, "test/legacy-keys.json"), "utf8"));

// design files unchanged
const pins: Record<string, string> = {
  "src/starfield.tsx": "69a9750e1e3e0e068a74c721051267fd3c05e51d706622c199164e49aa7824ca",
  "src/sound.ts": "d557ab7bfe2b5759eff6f6292ad82570e227fda3f5157efd1d982a31da9ef272",
};
for (const [rel, pin] of Object.entries(pins)) {
  const h = crypto.createHash("sha256").update(fs.readFileSync(path.join(root, rel))).digest("hex");
  eq("design pin " + rel, h, pin);
}

// mode counts
eq("合测题量", questionsFor("all").length, 101);
eq("八维题量", questionsFor("eight").length, 47);
eq("九型题量", questionsFor("ennea").length, 36);
eq("本能题量", questionsFor("instinct").length, 18);
ok("合测 = 三者之和", questionsFor("all").length === 47 + 36 + 18);
ok("合测与九型含加赛", includesPlayoffs("all") && includesPlayoffs("ennea") && !includesPlayoffs("eight") && !includesPlayoffs("instinct"));

// legacy keys preserved
const oldIds = Object.keys(legacy.Q);
ok("旧题数量 74", oldIds.length === 74);
for (const id of oldIds) {
  const got = optionKeysOf(id);
  const want = legacy.Q[id].keys;
  if (JSON.stringify(got) !== JSON.stringify(want)) {
    failed++;
    console.error("FAIL legacy keys", id, got, want);
  }
}
const still = oldIds.filter((id) => Q.some((q: Item) => q.id === id));
eq("旧题仍在", still.length, 74);
console.log("ok   旧题 option key 与 st/c 对照完毕（全部比对）");
for (const id of oldIds) {
  const q = Q.find((x: Item) => x.id === id)!;
  if ((q.st ?? null) !== (legacy.Q[id].st ?? null) || (q.c ?? null) !== (legacy.Q[id].c ?? null) || q.g !== legacy.Q[id].g) {
    failed++;
    console.error("FAIL legacy flags", id, q.g, q.st, q.c, legacy.Q[id]);
  }
}

// ennea balance + playoff coverage
const eApp = appearance("e", EN);
ok("九型每型至少 12 次出现", EN.every((k) => eApp[k] >= 12), eApp);
ok("九型出现次数不过分失衡", Math.max(...EN.map((k) => eApp[k])) - Math.min(...EN.map((k) => eApp[k])) <= 1, eApp);
const pairs = expectedPlayoffPairs();
eq("加赛型对应为 36", pairs.length, 36);
eq("加赛库覆盖全部型对", playoffPairSet(), pairs);
const pc = playoffCountByPair();
ok("每对加赛恰好 3 题", pairs.every((k) => pc[k] === 3), pc);
eq("加赛总题 108", PO.length, 108);

const iApp = appearance("i", INS);
ok("本能三项各 18 次", INS.every((k) => iApp[k] === 18), iApp);

eq("九型加赛门槛（36 题）", eUnlockThreshold(36), 29);
eq("九型加赛门槛（18 题仍为 15）", eUnlockThreshold(18), 15);
eq("本能门槛（18）", iUnlockThreshold(18), 10);
eq("本能门槛（9 仍为 5）", iUnlockThreshold(9), 5);

// complete a mode by picking first option (or typed key)
function complete(mode: Mode, pick: (q: Item, i: number) => number | string): Ans {
  const ans: Ans = {};
  questionsFor(mode).forEach((q, i) => { ans[q.id] = pick(q, i); });
  return ans;
}

function hasModuleLeak(readingMeasured: { label: string }[], mode: Mode): string[] {
  const leaks: string[] = [];
  const labels = readingMeasured.map((x) => x.label).join(" ");
  if (mode === "eight" && /九型|本能/.test(labels)) leaks.push("eight labels: " + labels);
  if (mode === "ennea" && /八维|本能/.test(labels)) leaks.push("ennea labels: " + labels);
  if (mode === "instinct" && /八维|九型/.test(labels)) leaks.push("instinct labels: " + labels);
  return leaks;
}

// each mode completable, results only for tested modules
(["all", "eight", "ennea", "instinct"] as Mode[]).forEach((mode) => {
  const ans = complete(mode, (_q, i) => 0);
  const P = present(ans, mode);
  ok(`${mode} 可完成`, P.done === P.total && P.unansweredMain === 0, { done: P.done, total: P.total });
  ok(`${mode} show flags`, (P.showEight === (mode === "all" || mode === "eight")) && (P.showEnnea === (mode === "all" || mode === "ennea")) && (P.showInstinct === (mode === "all" || mode === "instinct")));
  if (mode === "eight" || mode === "all") ok(`${mode} 八维不被全模块门槛误拦：功能题已满`, P.fnDone === P.fnTotal && P.fnDone >= 20);
  if (mode === "eight") {
    ok("单测八维无九型事实", P.enn.length === 0 && P.mainTxt === "" && P.needPairs.length === 0);
    ok("单测八维无本能事实", P.ins.every((x) => x.label !== "本能堆叠") || P.iTxt === "");
    ok("单测八维无九型附录数据冒充", P.eMain === "" && !P.showEnnea);
  }
  if (mode === "ennea") {
    ok("单测九型不输出八维轴", P.axes.length === 0 && P.mbti === "" && !P.showEight);
    ok("单测九型不输出本能堆叠", P.iTxt === "" && !P.showInstinct);
  }
  if (mode === "instinct") {
    ok("单测本能不输出八维或九型", P.axes.length === 0 && P.enn.length === 0 && !P.showEight && !P.showEnnea);
  }
  const reading = buildReading(P)!;
  const leaks = hasModuleLeak(reading.measured, mode);
  ok(`${mode} 解读测量层无未测模块`, leaks.length === 0, leaks);
  if (mode === "eight") ok("单测八维解读不含九型档案块", !reading.blocks.some((b) => b.id.startsWith("e") || b.id.startsWith("cat-") || b.title.includes("号")));
  if (mode === "ennea") ok("单测九型解读不含类型栈块", !reading.blocks.some((b) => b.id.startsWith("type-") || b.id === "axes"));
  if (mode === "instinct") ok("单测本能解读不含九型/八维块", !reading.blocks.some((b) => b.id.startsWith("e") || b.id.startsWith("type-") || b.id.startsWith("cat-")));
  const sketch = P.sketch;
  if (mode === "eight") ok("八维速写不含九型本能行", !sketch.includes("九型：") && !sketch.includes("本能："));
  if (mode === "ennea") ok("九型速写不含八维本能行", !sketch.includes("八维：") && !sketch.includes("本能：") && !sketch.includes("功能轴："));
  if (mode === "instinct") ok("本能速写不含八维九型行", !sketch.includes("八维：") && !sketch.includes("九型：") && !sketch.includes("功能轴："));
});

// mixing archives: answers from another mode are stripped
const mixed: Ans = { ...complete("ennea", () => 0), p1: 0, i1: 0 };
const stripped = answersForMode(mixed, "ennea");
ok("切换模式过滤掉八维和本能旧存档", stripped.p1 === undefined && stripped.i1 === undefined && stripped.e1 !== undefined);
const Pmix = present(mixed, "ennea");
ok("即使用混入答案呈现，单测九型仍不展示八维", !Pmix.showEight && Pmix.axes.length === 0 && Pmix.fnDone === 0);

// score formula regression: none deducts 0.25, idk excluded
const one: Ans = { e1: "none" };
const Snone = score(one, "ennea");
ok("都不是扣 0.25", Snone.e.e5 === 0 && Snone.en.e5 === 1 && Snone.ea.e5 === 1 && Snone.es.e5 === undefined || Snone.es.e5 === 0);
const Sidk = score({ e1: "idk" }, "ennea");
ok("我不知道不计分、不计入有效出现", (Sidk.ea.e5 || 0) === 0 && (Sidk.ek.e5 || 0) === 1 && Sidk.e.e5 === 0);

// pick all e4 (where present) should tend to lock 4 or at least rank it first after enough items
const ans4: Ans = {};
questionsFor("ennea").forEach((q) => {
  const i = q.o.findIndex((o) => o[0] === "e4");
  ans4[q.id] = i >= 0 ? i : "none";
});
const P4 = present(ans4, "ennea");
ok("倾向 4 号时可完成九型单测", P4.done === 36);
ok("压倒性选 4 时主型锁定为 4", P4.eMain === "e4", { main: P4.eMain, txt: P4.mainTxt, scores: P4.eRank.map((k) => k + ":" + P4.R.e[k]) });
const r4 = buildReading(P4)!;
ok("锁定 4 的解读含 4 号档案且为已锁", r4.blocks.some((b) => b.id === "e4" && b.locked));
ok("锁定时不会把未选中的型写成已锁主型", r4.blocks.filter((b) => b.locked && /^e\d$/.test(b.id)).every((b) => b.id === "e4"));

// ambiguous: split between two close types, no forced lock
const ansAm: Ans = {};
questionsFor("ennea").forEach((q, idx) => {
  const i4 = q.o.findIndex((o) => o[0] === "e4");
  const i5 = q.o.findIndex((o) => o[0] === "e5");
  if (idx % 2 === 0 && i4 >= 0) ansAm[q.id] = i4;
  else if (i5 >= 0) ansAm[q.id] = i5;
  else if (i4 >= 0) ansAm[q.id] = i4;
  else ansAm[q.id] = 0;
});
const Pam = present(ansAm, "ennea");
const ram = buildReading(Pam)!;
ok("暧昧结果不把主型假锁定，或若加赛也分不出则暂定", !(Pam.eMain && ram.certainty === "locked" && Math.abs((Pam.R.e[Pam.eRank[0]] || 0) - (Pam.R.e[Pam.eRank[1]] || 0)) < 15 && !Pam.viaPO) || !Pam.eMain || ram.certainty === "provisional" || Pam.viaPO);
if (!Pam.eMain) {
  ok("未锁主型时解读块均非已锁主型档案", ram.blocks.filter((b) => /^e\d$/.test(b.id)).every((b) => !b.locked));
  ok("未锁主型不判定翼", !Pam.wingLocked && /暂不|未锁|不判/.test(Pam.wingTxt + ram.measured.find((x) => x.label === "翼型")?.value));
  ok("暧昧解读 certainty 不是 locked", ram.certainty !== "locked");
}
ok("分差小时不会在测量层写死唯一主型除非加赛胜出", !Pam.eMain || Pam.viaPO || (Pam.R.e[Pam.eRank[0]] - Pam.R.e[Pam.eRank[1]] >= 15));

// insufficient answers: no fake certainty
const few: Ans = { e19: 0, e20: 0 };
const Pf = present(few, "ennea");
const rf = buildReading(Pf)!;
ok("题量不足时不锁主型", Pf.eMain === "");
ok("题量不足解读为 insufficient 或无已锁型档案", rf.certainty === "insufficient" && !rf.blocks.some((b) => b.locked && /^e\d$/.test(b.id)));

// profiles complete
ok("九型档案 9 份齐全", EN.every((k) => !!ENNEA_PROFILES[k]) && Object.keys(ENNEA_PROFILES).length === 9);
EN.forEach((k) => ok(`档案完整 ${k}`, enneaProfileComplete(k), ENNEA_PROFILES[k] && Object.fromEntries(["motive","fear","coping","strength","cost","stress","observe"].map((f) => [f, (ENNEA_PROFILES[k] as any)[f]?.length]))));
ok("目录含全部 9 型", allEnneaCatalog().length === 9 && EN.every((k) => allEnneaCatalog().some((b) => b.id === "cat-" + k)));
ok("16 型皆有可读说明", Object.keys(TYPES).every((t) => (TYPE_PROFILES[t] || "").length >= 200));
ok("本能三项皆有说明", INS.every((k) => (INS_PROFILES[k].text || "").length >= 200));
ok("六种堆叠皆有说明", ["sp/so","sp/sx","so/sp","so/sx","sx/sp","sx/so"].every((k) => !!STACK_NOTES[k]));
ok("四轴皆有说明", Object.keys(AXIS_NOTES).length === 4);
ok("免责声明包含非临床、非标准化、免费", /临床|标准化/.test(DISCLAIMER) && /免费/.test(DISCLAIMER));

// eight single can lock without e/i
const eightAns = complete("eight", () => 0);
const Pe = present(eightAns, "eight");
ok("单测八维在未答九型本能时仍能计算栈", Pe.fnDone >= 20 && Pe.R.ts.length === 16);

console.log(failed ? `\n${failed} failed` : "\nall tests passed");
if (failed) process.exit(1);
