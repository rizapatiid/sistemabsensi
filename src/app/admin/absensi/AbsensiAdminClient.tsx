"use client"

import { useState } from "react"

interface Absensi {
  id: string
  tanggal: Date
  waktuMasuk: Date
  idKaryawan: string
  status: string
  foto: string | null
  buktiApp: string | null
  alasan: string | null
  user: {
    nama: string
  }
}

export default function AbsensiAdminClient({ absensi }: { absensi: Absensi[] }) {
  const [modalImage, setModalImage] = useState<string | null>(null)

  const openModal = (src: string) => setModalImage(src)
  const closeModal = () => setModalImage(null)

  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", color: "#374151" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
              <th style={{ padding: "12px" }}>Tanggal</th>
              <th style={{ padding: "12px" }}>Waktu</th>
              <th style={{ padding: "12px" }}>Nama</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px" }}>Selfie</th>
              <th style={{ padding: "12px" }}>App</th>
              <th style={{ padding: "12px" }}>Alasan</th>
            </tr>
          </thead>
          <tbody>
            {absensi.map((a) => (
              <tr key={a.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px" }}>{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(a.tanggal))}</td>
                <td style={{ padding: "12px" }}>{new Intl.DateTimeFormat("id-ID", { timeStyle: "short" }).format(new Date(a.waktuMasuk))}</td>
                <td style={{ padding: "12px" }}>{a.user.nama}</td>
                <td style={{ padding: "12px" }}>
                   <span style={{ 
                     padding: "4px 8px", 
                     borderRadius: "12px", 
                     fontSize: "0.75rem",
                     backgroundColor: a.status === 'HADIR' ? "#d1fae5" : "#fee2e2",
                     color: a.status === 'HADIR' ? "#065f46" : "#991b1b"
                   }}>
                    {a.status}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  {a.foto ? (
                    <img 
                      src={a.foto} 
                      alt="Selfie" 
                      style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px", cursor: "pointer", border: "1px solid #ddd" }}
                      onClick={() => openModal(a.foto!)}
                    />
                  ) : "-"}
                </td>
                <td style={{ padding: "12px" }}>
                  {a.buktiApp ? (
                    <img 
                      src={a.buktiApp} 
                      alt="App" 
                      style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px", cursor: "pointer", border: "1px solid #ddd" }}
                      onClick={() => openModal(a.buktiApp!)}
                    />
                  ) : "-"}
                </td>
                <td style={{ padding: "12px", fontSize: "0.85rem", color: "#666" }}>
                  {a.alasan || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalImage && (
        <div 
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 10000, padding: "2rem"
          }} 
          onClick={closeModal}
        >
          <img 
            src={modalImage} 
            alt="Preview Full" 
            style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "8px", boxShadow: "0 0 20px rgba(0,0,0,0.5)" }} 
          />
          <button 
            style={{ position: "absolute", top: "20px", right: "20px", color: "white", background: "none", border: "none", fontSize: "2rem", cursor: "pointer" }}
            onClick={closeModal}
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}
