"use client"

import { Bell, CheckCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/app/actions/notification-actions"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface Notification {
    id: string
    title: string
    message: string
    createdAt: Date
    isRead: boolean
}

interface NotificationListProps {
    initialNotifications: Notification[]
}

export function NotificationList({ initialNotifications }: NotificationListProps) {
    const unreadCount = initialNotifications.filter(n => !n.isRead).length

    const handleMarkAsRead = async (id: string) => {
        try {
            await markNotificationAsRead(id)
            toast.success("Notification lue")
        } catch (error) {
            toast.error("Erreur lors de la mise à jour")
        }
    }

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return
        try {
            await markAllNotificationsAsRead()
            toast.success("Toutes les notifications sont lues")
        } catch (error) {
            toast.error("Erreur lors de la mise à jour")
        }
    }

    return (
        <Card className="col-span-1 w-full shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Bell className="h-5 w-5 text-[#0052cc]" />
                    Notifications
                </CardTitle>
                {unreadCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8 text-[#0052cc] hover:text-[#0052cc] hover:bg-blue-50"
                        onClick={handleMarkAllAsRead}
                    >
                        <CheckCheck className="h-4 w-4 mr-1" />
                        Tout lire
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {initialNotifications.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">Aucune notification pour le moment.</p>
                    </div>
                ) : (
                    <div className="space-y-3 ">
                        {initialNotifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`p-4 rounded-xl border transition-all cursor-pointer group relative ${notif.isRead
                                    ? 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'
                                    : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30'
                                    }`}
                                onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                            >
                                {!notif.isRead && (
                                    <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-[#0052cc] animate-pulse"></span>
                                )}
                                <p className={`font-bold text-sm ${notif.isRead ? 'text-zinc-900 dark:text-zinc-100' : 'text-[#0052cc] dark:text-blue-400'}`}>
                                    {notif.title}
                                </p>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                                    {notif.message}
                                </p>
                                <p className="text-[10px] text-zinc-400 mt-2 flex items-center gap-1">
                                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: fr })}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
