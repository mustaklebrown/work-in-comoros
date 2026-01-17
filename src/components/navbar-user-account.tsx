import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Building2, LayoutDashboard, LogOut } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export async function NavbarUserAccount() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const user = session?.user

    if (!user) {
        return (
            <>
                <Button variant="ghost" className="text-zinc-600 dark:text-zinc-400" asChild>
                    <Link href="/login">Connexion</Link>
                </Button>
                <Button className="bg-linear-to-r from-[#0052cc] to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/20" asChild>
                    <Link href="/register">S'inscrire</Link>
                </Button>
            </>
        )
    }

    return (
        <>
            <Button
                variant="ghost"
                className="hidden sm:inline-flex gap-2 text-zinc-600 dark:text-zinc-400"
                asChild
            >
                <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                </Link>
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-linear-to-br from-[#0052cc] to-blue-600 text-white font-semibold">
                                {user.name
                                    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                                    : user.email?.substring(0, 2).toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.name || 'Utilisateur'}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="sm:hidden">
                        <Link href="/dashboard" className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/settings" className="cursor-pointer">
                            <Building2 className="mr-2 h-4 w-4" />
                            <span>Paramètres</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <form action="/api/auth/sign-out" method="POST" className="w-full">
                            <button type="submit" className="flex w-full items-center text-red-600 dark:text-red-400">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Déconnexion</span>
                            </button>
                        </form>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export function NavbarUserSkeleton() {
    return (
        <div className="flex items-center gap-2">
            <div className="h-9 w-20 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-md" />
            <div className="h-9 w-24 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-md" />
        </div>
    )
}
