import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import MotionProvider from "@/components/MotionProvider";
import NeuralCursor from "@/components/NeuralCursor";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Parth Sood — Applied AI Engineer",
    template: "%s · Parth Sood",
  },
  description:
    "Chemist of applied AI. Clinical NLP and cohort pipelines by day; vector indexes, agent systems and the evals that keep them honest by night.",
  openGraph: {
    title: "Parth Sood — Applied AI Engineer",
    description:
      "Clinical NLP, retrieval infrastructure and the evals that keep agents honest.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        <MotionProvider>
          <LoadingScreen />
          <NeuralCursor />
          <Nav />
          <main>{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
