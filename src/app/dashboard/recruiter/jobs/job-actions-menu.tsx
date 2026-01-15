"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"
import { deleteJob } from "@/app/actions/job-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface JobActionsMenuProps {
    jobId: string
}

export function JobActionsMenu({ jobId }: JobActionsMenuProps) {
    const router = useRouter()

    async function handleDelete() {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) return

        try {
            await deleteJob(jobId)
            toast.success("Offre supprimée avec succès")
        } catch (error) {
            console.error(error)
            toast.error("Erreur lors de la suppression")
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    aria-haspopup="true"
                    size="icon"
                    variant="ghost"
                >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem className="cursor-pointer" onClick={() => { }}>
                    <Eye className="mr-2 h-4 w-4" /> Voir
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push(`/dashboard/recruiter/jobs/${jobId}/edit`)}
                >
                    <Pencil className="mr-2 h-4 w-4" /> Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                    onClick={handleDelete}
                >
                    <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
