import { prisma } from "@/lib/prisma"
import { JobCard } from "@/components/job-card"
import { JobSearchForm } from "@/components/job-search-form"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"

export default async function JobsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; island?: string; page?: string }>
}) {
    const { q, island, page } = await searchParams
    const currentPage = Number(page) || 1
    const pageSize = 12

    const [jobs, totalJobs] = await Promise.all([
        prisma.job.findMany({
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
            },
            take: pageSize,
            skip: (currentPage - 1) * pageSize,
        }),
        prisma.job.count({
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
            }
        })
    ])

    const totalPages = Math.ceil(totalJobs / pageSize)

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

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 pt-8">
                            <Button
                                variant="outline"
                                disabled={currentPage <= 1}
                                asChild={currentPage > 1}
                            >
                                {currentPage > 1 ? (
                                    <Link href={`?page=${currentPage - 1}${q ? `&q=${q}` : ''}${island ? `&island=${island}` : ''}`}>
                                        Précédent
                                    </Link>
                                ) : (
                                    <span>Précédent</span>
                                )}
                            </Button>
                            <div className="flex items-center px-4 text-sm font-medium">
                                Page {currentPage} sur {totalPages}
                            </div>
                            <Button
                                variant="outline"
                                disabled={currentPage >= totalPages}
                                asChild={currentPage < totalPages}
                            >
                                {currentPage < totalPages ? (
                                    <Link href={`?page=${currentPage + 1}${q ? `&q=${q}` : ''}${island ? `&island=${island}` : ''}`}>
                                        Suivant
                                    </Link>
                                ) : (
                                    <span>Suivant</span>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
