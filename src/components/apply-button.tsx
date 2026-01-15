"use client"

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { applyToJob } from "@/app/actions/application-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ApplyButtonProps {
    jobId: string;
    isLoggedIn: boolean;
    hasApplied?: boolean;
}

export function ApplyButton({ jobId, isLoggedIn, hasApplied = false }: ApplyButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleApply = async () => {
        if (!isLoggedIn) {
            router.push("/login?callbackUrl=/jobs/" + jobId);
            return;
        }

        setIsLoading(true);
        try {
            await applyToJob(jobId);
            toast.success("Candidature envoyée avec succès !");
            router.refresh(); // Refresh to update button state
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de l'application");
        } finally {
            setIsLoading(false);
        }
    };

    if (hasApplied) {
        return (
            <Button disabled variant="outline" className="w-full md:w-auto border-emerald-500 text-emerald-600 bg-emerald-50">
                Déjà postulé
            </Button>
        );
    }

    return (
        <Button
            className="w-full md:w-auto bg-[#0052cc] hover:bg-blue-700 text-white min-w-[200px]"
            size="lg"
            onClick={handleApply}
            disabled={isLoading}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Postuler maintenant
        </Button>
    );
}
