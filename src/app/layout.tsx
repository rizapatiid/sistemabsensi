import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PreventZoom from "@/components/PreventZoom";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";
import PushNotificationManager from "@/components/PushNotificationManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RMP DIGITALS - Sistem Pegawai Profesional",
  description: "Sistem Manajemen Kepegawaian, Absensi, dan Payroll Profesional",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  appleWebApp: {
    capable: true,
    title: "RMP Absensi",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="/iconapps.png" />
        <link rel="apple-touch-icon" href="/iconapps.png" />
      </head>
      <body>
        <RegisterServiceWorker />
        <PreventZoom />
        {children}
      </body>
    </html>
  );
}
