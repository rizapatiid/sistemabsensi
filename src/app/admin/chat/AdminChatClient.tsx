
"use client"

import { useState, useEffect, useRef } from "react"
import { getChatList, sendMessage, getMessages, findUserById, deleteMessage, deleteConversation } from "@/actions/chat"
import styles from "@/styles/chat.module.css"

export default function AdminChatClient({ admin }: { admin: any }) {
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [inputText, setInputText] = useState("")
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [confirmData, setConfirmData] = useState<{ type: 'message' | 'convo', id?: string } | null>(null)
  const [searchId, setSearchId] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchChatList()
    const interval = setInterval(fetchChatList, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedUser) {
      setMessages([])
      fetchMessages()
      const interval = setInterval(fetchMessages, 5000)
      return () => clearInterval(interval)
    }
  }, [selectedUser])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const fetchChatList = async () => {
    const res = await getChatList(admin.id)
    if (res.success) setUsers(res.users as any)
  }

  const fetchMessages = async () => {
    if (!selectedUser) return
    const res = await getMessages(admin.id, selectedUser.id)
    if (res.success) setMessages(res.messages as any)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !selectedUser || loading) return

    setLoading(true)
    const res = await sendMessage(admin.id, inputText, selectedUser.id)
    if (res.success) {
      setInputText("")
      fetchMessages()
      fetchChatList()
    }
    setLoading(false)
  }

  const handleSearchNewChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchId.trim() || isSearching) return
    setIsSearching(true)
    const res = await findUserById(searchId.toUpperCase())
    if (res.success) {
      if (!users.find(u => u.id === res.user?.id) && res.user) {
        setUsers(prev => [res.user, ...prev])
      }
      setSelectedUser(res.user)
      setIsModalOpen(false)
      setSearchId("")
    } else {
      alert("ID Karyawan tidak ditemukan.")
    }
    setIsSearching(false)
  }

  const openDeleteMsg = (msgId: string) => {
    setConfirmData({ type: 'message', id: msgId })
    setIsConfirmOpen(true)
  }

  const openDeleteConvo = () => {
    setConfirmData({ type: 'convo' })
    setIsConfirmOpen(true)
  }

  const executeDelete = async () => {
    if (!confirmData) return
    if (confirmData.type === 'message' && confirmData.id) {
      const res = await deleteMessage(confirmData.id, admin.id)
      if (res.success) fetchMessages()
    } else if (confirmData.type === 'convo' && selectedUser) {
      const res = await deleteConversation(admin.id, selectedUser.id)
      if (res.success) {
        setSelectedUser(null)
        fetchChatList()
      }
    }
    setIsConfirmOpen(false)
    setConfirmData(null)
  }

  return (
    <div className={`${styles.layoutWrapper} ${selectedUser ? styles.activeOnDetail : styles.activeOnList}`}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Chat Admin</h2>
        </div>

        <div className={styles.chatList}>
          {users.map((u) => (
            <div 
              key={u.id} 
              className={`${styles.chatItem} ${selectedUser?.id === u.id ? styles.charItemActive : ""}`}
              onClick={() => setSelectedUser(u)}
            >
              <div className={styles.avatar}>
                {u.nama[0]}
                {u.unreadCount > 0 && <span className={styles.unreadBadge}>{u.unreadCount}</span>}
              </div>
              <div className={styles.chatItemInfo}>
                <div className={styles.chatItemTop}>
                  <h3>{u.nama}</h3>
                  <span>ID: {u.id}</span>
                </div>
                <div className={styles.chatItemPreview}>
                  {u.lastMessage || u.role}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className={styles.fabNewChat} onClick={() => setIsModalOpen(true)} title="Koordinasi Baru">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </aside>

      <main className={styles.chatMain}>
        {selectedUser ? (
          <>
            <header className={styles.chatHeader}>
              <button className={styles.backButton} onClick={() => setSelectedUser(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </button>
              <div className={styles.avatar} style={{ width: '40px', height: '40px', fontSize: '0.9rem', borderRadius: '10px' }}>{selectedUser.nama[0]}</div>
              <div className={styles.headerTitle}>
                <h3>{selectedUser.nama}</h3>
              </div>
              <button className={styles.deleteConvoBtn} onClick={openDeleteConvo}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </header>

            <div className={styles.messagesArea} ref={scrollRef}>
              {messages.map((msg: any) => {
                const isMe = msg.senderId === admin.id
                return (
                  <div key={msg.id} className={`${styles.messageWrapper} ${isMe ? styles.isMe : styles.isOther}`}>
                    <div className={styles.bubble}>
                      <p style={{ margin: 0 }}>{msg.content}</p>
                      <div className={styles.messageFooter}>
                        <span className={styles.messageTime}>
                           {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && <button className={styles.delBtn} onClick={() => openDeleteMsg(msg.id)}>✕</button>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <form className={styles.inputArea} onSubmit={handleSend}>
              <div className={styles.inputWrapper}>
                <input type="text" placeholder="Balasan admin..." value={inputText} onChange={(e) => setInputText(e.target.value)} disabled={loading} />
              </div>
              <button type="submit" className={styles.sendBtn} disabled={loading || !inputText.trim()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </form>
          </>
        ) : (
          <div className={styles.noSelection}>
            <h2>Admin Hub</h2>
            <p>Pilih pesan untuk mulai monitoring atau klik "+" untuk mencari karyawan.</p>
          </div>
        )}
      </main>

      {/* NEW CHAT MODAL ADMIN */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}><h3>Cari Karyawan</h3><button onClick={() => setIsModalOpen(false)}>✕</button></div>
            <div className={styles.modalBody}>
              <form className={styles.modalSearch} onSubmit={handleSearchNewChat}>
                <input type="text" placeholder="Masukkan ID Karyawan..." value={searchId} onChange={(e) => setSearchId(e.target.value)} disabled={isSearching} />
                <button type="submit" disabled={isSearching || !searchId.trim()}>Buka Percakapan</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION POPUP */}
      {isConfirmOpen && (
        <div className={styles.modalOverlay} style={{ zIndex: 3000 }}>
          <div className={styles.confirmBox}>
             <h3>Konfirmasi Hapus</h3>
             <p>{confirmData?.type === 'message' ? "Hapus pesan terpilih?" : "Hapus seluruh percakapan?"}</p>
             <div className={styles.confirmActions}>
               <button className={styles.cancelBtn} onClick={() => setIsConfirmOpen(false)}>Batal</button>
               <button className={styles.executeBtn} onClick={executeDelete}>Hapus</button>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
