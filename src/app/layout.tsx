import { Geist, Geist_Mono, Hanken_Grotesk, Jost, Zen_Old_Mincho } from "next/font/google";
import { currentLocationSlug } from "@/lib/location";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jost = Jost({
  variable: "--font-jost-v",
  subsets: ["latin"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken-v",
  subsets: ["latin"],
});

/* Serif display + the brand's kanji accents. preload:false emits the full
 * unicode-range face set, so the browser fetches only the slices it renders
 * (latin + the handful of kanji) instead of preloading all of Japanese. */
const mincho = Zen_Old_Mincho({
  variable: "--font-mincho-v",
  weight: ["400", "700", "900"],
  preload: false,
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  const theme = currentLocationSlug() === "chattanooga" ? "market" : "classic";
  return (
    <html
      lang="en"
      data-theme={theme}
      className={`${geistSans.variable} ${geistMono.variable} ${jost.variable} ${hanken.variable} ${mincho.variable} h-full antialiased`}
    >
      <body className={`min-h-full flex flex-col ${theme === "market" ? "m-grain" : ""}`}>
        {children}
      </body>
    </html>
  );
}
