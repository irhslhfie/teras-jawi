import localFont from "next/font/local";
import "./globals.css";
import { ProviderQuery } from "@/hooks/provider";
import { Toaster } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";

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

export const metadata = {
  title: "Teras Jawi - Property Management System",
  description: "Modern property management system for Teras Jawi housing development",
  keywords: "property, real estate, housing, Teras Jawi, management",
  authors: [{ name: "Khaerul Anam" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/images/web/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/web/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ProviderQuery>
            <Toaster 
              position="top-center" 
              richColors 
              closeButton
              duration={4000}
            />
            {children}
          </ProviderQuery>
        </ErrorBoundary>
      </body>
    </html>
  );
}