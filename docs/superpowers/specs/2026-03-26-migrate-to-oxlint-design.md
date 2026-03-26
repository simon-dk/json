# Migrate ESLint to oxlint — Design

**Goal:** Replace the ESLint v10 setup (broken due to legacy config format) with oxlint — simpler, faster, zero config complexity.

**Why:** ESLint v10 dropped `.eslintrc.js` support. Migrating to flat config requires significant churn across multiple plugins. oxlint covers all rules that matter for this pure TypeScript utility monorepo.

---

## What is removed

- `packages/config/eslint/base.js` and the `eslint/` directory
- `.eslintrc.js` at root
- All ESLint devDependencies from `packages/config`: `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `@vercel/style-guide`, `eslint`, `eslint-config-airbnb`, `eslint-config-prettier`, `eslint-config-turbo`, `eslint-import-resolver-typescript`, `eslint-plugin-import`, `eslint-plugin-jest`, `eslint-plugin-only-warn`
- `eslint/base.js` from the `files` array in `packages/config/package.json`
- `@saxs/config` devDependency from root `package.json` (was only needed for the shared ESLint config)

## What is added

`oxlint` to root devDependencies.

`oxlint.config.json` at repo root:
```json
{
  "plugins": ["typescript"],
  "rules": {
    "no-console": "off",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "warn"
  },
  "ignorePatterns": ["**/dist/**"]
}
```

## Rule mapping

| Old rule | New | Notes |
|---|---|---|
| `eslint:recommended` | oxlint default | Covered |
| `@typescript-eslint/recommended` | `"plugins": ["typescript"]` | Covered |
| `plugin:jest/recommended` | Dropped | No longer using Jest |
| `airbnb/base` | Dropped | Style rules Prettier already handles; correctness rules covered by oxlint defaults |
| `no-console: off` | `"no-console": "off"` | Preserved |
| `no-shadow: off` | `"no-shadow": "off"` | Preserved |
| `@typescript-eslint/no-shadow: warn` | `"@typescript-eslint/no-shadow": "warn"` | Preserved |
| `@typescript-eslint/naming-convention` (no I-prefix) | Dropped | Not available in oxlint; agreed to drop |
| `import/*` rules | Dropped | Not available in oxlint; covered by TypeScript compiler |

## Script change

Root `package.json` lint script:
```
"lint": "oxlint ."
```

## Verification

Run `bun run lint` — should exit 0 with no errors on the existing codebase.
