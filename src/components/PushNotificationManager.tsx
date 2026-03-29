"use client";

import { useEffect, useState } from "react";
import { subscribeUser, unsubscribeUser } from "@/actions/push";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      initPush();
    } else {
      setLoading(false);
    }
  }, []);

  async function initPush() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
      
      // AUTO-ACTIVATE: Jika didukung dan belum berlangganan, namun izin sudah diberikan sebelumnya
      if (!sub && Notification.permission === "granted") {
        await subscribeToPush();
      }
    } catch (e) {
      console.error("Gagal inisialisasi push:", e);
    } finally {
      setLoading(false);
    }
  }

  async function subscribeToPush() {
    try {
      setLoading(true);
      const registration = await navigator.serviceWorker.ready;
      
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        console.error("VAPID Public Key is missing from environment variables.");
        return;
      }

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const subData = JSON.parse(JSON.stringify(sub));
      await subscribeUser(subData);
      setSubscription(sub);
    } catch (error) {
      console.error("Gagal berlangganan push:", error);
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribeFromPush() {
    try {
      setLoading(true);
      if (subscription) {
        await subscription.unsubscribe();
        await unsubscribeUser(subscription.endpoint);
        setSubscription(null);
      }
    } catch (error) {
      console.error("Gagal berhenti berlangganan push:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!isSupported) return null;

  return (
    <div style={{ 
      marginTop: '24px', 
      padding: '24px', 
      backgroundColor: 'white', 
      borderRadius: '16px', 
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            backgroundColor: subscription ? '#dcfce7' : '#f1f5f9', 
            color: subscription ? '#166534' : '#64748b',
            width: '48px', 
            height: '48px', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <div style={{ minWidth: '200px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Pemberitahuan Push</h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.4' }}>
              Dapatkan notifikasi real-time untuk payroll dan pengumuman penting.
            </p>
          </div>
        </div>
        
        <button 
          onClick={subscription ? unsubscribeFromPush : subscribeToPush}
          disabled={loading}
          style={{
            backgroundColor: subscription ? '#fef2f2' : '#1e40af',
            color: subscription ? '#991b1b' : 'white',
            border: `1px solid ${subscription ? '#fee2e2' : '#1e3a8a'}`,
            padding: '10px 24px',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: subscription ? 'none' : '0 4px 12px rgba(30, 64, 175, 0.2)'
          }}
        >
          {loading ? 'Proses...' : subscription ? 'Nonaktifkan' : 'Aktifkan Notifikasi'}
        </button>
      </div>

      {!subscription && !loading && (
        <div style={{ 
          marginTop: '16px', 
          padding: '12px 16px', 
          backgroundColor: '#eff6ff', 
          borderRadius: '10px', 
          fontSize: '0.8rem', 
          color: '#1e40af',
          border: '1px solid #dbeafe',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <span>Klik aktifkan untuk menerima pembaruan gaji secara instan di perangkat Anda.</span>
        </div>
      )}
    </div>
  );
}
