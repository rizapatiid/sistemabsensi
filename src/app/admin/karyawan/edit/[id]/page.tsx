import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import EditEmployeeForm from "./EditEmployeeForm"

export default async function AdminEditKaryawanPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  
  const user = await prisma.user.findUnique({
    where: { id }
  })

  if (!user || user.role !== "KARYAWAN") {
    notFound()
  }

  return <EditEmployeeForm user={user} />
}

