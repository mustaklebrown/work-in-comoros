"use client"

import { PDFDownloadLink } from "@react-pdf/renderer";
import { CVDocument } from "./cv-document";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface CVDownloadButtonProps {
    data: any;
    fileName?: string;
}

export function CVDownloadButton({ data, fileName = "CV_WorkInComoros.pdf" }: CVDownloadButtonProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <Button variant="outline" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Préparation...
            </Button>
        );
    }

    return (
        <PDFDownloadLink
            document={<CVDocument data={data} />}
            fileName={fileName}
        >
            {({ blob, url, loading, error }) =>
                loading ? (
                    <Button variant="outline" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Génération...
                    </Button>
                ) : (
                    <Button className="bg-[#0052cc] hover:bg-blue-700 text-white">
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger mon CV (PDF)
                    </Button>
                )
            }
        </PDFDownloadLink>
    );
}
