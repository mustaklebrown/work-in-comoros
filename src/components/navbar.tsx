import { Suspense } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { NavbarUserAccount, NavbarUserSkeleton } from "@/components/navbar-user-account"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
    return (
        <header className="px-4 md:px-6 py-3 border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
            <div className="max-w-7xl flex items-center justify-between mx-auto">
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

                    <Suspense fallback={<NavbarUserSkeleton />}>
                        <NavbarUserAccount />
                    </Suspense>
                </div>
            </div>
        </header>
    )
}
