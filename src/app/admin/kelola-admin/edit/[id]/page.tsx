import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import { redirect, notFound } from "next/navigation"
import EditAdminForm from "./EditAdminForm"

export default async function EditAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") redirect("/")

  const { id } = await params
  const admin = await prisma.user.findUnique({
    where: { id }
  })

  if (!admin || admin.role !== "ADMIN") return notFound()

  return <EditAdminForm user={admin} />
}
