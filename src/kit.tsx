import React from "react";
export { useState, useEffect, useMemo, useRef, useCallback, useReducer, Fragment } from "react";
export type { ReactNode, ChangeEvent, CSSProperties, KeyboardEvent, MouseEvent } from "react";
type N = React.ReactNode;
const T = {
  kind: "dark", bg: { base: "#0f1115", subtle: "#161a20", elevated: "#1c2128" },
  text: { primary: "#e8eaed", secondary: "#aab1bb", tertiary: "#7d8590", onColor: "#fff", onPrimary: "#0f1115", accent: "#6ea8fe", success: "#4ade80", warning: "#fbbf24", danger: "#f87171" },
  fill: { accentSubtle: "rgba(110,168,254,0.16)", primary: "#e8eaed" },
  border: { subtle: "#22272e", weak: "#2d333b", default: "#30363d", strong: "#444c56", focus: "#6ea8fe" },
  font: { family: "-apple-system,BlinkMacSystemFont,'PingFang SC','Noto Sans SC','Microsoft YaHei',sans-serif", mono: "ui-monospace,SFMono-Regular,Menlo,monospace",
    body1: { fontSize: "16px", lineHeight: "1.6" }, body2: { fontSize: "15px", lineHeight: "1.55" }, label: { fontSize: "13px", lineHeight: "1.4" }, code: { fontSize: "13px", lineHeight: "1.5" } },
  dataviz: { categorical: ["#6ea8fe", "#fbbf24", "#22d3ee"] },
};
export const useGrokTheme = (): any => T;
export function Page(p: { title: string; summary?: string; lang?: string; children?: N; width?: string }) {
  return <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 64px" }}><h1 style={{ fontSize: 24, margin: "0 0 8px" }}>{p.title}</h1>{p.summary ? <p style={{ color: T.text.secondary, margin: "0 0 16px" }}>{p.summary}</p> : null}{p.children}</main>;
}
export function Section(p: { heading?: string; caption?: string; children?: N }) {
  return <section style={{ marginTop: 32 }}>{p.heading ? <h2 style={{ fontSize: 19, margin: "0 0 4px" }}>{p.heading}</h2> : null}{p.caption ? <div style={{ color: T.text.tertiary, fontSize: 13, marginBottom: 8 }}>{p.caption}</div> : null}<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{p.children}</div></section>;
}
export const Text = (p: { children?: N }) => <p style={{ margin: 0, color: T.text.primary }}>{p.children}</p>;
export const Callout = (p: { tone?: string; children?: N }) => <div style={{ padding: 12, borderRadius: 8, border: `1px solid ${T.text.warning}55`, background: "rgba(251,191,36,0.08)", color: T.text.primary }}>{p.children}</div>;
export function Table(p: { columns: string[]; rows: N[][]; align?: string[] }) {
  const al = (i: number) => (p.align && p.align[i] === "end" ? "right" : "left") as any;
  return <div style={{ overflowX: "auto" }}><table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}><thead><tr>{p.columns.map((c, i) => <th key={i} style={{ textAlign: al(i), padding: "6px 8px", color: T.text.secondary, borderBottom: `1px solid ${T.border.default}`, fontWeight: 500 }}>{c}</th>)}</tr></thead><tbody>{p.rows.map((r, j) => <tr key={j}>{r.map((c, i) => <td key={i} style={{ textAlign: al(i), padding: "6px 8px", borderBottom: `1px solid ${T.border.subtle}` }}>{c}</td>)}</tr>)}</tbody></table></div>;
}
export function Bars(p: { bars: { label: string; value: number; display: string }[] }) {
  const mx = Math.max(100, ...p.bars.map((b) => b.value));
  return <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{p.bars.map((b) => <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 28, fontSize: 13 }}>{b.label}</span><div style={{ flex: 1, background: T.bg.subtle, borderRadius: 4, height: 14 }}><div style={{ width: `${(100 * b.value) / mx}%`, background: T.dataviz.categorical[0], height: 14, borderRadius: 4 }} /></div><span style={{ width: 32, textAlign: "right", fontSize: 13 }}>{b.display}</span></div>)}</div>;
}
export const Properties = (p: { items: { label: string; value: N }[] }) => <div>{p.items.map((it) => <div key={it.label} style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "8px 0", borderBottom: `1px solid ${T.border.subtle}` }}><span style={{ color: T.text.secondary, minWidth: 80 }}>{it.label}</span><span style={{ flex: 1, minWidth: 0, wordBreak: "break-word" }}>{it.value}</span></div>)}</div>;
export const Button = (p: { label: string; onClick: () => void }) => <button onClick={p.onClick} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${T.border.strong}`, background: T.bg.elevated, color: T.text.primary, fontSize: 14, cursor: "pointer" }}>{p.label}</button>;
export const LinkCards = (p: { links: { title: string; site?: string; href: string }[] }) => <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{p.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer" style={{ display: "block", padding: 12, borderRadius: 8, border: `1px solid ${T.border.default}`, color: T.text.primary, textDecoration: "none" }}><div>{l.title}</div><div style={{ color: T.text.tertiary, fontSize: 13 }}>{l.site}</div></a>)}</div>;
