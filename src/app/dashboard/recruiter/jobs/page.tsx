import Link from "next/link"
import { PlusCircle, MoreHorizontal, Pencil, Trash2, MapPin, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { JobActionsMenu } from "@/app/dashboard/recruiter/jobs/job-actions-menu"
import { prisma } from "@/lib/prisma"
import { Role } from "@/app/prisma/generated/client"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function JobsPage() {
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

    // 2. Fetch Jobs
    const jobs = await prisma.job.findMany({
        where: { companyId: recruiter.companyId },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { applications: true }
            }
        }
    })

    return (
        <div className="flex min-h-screen w-full flex-col bg-slate-50/50 dark:bg-black">
            <div className="flex flex-col sm:gap-4 sm:py-4">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold tracking-tight text-[#0052cc] dark:text-blue-400">Offres d'emploi</h1>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <Button size="sm" className="h-8 gap-1 bg-[#0052cc] hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white" asChild>
                            <Link href="/dashboard/recruiter/jobs/new">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Nouvelle Offre
                                </span>
                            </Link>
                        </Button>
                    </div>
                </header>

                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle>Vos Offres</CardTitle>
                            <CardDescription>
                                Gérez vos offres d'emploi et suivez leur statut.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-slate-50 dark:hover:bg-zinc-800/50">
                                        <TableHead>Titre</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Lieu
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Type
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Salaire (KMF)
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Candidats
                                        </TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {jobs.map((job) => (
                                        <TableRow key={job.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50">
                                            <TableCell className="font-medium text-[#0052cc] dark:text-blue-400">
                                                {job.title}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                                                    Activé
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex items-center text-muted-foreground">
                                                    <MapPin className="mr-1 h-3 w-3" />
                                                    {job.locationCity}, {job.locationIsland}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {job.contractType}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {job.salaryKMF?.toLocaleString() || "-"}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Badge variant="outline">{job._count.applications}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <JobActionsMenu jobId={job.id} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {jobs.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                                Aucune offre trouvée. Créez-en une nouvelle !
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className="bg-slate-50 dark:bg-zinc-800/20 py-4">
                            <div className="text-xs text-muted-foreground">
                                Affichage de <strong>1-{jobs.length}</strong> sur <strong>{jobs.length}</strong> offres
                            </div>
                        </CardFooter>
                    </Card>
                </main>
            </div>
        </div>
    )
}
