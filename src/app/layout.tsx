import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Navigation } from "@/components/Navigation";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MovieRec - Movie & TV Show Recommendations",
  description: "Discover your next favorite movie or TV show with personalized recommendations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="relative min-h-screen">
            <Navigation />
            <main className="container py-8">{children}</main>
            <Toaster position="bottom-right" />
          </div>
        </Providers>
      </body>
    </html>
  );
}
