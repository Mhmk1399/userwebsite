import localFont from "next/font/local";

export const esterdad = localFont({
  src: [
    {
      path: "./Estedad-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Estedad-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-esterdad",
  display: "swap",
});