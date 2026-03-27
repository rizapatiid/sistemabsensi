"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "@/styles/dashboard.module.css"
import Navbar from "@/components/Navbar"

interface EmployeeLayoutClientProps {
  children: React.ReactNode;
  user: { name: string; role: string };
}

export default function EmployeeLayoutClient({ children, user }: EmployeeLayoutClientProps) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Initialize sidebar based on screen width on mount
  useEffect(() => {
    if (window.innerWidth > 1024) {
      setIsSidebarOpen(true)
    }
  }, [])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const navLinks = [
    { name: "Dashboard", href: "/employee/home", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    ) },
    { name: "Portal Absensi", href: "/employee/absensi", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M8 15h8"/></svg>
    ) },
    { name: "Riwayat Kehadiran", href: "/employee/riwayat", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    ) },
    { name: "Slip Gaji & Rekening", href: "/employee/transaksi", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M7 15h.01"/><path d="M11 15h.01"/><path d="M15 15h.01"/></svg>
    ) },
  ]

  return (
    <div className={styles.layoutContainer}>
      <div 
        className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.sidebarOverlayActive : ""}`} 
        onClick={() => setIsSidebarOpen(false)}
      />
      <aside className={`${styles.sidebar} ${!isSidebarOpen ? styles.sidebarCollapsed : ""} ${isSidebarOpen ? styles.sidebarActive : ""}`}>
        <div className={styles.logo}>
          <div className="logo-icon" style={{ color: '#1a567e' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoBrand} style={{ color: '#1a567e', letterSpacing: '-1px' }}>RMP DIGITALS</span>
            <span className={styles.logoSub}>Sistem Pegawai Profesional</span>
          </div>
        </div>
        <nav className={styles.nav}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className={styles.navIcon}>{link.icon}</span>
                <span className={styles.navLabel}>{link.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
      <div className={styles.mainWrapper}>
        <Navbar user={user} onMobileMenuToggle={toggleSidebar} />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  )
}
