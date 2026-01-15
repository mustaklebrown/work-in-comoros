import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Role, ApplicationStatus } from "@/app/prisma/generated/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Building2, Calendar, Eye, Briefcase } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default async function CandidateApplicationsPage() {
    // 1. Authenticate
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || !session.user) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user || user.role !== Role.CANDIDATE) {
        redirect("/dashboard")
    }

    // 2. Fetch all applications
    const applications = await prisma.application.findMany({
        where: { userId: user.id },
        include: {
            job: {
                include: { company: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    const statusConfig: Record<ApplicationStatus, { label: string, variant: "secondary" | "outline" | "default" | "destructive" }> = {
        PENDING: { label: "En attente", variant: "secondary" },
        INTERVIEW: { label: "Entretien", variant: "default" },
        ACCEPTED: { label: "Retenu", variant: "default" }, // Handled by colors in Badge if needed, but keeping standard variants
        REJECTED: { label: "Refusé", variant: "destructive" },
    }

    return (
        <div className="flex-1 space-y-6 pt-6">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-[#0052cc] dark:text-blue-400">Mes Candidatures</h1>
                <p className="text-muted-foreground">Retrouvez l'historique et le statut de toutes vos candidatures.</p>
            </header>

            <div className="grid gap-4">
                {applications.map((app) => (
                    <Card key={app.id} className="overflow-hidden hover:shadow-md transition-shadow dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                                {/* Left Section: Job Info */}
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold text-[#0052cc] dark:text-blue-400">
                                            {app.job.title}
                                        </h3>
                                        <Badge variant={statusConfig[app.status].variant}>
                                            {statusConfig[app.status].label}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                                        <div className="flex items-center gap-1.5">
                                            <Building2 className="h-4 w-4" />
                                            {app.job.company.name}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-4 w-4" />
                                            {app.job.locationCity}, {app.job.locationIsland}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4" />
                                            Postulé le {format(new Date(app.createdAt), 'dd MMMM yyyy', { locale: fr })}
                                        </div>
                                        {app.interviewDate && (
                                            <div className="flex items-center gap-1.5 text-[#0052cc] font-bold">
                                                <Calendar className="h-4 w-4" />
                                                Entretien: {format(new Date(app.interviewDate), 'dd/MM/yyyy HH:mm', { locale: fr })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Section: Actions */}
                                <div className="flex items-center gap-3 shrink-0">
                                    <Button variant="outline" asChild size="sm">
                                        <Link href={`/jobs/${app.jobId}`}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Voir l'offre
                                        </Link>
                                    </Button>
                                    {/* Additional actions like 'Cancel' could go here if implemented */}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {applications.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700">
                        <Briefcase className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">Aucune candidature</h3>
                        <p className="text-muted-foreground mt-1 mb-6">
                            Vous n'avez pas encore postulé à des offres d'emploi.
                        </p>
                        <Button className="bg-[#0052cc] text-white" asChild>
                            <Link href="/jobs">Démarrer votre recherche</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
