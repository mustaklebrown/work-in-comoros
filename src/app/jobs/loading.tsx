
import { Navbar } from "@/components/navbar"

export default function JobsLoading() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        <div className="h-10 w-3/4 bg-zinc-200 dark:bg-zinc-800 animate-pulse mx-auto rounded-lg" />
                        <div className="h-5 w-1/2 bg-zinc-200 dark:bg-zinc-800 animate-pulse mx-auto rounded-lg" />
                    </div>

                    <div className="h-14 w-full bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-xl" />

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-[300px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
                                <div className="space-y-2">
                                    <div className="h-6 w-3/4 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
                                    <div className="h-4 w-1/2 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
                                </div>
                                <div className="space-y-2 pt-4">
                                    <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
                                    <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
                                    <div className="h-4 w-2/3 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
                                </div>
                                <div className="pt-4">
                                    <div className="h-10 w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
