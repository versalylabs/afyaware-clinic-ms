import type { Metadata } from "next";
import "./globals.css";
import { AfyawareProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Afyaware Medical Center — Outpatient Clinic, Pharmacy & Diagnostic Center",
  description:
    "Afyaware Medical Center is a premier private outpatient healthcare facility in Nairobi offering General Consultations, Antenatal & Maternal Care, Dental Surgery, Optical Refraction, Laboratory Diagnostics and Pharmacy services. Empanelled with SHA/SHIF and major insurers.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AfyawareProvider>{children}</AfyawareProvider>
      </body>
    </html>
  );
}
