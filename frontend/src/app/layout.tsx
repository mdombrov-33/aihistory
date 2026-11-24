// Root shell, local fonts and feature-owned visual integrations.

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/app/providers";
import { Navigation } from "@/components/app/navigation";
import "../styles/globals.css";
import "../features/discovery/discovery.css";
import "../features/lesson/player/player.css";
import "../features/lesson/media/media.css";
import "../features/lesson/scenes/layout.css";
import "../features/discovery/exhibit.css";
import "../features/lesson/scenes/gallery.css";
import "../features/lesson/shared/visual-exploration.css";
import "@xyflow/react/dist/style.css";
import "../features/lesson/shared/interactions.css";

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
          <a
            href="#main-content"
            className="skip-link py-3 px-5 fixed top-2 left-3 z-100 bg-primary text-primary-foreground [transform:translateY(-150%)] rounded-[6px] focus:[transform:translateY(0)]"
          >
            Skip to content
          </a>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
