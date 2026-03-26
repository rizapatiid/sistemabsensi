import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import EditAnnouncementForm from "./EditAnnouncementForm"

export default async function AdminEditAnnouncementPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const announcement = await prisma.announcement.findUnique({ where: { id } })

  if (!announcement) notFound()

  return <EditAnnouncementForm announcement={announcement} />
}
