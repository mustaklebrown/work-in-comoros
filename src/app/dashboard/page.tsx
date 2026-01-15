import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Role } from "@/app/prisma/generated/client"

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || !session.user) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user) {
        redirect("/login")
    }

    if (user.role === Role.RECRUITER) {
        redirect("/dashboard/recruiter")
    } else {
        redirect("/dashboard/candidate")
    }

    return null // Should not be reached
}
