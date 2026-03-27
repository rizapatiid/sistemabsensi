"use client"

import { useState } from "react"
import { deleteEmployeeAction, toggleBlockEmployeeAction } from "@/actions/employee"
import Link from "next/link"
import styles from "@/styles/admin.module.css"

const IconSearch = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
)

const IconEdit = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
)

const IconLock = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
)

const IconUnlock = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
)

const IconTrash = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
)

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
  const [searchTerm, setSearchTerm] = useState("")

  const filteredKaryawan = karyawanInitial.filter(k => 
    k.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (k.jabatan?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  )

  return (
    <>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Staf Perusahaan</h3>
        <div className={styles.searchBox}>
          <div className={styles.searchIcon}><IconSearch /></div>
          <input 
            type="text" 
            placeholder="Cari Nama / ID / Jabatan..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Identitas Pengguna</th>
              <th>Informasi Kontak</th>
              <th>Detail Rekening</th>
              <th>Status Akses</th>
              <th style={{ textAlign: 'right' }}>Kelola Data</th>
            </tr>
          </thead>
          <tbody>
            {filteredKaryawan.map((k) => (
              <tr key={k.id}>
                <td>
                  <div className={styles.userCell}>
                    <div className={styles.userAvatar}>{k.nama.charAt(0)}</div>
                    <div>
                      <span className={styles.userName}>{k.nama}</span>
                      <span className={styles.userSub}>{k.id} · {k.jabatan || 'No Dept'}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ lineHeight: '1.4' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>{k.phone || '-'}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '500', color: '#64748b' }}>{k.email || '-'}</div>
                  </div>
                </td>
                <td>
                  <div style={{ lineHeight: '1.4' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#1e3a8a' }}>{k.rekeningBank || '-'}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>{k.noRekening || '-'}</div>
                  </div>
                </td>
                <td>
                  <span className={`${styles.badge} ${k.status === 'AKTIF' ? styles.badgeAktif : styles.badgeBlokir}`}>
                    {k.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Link href={`/admin/karyawan/edit/${k.id}`} className={`${styles.btnSm} ${styles.btnEdit}`} title="Edit Data">
                      <IconEdit />
                    </Link>
                    
                    <form action={async () => { await toggleBlockEmployeeAction(k.id, k.status) }}>
                      <button type="submit" className={`${styles.btnSm} ${styles.btnBlock}`} title={k.status === 'AKTIF' ? 'Blokir' : 'Aktifkan'}>
                        {k.status === 'AKTIF' ? <IconLock /> : <IconUnlock />}
                      </button>
                    </form>
                    
                    <form action={async () => {
                      if (confirm(`Hapus permanen karyawan ${k.nama}? Tindakan ini tidak dapat dibatalkan.`)) {
                        await deleteEmployeeAction(k.id)
                      }
                    }}>
                      <button type="submit" className={`${styles.btnSm} ${styles.btnDelete}`} title="Hapus Permanen">
                        <IconTrash />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {filteredKaryawan.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "60px", color: "#94a3b8", fontWeight: "600", fontSize: "0.9rem" }}>
                  <div style={{ marginBottom: "12px" }}>
                    <IconSearch />
                  </div>
                  Data karyawan tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
