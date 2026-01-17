"use client"

import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function JobSearchForm() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('q', term)
        } else {
            params.delete('q')
        }
        replace(`${pathname}?${params.toString()}`)
    }

    const handleIslandChange = (value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value && value !== 'all') {
            params.set('island', value)
        } else {
            params.delete('island')
        }
        replace(`${pathname}?${params.toString()}`)
    }

    const debouncedSearch = useDebouncedCallback((value) => {
        handleSearch(value)
    }, 300)

    return (
        <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Rechercher par poste, entreprise ou mot-clé..."
                    className="pl-9 bg-white dark:bg-zinc-900"
                    onChange={(e) => debouncedSearch(e.target.value)}
                    defaultValue={searchParams.get('q')?.toString()}
                />
            </div>
            <div className="w-full sm:w-[200px]">
                <Select
                    defaultValue={searchParams.get('island')?.toString() || "all"}
                    onValueChange={handleIslandChange}
                >
                    <SelectTrigger className="bg-white dark:bg-zinc-900">
                        <SelectValue placeholder="Toutes les îles" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les îles</SelectItem>
                        <SelectItem value="GRANDE_COMORE">Grande Comore</SelectItem>
                        <SelectItem value="ANJOUAN">Anjouan</SelectItem>
                        <SelectItem value="MOHELI">Mohéli</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
