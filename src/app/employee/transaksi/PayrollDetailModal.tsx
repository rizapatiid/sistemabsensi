"use client"

import { useState } from "react"
import styles from "@/styles/admin.module.css"

interface PayrollDetail {
  id: string
  bulan: number
  tahun: number
  tipeGaji: string
  jumlahAbsen: number
  gajiPokok: number
  tunjangan: number
  ketTunjangan: string | null
  totalGaji: number
  statusPembayaran: string
  nama: string
  jabatan: string | null
  namaRekening: string | null
  bankSnapshot: string | null
  noRekeningSnapshot: string | null
  namaRekeningSnapshot: string | null
}

export default function PayrollDetailModal({ p }: { p: PayrollDetail }) {
  const [isOpen, setIsOpen] = useState(false)

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  return (
    <>
      <button 
        onClick={openModal}
        className={styles.btnSm} 
        style={{ 
          backgroundColor: "var(--primary)", 
          color: "white", 
          border: "none", 
          padding: "4px 8px", 
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "0.75rem"
        }}
      >
        Lihat Detail
      </button>

      {isOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "1rem"
        }} onClick={closeModal}>
          <div className="modal-content" style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            position: "relative"
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "2px solid var(--primary)", paddingBottom: "0.5rem" }}>
              <h2 style={{ color: "#111827", margin: 0 }}>Slip Gaji Digital</h2>
              <button 
                onClick={() => window.print()} 
                style={{ 
                  backgroundColor: "var(--primary)", 
                  color: "white", 
                  border: "none", 
                  padding: "4px 12px", 
                  borderRadius: "4px", 
                  cursor: "pointer",
                  fontSize: "0.8rem"
                }}
                className="no-print"
              >
                Cetak / PDF
              </button>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem", color: "#374151" }}>
              <div>
                <small style={{ color: "#6b7280", display: "block" }}>Nama Karyawan</small>
                <div style={{ fontWeight: "700", color: "#111827" }}>{p.nama}</div>
              </div>
              <div>
                <small style={{ color: "#6b7280", display: "block" }}>Jabatan</small>
                <div style={{ fontWeight: "700", color: "#111827" }}>{p.jabatan || "-"}</div>
              </div>
              <div>
                <small style={{ color: "#6b7280", display: "block" }}>Periode</small>
                <div style={{ fontWeight: "700", color: "#111827" }}>Bulan {p.bulan} / {p.tahun}</div>
              </div>
              <div>
                <small style={{ color: "#6b7280", display: "block" }}>Status</small>
                <div style={{ 
                  fontWeight: "700", 
                  color: p.statusPembayaran === "LUNAS" ? "#166534" : "#b91c1c" 
                }}>{p.statusPembayaran}</div>
              </div>
            </div>

            <div style={{ backgroundColor: "#f3f4f6", padding: "1.25rem", borderRadius: "8px", marginBottom: "1.5rem", border: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", color: "#374151" }}>
                <span>Gaji Pokok ({p.tipeGaji})</span>
                <span style={{ fontWeight: "600" }}>Rp. {p.gajiPokok.toLocaleString("id-ID")}</span>
              </div>
              {p.tipeGaji === "HARIAN" && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.85rem", color: "#4b5563" }}>
                  <span>Total Kehadiran</span>
                  <span style={{ fontWeight: "600" }}>{p.jumlahAbsen} Hari</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", color: "#374151" }}>
                <span>
                  Tunjangan
                  {p.ketTunjangan && <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>({p.ketTunjangan})</div>}
                </span>
                <span style={{ fontWeight: "600" }}>Rp. {p.tunjangan.toLocaleString("id-ID")}</span>
              </div>
              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "2px dashed #d1d5db", display: "flex", justifyContent: "space-between", fontWeight: "800", fontSize: "1.25rem", color: "#111827" }}>
                <span>Total Bersih</span>
                <span style={{ color: "var(--primary)" }}>Rp. {p.totalGaji.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div style={{ fontSize: "0.85rem", borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
              <div style={{ color: "#6b7280", marginBottom: "0.5rem" }}>Tujuan Transfer (Snapshot):</div>
              <div style={{ fontWeight: "700", color: "#111827", fontSize: "1rem" }}>{p.bankSnapshot || "-"} - {p.noRekeningSnapshot || "-"}</div>
              <div style={{ fontSize: "0.9rem", color: "#374151", fontWeight: "500" }}>a.n. {p.namaRekeningSnapshot || p.nama}</div>
            </div>

            <button 
              onClick={closeModal}
              className="no-print"
              style={{
                marginTop: "2rem",
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#1f2937",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "700"
              }}
            >
              Tutup
            </button>
          </div>
          <style jsx global>{`
            @media print {
              .no-print { display: none !important; }
              body * { visibility: hidden; }
              .modal-content, .modal-content * { visibility: visible; }
              .modal-content { 
                position: absolute; 
                left: 0; 
                top: 0; 
                width: 100%; 
                box-shadow: none !important;
                padding: 0 !important;
              }
            }
          `}</style>
        </div>
      )}
    </>
  )
}
