// Single source of truth for the theme registry.
//
// Adding a new theme:
//   1. Drop a CSS file at src/styles/themes/<id>.css with a [data-theme="<id>"] block.
//   2. Add an import for it in src/index.css (after _base.css).
//   3. Add an entry to THEMES below.
//   4. Add the id to the VALID array in the FOUC <script> in index.html.

export const THEMES = [
    {
        id: "authly",
        label: "Authly Light",
        group: "light",
        description: "The default. Indigo accents on a clean white surface.",
        swatch: { bg: "#f7f7fb", card: "#ffffff", brand: "#4f46e5", text: "#111827" }
    },
    {
        id: "rose",
        label: "Rose",
        group: "light",
        description: "Soft pinkish light with rose accents.",
        swatch: { bg: "#fff1f5", card: "#ffffff", brand: "#e11d48", text: "#4c0519" }
    },
    {
        id: "mint",
        label: "Mint",
        group: "light",
        description: "Pale teal-green light with deep teal accents.",
        swatch: { bg: "#effdf7", card: "#ffffff", brand: "#14b8a6", text: "#022c22" }
    },
    {
        id: "purple-night",
        label: "Purple Night",
        group: "dark",
        description: "Modern purplish dark with magenta accents.",
        swatch: { bg: "#160a26", card: "#20133a", brand: "#d946ef", text: "#f5e8ff" }
    },
    {
        id: "midnight-blue",
        label: "Midnight Blue",
        group: "dark",
        description: "Modern bluish dark with cyan accents.",
        swatch: { bg: "#0a1628", card: "#14253f", brand: "#06b6d4", text: "#e0f2fe" }
    },
    {
        id: "obsidian",
        label: "Obsidian",
        group: "dark",
        description: "Pure dark monochrome with high-contrast white accents.",
        swatch: { bg: "#050505", card: "#0d0d0d", brand: "#ffffff", text: "#fafafa" }
    }
];

export const DEFAULT_THEME = "purple-night";
export const STORAGE_KEY = "authly:theme";
export const VALID_THEME_IDS = THEMES.map((t) => t.id);

export const isValidThemeId = (id) =>
    typeof id === "string" && VALID_THEME_IDS.includes(id);

export const getThemeById = (id) =>
    THEMES.find((t) => t.id === id) ||
    THEMES.find((t) => t.id === DEFAULT_THEME);
