// Minimal stand-in for the Canvas kit, used only for the GitHub Pages build.
// The test paints its own warm-paper plate; this Page is just the outer margin.
import React from "react";
export { useState, useEffect, useMemo, useRef, useCallback, useReducer, Fragment } from "react";
export type { ReactNode, ChangeEvent, CSSProperties, KeyboardEvent, MouseEvent } from "react";
export function Page(p: { title: string; summary?: string; lang?: string; children?: React.ReactNode; width?: string }) {
  if (typeof document !== "undefined" && document.title !== p.title) document.title = p.title;
  return <main lang={p.lang} style={{ maxWidth: 840, margin: "0 auto", padding: "clamp(12px, 4vw, 40px) clamp(8px, 3vw, 20px) 64px" }}>{p.children}</main>;
}
