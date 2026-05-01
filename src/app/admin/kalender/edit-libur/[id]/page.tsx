import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import EditHolidayClient from "./EditHolidayClient"

export default async function EditHolidayPage({ params }: { params: { id: string } }) {
  const holiday = await prisma.calendar.findUnique({
    where: { id: params.id }
  })

  if (!holiday) {
    notFound()
  }

  return <EditHolidayClient holiday={holiday} />
}
