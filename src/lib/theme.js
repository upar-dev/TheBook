import { writable, derived } from "svelte/store";

// ── Theme definitions ──
// Add new themes here. Each needs a unique id, label, and full color set.
export const themes = [
  {
    id: "light",
    label: "Light",
    // CSS / Tailwind colors
    bg: "#F3F4F4",
    text: "#2C2C2C",
    rose: "#853953",
    plum: "#612D53",
    accent: "#853953",
    muted: "rgba(44, 44, 44, 0.15)",
    mutedText: "rgba(44, 44, 44, 0.35)",
    // 3D book colors
    coverColor: "#853953",
    spineColor: "#6E2F48",
    pageColor: "#FFFEF5",
    pageEdgeColor: "#FFEF5F",
    coverTextColor: "#FFFFFF",
    coverTextMuted: "rgba(255,255,255,0.5)",
    coverBorder: "rgba(255,255,255,0.12)",
    // Card colors
    secondary: "#853953",
    antiPrimary: "#FFFFFF",
  },
  {
    id: "dark",
    label: "Dark",
    bg: "#1A1A1A",
    text: "#E8E8E8",
    rose: "#c73e6d",
    plum: "#ad5094",
    accent: "#c73e6d",
    muted: "rgba(232, 232, 232, 0.12)",
    mutedText: "rgba(232, 232, 232, 0.35)",
    coverColor: "#c73e6d",
    spineColor: "#a33358",
    pageColor: "#FFFEF5",
    pageEdgeColor: "#FFEF5F",
    coverTextColor: "#FFFFFF",
    coverTextMuted: "rgba(255,255,255,0.5)",
    coverBorder: "rgba(255,255,255,0.15)",
    secondary: "#c73e6d",
    antiPrimary: "#2A2A2A",
  },
  {
    id: "navy-gold",
    label: "Navy & Gold",
    bg: "#A9A9A9",
    text: "#1B2A4A",
    rose: "#C8A84E",
    plum: "#1B2A4A",
    accent: "#C8A84E",
    muted: "rgba(27, 42, 74, 0.12)",
    mutedText: "rgba(27, 42, 74, 0.40)",
    coverColor: "#1B2A4A",
    spineColor: "#142038",
    pageColor: "#FFFEF5",
    pageEdgeColor: "#C8A84E",
    coverTextColor: "#C8A84E",
    coverTextMuted: "rgba(200, 168, 78, 0.50)",
    coverBorder: "rgba(200, 168, 78, 0.20)",
    secondary: "#1B2A4A",
    antiPrimary: "#FFFFFF",
  },
];

// ── Current theme id ──
export const currentThemeId = writable("light");

// ── Derived: full theme object ──
export const currentTheme = derived(currentThemeId, ($id) => {
  return themes.find((t) => t.id === $id) || themes[0];
});

// ── Apply CSS custom properties to :root ──
if (typeof window !== "undefined") {
  currentTheme.subscribe((theme) => {
    const root = document.documentElement;
    root.style.setProperty("--color-cream", theme.bg);
    root.style.setProperty("--color-charcoal", theme.text);
    root.style.setProperty("--color-rose", theme.rose);
    root.style.setProperty("--color-plum", theme.plum);
    root.style.setProperty("--color-secondary", theme.secondary);
    root.style.setProperty("--color-anti", theme.antiPrimary);

    // Smooth transition on theme change
    root.style.setProperty("transition", "background-color 0.4s ease, color 0.4s ease");
  });
}