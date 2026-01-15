import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Clock, CheckCircle2, XCircle, TrendingUp, Search, Bell } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Role, ApplicationStatus } from "@/app/prisma/generated/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { NotificationList } from "@/components/notification-list"

export default async function CandidateDashboard() {
    // 1. Authenticate User
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || !session.user) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            applications: {
                include: {
                    job: {
                        include: { company: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: 5
            },
            notifications: {
                orderBy: { createdAt: 'desc' },
                take: 5
            }
        }
    })

    if (!user || user.role !== Role.CANDIDATE) {
        // If recruiter is here, redirect them or show error
        if (user?.role === Role.RECRUITER) redirect("/dashboard/recruiter")
        return <div className="p-8">Accès refusé. Réservé aux candidats.</div>
    }

    // 2. Calculate Stats
    const totalApps = await prisma.application.count({ where: { userId: user.id } })
    const pendingApps = await prisma.application.count({
        where: { userId: user.id, status: ApplicationStatus.PENDING }
    })
    const interviewApps = await prisma.application.count({
        where: { userId: user.id, status: ApplicationStatus.INTERVIEW }
    })

    const statusLabels: Record<ApplicationStatus, { label: string, color: string, icon: any }> = {
        PENDING: { label: "En attente", color: "text-[#0052cc]", icon: Clock },
        INTERVIEW: { label: "Entretien", color: "text-emerald-600", icon: TrendingUp },
        ACCEPTED: { label: "Retenu", color: "text-green-700", icon: CheckCircle2 },
        REJECTED: { label: "Refusé", color: "text-red-600", icon: XCircle },
    }

    return (
        <div className="flex-1 space-y-6 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-[#0052cc] dark:text-blue-400">
                        Tableau de bord
                    </h2>
                    <p className="text-muted-foreground">Bienvenue, {user.name}. Suivez vos candidatures en temps réel.</p>
                </div>
                <Button className="bg-[#0052cc] hover:bg-blue-700 text-white" asChild>
                    <Link href="/jobs">
                        <Search className="mr-2 h-4 w-4" />
                        Trouver un job
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-[#0052cc]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Candidatures totales</CardTitle>
                        <Briefcase className="h-4 w-4 text-[#0052cc]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalApps}</div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-amber-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingApps}</div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-emerald-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Entretiens</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{interviewApps}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Candidatures Récentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {user.applications.map((app) => {
                                const statusInfo = statusLabels[app.status];
                                const StatusIcon = statusInfo.icon;
                                return (
                                    <div key={app.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold leading-none text-[#0052cc]">{app.job.title}</p>
                                            <p className="text-xs text-muted-foreground">{app.job.company.name} • Comores</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                                                <span className={`text-xs font-medium ${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/jobs/${app.jobId}`}>Voir</Link>
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                            {user.applications.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-sm text-muted-foreground">Vous n'avez pas encore postulé à des offres.</p>
                                    <Button variant="link" asChild>
                                        <Link href="/jobs">Consulter les offres disponibles</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <div className="w-full col-span-3">
                    <NotificationList initialNotifications={user.notifications} />
                </div>
            </div>


        </div>
    )
}
