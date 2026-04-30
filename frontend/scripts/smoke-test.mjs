#!/usr/bin/env node
// Quick smoke test: verifies the theme registry is structurally sound and the
// production build artifacts include the data-theme machinery.
//
// Run from the frontend/ directory:  node scripts/smoke-test.mjs

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

let passed = 0;
let failed = 0;

const test = (name, fn) => {
    try {
        fn();
        console.log(`  ✓ ${name}`);
        passed++;
    } catch (err) {
        console.error(`  ✗ ${name}\n      ${err.message}`);
        failed++;
    }
};

console.log("\n== Authly frontend smoke test ==\n");

console.log("Theme registry");
const registry = await import("../src/styles/themes/index.js");

test("THEMES is a non-empty array", () => {
    if (!Array.isArray(registry.THEMES) || registry.THEMES.length === 0) {
        throw new Error("THEMES missing or empty");
    }
});

test("Has 6 themes (3 light + 3 dark)", () => {
    if (registry.THEMES.length !== 6) {
        throw new Error(`expected 6 themes, got ${registry.THEMES.length}`);
    }
    const light = registry.THEMES.filter((t) => t.group === "light").length;
    const dark = registry.THEMES.filter((t) => t.group === "dark").length;
    if (light !== 3 || dark !== 3) {
        throw new Error(`expected 3 light + 3 dark, got ${light} light + ${dark} dark`);
    }
});

test("Every theme has id, label, group, description, swatch", () => {
    for (const t of registry.THEMES) {
        for (const k of ["id", "label", "group", "description", "swatch"]) {
            if (!t[k]) throw new Error(`theme ${t.id || "?"} missing ${k}`);
        }
        for (const k of ["bg", "card", "brand", "text"]) {
            if (!t.swatch[k]) throw new Error(`theme ${t.id} swatch missing ${k}`);
        }
    }
});

test("DEFAULT_THEME exists in registry", () => {
    if (!registry.VALID_THEME_IDS.includes(registry.DEFAULT_THEME)) {
        throw new Error(`DEFAULT_THEME=${registry.DEFAULT_THEME} not in VALID_THEME_IDS`);
    }
});

test("isValidThemeId true for each registered id", () => {
    for (const t of registry.THEMES) {
        if (!registry.isValidThemeId(t.id)) throw new Error(`${t.id} flagged invalid`);
    }
});

test("isValidThemeId false for junk input", () => {
    for (const v of [null, undefined, "", "nope", 42, {}]) {
        if (registry.isValidThemeId(v)) throw new Error(`${String(v)} should be invalid`);
    }
});

console.log("\nTheme CSS files");
for (const t of registry.THEMES) {
    test(`themes/${t.id}.css declares [data-theme="${t.id}"]`, () => {
        const css = readFileSync(path.join(root, "src/styles/themes", `${t.id}.css`), "utf8");
        const selector = `[data-theme="${t.id}"]`;
        if (!css.includes(selector)) throw new Error(`missing selector ${selector}`);
        for (const v of ["--bg", "--bg-elev", "--fg", "--fg-muted", "--line", "--brand", "--on-brand"]) {
            if (!css.includes(v)) throw new Error(`${t.id}.css missing var ${v}`);
        }
    });
}

console.log("\nFOUC inline script");
test("index.html has the FOUC bootstrap script with all 6 ids", () => {
    const html = readFileSync(path.join(root, "index.html"), "utf8");
    if (!/data-theme=/.test(html)) throw new Error("data-theme attribute missing on <html>");
    if (!/authly:theme/.test(html)) throw new Error("STORAGE_KEY missing in inline script");
    for (const t of registry.THEMES) {
        if (!html.includes(`"${t.id}"`)) {
            throw new Error(`theme id ${t.id} missing from inline script VALID array`);
        }
    }
});

console.log("\nProduction build");
test("dist/ exists (run npm run build first if this fails)", () => {
    if (!existsSync(path.join(root, "dist"))) {
        throw new Error("dist/ not found - run `npm run build`");
    }
    if (!existsSync(path.join(root, "dist/index.html"))) {
        throw new Error("dist/index.html missing");
    }
});

test("Built index.html preserves data-theme attribute and FOUC script", () => {
    const html = readFileSync(path.join(root, "dist/index.html"), "utf8");
    if (!/data-theme/.test(html)) throw new Error("built html missing data-theme attribute");
    if (!/authly:theme/.test(html)) throw new Error("built html missing FOUC script");
});

test("Built CSS contains all 6 [data-theme] selectors", () => {
    const distAssets = path.join(root, "dist/assets");
    const cssFile = readdirSync(distAssets).find((f) => f.endsWith(".css"));
    if (!cssFile) throw new Error("no css file in dist/assets");
    const css = readFileSync(path.join(distAssets, cssFile), "utf8");
    for (const t of registry.THEMES) {
        if (!css.includes(`[data-theme=${t.id}]`) && !css.includes(`[data-theme="${t.id}"]`)) {
            throw new Error(`built CSS missing [data-theme=${t.id}]`);
        }
    }
});

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
