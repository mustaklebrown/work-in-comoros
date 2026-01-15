import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Role } from "@/app/prisma/generated/client"
import { NotificationList } from "@/components/notification-list"

export default async function RecruiterNotificationsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || !session.user) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            notifications: {
                orderBy: { createdAt: 'desc' },
                take: 20
            }
        }
    })

    if (!user || user.role !== Role.RECRUITER) {
        redirect("/dashboard")
    }

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-[#0052cc] dark:text-blue-400">
                        Notifications
                    </h2>
                    <p className="text-muted-foreground">Restez informé des dernières mises à jour.</p>
                </div>
            </div>

            <div className="w-full">
                <NotificationList initialNotifications={user.notifications} />
            </div>
        </div>
    )
}
