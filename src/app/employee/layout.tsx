import prisma from "@/lib/prisma"
import { getSession, logoutAction } from "@/actions/auth"
import { redirect } from "next/navigation"
import EmployeeLayoutClient from "./EmployeeLayoutClient"

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect("/")

  const user = await prisma.user.findUnique({ 
    where: { id: session.id },
    select: { nama: true, role: true, status: true, fotoProfil: true }
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
          padding: "40px", 
          borderRadius: "24px", 
          boxShadow: "0 20px 40px -10px rgba(15, 23, 42, 0.1), 0 10px 15px -3px rgba(15, 23, 42, 0.05)", 
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Decorative accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: '#ef4444' }}></div>
          
          <div style={{ 
              width: "72px", 
              height: "72px", 
              background: "#fee2e2", 
              borderRadius: "20px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              margin: "0 auto 24px auto",
              transform: "rotate(-10deg)"
          }}>
            <svg width="32" height="32" fill="none" stroke="#ef4444" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M12 8v4"/>
              <path d="M12 16h.01"/>
            </svg>
          </div>
          
          <h2 style={{ color: "#0f172a", marginBottom: "12px", fontSize: "1.5rem", fontWeight: "800", letterSpacing: "-0.02em" }}>Akses Diblokir</h2>
          <p style={{ color: "#475569", marginBottom: "32px", lineHeight: "1.6", fontSize: "0.95rem" }}>
            Maaf, akun Anda saat ini sedang dinonaktifkan sementara oleh administrator.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <form action={logoutAction} style={{ width: '100%' }}>
              <button type="submit" style={{ 
                  width: "100%", 
                  padding: "14px", 
                  backgroundColor: "#0f172a", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "12px", 
                  cursor: "pointer", 
                  fontWeight: "700",
                  fontSize: "0.95rem",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
              }}>
                Kembali ke Login
              </button>
            </form>
            
            <a href="mailto:admin@company.com" style={{ 
                color: "#64748b", 
                fontSize: "0.85rem", 
                fontWeight: "600", 
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textDecoration: "none",
                display: "block"
            }}>
                Hubungi Admin
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <EmployeeLayoutClient user={{ id: session.id, name: user.nama, role: user.role, fotoProfil: user.fotoProfil }} >
      {children}
    </EmployeeLayoutClient>
  )
}
