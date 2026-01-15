"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { createJob, updateJob } from "@/app/actions/job-actions"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"

const jobSchema = z.object({
    title: z.string().min(5, {
        message: "Le titre doit contenir au moins 5 caractères.",
    }),
    description: z.string().min(50, {
        message: "La description doit contenir au moins 50 caractères.",
    }),
    locationIsland: z.enum(["GRANDE_COMORE", "ANJOUAN", "MOHELI"]),
    locationCity: z.string().min(2, {
        message: "La ville est requise.",
    }),
    contractType: z.enum(["CDI", "CDD", "STAGE", "PRESTATION"]),
    salaryKMF: z.string().optional(),
})

interface JobFormProps {
    initialData?: z.infer<typeof jobSchema> & { id: string }
}

export function JobForm({ initialData }: JobFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const isEditing = !!initialData

    const form = useForm<z.infer<typeof jobSchema>>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            locationIsland: initialData?.locationIsland as "GRANDE_COMORE" | "ANJOUAN" | "MOHELI" || undefined,
            locationCity: initialData?.locationCity || "",
            contractType: initialData?.contractType as "CDI" | "CDD" | "STAGE" | "PRESTATION" || undefined,
            salaryKMF: initialData?.salaryKMF || "",
        },
    })

    async function onSubmit(values: z.infer<typeof jobSchema>) {
        setIsLoading(true)
        try {
            if (isEditing) {
                await updateJob(initialData.id, values)
                toast.success("L'offre d'emploi a été mise à jour avec succès.")
            } else {
                await createJob(values)
                toast.success("L'offre d'emploi a été créée avec succès.")
            }
            router.push("/dashboard/recruiter/jobs")
        } catch (error) {
            console.error(error)
            toast.error(isEditing ? "Erreur lors de la mise à jour." : "Erreur lors de la création.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/recruiter/jobs">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight text-[#0052cc] dark:text-blue-400">
                    {isEditing ? "Modifier l'offre" : "Nouvelle Offre"}
                </h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card className="border-none shadow-md bg-white dark:bg-zinc-900">
                        <CardHeader>
                            <CardTitle>Détails du poste</CardTitle>
                            <CardDescription>
                                Renseignez les informations essentielles pour attirer les meilleurs candidats.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Titre du poste</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ex: Développeur Fullstack, Comptable..." {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Un titre clair et précis fonctionne mieux.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="locationIsland"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Île</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner une île" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="GRANDE_COMORE">Grande Comore (Ngazidja)</SelectItem>
                                                    <SelectItem value="ANJOUAN">Anjouan (Ndzuwani)</SelectItem>
                                                    <SelectItem value="MOHELI">Mohéli (Mwali)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="locationCity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ville/Village</FormLabel>
                                            <FormControl>
                                                <Input placeholder="ex: Moroni, Mutsamudu..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="contractType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type de contrat</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Type de contrat" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="CDI">CDI</SelectItem>
                                                    <SelectItem value="CDD">CDD</SelectItem>
                                                    <SelectItem value="STAGE">Stage</SelectItem>
                                                    <SelectItem value="PRESTATION">Prestation / Freelance</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="salaryKMF"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Salaire mensuel (KMF) <span className="text-muted-foreground text-xs">(Optionnel)</span></FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="ex: 150000" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description du poste</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Décrivez les responsabilités, les compétences requises et les avantages..."
                                                className="resize-none min-h-[200px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" type="button" asChild>
                            <Link href="/dashboard/recruiter/jobs">Annuler</Link>
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-[#0052cc] hover:bg-blue-700 text-white min-w-[150px]">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isEditing ? "Mettre à jour" : "Publier l'offre"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
