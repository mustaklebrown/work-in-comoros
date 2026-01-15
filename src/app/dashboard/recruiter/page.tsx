import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { Briefcase, Users, Calendar, TrendingUp } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ApplicationStatus, Role } from "@/app/prisma/generated/client"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { NotificationList } from "@/components/notification-list"

export default async function RecruiterDashboard() {
    // 1. Authenticate User
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || !session.user) {
        redirect("/") // or /auth/login
    }

    const recruiter = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            company: true,
            notifications: {
                orderBy: { createdAt: 'desc' },
                take: 5
            }
        }
    })

    if (!recruiter) {
        return <div className="p-8">Erreur: Compte utilisateur introuvable.</div>
    }

    if (recruiter.role !== Role.RECRUITER) {
        return <div className="p-8">Accès refusé: Votre compte n'a pas le rôle "Recruteur".</div>
    }

    if (!recruiter.companyId) {
        return <div className="p-8 text-amber-600">Action requise: Votre compte Recruteur doit être rattaché à une entreprise. Veuillez contacter l'administrateur.</div>
    }

    const companyId = recruiter.companyId

    // 2. Fetch Real Stats
    const activeJobsCount = await prisma.job.count({
        where: { companyId: companyId }
    })

    const applicationsReceivedCount = await prisma.application.count({
        where: {
            job: { companyId: companyId }
        }
    })

    const interviewsScheduledCount = await prisma.application.count({
        where: {
            job: { companyId: companyId },
            status: ApplicationStatus.INTERVIEW
        }
    })

    // 3. Fetch Recent Candidates
    const recentApplications = await prisma.application.findMany({
        where: { job: { companyId: companyId } },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            user: true,
            job: true
        }
    })

    const newApplicationsToday = await prisma.application.count({
        where: {
            job: { companyId: companyId },
            createdAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        }
    })


    // 4. Fetch Monthly Stats for Chart
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const applicationsByMonth = await prisma.application.groupBy({
        by: ['createdAt'],
        where: {
            job: { companyId: companyId },
            createdAt: { gte: sixMonthsAgo }
        },
    });

    // Aggregate by month locally since Prisma groupBy date truncation is tricky across DBs
    const monthlyStats = [0, 1, 2, 3, 4, 5].map(i => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthName = d.toLocaleString('fr-FR', { month: 'short' });
        const monthKey = d.getMonth();
        const count = applicationsByMonth.filter(app => new Date(app.createdAt).getMonth() === monthKey).length;
        return { name: monthName, total: count };
    }).reverse();

    const statusLabels: Record<ApplicationStatus, { label: string, color: string }> = {
        PENDING: { label: "En attente", color: "text-[#0052cc] dark:text-blue-400" },
        INTERVIEW: { label: "Entretien", color: "text-emerald-600 dark:text-emerald-400" },
        ACCEPTED: { label: "Retenu", color: "text-green-700 dark:text-green-500" },
        REJECTED: { label: "Refusé", color: "text-red-600 dark:text-red-400" },
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-[#0052cc] dark:text-blue-400">
                        Dashboard Recruteur
                    </h2>
                    <p className="text-muted-foreground">Bienvenue, {recruiter.name} ({recruiter.company?.name})</p>
                </div>
                <div className="flex items-center space-x-2">
                    {/* Controls like DatePicker can be added here */}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-[#0052cc] dark:border-l-blue-600">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Offres Actives</CardTitle>
                        <Briefcase className="h-4 w-4 text-[#0052cc] dark:text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeJobsCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Offres publiées
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-indigo-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Candidatures Reçues</CardTitle>
                        <Users className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{applicationsReceivedCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Total candidatures
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Entretiens Prévus</CardTitle>
                        <Calendar className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{interviewsScheduledCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Candidats en phase d'entretien
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taux de Rétention</CardTitle>
                        <TrendingUp className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">-- %</div>
                        <p className="text-xs text-muted-foreground">
                            Données insuffisantes
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Aperçu des Candidatures (6 derniers mois)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview data={monthlyStats} />
                    </CardContent>
                </Card>
                <div className="lg:col-span-3 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Candidats Récents</CardTitle>
                            <div className="text-sm text-muted-foreground">
                                Vous avez reçu {newApplicationsToday} nouvelles candidatures aujourd'hui.
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {recentApplications.map((app) => (
                                    <div key={app.id} className="flex items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{app.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{app.job.title}</p>
                                        </div>
                                        <div className={`ml-auto font-medium ${statusLabels[app.status].color}`}>
                                            {statusLabels[app.status].label}
                                        </div>
                                    </div>
                                ))}
                                {recentApplications.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">Aucune candidature récente.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <NotificationList initialNotifications={recruiter.notifications} />
                </div>
            </div>
        </div>
    )
}
