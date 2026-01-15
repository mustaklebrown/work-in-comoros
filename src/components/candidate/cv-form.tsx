"use client"

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { updateCVProfile } from "@/app/actions/cv-actions";
import { Loader2, Plus, Trash2, GraduationCap, Briefcase } from "lucide-react";
import { CVDownloadButton } from "./cv-download-button";

const cvFormSchema = z.object({
    headline: z.string().min(2, "Le titre est requis"),
    summary: z.string().min(10, "Le résumé doit faire au moins 10 caractères"),
    skills: z.string().optional(),
    location: z.string().optional(),
    experience: z.array(z.object({
        company: z.string().min(1, "Requis"),
        role: z.string().min(1, "Requis"),
        from: z.string().min(1, "Requis"),
        to: z.string().min(1, "Requis"),
        description: z.string().optional(),
    })).optional(),
    education: z.array(z.object({
        school: z.string().min(1, "Requis"),
        degree: z.string().min(1, "Requis"),
        year: z.string().min(1, "Requis"),
    })).optional(),
});

type CVFormValues = z.infer<typeof cvFormSchema>;

interface CVFormProps {
    initialData: any;
}

export function CVForm({ initialData }: CVFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<CVFormValues>({
        resolver: zodResolver(cvFormSchema),
        defaultValues: {
            headline: initialData?.headline || "",
            summary: initialData?.summary || "",
            skills: initialData?.skills || "",
            location: initialData?.location || "",
            experience: initialData?.experience || [],
            education: initialData?.education || [],
        },
    });

    const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
        control: form.control,
        name: "experience",
    });

    const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
        control: form.control,
        name: "education",
    });

    async function onSubmit(values: CVFormValues) {
        setIsLoading(true);
        try {
            await updateCVProfile(values);
            toast.success("Profil CV mis à jour !");
        } catch (error: any) {
            toast.error(error.message || "Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    }

    // Check if we have enough info to download
    const canDownload = form.getValues("headline") && form.getValues("summary");

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                {canDownload && (
                    <CVDownloadButton
                        data={{
                            ...form.getValues(),
                            name: initialData.name,
                            email: initialData.email,
                            phone: initialData.phone,
                        }}
                    />
                )}
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Section 1: Basic Info */}
                    <Card className="border-zinc-200 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle>Informations Générales</CardTitle>
                            <CardDescription>Votre titre et résumé professionnel.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="headline"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Titre du profil</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Développeur Web Senior, Comptable..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Localisation</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Moroni, Grande Comore" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="summary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Résumé professionnel</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Parlez de votre parcours et de vos ambitions..."
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="skills"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Compétences (séparées par des virgules)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: React, Project Management, Excel..." {...field} />
                                        </FormControl>
                                        <FormDescription>Ces compétences apparaîtront sous forme de tags dans votre CV.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Section 2: Experience */}
                    <Card className="border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Expériences</CardTitle>
                                <CardDescription>Vos emplois et stages précédents.</CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => appendExp({ company: "", role: "", from: "", to: "", description: "" })}
                            >
                                <Plus className="h-4 w-4 mr-2" /> Ajouter
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {expFields.map((field, index) => (
                                <div key={field.id} className="p-4 rounded-lg border bg-slate-50/50 dark:bg-zinc-800/10 space-y-4 relative">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 text-red-500"
                                        onClick={() => removeExp(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`experience.${index}.company`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Entreprise</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`experience.${index}.role`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Poste</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`experience.${index}.from`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>De</FormLabel>
                                                    <FormControl><Input placeholder="Moins/Année" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`experience.${index}.to`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>À</FormLabel>
                                                    <FormControl><Input placeholder="Moins/Année ou Aujourd'hui" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name={`experience.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl><Textarea {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ))}
                            {expFields.length === 0 && (
                                <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                                    <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                    Aucune expérience ajoutée.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Section 3: Education */}
                    <Card className="border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Formation</CardTitle>
                                <CardDescription>Vos diplômes et certifications.</CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => appendEdu({ school: "", degree: "", year: "" })}
                            >
                                <Plus className="h-4 w-4 mr-2" /> Ajouter
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {eduFields.map((field, index) => (
                                <div key={field.id} className="p-4 rounded-lg border bg-slate-50/50 dark:bg-zinc-800/10 space-y-4 relative">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 text-red-500"
                                        onClick={() => removeEdu(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`education.${index}.school`}
                                            render={({ field }) => (
                                                <FormItem className="col-span-1">
                                                    <FormLabel>École/Université</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`education.${index}.degree`}
                                            render={({ field }) => (
                                                <FormItem className="col-span-1">
                                                    <FormLabel>Diplôme</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`education.${index}.year`}
                                            render={({ field }) => (
                                                <FormItem className="col-span-1">
                                                    <FormLabel>Année</FormLabel>
                                                    <FormControl><Input placeholder="Ex: 2023" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}
                            {eduFields.length === 0 && (
                                <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                                    <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                    Aucune formation ajoutée.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Button type="submit" className="w-full bg-[#0052cc] hover:bg-blue-700 text-white" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enregistrer mon profil CV
                    </Button>
                </form>
            </Form>
        </div>
    );
}
