'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { createCompany, updateCompany } from '@/app/actions/company-actions';
import { Loader2, Building2 } from 'lucide-react';

const companySchema = z.object({
    name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
    sector: z.string().min(2, "Le secteur est requis"),
    nif: z.string().optional(),
    rc: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface CompanyFormProps {
    initialData?: CompanyFormValues & { id: string };
}

export function CompanyForm({ initialData }: CompanyFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<CompanyFormValues>({
        resolver: zodResolver(companySchema),
        defaultValues: initialData || {
            name: '',
            sector: '',
            nif: '',
            rc: '',
        },
    });

    async function onSubmit(values: CompanyFormValues) {
        setIsLoading(true);
        try {
            if (initialData) {
                await updateCompany(initialData.id, values);
                toast.success("Entreprise mise à jour !");
            } else {
                await createCompany(values);
                toast.success("Entreprise créée avec succès !");
            }
        } catch (error: any) {
            toast.error(error.message || "Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto border-zinc-200 dark:border-zinc-800">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-[#0052cc]" />
                    <CardTitle>{initialData ? "Modifier l'entreprise" : "Configurer votre entreprise"}</CardTitle>
                </div>
                <CardDescription>
                    {initialData
                        ? "Mettez à jour les informations légales de votre structure."
                        : "En tant que recruteur, vous devez enregistrer votre entreprise pour publier des offres."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom de l'entreprise</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Comores Telecom, Al-Marjan..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sector"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Secteur d'activité</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Technologie, Agriculture, Tourisme..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="nif"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Numéro NIF (Optionnel)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Numéro d'Identification Fiscale" {...field} />
                                        </FormControl>
                                        <FormDescription>Utilisé pour la vérification de crédibilité.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="rc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Registre de Commerce (Optionnel)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="RC Comores" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="w-full bg-[#0052cc] hover:bg-blue-700 text-white" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? "Sauvegarder les modifications" : "Enregistrer l'entreprise"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
