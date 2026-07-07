import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "World News Explorer - Interactive Global News Map",
  description: "Explore news from around the world with an interactive map. Get the latest headlines, politics, business, technology, sports, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.variable} min-h-full flex flex-col antialiased bg-white dark:bg-black transition-colors duration-300`}>
        <ErrorBoundary>
          <AppProvider>
            {children}
          </AppProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
