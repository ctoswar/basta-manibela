import type { Metadata } from "next";
import { Oswald, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Basta Manibela | Quality Used Vehicles, Lipa City",
  description:
    "Quality vehicles. Trusted service. Satisfied every ride. Browse inspected, ready-to-drive used cars and motorcycles from Basta Manibela.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${oswald.variable} ${manrope.variable}`}>
      <body className="font-body antialiased">
        <SplashScreen />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
