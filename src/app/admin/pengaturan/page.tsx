import { getSession } from "@/actions/auth"
import { getSystemSettings } from "@/lib/settings"
import PengaturanClient from "./PengaturanClient"
import styles from "@/styles/admin.module.css"

export default async function PengaturanPage() {
    const session = await getSession()
    if (session?.role !== "ADMIN") return <div>Unauthorized</div>

    const settings = await getSystemSettings()

    return (
        <div className={styles.pageContainer}>
            <PengaturanClient settings={settings} />
        </div>
    )
}
