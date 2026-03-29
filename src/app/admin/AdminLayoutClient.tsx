"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "@/styles/dashboard.module.css"
import Navbar from "@/components/Navbar"

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user: { name: string; role: string };
}

export default function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
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
    { name: "Dashboard", href: "/admin/home", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    ) },
    { name: "Data Karyawan", href: "/admin/karyawan", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ) },
    { name: "Rekap Absensi", href: "/admin/absensi", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M8 15h8"/></svg>
    ) },
    { name: "Payroll System", href: "/admin/payroll", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M7 15h.01"/><path d="M11 15h.01"/><path d="M15 15h.01"/></svg>
    ) },
    { name: "Pengumuman", href: "/admin/kalender", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    ) },
    { name: "Kelola Admin", href: "/admin/kelola-admin", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
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
          <img 
            src="/logositus.png" 
            alt="RMP Digitals" 
            className={styles.sidebarLogo}
          />
        </div>
        <nav className={styles.nav}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                onClick={() => {
                  if (window.innerWidth <= 1024) {
                    setIsSidebarOpen(false)
                  }
                }}
              >
                <span className={styles.navIcon}>{link.icon}</span>
                <span className={styles.navLabel}>{link.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
      <div className={styles.mainWrapper}>
        <Navbar user={user} onMobileMenuToggle={toggleSidebar} isSidebarCollapsed={!isSidebarOpen} />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  )
}
