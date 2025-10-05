import localFont from "next/font/local";

export const rey = localFont({
  src: [
    {
      path: "./Ray.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Ray-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-ray",
  display: "swap",
});