import { prisma } from "@/lib/prisma"
import { JobForm } from "@/components/recruiter/job-form"
import { notFound } from "next/navigation"

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const job = await prisma.job.findUnique({
        where: { id }
    })

    if (!job) {
        notFound()
    }

    // Convert Prisma Decimal to string for the form if needed, or simply pass as is if compatible.
    // However, JobForm expects salaryKMF to be string.
    const initialData = {
        ...job,
        salaryKMF: job.salaryKMF ? job.salaryKMF.toString() : "",
    }

    return <JobForm initialData={initialData} />
}
