import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Prisma } from "@/app/prisma/generated/client";
import { MapPin, Briefcase, Banknote } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

type JobWithCompany = Prisma.JobGetPayload<{
    include: { company: true };
}>;

interface JobCardProps {
    job: JobWithCompany;
}

export function JobCard({ job }: JobCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow dark:bg-zinc-900 dark:border-zinc-800">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h3 className="font-bold text-lg text-[#0052cc] dark:text-blue-400 line-clamp-1">
                            <Link href={`/jobs/${job.id}`} className="hover:underline">
                                {job.title}
                            </Link>
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground">
                            {job.company.name}
                        </p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                        {job.contractType}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1 pb-3">
                <div className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>
                            {job.locationCity}, {job.locationIsland}
                        </span>
                    </div>
                    {job.salaryKMF && (
                        <div className="flex items-center gap-2">
                            <Banknote className="h-4 w-4 shrink-0" />
                            <span>
                                {job.salaryKMF.toLocaleString('fr-FR')} KMF
                            </span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 shrink-0" />
                        <span>
                            Publié {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale: fr })}
                        </span>
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {job.description}
                    </p>
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                <Button className="w-full bg-[#0052cc] hover:bg-blue-700 text-white" asChild>
                    <Link href={`/jobs/${job.id}`}>Voir l'offre</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
