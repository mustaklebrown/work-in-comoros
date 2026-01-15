import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Role } from "@/app/prisma/generated/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Banknote, FileDown, Plus, Users, Calculator } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default async function PayrollPage() {
    // 1. Authenticate
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || !session.user) {
        redirect("/login")
    }

    const recruiter = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { company: true }
    })

    if (!recruiter || recruiter.role !== Role.RECRUITER || !recruiter.companyId) {
        return <div className="p-8">Accès refusé.</div>
    }

    // 2. Fetch payrolls for the company's employees
    // Note: In this simple MVP, we assume any user with companyId = recruiter.companyId is an employee
    const payrolls = await prisma.payroll.findMany({
        where: {
            user: { companyId: recruiter.companyId }
        },
        include: {
            user: true
        },
        orderBy: { month: 'desc' }
    })

    return (
        <div className="flex-1 space-y-6 pt-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-[#0052cc] dark:text-blue-400">Gestion de la Paie</h1>
                    <p className="text-muted-foreground">Générez les bulletins de paie conformes au Code du Travail comorien.</p>
                </div>
                <Button className="bg-[#0052cc] text-white">
                    <Plus className="mr-2 h-4 w-4" /> Nouveau Bulletin
                </Button>
            </header>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-l-[#0052cc]">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Masse Salariale (Mois)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--- KMF</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Cotisations Sociales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--- KMF</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Employés Déclarés</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Bulletins Récents</CardTitle>
                    <CardDescription>Liste des derniers bulletins de paie générés.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employé</TableHead>
                                <TableHead>Mois</TableHead>
                                <TableHead>Brut (KMF)</TableHead>
                                <TableHead>Retenues</TableHead>
                                <TableHead>Net à Payer</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payrolls.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">{p.user.name}</TableCell>
                                    <TableCell>{format(new Date(p.month), 'MMMM yyyy', { locale: fr })}</TableCell>
                                    <TableCell>{p.grossSalary.toLocaleString()} KMF</TableCell>
                                    <TableCell className="text-red-500">-{p.deductions.toLocaleString()} KMF</TableCell>
                                    <TableCell className="font-bold text-emerald-600">{p.netSalary.toLocaleString()} KMF</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <FileDown className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {payrolls.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Calculator className="h-8 w-8 text-zinc-300" />
                                            <p>Aucun bulletin de paie généré pour le moment.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:bg-amber-900/10 dark:border-amber-900/30">
                <h4 className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                    ⚠️ Rappel Conformité Comores
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-500/80 mt-1">
                    Le taux de cotisation à la Caisse de Retraite (CPCS) est de 3% pour l'employé et 7% pour l'employeur.
                    N'oubliez pas les déclarations trimestrielles aux administrations fiscales.
                </p>
            </div>
        </div>
    )
}
