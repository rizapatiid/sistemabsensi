"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "@/styles/dashboard.module.css"
import Navbar from "@/components/Navbar"
import { getTotalUnreadCount } from "@/actions/chat"
import { getUnreadAnnouncementCount, markAnnouncementsAsRead } from "@/actions/admin"

interface EmployeeLayoutClientProps {
  children: React.ReactNode;
  user: { id: string; name: string; role: string };
}

export default function EmployeeLayoutClient({ children, user }: EmployeeLayoutClientProps) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [announcementCount, setAnnouncementCount] = useState(0)

  // Initialize sidebar based on screen width on mount
  useEffect(() => {
    if (window.innerWidth > 1024) {
      setIsSidebarOpen(true)
    }

    // Fetch total unread count
    const fetchData = async () => {
      const [chatRes, annRes] = await Promise.all([
        getTotalUnreadCount(user.id),
        getUnreadAnnouncementCount(user.id)
      ])
      if (chatRes.success) setUnreadCount(chatRes.count)
      if (annRes.success) setAnnouncementCount(annRes.count)
    }

    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [user.id])

  // Clear announcement badge when visiting page
  useEffect(() => {
    if (pathname === "/employee/pengumuman" && announcementCount > 0) {
      markAnnouncementsAsRead(user.id).then(res => {
        if (res.success) setAnnouncementCount(0)
      })
    }
  }, [pathname, user.id, announcementCount])

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
    { name: "Pusat Pengumuman", href: "/employee/pengumuman", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    ) },
    { name: "Slip Gaji & Rekening", href: "/employee/transaksi", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M7 15h.01"/><path d="M11 15h.01"/><path d="M15 15h.01"/></svg>
    ) },
    { name: "Chat", href: "/employee/chat", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    ) },
  ]

  return (
    <div className={styles.layoutContainer}>
      <div 
        className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.sidebarOverlayActive : ""}`} 
        onClick={() => setIsSidebarOpen(false)}
      />
      <aside className={`${styles.sidebar} ${!isSidebarOpen ? styles.sidebarCollapsed : ""} ${isSidebarOpen ? styles.sidebarActive : ""}`}>
        {/* Sidebar Header: Dynamic Layout based on State */}
        <div style={{ 
          padding: !isSidebarOpen ? '0' : '0 16px', 
          display: 'flex', 
          flexDirection: isSidebarOpen ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: isSidebarOpen ? 'space-between' : 'center',
          gap: '12px',
          borderBottom: '1px solid #f1f5f9',
          marginBottom: '8px',
          height: '70px',
          minHeight: '70px'
        }}>
          {/* LOGO (Only shown when expanded, on the LEFT) */}
          {isSidebarOpen && (
            <img 
              src="/logositus.png" 
              alt="RMP Digitals" 
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            />
          )}

          {/* THE TOGGLE BUTTON (On the RIGHT when expanded, CENTER when collapsed) */}
          <button 
            className={`hamburger-btn ${!isSidebarOpen ? 'is-collapsed' : ''}`} 
            onClick={toggleSidebar}
            style={{ 
              background: !isSidebarOpen ? '#1e40af' : 'white', 
              color: !isSidebarOpen ? 'white' : '#1e40af',
              border: '1px solid #eef2f6',
              borderRadius: '10px',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            {!isSidebarOpen ? (
              /* COLLAPSED: GARIS 3 (Hamburger Menu) */
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            ) : (
              /* EXPANDED: X (Close) */
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            )}
          </button>
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
                   if (window.innerWidth <= 1024) setIsSidebarOpen(false)
                }}
              >
                <span className={styles.navIcon}>
                  {link.icon}
                  {link.name === "Chat" && unreadCount > 0 && (
                    <span className={styles.sidebarBadge}>{unreadCount}</span>
                  )}
                  {link.name === "Pusat Pengumuman" && announcementCount > 0 && (
                    <span className={styles.sidebarBadge}>{announcementCount}</span>
                  )}
                </span>
                <span className={styles.navLabel}>{link.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
      <div className={styles.mainWrapper}>
        <Navbar user={user} onMobileMenuToggle={toggleSidebar} isSidebarCollapsed={!isSidebarOpen} />
        <main className={styles.mainContent} style={pathname.includes("/chat") ? { padding: 0 } : {}}>
          {children}
        </main>
      </div>
    </div>
  )
}
