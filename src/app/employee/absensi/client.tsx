"use client"

import { useState, useRef } from "react"
import { submitKehadiranAction } from "@/actions/employeeUser"
import styles from "@/styles/admin.module.css"

export default function AbsensiClient({ isClosed, message, hasAttendance }: { isClosed: boolean, message: string, hasAttendance: boolean }) {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{type: "error"|"success", text: string} | null>(null)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [capturedScreenshot, setCapturedScreenshot] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCapturedScreenshot(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    setCameraActive(true)
    setMsg(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setMsg({ type: "error", text: "Gagal mengakses kamera. Pastikan izin kamera diberikan." })
      setCameraActive(false)
    }
  }

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL("image/jpeg")
        setCapturedPhoto(dataUrl)
        
        // Stop camera
        const stream = video.srcObject as MediaStream
        if (stream) {
          stream.getTracks().forEach(track => track.stop())
        }
        setCameraActive(false)
      }
    }
  }

  async function handleAbsen(status: "HADIR" | "IZIN") {
    let alasanInput = ""
    
    if (status === "HADIR") {
      if (!capturedPhoto) {
        setMsg({ type: "error", text: "Silakan ambil foto selfie sebagai bukti kehadiran!" })
        return
      }
      if (!capturedScreenshot) {
        setMsg({ type: "error", text: "Silakan upload bukti screenshot masuk aplikasi!" })
        return
      }
    } else if (status === "IZIN") {
      const p = window.prompt("Berikan alasan izin Anda (Sakit/Keperluan):")
      if (!p || p.trim() === "") {
        setMsg({ type: "error", text: "Alasan izin wajib diisi!" })
        return
      }
      alasanInput = p
    }

    setLoading(true)
    setMsg(null)
    const res = await submitKehadiranAction(status, capturedPhoto || undefined, capturedScreenshot || undefined, alasanInput || undefined)
    if (res?.error) {
      setMsg({ type: "error", text: res.error })
    } else {
      setMsg({ type: "success", text: "Absensi " + status + " berhasil dicatat!" })
    }
    setLoading(false)
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Portal Absensi</h1>
      
      <div className={`${styles.section} glass`} style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
        {msg && (
          <div className={styles.error} style={{ 
            backgroundColor: msg.type === "success" ? "#d1fae5" : undefined,
            color: msg.type === "success" ? "#065f46" : undefined,
            borderColor: msg.type === "success" ? "#a7f3d0" : undefined,
            marginBottom: "1.5rem"
          }}>
            {msg.text}
          </div>
        )}

        {isClosed ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <h2 style={{ color: "var(--danger)" }}>Portal Error / Ditutup</h2>
            <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>{message}</p>
          </div>
        ) : hasAttendance ? (
           <div style={{ textAlign: "center", padding: "2rem" }}>
            <h2 style={{ color: "var(--primary)" }}>Selesai</h2>
            <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>Anda sudah merekam kehadiran hari ini. Selamat bekerja!</p>
          </div>         
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2 style={{ marginBottom: "1.5rem" }}>Rekam Kehadiran Anda</h2>
            
            <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
              {/* Selfie Camera Area */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <strong style={{ fontSize: "0.9rem" }}>1. Foto Selfie</strong>
                {capturedPhoto ? (
                  <div style={{ position: "relative", width: "100%" }}>
                    <img src={capturedPhoto} alt="Selfie" style={{ width: "100%", borderRadius: "8px", border: "2px solid var(--primary)", aspectRatio: "1/1", objectFit: "cover" }} />
                    <button 
                      onClick={() => { setCapturedPhoto(null); startCamera(); }}
                      style={{ position: "absolute", top: "5px", right: "5px", padding: "3px 8px", borderRadius: "10px", backgroundColor: "rgba(0,0,0,0.6)", color: "white", border: "none", cursor: "pointer", fontSize: "0.6rem" }}
                    >X</button>
                  </div>
                ) : cameraActive ? (
                  <div style={{ position: "relative", width: "100%", backgroundColor: "#000", borderRadius: "8px", overflow: "hidden" }}>
                    <video ref={videoRef} autoPlay playsInline style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }} />
                    <button 
                      onClick={takePhoto}
                      style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", padding: "8px 15px", borderRadius: "20px", border: "none", backgroundColor: "white", color: "#111827", fontWeight: "700", fontSize: "0.7rem", cursor: "pointer" }}
                    >Snap</button>
                  </div>
                ) : (
                  <button onClick={startCamera} style={{ width: "100%", aspectRatio: "1/1", borderRadius: "8px", border: "2px dashed #ccc", cursor: "pointer", color: "#666", backgroundColor: "white" }}>
                    Buka Kamera
                  </button>
                )}
              </div>

              {/* Screenshot Area */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <strong style={{ fontSize: "0.9rem" }}>2. Screenshot App</strong>
                {capturedScreenshot ? (
                  <div style={{ position: "relative", width: "100%" }}>
                    <img src={capturedScreenshot} alt="Screenshot" style={{ width: "100%", borderRadius: "8px", border: "2px solid var(--primary)", aspectRatio: "1/1", objectFit: "cover" }} />
                    <button 
                      onClick={() => setCapturedScreenshot(null)}
                      style={{ position: "absolute", top: "5px", right: "5px", padding: "3px 8px", borderRadius: "10px", backgroundColor: "rgba(0,0,0,0.6)", color: "white", border: "none", cursor: "pointer", fontSize: "0.6rem" }}
                    >X</button>
                  </div>
                ) : (
                  <label style={{ width: "100%", aspectRatio: "1/1", borderRadius: "8px", border: "2px dashed #ccc", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#666", textAlign: "center", padding: "10px", backgroundColor: "white" }}>
                    <input type="file" accept="image/*" onChange={handleScreenshot} style={{ display: "none" }} />
                    <span style={{ fontSize: "0.75rem" }}>Upload Screenshot Bukti Masuk App</span>
                  </label>
                )}
              </div>
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />

            <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
              <button 
                className={styles.actionBtn} 
                onClick={() => handleAbsen("HADIR")}
                disabled={loading || !capturedPhoto || !capturedScreenshot}
                style={{ flex: 2, fontSize: "1.1rem", padding: "1rem", opacity: (!capturedPhoto || !capturedScreenshot || loading) ? 0.6 : 1 }}
              >
                {loading ? "Menyimpan..." : "Kirim Absensi (Hadir)"}
              </button>
              <button 
                className={styles.actionBtn} 
                onClick={() => handleAbsen("IZIN")}
                disabled={loading}
                style={{ flex: 1, fontSize: "1.1rem", padding: "1rem", backgroundColor: "#6b7280" }}
              >
                Izin
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
