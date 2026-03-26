"use client"

import { createHolidayAction } from "@/actions/admin"
import styles from "@/styles/admin.module.css"
import Link from "next/link"

export default function CreateHolidayPage() {
  return (
    <div className={styles.pageContainer}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className={styles.pageTitle}>Set Hari Libur (Portal Ditutup)</h1>
        <Link href="/admin/kalender" className={styles.logoutBtn} style={{ backgroundColor: "#374151" }}> Kembali </Link>
      </div>

      <div className={`${styles.section} glass`} style={{ maxWidth: "500px" }}>
        <p style={{ marginBottom: "1.5rem", color: "#6b7280", fontSize: "0.9rem" }}>
          Pilih tanggal libur. Pada tanggal tersebut, karyawan tidak akan bisa melakukan absensi di aplikasi.
        </p>

        <form action={createHolidayAction} className="flex flex-col gap-4">
          <div className={styles.formGroup}>
            <label>Tanggal Libur</label>
            <input type="date" name="tanggal" required />
          </div>
          <div className={styles.formGroup}>
            <label>Keterangan Libur</label>
            <input type="text" name="keterangan" placeholder="Misal: Libur Lebaran, Tanggal Merah" required />
          </div>
          <button type="submit" className={styles.actionBtn} style={{ marginTop: "1rem" }}>
            Simpan Hari Libur
          </button>
        </form>
      </div>
    </div>
  )
}
