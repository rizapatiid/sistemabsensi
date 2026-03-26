"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "@/styles/dashboard.module.css"

export default function EmployeeNav() {
  const pathname = usePathname()

  const navLinks = [
    { name: "Beranda", href: "/employee/home" },
    { name: "Portal Absensi", href: "/employee/absensi" },
    { name: "Riwayat Kehadiran", href: "/employee/riwayat" },
    { name: "Slip Gaji & Rekening", href: "/employee/transaksi" },
    { name: "Profil Saya", href: "/employee/profil" }
  ]

  return (
    <nav className={styles.nav}>
      {navLinks.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
        return (
          <Link 
            key={link.href} 
            href={link.href}
            className={`${styles.navLink} ${isActive ? styles.active : ""}`}
          >
            {link.name}
          </Link>
        )
      })}
    </nav>
  )
}
