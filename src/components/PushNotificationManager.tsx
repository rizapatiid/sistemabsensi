"use client";

import { useEffect, useState } from "react";
import { subscribeUser, unsubscribeUser } from "@/actions/push";
import styles from "@/styles/profil_karyawan.module.css"

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

  const enabled = !!subscription;

  return (
    <div className={styles.notifCard}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'inherit', flex: 1 }}>
        <div className={styles.notifIcon} style={{ 
          background: enabled 
            ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' 
            : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
          color: enabled ? '#16a34a' : '#94a3b8',
          boxShadow: enabled ? '0 4px 12px rgba(22, 163, 74, 0.1)' : 'none',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
             <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </div>
        <div className={styles.notifContent}>
          <h3>Pemberitahuan Push</h3>
          <p>Dapatkan notifikasi real-time di perangkat ini.</p>
        </div>
      </div>
      
      <div 
        onClick={loading ? undefined : (enabled ? unsubscribeFromPush : subscribeToPush)}
        className={styles.switch}
        style={{
          backgroundColor: enabled ? '#16a34a' : '#cbd5e1',
          boxShadow: enabled ? '0 4px 12px rgba(22, 163, 74, 0.3)' : 'inset 0 2px 4px rgba(0,0,0,0.05)',
          opacity: loading ? 0.7 : 1,
        }}
      >
        <div 
          className={styles.switchKnob}
          style={{
            transform: `translateX(${enabled ? 'calc(100% + 4px)' : '0px'})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {loading && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
