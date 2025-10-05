import "./globals.css";
import StyledComponentsRegistry from "@/lib/registry";
import { fontMap } from "@/lib/fontManager";
import { Toaster } from "react-hot-toast";
import ClientWrapper from "@/components/ClientWrapper";
import LayoutProvider from "@/components/LayoutProvider";

const allFontVariables = Object.values(fontMap)
  .map((font) => font.variable)
  .join(" ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <body className={`${allFontVariables} ${fontMap.hezare.className}`}>
        <StyledComponentsRegistry>
          <ClientWrapper>
            <Toaster position="top-center" />
            <LayoutProvider>{children}</LayoutProvider>
          </ClientWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
