import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hybrid Bottom — Controlled Root Interface",
  description: "A tunable root-pruning interface driven by geometry, membrane and airflow.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Hybrid Bottom — Controlled Root Interface",
    description: "Design the pause before the branch.",
    images: [{ url: "/og.png", width: 1536, height: 1024 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hybrid Bottom — Controlled Root Interface",
    description: "Design the pause before the branch.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
