import type { ThemeContent } from "@/lib/content";
import { SANS_FONTS, SERIF_FONTS, googleFontsUrl } from "@/lib/fonts";

interface ThemeInjectorProps {
  theme: ThemeContent;
}

/**
 * Server component that renders an inline <style> block overriding brand
 * CSS variables and @imports any non‑default Google Fonts.
 * Renders server-side so there's zero flash of unstyled content.
 */
export default function ThemeInjector({ theme }: ThemeInjectorProps) {
  const sansOpt  = SANS_FONTS.find((f) => f.name === theme.sansFont);
  const serifOpt = SERIF_FONTS.find((f) => f.name === theme.serifFont);

  // Collect Google Font queries that need to be loaded (non-default only)
  const fontQueries: string[] = [];
  if (sansOpt?.googleQuery)  fontQueries.push(sansOpt.googleQuery);
  if (serifOpt?.googleQuery) fontQueries.push(serifOpt.googleQuery);

  const fontImport = fontQueries.length
    ? `@import url('${googleFontsUrl(fontQueries)}');`
    : "";

  const sansCss  = sansOpt  ? `--font-sans:  ${sansOpt.stack};`  : "";
  const serifCss = serifOpt ? `--font-serif: ${serifOpt.stack};` : "";

  const css = `
${fontImport}
:root {
  --background: ${theme.background};
  --foreground: ${theme.foreground};
  --primary:    ${theme.primary};
  --accent:     ${theme.accent};
  --secondary:  ${theme.secondary};
  ${sansCss}
  ${serifCss}
}
`.trim();

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
