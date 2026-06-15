"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { updateAvatarKaryawanAction } from "@/actions/employeeUser"
import styles from "@/styles/profil_karyawan.module.css"

export default function AvatarEditor({ user }: { user: { fotoProfil: string | null; nama: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar tidak boleh lebih dari 2MB")
        return
      }
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setIsModalOpen(true)
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSave = async () => {
    if (!selectedFile) return

    setIsLoading(true)
    try {
      const reader = new FileReader()
      reader.readAsDataURL(selectedFile)
      reader.onloadend = async () => {
        const base64data = reader.result as string
        const res = await updateAvatarKaryawanAction(base64data)
        
        if (res?.error) {
          alert(res.error)
        } else {
          setIsModalOpen(false)
        }
        setIsLoading(false)
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem.")
      setIsLoading(false)
    }
  }

  return (
    <>
      <div style={{ position: 'relative', width: '116px', height: '116px', marginBottom: '12px', zIndex: 2 }}>
        <div style={{ 
            width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', 
            border: '5px solid white', boxShadow: '0 8px 20px -4px rgba(0,0,0,0.15)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            background: '#f8fafc'
        }}>
          {user.fotoProfil ? (
            <Image src={user.fotoProfil} alt={user.nama} width={116} height={116} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          )}
        </div>

        <button 
          onClick={() => fileInputRef.current?.click()}
          style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            padding: 0,
            zIndex: 3
          }}
          title="Ubah Foto Profil"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </button>

        <input 
          type="file" 
          accept="image/*" 
          style={{ display: 'none' }} 
          ref={fileInputRef} 
          onChange={handleFileChange} 
        />
      </div>

      {isModalOpen && previewUrl && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '20px'
        }}>
          <div style={{
            background: 'white', borderRadius: '8px', padding: '24px',
            width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Pratinjau Foto Profil</h3>
            
            <div style={{
              width: '160px', height: '160px', borderRadius: '50%', overflow: 'hidden',
              border: '4px solid #f1f5f9', marginBottom: '24px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}>
              <Image src={previewUrl} alt="Preview" width={160} height={160} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button 
                onClick={handleClose}
                disabled={isLoading}
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1',
                  background: 'white', color: '#475569', fontWeight: 800, cursor: isLoading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.05em', transition: 'all 0.2s', textTransform: 'uppercase', fontSize: '0.9rem'
                }}
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                disabled={isLoading}
                className={styles.submitBtn}
                style={{
                  flex: 1, margin: 0, width: 'auto', padding: '12px', cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                {isLoading ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                    </svg>
                    MEMPROSES...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                    SIMPAN
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
