import { prisma } from "@/lib/prisma"
import { JobCard } from "@/components/job-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default async function JobsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; island?: string }>
}) {
    const { q, island } = await searchParams

    const jobs = await prisma.job.findMany({
        where: {
            AND: [
                q ? {
                    OR: [
                        { title: { contains: q, mode: 'insensitive' } },
                        { description: { contains: q, mode: 'insensitive' } },
                        { company: { name: { contains: q, mode: 'insensitive' } } }
                    ]
                } : {},
                island && island !== 'all' ? { locationIsland: island as any } : {}
            ]
        },
        include: {
            company: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black">

            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Trouvez votre prochain emploi aux Comores
                        </h1>
                        <p className="text-muted-foreground">
                            Découvrez les meilleures opportunités à Grande Comore, Anjouan et Mohéli.
                        </p>
                    </div>

                    {/* Search Component */}
                    <JobSearchForm />

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>

                    {jobs.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            Aucune offre trouvée pour votre recherche.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
