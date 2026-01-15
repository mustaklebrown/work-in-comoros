"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Settings,
    FileText,
    LogOut,
    Building2,
    Banknote,
    Bell
} from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { Role } from "@/app/prisma/generated/client";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    userRole?: Role; // Pass role from layout
}

export function Sidebar({ className, userRole }: SidebarProps) {
    const pathname = usePathname();
    const isRecruiter = userRole === "RECRUITER";
    const isCandidate = userRole === "CANDIDATE";

    const navItems = [
        ...(isRecruiter ? [
            { label: "Tableau de bord", href: "/dashboard/recruiter", icon: LayoutDashboard, section: "Recrutement" },
            { label: "Offres d'emploi", href: "/dashboard/recruiter/jobs", icon: Briefcase, section: "Recrutement" },
            { label: "Candidatures", href: "/dashboard/recruiter/applications", icon: Users, section: "Recrutement" },
            { label: "Entretiens", href: "/dashboard/recruiter/interviews", icon: FileText, section: "Recrutement" },
            { label: "Paie & Contrats", href: "/dashboard/recruiter/payroll", icon: Banknote, section: "Recrutement" },
            { label: "Notifications", href: "/dashboard/recruiter/notifications", icon: Bell, section: "Recrutement" },
        ] : []),
        ...(isCandidate ? [
            { label: "Vue d'ensemble", href: "/dashboard/candidate", icon: LayoutDashboard, section: "Espace Candidat" },
            { label: "Mes Candidatures", href: "/dashboard/candidate/applications", icon: Briefcase, section: "Espace Candidat" },
            { label: "Notifications", href: "/dashboard/candidate/notifications", icon: Bell, section: "Espace Candidat" },
        ] : []),
        { label: "Paramètres", href: "/dashboard/settings", icon: Settings, section: "Compte" },
    ];

    const sections = Array.from(new Set(navItems.map(item => item.section)));

    return (
        <div className={cn("flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800", className)}>
            {/* Logo Section */}
            <div className="px-6 py-6 mb-2">
                <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="relative w-10 h-10 shrink-0">
                        <Image
                            src="/wic-logo.png"
                            alt="W-I-C Logo"
                            width={40}
                            height={40}
                            className="rounded-xl shadow-sm"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-xl text-zinc-900 dark:text-white leading-none">W-I-C</span>
                        <span className="text-[10px] text-zinc-500 font-medium tracking-wider uppercase mt-1">Plateforme RH</span>
                    </div>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-3 space-y-6">
                {sections.map((section) => (
                    <div key={section} className="space-y-1">
                        <h2 className="mb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                            {section}
                        </h2>
                        <div className="space-y-1">
                            {navItems
                                .filter(item => item.section === section)
                                .map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;
                                    return (
                                        <Button
                                            key={item.href}
                                            variant={isActive ? "secondary" : "ghost"}
                                            className={cn(
                                                "w-full justify-start transition-all duration-200 h-10 group",
                                                isActive
                                                    ? "bg-blue-50 text-[#0052cc] dark:bg-blue-900/20 dark:text-blue-400 font-bold shadow-sm"
                                                    : "text-zinc-500 dark:text-zinc-400 hover:text-[#0052cc] dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
                                            )}
                                            asChild
                                        >
                                            <Link href={item.href}>
                                                <Icon className={cn(
                                                    "mr-3 h-4 w-4 transition-transform duration-200 group-hover:scale-110",
                                                    isActive ? "text-[#0052cc] dark:text-blue-400" : "text-zinc-400 group-hover:text-[#0052cc] dark:hover:text-blue-400"
                                                )} />
                                                {item.label}
                                            </Link>
                                        </Button>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Logout at bottom */}
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
                <LogoutButton className="w-full justify-start text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors" />
            </div>
        </div>
    );
}
