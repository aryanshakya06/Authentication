# Authly · Frontend

React 19, Vite 7, react-router 7, axios, react-toastify. Hand-written CSS, no UI framework.

## Quick start

```bash
cp .env.example .env
# set VITE_API_URL to your backend (http://localhost:5000 by default)
npm install
npm run verify     # lint, build, smoke (one-shot)
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

- `src/index.css`. The full stylesheet. Reset, layout primitives, component classes (`.btn`, `.input`, `.form-card`, `.welcome`, `.tile`, etc.).
- `src/components/ui/`. Button, Input, PasswordInput, Spinner, FormCard.
- `src/components/layout/`. Navbar (with Themes button), Footer.
- `src/components/{ProtectedRoute,ErrorBoundary,ThemePicker}.jsx`.
- `src/pages/`. Landing, Home (auth dashboard), Login, Register, VerifyOTP, Verify, ForgotPassword, ResetPassword, Dashboard (admin), NotFound.
- `src/lib/api.js`. axios instance with refresh and CSRF interceptors.
- `src/lib/errors.js`. `getErrorMessage` and `showError`.
- `src/context/AppContext.jsx`. Auth state (`user`, `isAuth`, `loading`, `logoutUser`).
- `src/context/ThemeContext.jsx`. `<ThemeProvider>` and `useTheme()` hook with `localStorage` persistence.
- `src/hooks/useAuth.js`, `src/hooks/usePageTitle.js`.
- `src/routes/AppRoutes.jsx`. Full router with `ProtectedRoute` and `PublicOnlyRoute`.
- `src/styles/themes/`. `_base.css` + 6 theme files + `index.js` registry.

## Theming

Six themes available out of the box. Default is `purple-night`.

| id              | mode  | accent       |
| --------------- | ----- | ------------ |
| `authly`        | light | indigo 600   |
| `rose`          | light | rose 600     |
| `mint`          | light | teal 500     |
| `purple-night`  | dark  | fuchsia 500  |
| `midnight-blue` | dark  | cyan 500     |
| `obsidian`      | dark  | pure white   |

The active theme is the `data-theme` attribute on `<html>`. It is set BEFORE the first paint by an inline script in `index.html` that reads `localStorage["authly:theme"]` and falls back to the default. Zero FOUC on reload. Each theme declares the same set of CSS custom properties (`--bg`, `--bg-elev`, `--fg`, `--fg-muted`, `--line`, `--brand`, `--on-brand`, `--hero-grad`, etc.). Components in `src/index.css` use those tokens directly through plain CSS classes. No utility-class framework, no preprocessor.

To add a 7th theme:

1. Drop a `src/styles/themes/<id>.css` with a `[data-theme="<id>"]` block.
2. Add an `@import` for it in `src/index.css`.
3. Add an entry to `THEMES` in `src/styles/themes/index.js`.
4. Add the id to the `VALID` array in the inline script in `index.html`.

The smoke test (`npm run smoke`) verifies steps 1 through 4 stay consistent.

See the [root README](../README.md) for the full picture.
