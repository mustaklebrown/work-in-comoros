"use client"

import { useState } from "react"
import { MoreHorizontal, Calendar, Search, Filter, MapPin, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ApplicationStatus } from "@/app/prisma/generated/client"
import { toast } from "sonner"
import { updateApplicationStatus } from "@/app/actions/application-actions"

interface Candidate {
    id: string
    name: string
    role: string
    avatar: string
    date: string
    status: ApplicationStatus
    interviewDate?: string
    // CV Data
    headline?: string
    summary?: string
    skills?: string
    experience?: any
    education?: any
    location?: string
    email?: string
}

interface KanbanBoardProps {
    initialCandidates: Candidate[]
}

export function KanbanBoard({ initialCandidates }: KanbanBoardProps) {
    const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isCvModalOpen, setIsCvModalOpen] = useState(false)
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
    const [interviewDateTime, setInterviewDateTime] = useState("")

    const handleScheduleInterview = async () => {
        if (!selectedCandidate || !interviewDateTime) return;

        const date = new Date(interviewDateTime);
        if (isNaN(date.getTime())) {
            toast.error("Date invalide");
            return;
        }

        // Optimistic update
        const oldCandidates = [...candidates];
        setCandidates(candidates.map(c =>
            c.id === selectedCandidate.id
                ? { ...c, status: "INTERVIEW" as ApplicationStatus, interviewDate: date.toLocaleString('fr-FR') }
                : c
        ));

        setIsDialogOpen(false);
        setInterviewDateTime("");

        toast.promise(updateApplicationStatus(selectedCandidate.id, "INTERVIEW", date), {
            loading: 'Planification...',
            success: 'Entretien planifié',
            error: (err) => {
                setCandidates(oldCandidates);
                return 'Erreur lors de la planification';
            }
        });
    }

    const columns: { id: ApplicationStatus; label: string; color: string }[] = [
        { id: "PENDING", label: "En attente", color: "bg-slate-100 dark:bg-zinc-800" },
        { id: "INTERVIEW", label: "Entretien", color: "bg-blue-50 dark:bg-blue-900/10" },
        { id: "ACCEPTED", label: "Retenu", color: "bg-emerald-50 dark:bg-emerald-900/10" },
        { id: "REJECTED", label: "Refusé", color: "bg-red-50 dark:bg-red-900/10" },
    ]

    return (
        <div className="flex flex-col h-full w-full gap-4">
            <header className="flex items-center justify-end px-4 sm:px-6">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Filtrer..."
                            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                        />
                    </div>
                    <Button variant="outline" size="sm" className="h-9 gap-1">
                        <Filter className="h-3.5 w-3.5" />
                        <span>Filtrer</span>
                    </Button>
                </div>
            </header>

            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex h-full gap-6 min-w-[1000px] px-6">
                    {columns.map((column) => (
                        <div key={column.id} className={`flex h-full min-w-[300px] flex-col rounded-lg border border-slate-200 dark:border-zinc-800 ${column.color}`}>
                            <div className="p-4 flex items-center justify-between">
                                <h3 className="font-semibold text-sm">{column.label}</h3>
                                <Badge variant="secondary" className="bg-white dark:bg-black">
                                    {candidates.filter(c => c.status === column.id).length}
                                </Badge>
                            </div>
                            <ScrollArea className="flex-1 px-4 pb-4">
                                <div className="space-y-3">
                                    {candidates
                                        .filter((candidate) => candidate.status === column.id)
                                        .map((candidate) => (
                                            <Card key={candidate.id} className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
                                                <CardContent className="p-4 space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-9 w-9">
                                                                <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-xs">
                                                                    {candidate.avatar}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-sm font-medium leading-none">{candidate.name}</p>
                                                                <p className="text-xs text-muted-foreground mt-1">{candidate.role}</p>
                                                                {candidate.interviewDate && (
                                                                    <p className="text-[10px] font-bold text-[#0052cc] mt-1 flex items-center gap-1">
                                                                        <Calendar className="h-2 w-2" />
                                                                        RDV: {candidate.interviewDate}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    className="text-[#0052cc] font-semibold"
                                                                    onClick={() => {
                                                                        setSelectedCandidate(candidate);
                                                                        setIsDialogOpen(true);
                                                                    }}
                                                                >
                                                                    Planifier un entretien
                                                                </DropdownMenuItem>
                                                                {columns.map((statusCol) => (
                                                                    <DropdownMenuItem
                                                                        key={statusCol.id}
                                                                        disabled={candidate.status === statusCol.id}
                                                                        className={statusCol.id === "REJECTED" ? "text-red-500" : ""}
                                                                        onClick={() => {
                                                                            const newStatus = statusCol.id as ApplicationStatus;
                                                                            // Optimistic update
                                                                            setCandidates(candidates.map(c => c.id === candidate.id ? { ...c, status: newStatus } : c));
                                                                            // Server update
                                                                            toast.promise(updateApplicationStatus(candidate.id, newStatus), {
                                                                                loading: 'Mise à jour...',
                                                                                success: 'Statut mis à jour',
                                                                                error: (err) => {
                                                                                    // Revert on error
                                                                                    setCandidates(candidates.map(c => c.id === candidate.id ? { ...c, status: candidate.status } : c));
                                                                                    return 'Erreur lors de la mise à jour';
                                                                                }
                                                                            });
                                                                        }}
                                                                    >
                                                                        {statusCol.label}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {candidate.date}
                                                        </div>
                                                        <Button
                                                            variant="link"
                                                            className="h-auto p-0 text-xs text-[#0052cc]"
                                                            onClick={() => {
                                                                setSelectedCandidate(candidate);
                                                                setIsCvModalOpen(true);
                                                            }}
                                                        >
                                                            Voir CV
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                </div>
                            </ScrollArea>
                        </div>
                    ))}
                </div>
            </div>

            {/* Schedule Interview Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Planifier un entretien</DialogTitle>
                        <DialogDescription>
                            Fixez une date et une heure pour l'entretien avec {selectedCandidate?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="datetime">Date et Heure</Label>
                            <Input
                                id="datetime"
                                type="datetime-local"
                                value={interviewDateTime}
                                onChange={(e) => setInterviewDateTime(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                        <Button className="bg-[#0052cc]" onClick={handleScheduleInterview}>Confirmer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* CV Preview Modal */}
            <Dialog open={isCvModalOpen} onOpenChange={setIsCvModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-lg">
                                    {selectedCandidate?.avatar}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p>{selectedCandidate?.name}</p>
                                <p className="text-sm font-normal text-muted-foreground">{selectedCandidate?.headline || selectedCandidate?.role}</p>
                            </div>
                        </DialogTitle>
                        <DialogDescription className="flex items-center gap-4 text-xs mt-2">
                            {selectedCandidate?.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {selectedCandidate.location}
                                </span>
                            )}
                            {selectedCandidate?.email && (
                                <span className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" /> {selectedCandidate.email}
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Summary */}
                        {selectedCandidate?.summary && (
                            <section>
                                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Résumé</h4>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                    {selectedCandidate.summary}
                                </p>
                            </section>
                        )}

                        {/* Skills */}
                        {selectedCandidate?.skills && (
                            <section>
                                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Compétences</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCandidate.skills.split(',').map((skill, i) => (
                                        <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
                                            {skill.trim()}
                                        </Badge>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Experience */}
                        {selectedCandidate?.experience && Array.isArray(selectedCandidate.experience) && (
                            <section>
                                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Expérience Professionnelle</h4>
                                <div className="space-y-4">
                                    {selectedCandidate.experience.map((exp: any, i: number) => (
                                        <div key={i} className="border-l-2 border-slate-100 pl-4 py-1">
                                            <p className="text-sm font-bold">{exp.role}</p>
                                            <p className="text-xs text-[#0052cc]">{exp.company}</p>
                                            <p className="text-[10px] text-muted-foreground mb-1">{exp.from} - {exp.to}</p>
                                            <p className="text-xs text-zinc-600 dark:text-zinc-400">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {selectedCandidate?.education && Array.isArray(selectedCandidate.education) && (
                            <section>
                                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Formation</h4>
                                <div className="space-y-3">
                                    {selectedCandidate.education.map((edu: any, i: number) => (
                                        <div key={i} className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-bold">{edu.degree}</p>
                                                <p className="text-xs text-muted-foreground">{edu.school}</p>
                                            </div>
                                            <Badge variant="outline" className="text-[10px]">{edu.year}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <DialogFooter className="mt-4">
                        <Button className="w-full bg-[#0052cc]" onClick={() => setIsCvModalOpen(false)}>Fermer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
