import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MapPin, Briefcase, Banknote, Building2, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { ApplyButton } from "@/components/apply-button"

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const session = await auth.api.getSession({
        headers: await headers()
    })

    const job = await prisma.job.findUnique({
        where: { id },
        include: {
            company: true
        }
    })

    if (!job) {
        notFound()
    }

    // Check if user has already applied
    let hasApplied = false
    if (session?.user) {
        const application = await prisma.application.findFirst({
            where: {
                jobId: id,
                userId: session.user.id
            }
        })
        hasApplied = !!application
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black py-8">
            <div className="container mx-auto px-4 max-w-4xl space-y-6">
                <Button variant="ghost" asChild className="mb-4">
                    <Link href="/jobs" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        Retour aux offres
                    </Link>
                </Button>

                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b pb-6 dark:border-zinc-800">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{job.title}</h1>
                            <div className="flex items-center gap-2 text-[#0052cc] font-medium text-lg">
                                <Building2 className="h-5 w-5" />
                                {job.company.name}
                            </div>
                        </div>
                        <Badge className="text-sm px-3 py-1" variant="secondary">
                            {job.contractType}
                        </Badge>
                    </div>

                    {/* Meta info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                        <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{job.locationCity}, {job.locationIsland}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Banknote className="h-5 w-5 text-muted-foreground" />
                            <span>{job.salaryKMF ? `${job.salaryKMF.toLocaleString('fr-FR')} KMF` : "Salaire non communiqué"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Briefcase className="h-5 w-5 text-muted-foreground" />
                            <span>Contrat {job.contractType}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <span>Publié {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale: fr })}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Description du poste</h2>
                        <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {job.description}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t dark:border-zinc-800 flex justify-end">
                        <ApplyButton
                            jobId={job.id}
                            isLoggedIn={!!session?.user}
                            hasApplied={hasApplied}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
