import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import EditAnnouncementForm from "./EditAnnouncementForm"

export default async function AdminEditPengumumanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const ann = await prisma.announcement.findUnique({
    where: { id }
  })

  if (!ann) notFound()

  return <EditAnnouncementForm ann={ann} />
}
