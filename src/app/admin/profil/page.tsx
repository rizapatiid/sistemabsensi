import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import { redirect } from "next/navigation"
import styles from "@/styles/admin.module.css"
import AdminProfileForm from "./AdminProfileForm"

export default async function AdminProfilePage() {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") redirect("/")

  const user = await prisma.user.findUnique({
    where: { id: session.id }
  })

  if (!user) redirect("/")

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Profil Saya (Admin)</h1>
      
      <div style={{ display: "flex", gap: "2rem" }}>
        {/* Ringkasan Admin */}
        <div className={`${styles.section} glass`} style={{ width: "300px" }}>
          <h2>Status Akses</h2>
          <div style={{ marginTop: "1rem" }}>
            <div style={{ padding: "1rem", backgroundColor: "#4f46e5", color: "white", borderRadius: "8px", textAlign: "center" }}>
              <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>Role User</div>
              <div style={{ fontWeight: "700", fontSize: "1.2rem" }}>SYSTEM {user.role}</div>
            </div>
            <div style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "#6b7280", lineHeight: "1.5" }}>
              Sebagai Administrator, Anda memiliki akses penuh ke manajemen karyawan, absensi, dan sistem penggajian.
            </div>
          </div>
        </div>

        {/* Form Profil */}
        <AdminProfileForm user={user} />
      </div>
    </div>
  )
}
