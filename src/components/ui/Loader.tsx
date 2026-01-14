import { Loader2 } from 'lucide-react';

export const Loader = () => (
    <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
    </div>
);

export const FullScreenLoader = () => (
    <div className="fixed inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-[var(--color-primary)]" />
            <p className="text-gray-600 dark:text-gray-400 font-medium font-primary">Cargando...</p>
        </div>
    </div>
);
