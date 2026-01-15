import { prisma } from "@/lib/prisma"
import { Role } from "@/app/prisma/generated/client"
import { KanbanBoard } from "@/components/recruiter/kanban-board"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function ApplicationsPage() {
    // 1. Authenticate User
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || !session.user) {
        redirect("/")
    }

    const recruiter = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { company: true }
    })

    if (!recruiter || !recruiter.companyId || recruiter.role !== Role.RECRUITER) {
        return <div className="p-8">Erreur: Vous devez être un recruteur connecté.</div>
    }

    // 2. Fetch Applications
    const applications = await prisma.application.findMany({
        where: {
            job: { companyId: recruiter.companyId }
        },
        include: {
            user: true,
            job: true
        },
        orderBy: { createdAt: 'desc' }
    })

    // Transform data for the Kanban board
    const candidates = applications.map(app => ({
        id: app.id,
        name: app.user.name || "Candidat Anonyme",
        email: app.user.email,
        role: app.job.title,
        avatar: app.user.name ? app.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "??",
        date: app.createdAt.toLocaleDateString(),
        status: app.status,
        interviewDate: app.interviewDate ? app.interviewDate.toLocaleString() : undefined,
        // CV Data
        headline: app.user.headline || undefined,
        summary: app.user.summary || undefined,
        skills: app.user.skills || undefined,
        experience: app.user.experience || undefined,
        education: app.user.education || undefined,
        location: app.user.location || undefined
    }))

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] w-full max-w-full gap-4">
            <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold tracking-tight text-[#0052cc] dark:text-blue-400">Candidatures</h1>
                </div>
            </header>

            <KanbanBoard initialCandidates={candidates} />
        </div>
    )
}
