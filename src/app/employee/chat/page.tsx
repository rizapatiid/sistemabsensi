
import { getSession } from "@/actions/auth"
import prisma from "@/lib/prisma"
import ChatClient from "./ChatClient"
import { redirect } from "next/navigation"

export default async function ChatPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, nama: true, role: true }
  })

  if (!user) redirect("/login")

  return (
    <div style={{ height: 'calc(100vh - 70px)', overflow: 'hidden' }}>
      <ChatClient user={user} />
    </div>
  )
}
