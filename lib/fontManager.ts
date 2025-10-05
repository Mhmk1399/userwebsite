import localFont from "next/font/local";
import {
  Cairo,
  Vazirmatn,
  Amiri,
  Almarai,
  Markazi_Text,
} from "next/font/google";

// Local Persian fonts
export const hezare = localFont({
  src: [
    {
      path: "../next-persian-fonts/dohezar/Hezareh Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../next-persian-fonts/dohezar/Hezareh Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-hezare",
  display: "swap",
});

export const esterdad = localFont({
  src: [
    {
      path: "../next-persian-fonts/esterdad/Estedad-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../next-persian-fonts/esterdad/Estedad-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-esterdad",
  display: "swap",
});

export const sahel = localFont({
  src: "../next-persian-fonts/sahel/Sahel-VF.woff2",
  variable: "--font-sahel",
  display: "swap",
});

export const rey = localFont({
  src: [
    {
      path: "../next-persian-fonts/ray/Ray.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../next-persian-fonts/ray/Ray-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-ray",
  display: "swap",
});

// Google fonts
export const vazir = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazir",
  display: "swap",
});

export const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
});

export const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-amiri",
  display: "swap",
});

export const almarai = Almarai({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-almarai",
  display: "swap",
});

export const markaziText = Markazi_Text({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-markazi-text",
  display: "swap",
});

// Font mapping
export const fontMap = {
  hezare,
  esterdad,
  sahel,
  rey,
  vazir,
  cairo,
  amiri,
  almarai,
  markaziText,
} as const;

export type FontName = keyof typeof fontMap;

export const getFontClass = (fontName: string): string => {
  const normalizedName = fontName.toLowerCase() as FontName;
  return fontMap[normalizedName]?.className || fontMap.hezare.className;
};

export const getFontVariable = (fontName: string): string => {
  const normalizedName = fontName.toLowerCase() as FontName;
  return fontMap[normalizedName]?.variable || fontMap.hezare.variable;
};
