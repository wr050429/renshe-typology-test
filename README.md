# 人设类型学合测 · 轴向版

八维（功能轴 + 主辅先后）× 九型（动机三选一 + 加赛）× 本能（最像 / 最不像）的静态测试页。

- 在线地址：https://wr050429.github.io/renshe-typology-test/
- `index.html` + `app.js` 是构建产物，直接由 GitHub Pages 提供。
- 源码在 `src/`：`app.tsx`（题库与计分）、`kit.tsx`（界面组件）、`main.tsx`。
- 重新构建：`npm i react@18 react-dom@18 esbuild && npx esbuild src/main.tsx --bundle --minify --jsx=automatic --outfile=app.js`
