import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allow zooming for accessibility
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0052cc" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://work-in-comoros.km'),
  title: {
    default: "Work-in-Comoros | Plateforme RH & Recrutement",
    template: "%s | Work-in-Comoros"
  },
  description: "La première plateforme de recrutement moderne aux Comores. Trouvez votre talent idéal ou votre futur emploi en Grande Comore, Anjouan et Mohéli.",
  keywords: ["recrutement Comores", "emploi Comores", "RH Comores", "travail Comores", "WIC", "Work in Comoros"],
  authors: [{ name: "Work-in-Comoros Team" }],
  openGraph: {
    type: "website",
    locale: "fr_KM",
    url: "https://work-in-comoros.km",
    siteName: "Work-in-Comoros",
    title: "Work-in-Comoros | Plateforme RH & Recrutement",
    description: "Trouvez votre talent idéal ou votre futur emploi aux Comores.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Work-in-Comoros | Plateforme RH & Recrutement",
    description: "Trouvez votre talent idéal ou votre futur emploi aux Comores.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Work-in-Comoros",
  },
};

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
