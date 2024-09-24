import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";

import { Inter } from "next/font/google";

import NavBar from "@/components/NavBar";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { cn, constructMetadata } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <Providers>
        <body
          className={cn(
            "grainy min-h-screen font-sans antialiased",
            inter.className,
          )}
        >
          <Toaster />
          <NavBar />
          {children}
        </body>
      </Providers>
    </html>
  );
}
