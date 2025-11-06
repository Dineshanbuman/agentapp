import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // temporary until Intro font is hosted
import "./globals.css";
import { AuthProvider } from "../app/context/AuthContext";
import Script from "next/script";

const poppins = Poppins({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Wendy’s Customer Care Platform",
  description: "Empowering smarter, more personalized Customer Care experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
