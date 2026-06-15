'use client'

import { useState, useEffect } from 'react'

export default function ServerMonitor() {
  const [loading, setLoading] = useState(false)
  const [dateStr, setDateStr] = useState<string>('Memuat...')
  const [timeStr, setTimeStr] = useState<string>('--:--:--')
  const [data, setData] = useState({
    // Info paket
    plan: 'Business Web Hosting',
    batasResource: 'Unlimited Bandwidth / 200GB SSD',
    
    // Pemakaian resource
    storage: { used: 45.2, total: 200, unit: 'GB' },
    inodes: { used: 120500, total: 600000, unit: 'File' },
    databases: { used: 5, total: 'Unlimited' },
    subdomains: { used: 2, total: 100 },
    parkedDomains: { used: 1, total: 100 },
    ftpAccounts: { used: 3, total: 'Unlimited' },
    
    // Info website/domain
    activeDomains: 3,
    rootFolder: '/public_html',
    domainStatus: 'Aktif / Resolving',
    
    // SSL & PHP
    sslStatus: 'Active (Sertifikat Lifetime per domain)',
    phpVersion: '8.2 (Bisa diubah tiap subdomain)',
    
    // Nameserver & Info server
    nameservers: 'ns1.dns-parking.com, ns2.dns-parking.com',
    serverLocation: 'Singapore (SG)',
    webServer: 'LiteSpeed Web Server',
  })

  // Jam Real-time WIB
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const dateOptions: Intl.DateTimeFormatOptions = { 
        timeZone: 'Asia/Jakarta', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      }
      const timeOptions: Intl.DateTimeFormatOptions = { 
        timeZone: 'Asia/Jakarta', 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
      }
      setDateStr(now.toLocaleString('id-ID', dateOptions))
      setTimeStr(now.toLocaleString('id-ID', timeOptions).replace(/\./g, ':'))
    }
    
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchServerStats = async () => {
    setLoading(true)
    setTimeout(() => {
        setData(prev => ({
          ...prev,
          storage: { ...prev.storage, used: Math.floor(Math.random() * 20) + 40 },
          inodes: { ...prev.inodes, used: Math.floor(Math.random() * 5000) + 120000 },
        }))
        setLoading(false)
    }, 1000)
  }

  useEffect(() => {
    fetchServerStats()
  }, [])

  const storagePercent = (data.storage.used / (data.storage.total as number)) * 100
  const inodesPercent = (data.inodes.used / (data.inodes.total as number)) * 100

  // Komponen bantuan
  const InfoRow = ({ label, value, icon }: { label: string, value: string | number, icon?: React.ReactNode }) => (
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {icon && <span style={{ display: 'flex', alignItems: 'center', color: '#94a3b8' }}>{icon}</span>}
              <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
          </div>
          <span style={{ color: '#0f172a', fontSize: '0.85rem', fontWeight: 700, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
      </div>
  )

  const ProgressBar = ({ label, used, total, unit, percent, colorMap, icon }: any) => (
      <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {icon && <span style={{ display: 'flex', alignItems: 'center', color: '#94a3b8' }}>{icon}</span>}
                  <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>{label}</span>
              </div>
              <span style={{ color: '#0f172a', fontSize: '0.8rem', fontWeight: 800 }}>
                  {typeof used === 'number' && used > 1000 ? (used/1000).toFixed(1)+'k' : used} / 
                  {typeof total === 'number' && total > 1000 ? (total/1000).toFixed(0)+'k' : total} {unit}
              </span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                  width: `${percent}%`, height: '100%', 
                  background: percent > 80 ? colorMap.high : percent > 50 ? colorMap.medium : colorMap.low, 
                  borderRadius: '4px', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' 
              }}></div>
          </div>
      </div>
  )

  const cardStyle = {
      background: '#ffffff',
      borderRadius: '20px', 
      padding: '16px 20px', 
      border: '1px solid #e2e8f0',
      boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
      position: 'relative' as 'relative',
      overflow: 'hidden'
  }

  const CopyableItem = ({ text }: { text: string }) => {
      const [copied, setCopied] = useState(false);
      const handleCopy = () => {
          navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      };
      return (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid #e2e8f0' }}>
              <span>{text}</span>
              <button 
                  onClick={handleCopy}
                  title="Salin"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: copied ? '#10b981' : '#94a3b8', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
                  onMouseOver={(e) => { if(!copied) e.currentTarget.style.color = '#3b82f6' }}
                  onMouseOut={(e) => { if(!copied) e.currentTarget.style.color = '#94a3b8' }}
              >
                  {copied ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  )}
              </button>
          </div>
      );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <style>{`
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @media (max-width: 640px) {
                .hide-text-mobile { display: none; }
                .sync-btn { padding: 10px !important; }
            }
            .nameserver-list > div:last-child {
                border-bottom: none !important;
            }
        `}</style>
        
        {/* Top Row Cards */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {/* Header Card */}
            <div style={{ 
                ...cardStyle,
                padding: '16px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
                flex: '1 1 350px'
            }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 1, flex: 1, minWidth: 0 }}>
                    <div style={{ 
                        background: '#eff6ff', color: '#3b82f6', height: '46px', width: '46px', 
                        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(59, 130, 246, 0.1)', border: '1px solid #dbeafe', flexShrink: 0
                    }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                    </div>
                    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <h3 style={{ margin: '0 0 2px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            Status Server
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ position: 'absolute', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', opacity: 0.4, animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
                                <span style={{ position: 'relative', width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                            </div>
                            <p style={{ margin: '0', fontSize: '0.85rem', color: '#475569', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {data.plan}
                            </p>
                        </div>
                        <p style={{ margin: '0', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, paddingLeft: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            Lokasi: {data.serverLocation}
                        </p>
                    </div>
                </div>
                
                <button 
                    className="sync-btn"
                    onClick={fetchServerStats} disabled={loading}
                    style={{
                        background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0',
                        padding: '10px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '8px', height: 'fit-content',
                        position: 'relative', zIndex: 1, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                    }}
                    onMouseOver={(e) => { if (!loading) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; } }}
                    onMouseOut={(e) => { if (!loading) { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; } }}
                >
                    <svg style={{ animation: loading ? 'spin 1s linear infinite' : 'none', color: '#3b82f6', flexShrink: 0 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                    <span className="hide-text-mobile">{loading ? 'Sinkronisasi...' : 'Perbarui Data'}</span>
                </button>
            </div>

            {/* Time Card */}
            <div style={{ 
                ...cardStyle,
                display: 'flex', alignItems: 'center', gap: '16px',
                flex: '1 1 280px'
            }}>
                <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                    <div style={{ 
                        background: '#ecfdf5', color: '#10b981', height: '52px', width: '52px', 
                        borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        flexShrink: 0, border: '1px solid #a7f3d0', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.15)'
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#64748b', fontWeight: 800 }}>Waktu Server</h4>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                            <span style={{ 
                                fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', 
                                letterSpacing: '1.5px', fontFamily: '"SF Mono", "Roboto Mono", monospace',
                                fontVariantNumeric: 'tabular-nums'
                            }}>
                                {timeStr}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                                {dateStr}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            
            {/* Card 1: Pemakaian Resource */}
            <div style={{ 
                ...cardStyle,
                display: 'flex', flexDirection: 'column', gap: '12px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '8px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                    </div>
                    <h4 style={{ color: '#0f172a', fontSize: '1.05rem', margin: '0', fontWeight: 800 }}>Pemakaian Resource</h4>
                </div>
                <ProgressBar icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>} label="Storage (SSD)" used={data.storage.used.toFixed(1)} total={data.storage.total} unit="GB" percent={storagePercent} colorMap={{low:'#3b82f6', medium:'#f59e0b', high:'#ef4444'}} />
                <ProgressBar icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>} label="Inodes (File)" used={data.inodes.used} total={data.inodes.total} unit="" percent={inodesPercent} colorMap={{low:'#10b981', medium:'#f59e0b', high:'#ef4444'}} />
                
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column' }}>
                    <InfoRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>} label="Nama Plan" value={data.plan} />
                    <div style={{ borderBottom: 'none' }}><InfoRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>} label="Batas Resource" value={data.batasResource} /></div>
                </div>
            </div>

            {/* Card 2: Akun & Database */}
            <div style={{ 
                ...cardStyle,
                display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ background: '#f5f3ff', padding: '6px', borderRadius: '8px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                    </div>
                    <h4 style={{ color: '#0f172a', fontSize: '1.05rem', margin: '0', fontWeight: 800 }}>Akun & Database</h4>
                </div>
                <InfoRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>} label="Databases (MySQL)" value={`${data.databases.used} / ${data.databases.total}`} />
                <InfoRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>} label="Subdomains" value={`${data.subdomains.used} / ${data.subdomains.total}`} />
                <InfoRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9 17V7h4a3 3 0 0 1 0 6H9"></path></svg>} label="Parked Domains" value={`${data.parkedDomains.used} / ${data.parkedDomains.total}`} />
                <div style={{ borderBottom: 'none' }}><InfoRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>} label="Akun FTP" value={`${data.ftpAccounts.used} / ${data.ftpAccounts.total}`} /></div>
            </div>

            {/* Card 3: Website, SSL, PHP, Server */}
            <div style={{ 
                ...cardStyle,
                display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ background: '#ecfdf5', padding: '6px', borderRadius: '8px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    </div>
                    <h4 style={{ color: '#0f172a', fontSize: '1.05rem', margin: '0', fontWeight: 800 }}>Info Website & Server</h4>
                </div>
                <InfoRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>} label="Domain Aktif" value={data.activeDomains} />
                <InfoRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>} label="Root Folder" value={data.rootFolder} />
                <InfoRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>} label="Status Domain" value={data.domainStatus} />
                <InfoRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>} label="SSL Status" value={data.sslStatus} />
                <InfoRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>} label="Versi PHP" value={data.phpVersion} />
                <InfoRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>} label="Web Server" value={data.webServer} />
                
                <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Nameservers</span>
                    </div>
                    <div className="nameserver-list" style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', color: '#334155', fontFamily: 'monospace', wordBreak: 'break-all', border: '1px solid #f1f5f9' }}>
                        {data.nameservers.split(', ').map((ns, i) => <CopyableItem key={i} text={ns} />)}
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}

