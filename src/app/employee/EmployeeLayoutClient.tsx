"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "@/styles/dashboard.module.css"
import Navbar from "@/components/Navbar"
import { getTotalUnreadCount } from "@/actions/chat"
import { getUnreadAnnouncementCount, markAnnouncementsAsRead, getUnreadPayrollCount, markPayrollsAsRead } from "@/actions/admin"

interface EmployeeLayoutClientProps {
  children: React.ReactNode;
  user: { id: string; name: string; role: string };
}

export default function EmployeeLayoutClient({ children, user }: EmployeeLayoutClientProps) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [announcementCount, setAnnouncementCount] = useState(0)
  const [payrollCount, setPayrollCount] = useState(0)

  // Initialize sidebar based on screen width on mount
  useEffect(() => {
    if (window.innerWidth > 1024) {
      setIsSidebarOpen(true)
    }

    // Fetch total unread count
    const fetchData = async () => {
      const [chatRes, annRes, payRes] = await Promise.all([
        getTotalUnreadCount(user.id),
        getUnreadAnnouncementCount(user.id),
        getUnreadPayrollCount(user.id)
      ])
      if (chatRes.success) setUnreadCount(chatRes.count)
      if (annRes.success) setAnnouncementCount(annRes.count)
      if (payRes.success) setPayrollCount(payRes.count)
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

  // Clear payroll badge when visiting page
  useEffect(() => {
    if (pathname === "/employee/transaksi" && payrollCount > 0) {
      markPayrollsAsRead(user.id).then(res => {
        if (res.success) setPayrollCount(0)
      })
    }
  }, [pathname, user.id, payrollCount])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const toggleMoreMenu = () => setIsMoreMenuOpen(!isMoreMenuOpen)

  const navLinks = [
    {
      name: "Dashboard", href: "/employee/home", icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
      )
    },
    {
      name: "Portal Absensi", href: "/employee/absensi", icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="M8 15h8" /></svg>
      )
    },
    {
      name: "Riwayat Kehadiran", href: "/employee/riwayat", icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
      )
    },
    {
      name: "Pusat Pengumuman", href: "/employee/pengumuman", icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
      )
    },
    {
      name: "Slip Gaji & Rekening", href: "/employee/transaksi", icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /><path d="M7 15h.01" /><path d="M11 15h.01" /><path d="M15 15h.01" /></svg>
      )
    },
    {
      name: "Chat", href: "/employee/chat", icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
      )
    },
  ]

  return (
    <div className={styles.layoutContainer}>
      <div
        className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.sidebarOverlayActive : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <aside className={`${styles.sidebar} ${!isSidebarOpen ? styles.sidebarCollapsed : ""} ${isSidebarOpen ? styles.sidebarActive : ""}`}>
        {/* Sidebar Header */}
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
          {isSidebarOpen && (
            <img
              src="/logositus.png"
              alt="RMP Digitals"
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            />
          )}

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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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
                  {link.name === "Slip Gaji & Rekening" && payrollCount > 0 && (
                    <span className={styles.sidebarBadge}>{payrollCount}</span>
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

      {/* More Menu Drawer */}
      <div
        className={`${styles.moreMenuOverlay} ${isMoreMenuOpen ? styles.moreMenuOverlayActive : ""}`}
        onClick={() => setIsMoreMenuOpen(false)}
      />
      <div className={`${styles.moreMenuDrawer} ${isMoreMenuOpen ? styles.moreMenuDrawerActive : ""}`}>
        <div className={styles.drawerHandle} />
        <div className={styles.drawerHeader}>
          <div className={styles.drawerProfile}>
            <div className={styles.drawerAvatar}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className={styles.drawerInfo}>
              <span className={styles.drawerName}>{user.name}</span>
              <span className={styles.drawerRole}>{user.role === 'employee' ? 'Karyawan' : user.role}</span>
            </div>
          </div>
          <button className={styles.drawerClose} onClick={() => setIsMoreMenuOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className={styles.drawerGrid}>
          <Link href="/employee/pengumuman" className={styles.drawerItem} onClick={() => setIsMoreMenuOpen(false)}>
            <div className={styles.drawerIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </div>
            <span className={styles.drawerLabel}>Pusat Pengumuman</span>
            {announcementCount > 0 && <span className={styles.sidebarBadge} style={{ position: 'static', marginLeft: 'auto' }}>{announcementCount}</span>}
            <div className={styles.drawerChevron}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </Link>
          <Link href="/employee/chat" className={styles.drawerItem} onClick={() => setIsMoreMenuOpen(false)}>
            <div className={styles.drawerIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </div>
            <span className={styles.drawerLabel}>Chat & Pesan</span>
            {unreadCount > 0 && <span className={styles.sidebarBadge} style={{ position: 'static', marginLeft: 'auto' }}>{unreadCount}</span>}
            <div className={styles.drawerChevron}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </Link>
          <Link href="/employee/profil" className={styles.drawerItem} onClick={() => setIsMoreMenuOpen(false)}>
            <div className={styles.drawerIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <span className={styles.drawerLabel}>Profil Akun</span>
            <div className={styles.drawerChevron}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </Link>
          <button
            className={styles.drawerItem}
            onClick={() => {
              setIsMoreMenuOpen(false);
              setIsLogoutModalOpen(true);
            }}
          >
            <div className={styles.drawerIcon} style={{ color: '#dc2626', background: '#fef2f2', borderColor: '#fee2e2' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </div>
            <span className={styles.drawerLabel} style={{ color: '#dc2626' }}>Logout Aplikasi</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className={styles.bottomNav}>
        <Link href="/employee/home" className={`${styles.bottomNavItem} ${pathname === '/employee/home' ? styles.bottomNavItemActive : ''}`}>
          <div className={styles.bottomNavIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          </div>
          <span>Home</span>
        </Link>
        <Link href="/employee/riwayat" className={`${styles.bottomNavItem} ${pathname === '/employee/riwayat' ? styles.bottomNavItemActive : ''}`}>
          <div className={styles.bottomNavIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          </div>
          <span>Riwayat</span>
        </Link>
        <Link href="/employee/absensi" className={`${styles.bottomNavItem} ${styles.bottomNavItemAbsen} ${pathname === '/employee/absensi' ? styles.bottomNavItemActive : ''}`}>
          <div className={styles.bottomNavIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.02-.3 3"></path>
              <path d="M14 22a10 10 0 0 0-4-4"></path>
              <path d="M18 12a6 6 0 0 0-6-6 6 6 0 0 0-6 6c0 2.21.12 4.41.34 6.61"></path>
              <path d="M22 12a10 10 0 0 0-10-10A10 10 0 0 0 2 12c0 4.23 1.01 8.42 3 12"></path>
              <path d="M8 22a10 10 0 0 1-1-4 10 10 0 0 1 10-10"></path>
            </svg>
          </div>
          <span>Absen</span>
        </Link>
        <Link href="/employee/transaksi" className={`${styles.bottomNavItem} ${pathname === '/employee/transaksi' ? styles.bottomNavItemActive : ''}`}>
          <div className={styles.bottomNavIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /><path d="M7 15h.01" /><path d="M11 15h.01" /><path d="M15 15h.01" /></svg>
          </div>
          <span>Gaji</span>
          {payrollCount > 0 && <span className={styles.bottomNavBadge}>{payrollCount}</span>}
        </Link>
        <button onClick={toggleMoreMenu} className={`${styles.bottomNavItem} ${isMoreMenuOpen ? styles.bottomNavItemActive : ''}`}>
          <div className={styles.bottomNavIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </div>
          <span>Lainnya</span>
          {(announcementCount > 0 || unreadCount > 0) && <span className={styles.bottomNavBadge}>!</span>}
        </button>
      </nav>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className={styles.logoutModalOverlay} onClick={() => setIsLogoutModalOpen(false)}>
          <div className={styles.logoutModal} onClick={e => e.stopPropagation()}>
            <div className={styles.logoutIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </div>
            <h3>Konfirmasi Keluar</h3>
            <p>Apakah Anda yakin ingin mengakhiri sesi dan keluar dari aplikasi RMP Digitals?</p>
            <div className={styles.logoutActions}>
              <button 
                className={styles.confirmLogoutBtn}
                onClick={async () => {
                  const { logoutAction } = await import("@/actions/auth");
                  await logoutAction();
                }}
              >
                Ya, Keluar Sekarang
              </button>
              <button 
                className={styles.cancelLogoutBtn}
                onClick={() => setIsLogoutModalOpen(false)}
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
