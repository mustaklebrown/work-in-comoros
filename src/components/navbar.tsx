import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
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
import Image from "next/image"

export async function Navbar() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const user = session?.user

    return (
        <header className="px-4 md:px-6 h-20 flex items-center justify-between border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="relative w-10 h-10">
                    <Image
                        src="/wic-logo.png"
                        alt="Work-in-Comoros Logo"
                        width={40}
                        height={40}
                        className="rounded-xl"
                        priority
                    />
                </div>
                <div className="hidden sm:block">
                    <div className="font-bold text-xl text-zinc-900 dark:text-white">Work-in-Comoros</div>
                    <div className="text-[10px] text-zinc-500 -mt-0.5">Plateforme RH #1</div>
                </div>
            </Link>

            <div className="flex items-center gap-2 md:gap-4">
                <Button variant="ghost" className="hidden md:inline-flex text-zinc-600 dark:text-zinc-400" asChild>
                    <Link href="/jobs">Offres d'emploi</Link>
                </Button>

                <ModeToggle />

                {user ? (
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
                                        <AvatarFallback className="bg-gradient-to-br from-[#0052cc] to-blue-600 text-white font-semibold">
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
                ) : (
                    <>
                        <Button variant="ghost" className="text-zinc-600 dark:text-zinc-400" asChild>
                            <Link href="/login">Connexion</Link>
                        </Button>
                        <Button className="bg-gradient-to-r from-[#0052cc] to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/20" asChild>
                            <Link href="/register">S'inscrire</Link>
                        </Button>
                    </>
                )}
            </div>
        </header>
    )
}
