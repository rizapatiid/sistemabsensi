import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          // Prevent Desktop Zoom via Keyboard and Mouse
          window.addEventListener('keydown', function(event) {
            if (event.ctrlKey === true && (event.keyCode === 61 || event.keyCode === 107 || event.keyCode === 173 || event.keyCode === 109 || event.keyCode === 187 || event.keyCode === 189)) {
              event.preventDefault();
            }
          });
          window.addEventListener('wheel', function(event) {
            if (event.ctrlKey === true) {
              event.preventDefault();
            }
          }, { passive: false });

          // Prevent Mobile Pinch-to-Zoom (Multi-touch)
          window.addEventListener('touchstart', function(event) {
            if (event.touches.length > 1) {
              event.preventDefault();
            }
          }, { passive: false });

          // Prevent Mobile Double-Tap to Zoom
          let lastTouchEnd = 0;
          window.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
              event.preventDefault();
            }
            lastTouchEnd = now;
          }, false);
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
