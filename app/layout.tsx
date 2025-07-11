import type { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/registry";
import { hezare } from "../next-persian-fonts/dohezar";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "وبسایت کاربر",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${hezare.variable}`}>
        <StyledComponentsRegistry>
          <Header />
          <Toaster />
          {children}
          <Footer />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
