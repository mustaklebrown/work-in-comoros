import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Role, ApplicationStatus } from "@/app/prisma/generated/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, Mail, Calendar, Video, MapPin, UserCheck } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default async function InterviewsPage() {
    // 1. Authenticate Recruiter
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || !session.user) {
        redirect("/login")
    }

    const recruiter = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!recruiter || recruiter.role !== Role.RECRUITER || !recruiter.companyId) {
        return <div className="p-8">Accès refusé.</div>
    }

    // 2. Fetch applications with status INTERVIEW
    const interviews = await prisma.application.findMany({
        where: {
            job: { companyId: recruiter.companyId },
            status: ApplicationStatus.INTERVIEW
        },
        include: {
            user: true,
            job: true
        },
        orderBy: { updatedAt: 'desc' }
    })

    return (
        <div className="flex-1 space-y-6 pt-6">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-[#0052cc] dark:text-blue-400">Entretiens</h1>
                <p className="text-muted-foreground">
                    Candidats actuellement en phase d'entretien. Suivez et planifiez vos échanges.
                </p>
            </header>

            <div className="grid gap-6">
                {interviews.map((app) => (
                    <Card key={app.id} className="overflow-hidden hover:shadow-md transition-shadow dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="bg-slate-50/50 dark:bg-zinc-800/20 pb-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-lg font-bold">{app.user.name}</CardTitle>
                                        <Badge className="bg-[#0052cc] text-white">Prêt pour Entretien</Badge>
                                    </div>
                                    <CardDescription>Candidat pour : <span className="font-medium text-[#0052cc]">{app.job.title}</span></CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={`mailto:${app.user.email}`}>
                                            <Mail className="h-4 w-4 mr-2" />
                                            Contacter
                                        </a>
                                    </Button>
                                    <Button className="bg-[#0052cc] text-white" size="sm">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Planifier
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold uppercase text-muted-foreground flex items-center gap-2">
                                        <UserCheck className="h-4 w-4" /> Infos Candidat
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <p className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                            <Mail className="h-4 w-4" /> {app.user.email}
                                        </p>
                                        <p className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                            <Phone className="h-4 w-4" /> +269 ... (A compléter)
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 text-center md:text-left">
                                    <h4 className="text-sm font-semibold uppercase text-muted-foreground flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> Date de candidature
                                    </h4>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                        Reçu le {format(new Date(app.createdAt), 'dd MMMM yyyy', { locale: fr })}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold uppercase text-muted-foreground flex items-center gap-2">
                                        <MapPin className="h-4 w-4" /> Localisation
                                    </h4>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                        {app.job.locationCity}, {app.job.locationIsland}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {interviews.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700">
                        <Video className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">Aucun entretien prévu</h3>
                        <p className="text-muted-foreground mt-1">
                            Déplacez des candidats vers la colonne "Entretien" dans le Kanban pour les voir ici.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
