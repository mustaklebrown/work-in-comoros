'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global Application Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-zinc-950">
            <div className="max-w-md w-full text-center space-y-8 p-8 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-red-50 dark:bg-red-950/20">
                        <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Oups ! Une erreur est survenue</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Désolé pour ce désagrément. Notre équipe a été notifiée et nous travaillons à résoudre le problème.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={() => reset()}
                        variant="default"
                        className="flex-1 bg-[#0052cc] hover:bg-blue-700 h-12 gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Réessayer
                    </Button>
                    <Button
                        variant="outline"
                        asChild
                        className="flex-1 h-12 gap-2"
                    >
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Retour à l'accueil
                        </Link>
                    </Button>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 text-left p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-auto max-h-48">
                        <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 break-all">
                            {error.message || 'No error message available'}
                        </p>
                        {error.digest && (
                            <p className="text-[10px] mt-1 text-zinc-400">Digest: {error.digest}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
