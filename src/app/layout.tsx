import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CurrencyProvider } from "@/context/currency-context";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BOSSBOOK — Facturation Pro",
  description: "SaaS de facturation professionnel pour entrepreneurs africains et internationaux",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
          <CurrencyProvider>
            {children}
            <Toaster 
              position="top-center" 
              expand={false} 
              richColors 
              closeButton
              toastOptions={{
                style: {
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '24px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                  color: '#1c2537',
                  fontSize: '12px',
                  fontWeight: '600'
                },
                className: "dark:!bg-[#1c2537]/80 dark:!text-white dark:!border-white/10"
              }}
            />
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
