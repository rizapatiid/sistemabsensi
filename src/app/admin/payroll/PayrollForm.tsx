"use client"

import { useState } from "react"
import styles from "@/styles/admin.module.css"
import { generatePayrollAction } from "@/actions/admin"

type User = { id: string; nama: string; rekeningBank?: string | null; noRekening?: string | null; namaRekening?: string | null }

export default function PayrollForm({ users }: { users: User[] }) {
  const [tipeGaji, setTipeGaji] = useState("BULANAN")
  const [modeAbsen, setModeAbsen] = useState("AUTO")
  const [loading, setLoading] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState("")
  
  const activeUser = users.find(u => u.id === selectedUserId)
  
  const bulanList = Array.from({length: 12}, (_, i) => i + 1)
  const currentYear = new Date().getFullYear()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      const res = await generatePayrollAction(formData)
      if (res?.error) {
        alert(res.error)
      } else {
        alert("Payroll berhasil dibuat!")
        e.currentTarget.reset()
        setSelectedUserId("")
      }
    } catch (e) {
      alert("Terjadi kesalahan sistem")
    }
    setLoading(false)
  }

  return (
    <div className={`${styles.section} glass`} style={{ maxWidth: "600px" }}>
      <h2>Buat Slip Gaji Baru</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className={styles.formGroup}>
          <label>Pilih Karyawan</label>
          <select name="idKaryawan" required value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
            <option value="">-- Pilih --</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.nama} ({u.id})</option>)}
          </select>
        </div>

        {activeUser && (
          <div style={{ backgroundColor: "rgba(0,0,0,0.05)", padding: "1rem", borderRadius: "8px", fontSize: "0.9rem", marginTop: "-0.5rem" }}>
            <strong style={{ display: "block", marginBottom: "0.25rem", color: "var(--text-color)" }}>Informasi Rekening:</strong>
            {activeUser.rekeningBank && activeUser.noRekening ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ color: "var(--primary-color)", fontWeight: "600" }}>{activeUser.rekeningBank} - {activeUser.noRekening}</span>
                <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>a.n. {activeUser.namaRekening || activeUser.nama}</span>
              </div>
            ) : (
              <span style={{ color: "#ef4444" }}>Karyawan belum mengatur rekening bank</span>
            )}
          </div>
        )}
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className={styles.formGroup}>
            <label>Bulan (1-12)</label>
            <select name="bulan" required defaultValue={new Date().getMonth() + 1}>
              {bulanList.map(b => <option key={b} value={b}>Bulan {b}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Tahun</label>
            <input type="number" name="tahun" required defaultValue={currentYear} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className={styles.formGroup}>
            <label>Tipe Gaji</label>
            <select name="tipeGaji" value={tipeGaji} onChange={(e) => setTipeGaji(e.target.value)} required>
              <option value="BULANAN">Bulanan</option>
              <option value="HARIAN">Harian</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Nominal Gaji Pokok (Rp)</label>
            <input type="number" name="gajiPokok" placeholder={tipeGaji === "HARIAN" ? "Cth: 150000" : "Cth: 5000000"} required />
          </div>
        </div>

        {tipeGaji === "HARIAN" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", backgroundColor: "rgba(0,0,0,0.05)", padding: "1rem", borderRadius: "8px" }}>
            <div className={styles.formGroup}>
              <label>Mode Absen</label>
              <select name="modeAbsen" value={modeAbsen} onChange={(e) => setModeAbsen(e.target.value)}>
                <option value="AUTO">Otomatis (Hitung dari DB)</option>
                <option value="MANUAL">Set Manual</option>
              </select>
            </div>
            {modeAbsen === "MANUAL" && (
              <div className={styles.formGroup}>
                <label>Jumlah Kehadiran (Hari)</label>
                <input type="number" name="jumlahAbsen" placeholder="Berapa hari?" min="0" />
              </div>
            )}
            {modeAbsen === "AUTO" && (
              <div className={styles.formGroup}>
                <label>&nbsp;</label>
                <div style={{ fontSize: "0.85rem", color: "var(--text-color)", opacity: 0.7, marginTop: "0.5rem" }}>
                  *Sistem akan menghitung otomatis berdasarkan absensi HADIR di bulan yang dipilih.
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className={styles.formGroup}>
            <label>Tunjangan / Bonus (Opsional) (Rp)</label>
            <input type="number" name="tunjangan" placeholder="Cth: 200000" defaultValue="0" />
          </div>
          <div className={styles.formGroup}>
            <label>Keterangan Tunjangan</label>
            <input type="text" name="ketTunjangan" placeholder="Cth: Transport, Makan" />
          </div>
        </div>
        
        <button type="submit" disabled={loading} className={styles.actionBtn} style={{ marginTop: "1rem", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Menyimpan..." : "Generate Payroll"}
        </button>
      </form>
    </div>
  )
}
