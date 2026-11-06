# ADR 0001：工具鏈基準與決策紀錄方式

- 狀態：已採用
- 日期：2026-11-06

## 背景

專案從空的儲存庫開始，之後每個階段都會由我與 Claude Code 反覆修改。需要先固定一套開發環境與規範，讓本機（Windows 11）與 CI（Linux）用同一組指令得到相同結果，並讓重大決策有地方記錄。

## 決策

1. **以 ADR 記錄重大決策。** 放在 `docs/adr/`，一個決策一個檔，檔名為 `NNNN-kebab-case-title.md`，採精簡的 MADR 格式（背景、決策、後果）。已採用的 ADR 不改寫；決策改變時新增一份 ADR 取代舊的。
2. **Node.js 26（LTS）。** 版本寫在 `.nvmrc`，CI 與 Vercel 都讀同一個版本。
3. **pnpm 12，以 `package.json` 的 `packageManager` 鎖定精確版本。** Node 25 起不再內建 corepack，因此本機以 `npm i -g pnpm` 安裝；版本不符時 pnpm 會自行切換到鎖定的版本。依賴的 build script 預設封鎖，只有列在 `pnpm-workspace.yaml` 的 `allowBuilds` 中的套件才能執行。
4. **Next.js 16（App Router）+ React 19 + TypeScript strict。** Next.js 16 已移除 `next lint`，改用 ESLint CLI 搭配 flat config（`eslint-config-next` 的 core-web-vitals 與 typescript 設定）。型別檢查用 `next typegen && tsc --noEmit`，不必為了檢查型別而完整建置。
5. **TypeScript 暫時鎖在 6.0.x。** TypeScript 7 已是 latest，但 `typescript-eslint`（`eslint-config-next` 依賴它）目前只支援 `<6.1.0`。等 `typescript-eslint` 支援 7.x 後再升級。
6. **格式與 lint：Prettier + ESLint；Python 端之後用 Ruff。** 由 pre-commit 統一執行。本機沒有系統 Python，pre-commit 以 `uvx pre-commit` 執行，不另外安裝。
7. **CI 使用 GitHub Actions，步驟與本機指令相同：** `pnpm install --frozen-lockfile` → `format:check` → `lint` → `typecheck` → `build`。pnpm 與 Node 由官方的 `pnpm/setup` action 安裝並快取 store。
8. **換行統一為 LF**，由 `.gitattributes` 強制，避免 Windows 的 `core.autocrlf=true` 造成 CI 差異。

## 後果

- 好處：本機與 CI 結果一致；版本變更只需改 `.nvmrc` 與 `packageManager` 兩處；新加入的依賴若需要 build script，必須明確審核。
- 代價：TypeScript 暫時無法使用 7.x；未安裝 Python 時 pre-commit 依賴 uv。
- 待辦：測試框架（Vitest）等到出現 `src/lib` 純函式時再加入；Python 工具（Ruff、pytest、mypy）等到建立 `tools/` 時再加入 pre-commit 與 CI。
