import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Role } from "@/app/prisma/generated/client"
import { CompanyForm } from "@/components/recruiter/company-form"
import { CVForm } from "@/components/candidate/cv-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, ShieldCheck, FileText } from "lucide-react"

export default async function SettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || !session.user) {
        redirect("/login")
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { company: true }
    })

    if (!dbUser) redirect("/login")

    return (
        <div className="flex-1 space-y-8 pt-6">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-[#0052cc] dark:text-blue-400">Paramètres</h1>
                <p className="text-muted-foreground">Gérez votre profil et les informations de votre compte.</p>
            </header>

            <div className="grid gap-8">
                {/* User Info Section */}
                <Card className="border-zinc-200 dark:border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <User className="h-5 w-5 text-[#0052cc]" />
                            Profil Utilisateur
                        </CardTitle>
                        <CardDescription>Informations personnelles de votre compte.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Mail className="h-3.5 w-3.5" /> Email
                                </p>
                                <p className="text-sm border rounded-md p-2 bg-slate-50 dark:bg-zinc-800/50">{dbUser.email}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <ShieldCheck className="h-3.5 w-3.5" /> Rôle
                                </p>
                                <p className="text-sm border rounded-md p-2 bg-slate-50 dark:bg-zinc-800/50">
                                    {dbUser.role === Role.RECRUITER ? "Recruteur" : "Candidat"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Company Section for Recruiters */}
                {dbUser.role === Role.RECRUITER && (
                    <CompanyForm
                        initialData={dbUser.company ? {
                            id: dbUser.company.id,
                            name: dbUser.company.name,
                            sector: dbUser.company.sector || "",
                            nif: dbUser.company.nif || "",
                            rc: dbUser.company.rc || "",
                        } : undefined}
                    />
                )}

                {/* Candidate Specific Settings (CV, etc) */}
                {dbUser.role === Role.CANDIDATE && (
                    <Card className="border-zinc-200 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-[#0052cc]" />
                                Mon CV Dynamique
                            </CardTitle>
                            <CardDescription>Complétez votre profil pour générer un CV professionnel exportable en PDF.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CVForm initialData={{
                                name: dbUser.name,
                                email: dbUser.email,
                                phone: dbUser.phone,
                                headline: dbUser.headline,
                                summary: dbUser.summary,
                                skills: dbUser.skills,
                                location: dbUser.location,
                                experience: dbUser.experience,
                                education: dbUser.education,
                            }} />
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

