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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "RMP DIGITALS - Sistem Pegawai Profesional",
  description: "Sistem Manajemen Kepegawaian, Absensi, dan Payroll Profesional",
  icons: {
    icon: "/logositus.png",
    apple: "/logositus.png",
  },
  appleWebApp: {
    capable: true,
    title: "RMP Absensi",
    statusBarStyle: "black-translucent",
  },
};

import { getSession } from "@/actions/auth";
import { getSystemSettings } from "@/lib/settings";
import MaintenancePage from "@/components/MaintenancePage";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const settings = await getSystemSettings();
  
  // Bypass maintenance mode for admins
  const isAdmin = session?.role === "ADMIN";
  const isMaintenance = settings.maintenance && !isAdmin;

  return (
    <html lang="id">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="/logositus.png" />
        <link rel="apple-touch-icon" href="/logositus.png" />
      </head>
      <body>
        <RegisterServiceWorker />
        <PreventZoom />
        {isMaintenance ? <MaintenancePage /> : children}
      </body>
    </html>
  );
}
