# Authly · Frontend

React 19 + Vite 7 + Tailwind CSS 4 + react-router 7.

## Quick start

```bash
cp .env.example .env
# set VITE_API_URL to your backend (http://localhost:5000 by default)
npm install
npm run dev
```

Visit `http://localhost:5173`.

## Scripts

| Command         | Purpose                          |
| --------------- | -------------------------------- |
| `npm run dev`   | Vite dev server with HMR         |
| `npm run build` | Production bundle to `dist/`     |
| `npm run preview` | Serve the production build      |
| `npm run lint`  | Run ESLint                       |

## Structure

- `src/components/ui/` — Button, Input, PasswordInput, Spinner, FormCard
- `src/components/layout/` — Navbar, Footer
- `src/components/{ProtectedRoute,ErrorBoundary}.jsx`
- `src/pages/` — Home, Login, Register, VerifyOTP, Verify, ForgotPassword, ResetPassword, Dashboard, NotFound
- `src/lib/api.js` — axios instance with refresh + CSRF interceptors
- `src/lib/errors.js` — `getErrorMessage` / `showError`
- `src/context/AppContext.jsx` — auth state (`user`, `isAuth`, `loading`, `logoutUser`)
- `src/hooks/useAuth.js`, `src/hooks/usePageTitle.js`
- `src/routes/AppRoutes.jsx` — full router with `ProtectedRoute` / `PublicOnlyRoute`

See the [root README](../README.md) for the full picture.
