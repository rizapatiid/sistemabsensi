import prisma from "@/lib/prisma"
import { getSession, logoutAction } from "@/actions/auth"
import { redirect } from "next/navigation"
import EmployeeLayoutClient from "./EmployeeLayoutClient"

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect("/")

  const user = await prisma.user.findUnique({ 
    where: { id: session.id },
    select: { nama: true, role: true, status: true }
  })

  if (!user) redirect("/")

  if (user.status === "BLOKIR") {
    return (
      <div style={{ 
        height: "100vh", 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center", 
        backgroundColor: "#f8fafc",
        padding: "20px",
        fontFamily: "inherit"
      }}>
        <div style={{ 
          maxWidth: "400px", 
          width: "100%",
          background: "white", 
          borderRadius: "28px", 
          padding: "40px 32px",
          textAlign: "center",
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.1)",
          border: "1px solid #e2e8f0",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* SECURITY ACCENT */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: '#ef4444' }}></div>

          <div style={{ 
            width: "64px", 
            height: "64px", 
            backgroundColor: "#fef2f2", 
            borderRadius: "20px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 24px",
            color: "#ef4444",
            border: "1px solid #fee2e2"
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>

          <span style={{ 
            fontSize: '0.65rem', 
            fontWeight: 900, 
            color: '#ef4444', 
            textTransform: 'uppercase', 
            letterSpacing: '0.12em',
            display: 'block',
            marginBottom: '10px'
          }}>Security Protocol: Restricted</span>
          
          <h1 style={{ 
            color: "#0f172a", 
            fontSize: "1.75rem", 
            fontWeight: 1000, 
            marginBottom: "12px",
            letterSpacing: '-0.04em' 
          }}>Akses Diblokir</h1>
          
          <p style={{ 
            color: "#64748b", 
            marginBottom: "32px", 
            lineHeight: "1.6", 
            fontSize: "0.95rem",
            fontWeight: 600
          }}>
            Maaf, akun Anda telah dinonaktifkan oleh Administrator sistem. Silakan hubungi departemen terkait untuk pemulihan akses.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <form action={logoutAction} style={{ width: '100%' }}>
                <button type="submit" style={{ 
                width: "100%",
                backgroundColor: "#0f172a", 
                color: "white", 
                padding: "16px 24px", 
                borderRadius: "14px", 
                border: "none", 
                fontWeight: "900",
                cursor: "pointer",
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                transition: "all 0.2s"
                }}>
                Keluar dari Sistem
                </button>
            </form>
            <a href="mailto:contact@rmpid.com" style={{ 
                width: "100%",
                backgroundColor: "#f1f5f9", 
                color: "#475569", 
                padding: "16px 24px", 
                borderRadius: "14px", 
                border: "1px solid #e2e8f0", 
                fontWeight: "900",
                cursor: "pointer",
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textDecoration: "none",
                display: "block"
            }}>
                Hubungi Admin
            </a>
          </div>

          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
             <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>RMP DIGITALS V 1.0.0</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <EmployeeLayoutClient user={{ id: session.id, name: user.nama, role: user.role }} >
      {children}
    </EmployeeLayoutClient>
  )
}
