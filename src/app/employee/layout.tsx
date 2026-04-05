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
        alignItems: "center", 
        justifyContent: "center", 
        backgroundColor: "#fef2f2",
        padding: "2rem"
      }}>
        <div className="glass" style={{ 
          maxWidth: "450px", 
          textAlign: "center", 
          padding: "3rem 2rem",
          border: "1px solid #fee2e2"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚫</div>
          <h1 style={{ color: "#991b1b", marginBottom: "1rem" }}>Akun Diblokir</h1>
          <p style={{ color: "#7f1d1d", marginBottom: "2rem", lineHeight: "1.6" }}>
            Maaf, akun Anda telah dinonaktifkan oleh Administrator. <br/>
            <strong>Silakan hubungi Admin untuk informasi lebih lanjut.</strong>
          </p>
          <form action={logoutAction}>
            <button type="submit" style={{ 
              backgroundColor: "#1f2937", 
              color: "white", 
              padding: "10px 24px", 
              borderRadius: "6px", 
              border: "none", 
              fontWeight: "600",
              cursor: "pointer"
            }}>
              Keluar dari Sistem
            </button>
          </form>
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
