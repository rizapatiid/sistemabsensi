import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import { redirect } from "next/navigation"
import AdminManagementClient from "./AdminManagementClient"

export default async function KelolaAdminPage() {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") redirect("/")

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "desc" }
  })

  return <AdminManagementClient admins={admins} currentUserId={session.id} />
}
