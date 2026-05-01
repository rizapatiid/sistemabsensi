import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import EditHolidayClient from "./EditHolidayClient"

export default async function EditHolidayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const holiday = await prisma.calendar.findUnique({
    where: { id }
  })

  if (!holiday) {
    notFound()
  }

  return <EditHolidayClient holiday={holiday} />
}
