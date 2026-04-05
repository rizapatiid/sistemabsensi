import { getSession } from "@/actions/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import AdminLayoutClient from "./AdminLayoutClient"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") redirect("/")

  const userProfile = await prisma.user.findUnique({
    where: { id: session.id },
    select: { nama: true, role: true }
  })

  if (!userProfile) redirect("/")

  return (
    <AdminLayoutClient user={{ id: session.id, name: userProfile.nama, role: userProfile.role }} >
      {children}
    </AdminLayoutClient>
  )
}
