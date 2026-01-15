"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface LogoutButtonProps {
    className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
    const router = useRouter()

    const handleLogout = async () => {
        await authClient.signOut()
        router.push("/")
    }

    return (
        <Button
            variant="ghost"
            className={cn("w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20", className)}
            onClick={handleLogout}
        >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
        </Button>
    )
}
