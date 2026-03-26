import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import { redirect } from "next/navigation"
import styles from "@/styles/admin.module.css"
import ProfileForm from "./ProfileForm"

export default async function EmployeeProfilePage() {
  const session = await getSession()
  if (!session) redirect("/")

  const user = await prisma.user.findUnique({
    where: { id: session.id }
  })

  if (!user) redirect("/")

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Profil Saya</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Tampilan Detail Profil */}
        <div className={`${styles.section} glass`}>
          <h2>Ringkasan Akun</h2>
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#666" }}>ID Karyawan</label>
              <div style={{ fontWeight: "700", fontSize: "1.2rem" }}>{user.id}</div>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#666" }}>Jabatan</label>
              <div style={{ fontWeight: "600", color: "var(--primary)" }}>{user.jabatan || "-"}</div>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", color: "#666" }}>Status Akun</label>
              <div style={{ marginTop: "4px" }}>
                <span className={`${styles.badge} ${user.status === 'AKTIF' ? styles.hadir : styles.izin}`}>
                  {user.status}
                </span>
              </div>
            </div>
            <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
              <p style={{ fontSize: "0.85rem", color: "#666", lineHeight: "1.4" }}>
                * Jika Anda menemukan kesalahan pada ID atau Jabatan, silakan hubungi Administrator untuk perbaikan data.
              </p>
            </div>
          </div>
        </div>

        {/* Form Edit Profil */}
        <ProfileForm user={user} />
      </div>
    </div>
  )
}
