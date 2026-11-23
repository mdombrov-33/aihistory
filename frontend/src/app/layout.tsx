import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/app/providers";
import { Navigation } from "@/components/app/navigation";
import "./globals.css";
import "./cinematic.css";
import "./scenes.css";
import "./interactions.css";
import "./scene-frame.css";
const sans = localFont({
  src: "./fonts/source-sans-3-variable.ttf",
  variable: "--font-source-sans",
  display: "swap",
  weight: "200 900",
});
const serif = localFont({
  src: "./fonts/zilla-slab-semibold.ttf",
  variable: "--font-zilla",
  display: "swap",
  weight: "600",
});
export const metadata: Metadata = {
  title: { default: "History — Follow your curiosity", template: "%s · History" },
  description:
    "Explore history through immersive stories, meaningful interactions and inspectable evidence. A prepared frontend preview.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#10151f" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${sans.variable} ${serif.variable}`}
    >
      <body>
        <Providers>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
