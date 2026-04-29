# Authly · Backend

Express + Mongoose + Redis. Entry point: `src/server.js`.

## Quick start

```bash
cp .env.example .env
npm run gen-secrets   # paste output into .env
# fill MONGODB_URI / REDIS_URL / FRONTEND_URL / SMTP_USER / SMTP_PASS
npm install
npm run dev
```

Visit `http://localhost:5000/api/v1/health`.

## Scripts

| Command              | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | Run with nodemon                                 |
| `npm start`          | Run with plain node                              |
| `npm run gen-secrets`| Print fresh JWT_SECRET + REFRESH_SECRET hex pair |

See the [root README](../README.md) for the full architecture, and
[docs/API.md](../docs/API.md) for the endpoint reference.
