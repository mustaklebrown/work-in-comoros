import { Sidebar } from "@/components/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bell, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Role } from "@/app/prisma/generated/client";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const user = session?.user;
    let companyName = "";
    let userRole: Role | undefined = undefined;

    if (user) {
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: { company: true }
        });
        companyName = dbUser?.company?.name || "";
        userRole = dbUser?.role;
    }

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-black">
            {/* Desktop Sidebar */}
            <div className="hidden md:block fixed inset-y-0 z-50 w-64 border-r bg-white dark:bg-zinc-900 dark:border-zinc-800">
                <Sidebar className="border-none" userRole={userRole} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300 ease-in-out min-w-0">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden -ml-2">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64 border-r bg-white dark:bg-zinc-900 dark:border-zinc-800">
                            <Sidebar className="border-none" userRole={userRole} />
                        </SheetContent>
                    </Sheet>

                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-3 md:w-1/3">
                            {/* Logo */}
                            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
                                <div className="relative w-8 h-8">
                                    <Image
                                        src="/wic-logo.png"
                                        alt="W-I-C"
                                        width={32}
                                        height={32}
                                        className="rounded-lg"
                                        priority
                                    />
                                </div>
                                <span className="hidden lg:inline font-bold text-sm text-zinc-900 dark:text-white">W-I-C</span>
                            </Link>

                            {/* Search */}
                            <div className="hidden sm:flex items-center gap-2">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Rechercher..."
                                    className="h-9 w-[120px] md:w-[200px] lg:w-[280px] border-none bg-slate-50 dark:bg-zinc-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                            <ModeToggle />
                            <Button variant="ghost" size="icon" className="relative text-zinc-500 dark:text-zinc-400" asChild>
                                <Link href={userRole === "RECRUITER" ? "/dashboard/recruiter/notifications" : "/dashboard/candidate/notifications"}>
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-zinc-900"></span>
                                </Link>
                            </Button>
                            <div className="flex items-center gap-2 border-l pl-4 dark:border-zinc-700">
                                <div className="hidden flex-col items-end md:flex">
                                    <span className="text-sm font-medium dark:text-zinc-100">{user?.name || "Invité"}</span>
                                    {companyName && (
                                        <span className="text-xs text-muted-foreground">{companyName}</span>
                                    )}
                                </div>
                                <Avatar className="h-8 w-8 md:h-10 md:w-10 ring-2 ring-white dark:ring-zinc-800">
                                    <AvatarImage src={user?.image || "/avatars/01.png"} alt={user?.name || "@user"} />
                                    <AvatarFallback className="bg-[#0052cc] text-white">
                                        {user?.name?.slice(0, 2).toUpperCase() || "??"}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-2 md:p-8 overflow-y-auto overflow-x-hidden min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
