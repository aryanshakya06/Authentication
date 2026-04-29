#!/usr/bin/env node
import crypto from "node:crypto";

const hex = (bytes) => crypto.randomBytes(bytes).toString("hex");

const jwtSecret = hex(64);
const refreshSecret = hex(64);

const banner =
    "============================================================\n" +
    " Generated 64-byte secrets. Paste into backend/.env\n" +
    " (do NOT commit them; backend/.env is gitignored)\n" +
    "============================================================";

console.log(banner);
console.log();
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`REFRESH_SECRET=${refreshSecret}`);
console.log();
console.log("Tip: rerun this script to rotate the secrets at any time.");
