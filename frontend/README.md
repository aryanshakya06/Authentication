# Authly · Frontend

React 19 + Vite 7 + Tailwind CSS 4 + react-router 7.

## Quick start

```bash
cp .env.example .env
# set VITE_API_URL to your backend (http://localhost:5000 by default)
npm install
npm run verify     # lint + build + smoke (one-shot)
npm run dev
```

Visit `http://localhost:5173`.

## Scripts

| Command             | Purpose                                                       |
| ------------------- | ------------------------------------------------------------- |
| `npm run dev`       | Vite dev server with HMR                                      |
| `npm run build`     | Production bundle to `dist/`                                  |
| `npm run preview`   | Serve the production build                                    |
| `npm run lint`      | ESLint                                                        |
| `npm run smoke`     | 16-assertion smoke test (theme registry, FOUC, built CSS)     |
| `npm run verify`    | `lint` + `build` + `smoke`                                    |

## Structure

- `src/components/ui/` — Button, Input, PasswordInput, Spinner, FormCard
- `src/components/layout/` — Navbar (with Themes button), Footer
- `src/components/{ProtectedRoute,ErrorBoundary,ThemePicker}.jsx`
- `src/pages/` — Landing, Home (auth dashboard), Login, Register, VerifyOTP, Verify, ForgotPassword, ResetPassword, Dashboard (admin), NotFound
- `src/lib/api.js` — axios instance with refresh + CSRF interceptors
- `src/lib/errors.js` — `getErrorMessage` / `showError`
- `src/context/AppContext.jsx` — auth state (`user`, `isAuth`, `loading`, `logoutUser`)
- `src/context/ThemeContext.jsx` — `<ThemeProvider>` + `useTheme()` hook with `localStorage` persistence
- `src/hooks/useAuth.js`, `src/hooks/usePageTitle.js`
- `src/routes/AppRoutes.jsx` — full router with `ProtectedRoute` / `PublicOnlyRoute`
- `src/styles/themes/` — `_base.css` + 6 theme files + `index.js` registry

## Theming

Six themes available out of the box:

| id              | mode  | accent       |
| --------------- | ----- | ------------ |
| `authly`        | light | indigo 600   |
| `rose`          | light | rose 600     |
| `mint`          | light | teal 500     |
| `purple-night`  | dark  | fuchsia 500  |
| `midnight-blue` | dark  | cyan 500     |
| `obsidian`      | dark  | pure white   |

The active theme is the `data-theme` attribute on `<html>`, which is set BEFORE the first paint by an inline script in `index.html` (reads `localStorage["authly:theme"]`, falls back to `authly` — zero FOUC on reload). Each theme declares the same set of CSS custom properties (`--bg`, `--bg-elev`, `--fg`, `--fg-muted`, `--line`, `--brand`, `--on-brand`, `--hero-grad`, ...). Tailwind v4's `@theme inline` block in `src/index.css` exposes them as utility classes (`bg-page`, `bg-card`, `text-fg`, `bg-brand`, `text-on-brand`, ...) so components stay theme-aware without inline styles.

To add a 7th theme:

1. Drop a `src/styles/themes/<id>.css` with a `[data-theme="<id>"]` block.
2. Add an `@import` for it in `src/index.css`.
3. Add an entry to `THEMES` in `src/styles/themes/index.js`.
4. Add the id to the `VALID` array in the inline script in `index.html`.

The smoke test (`npm run smoke`) verifies steps 1–4 are consistent.

See the [root README](../README.md) for the full picture.
