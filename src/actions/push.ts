"use server"

import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import webpush from "web-push"

if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:rmpstorages@gmail.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
}

export async function subscribeUser(subscription: any) {
  const session = await getSession()
  if (!session) return { error: "Terjadi kesalahan: Sesi tidak ditemukan." }

  try {
    await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        userId: session.id,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
      create: {
        userId: session.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    })
    return { success: true }
  } catch (error) {
    console.error("Gagal menyimpan langganan push:", error)
    return { error: "Gagal menyimpan langganan." }
  }
}

export async function unsubscribeUser(endpoint: string) {
  try {
    await prisma.pushSubscription.delete({
      where: { endpoint },
    })
    return { success: true }
  } catch (error) {
    console.error("Gagal menghapus langganan push:", error)
    return { error: "Gagal menghapus langganan." }
  }
}

export async function sendNotificationToUser(userId: string, title: string, body: string, url: string = "/") {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  })

  const results = await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          JSON.stringify({ title, body, url })
        )
        return { success: true }
      } catch (error: any) {
        if (error.statusCode === 410 || error.statusCode === 404) {
          // Subscription has expired or is no longer valid
          await prisma.pushSubscription.delete({ where: { id: sub.id } })
        }
        return { success: false, error: error.message }
      }
    })
  )

  return results
}

export async function sendNotificationToAllUsers(title: string, body: string, url: string = "/") {
  const subscriptions = await prisma.pushSubscription.findMany()

  const results = await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          JSON.stringify({ title, body, url })
        )
        return { success: true }
      } catch (error: any) {
        if (error.statusCode === 410 || error.statusCode === 404) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } })
        }
        return { success: false, error: error.message }
      }
    })
  )

  return results
}
