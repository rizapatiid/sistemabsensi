
"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function findUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, nama: true, role: true }
    })
    return { success: !!user, user }
  } catch (error) {
    return { success: false, error: "Gagal mencari user" }
  }
}

export async function findFirstAdmin() {
  try {
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: { id: true, nama: true, role: true }
    })
    return { success: !!admin, admin }
  } catch (error) {
    return { success: false, error: "Gagal mencari admin" }
  }
}

export async function sendMessage(senderId: string, content: string, receiverId?: string) {
  try {
    const message = await prisma.message.create({
      data: {
        senderId,
        content,
        receiverId: receiverId || null,
      }
    })
    revalidatePath("/chat")
    return { success: true, message }
  } catch (error) {
    console.error("Chat Error:", error)
    return { success: false, error: "Gagal mengirim pesan" }
  }
}

export async function getMessages(userId: string, targetId?: string) {
  try {
    const messages = await prisma.message.findMany({
      where: targetId 
        ? {
            OR: [
              { senderId: userId, receiverId: targetId },
              { senderId: targetId, receiverId: userId }
            ]
          }
        : { receiverId: null },
      include: {
        sender: {
          select: { nama: true, role: true }
        }
      },
      orderBy: { createdAt: "asc" }
    })

    // Mark as read when messages are fetched
    if (targetId) {
      await prisma.message.updateMany({
        where: {
          senderId: targetId,
          receiverId: userId,
          isRead: false
        },
        data: { isRead: true }
      })
    }

    return { success: true, messages }
  } catch (error) {
    console.error("Chat Error:", error)
    return { success: false, error: "Gagal mengambil pesan" }
  }
}

export async function getChatList(userId: string) {
  try {
    const usersWithMessages = await prisma.user.findMany({
      where: {
        id: { not: userId },
        OR: [
          { sentMessages: { some: { receiverId: userId } } },
          { receivedMessages: { some: { senderId: userId } } }
        ]
      },
      select: {
        id: true,
        nama: true,
        role: true,
      }
    })

    const chatList = await Promise.all(usersWithMessages.map(async (u) => {
      const lastMsg = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: userId, receiverId: u.id },
            { senderId: u.id, receiverId: userId }
          ]
        },
        orderBy: { createdAt: "desc" },
        select: { content: true, createdAt: true, senderId: true }
      })

      const unreadCount = await prisma.message.count({
        where: {
          senderId: u.id,
          receiverId: userId,
          isRead: false
        }
      })

      return {
        ...u,
        lastMessage: lastMsg?.content || "",
        lastTime: lastMsg?.createdAt || null,
        unreadCount
      }
    }))

    // Sort by time
    chatList.sort((a: any, b: any) => {
      const timeA = a.lastTime ? new Date(a.lastTime).getTime() : 0
      const timeB = b.lastTime ? new Date(b.lastTime).getTime() : 0
      return timeB - timeA
    })

    return { success: true, users: chatList }
  } catch (error) {
    console.error("Chat Error:", error)
    return { success: false, error: "Gagal mengambil daftar chat" }
  }
}

export async function deleteMessage(messageId: string, userId: string) {
  try {
    const message = await prisma.message.findUnique({ where: { id: messageId } })
    if (!message || message.senderId !== userId) {
      return { success: false, error: "Tidak memiliki izin" }
    }

    await prisma.message.delete({ where: { id: messageId } })
    return { success: true }
  } catch (error) {
    return { success: false, error: "Gagal menghapus pesan" }
  }
}

export async function deleteConversation(userId: string, targetId: string) {
  try {
    await prisma.message.deleteMany({
      where: {
        OR: [
          { senderId: userId, receiverId: targetId },
          { senderId: targetId, receiverId: userId }
        ]
      }
    })
    revalidatePath("/chat")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Gagal menghapus percakapan" }
  }
}
