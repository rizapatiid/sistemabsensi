import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RMP Digitals - Sistem Absensi',
    short_name: 'RMP Absensi',
    description: 'Sistem Manajemen Kepegawaian, Absensi, dan Payroll Profesional PT Riza Media Productions',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1e3a8a',
    icons: [
      {
        src: '/iconapps.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/iconapps.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}
