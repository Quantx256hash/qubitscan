import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { QubitScanShell } from "@/components/qubitscan/Shell";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "700"],
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "QubitScan — live Qubitor testnet explorer",
  description:
    "QubitScan reads the live Qubitor testnet directly: blocks, QubitorPQTxV1 transactions, ML-DSA accounts, and reconstructed post-quantum proofs.",
  metadataBase: new URL("https://qubitscan.org"),
  openGraph: {
    title: "QubitScan",
    description:
      "Live Qubitor testnet explorer — post-quantum, read straight from the chain.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="bg-qb-black text-qb-bone antialiased">
        <a href="#main" className="qb-skip">
          Skip to content
        </a>
        <QubitScanShell>
          <div id="main">{children}</div>
        </QubitScanShell>
      </body>
    </html>
  );
}
