"use client"

import { MessageCircle } from "lucide-react"

export function WhatsAppFloat() {
    const phoneNumber = "2693257850" // Example number, replace with real one

    return (
        <a
            href={`https://wa.me/${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
            aria-label="Contacter sur WhatsApp"
        >
            <MessageCircle className="h-8 w-8 fill-current" />
        </a>
    )
}
