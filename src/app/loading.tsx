
const loading = () => {
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900/30 text-blue-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#0052cc] border-t-transparent animate-spin"></div>
                </div>
                <div className="flex flex-col items-center animate-pulse">
                    <span className="text-xl font-bold text-[#0052cc] dark:text-blue-400">W-I-C</span>
                    <span className="text-xs text-zinc-500 font-medium tracking-widest uppercase mt-1">Chargement...</span>
                </div>
            </div>
        </div>
    )
}

export default loading



