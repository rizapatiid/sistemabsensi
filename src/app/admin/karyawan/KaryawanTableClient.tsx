"use client"

import { deleteEmployeeAction, toggleBlockEmployeeAction } from "@/actions/employee"
import Link from "next/link"
import styles from "@/styles/admin.module.css"

interface Karyawan {
  id: string
  nama: string
  jabatan: string | null
  phone: string | null
  email: string | null
  rekeningBank: string | null
  noRekening: string | null
  status: string
}

export default function KaryawanTableClient({ karyawanInitial }: { karyawanInitial: Karyawan[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className={styles.dataGrid}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama & Jabatan</th>
            <th>Kontak</th>
            <th>Bank Info</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {karyawanInitial.map((k) => (
            <tr key={k.id}>
              <td>{k.id}</td>
              <td>
                <div style={{ fontWeight: "700" }}>{k.nama}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{k.jabatan || '-'}</div>
              </td>
              <td>
                <div style={{ fontSize: "0.85rem" }}>{k.phone || '-'}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{k.email || '-'}</div>
              </td>
              <td>
                <div style={{ fontWeight: "500", color: "var(--primary)" }}>{k.rekeningBank || '-'}</div>
                <div style={{ fontSize: "0.8rem" }}>{k.noRekening || '-'}</div>
              </td>
              <td>
                <span className={`${styles.badge} ${k.status === 'AKTIF' ? styles.hadir : styles.izin}`}>
                  {k.status}
                </span>
              </td>
              <td className={styles.actions}>
                <Link href={`/admin/karyawan/edit/${k.id}`} className={styles.btnSm} style={{ textDecoration: "none", backgroundColor: "#3b82f6", color: "white" }}>
                  Edit
                </Link>
                <form action={async () => { await toggleBlockEmployeeAction(k.id, k.status) }}>
                  <button type="submit" className={styles.btnSm}>
                    {k.status === 'AKTIF' ? 'Blokir' : 'Aktifkan'}
                  </button>
                </form>
                <form action={async () => {
                  if (confirm(`Hapus karyawan ${k.nama}?`)) {
                    await deleteEmployeeAction(k.id)
                  }
                }}>
                  <button type="submit" className={styles.btnDelete}>Hapus</button>
                </form>
              </td>
            </tr>
          ))}
          {karyawanInitial.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>Belum ada karyawan</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
