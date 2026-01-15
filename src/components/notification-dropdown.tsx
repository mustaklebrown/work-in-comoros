"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface Notification {
    id: string
    title: string
    message: string
    createdAt: Date
    isRead: boolean
}

export function NotificationDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const unreadCount = notifications.filter(n => !n.isRead).length

    // In a real app, this would be fetched from an API or passed via props
    // For now, we'll assume it's fetched on mount (mocking the fetch for now as we don't have a dedicated API route yet, or we could add a server action call)

    // NOTE: For this task, I'll keep it simple and just show a message if empty, 
    // but the candidate dashboard already shows them.

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-zinc-500 dark:text-zinc-400">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-zinc-900"></span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Aucune notification
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <DropdownMenuItem key={n.id} className="flex flex-col items-start p-3 focus:bg-slate-50">
                                <p className="font-bold text-xs text-[#0052cc]">{n.title}</p>
                                <p className="text-xs text-zinc-600 mt-0.5 line-clamp-2">{n.message}</p>
                                <p className="text-[10px] text-zinc-400 mt-1">
                                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: fr })}
                                </p>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center w-full justify-center text-xs text-[#0052cc] font-medium">
                    Voir toutes les notifications
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
