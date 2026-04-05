
import { getSession } from "@/actions/auth"
import prisma from "@/lib/prisma"
import AdminChatClient from "./AdminChatClient"
import { redirect } from "next/navigation"

export default async function AdminChatPage() {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") redirect("/login")

  const admin = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, nama: true, role: true }
  })

  if (!admin) redirect("/login")

  return (
    <div style={{ height: 'calc(100vh - 70px)', overflow: 'hidden' }}>
      <AdminChatClient admin={admin} />
    </div>
  )
}
