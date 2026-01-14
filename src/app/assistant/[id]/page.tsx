'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Save, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { FullScreenLoader } from '@/components/ui/Loader';
import { ChatInterface } from '@/components/ChatInterface';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function TrainingPage() {
    /**
     * useParams: Esta herramienta de Next.js nos permite leer el ID que aparece 
     * en la barra de direcciones del navegador.
     * Ejemplo: si entras a /assistant/1, params.id será '1'.
     */
    const params = useParams();
    const id = params.id as string;
    const queryClient = useQueryClient();

    // Variable para guardar el texto que el usuario escribe en la Base de Conocimientos
    const [rules, setRules] = useState('');

    /**
     * useQuery: Buscamos en nuestra "base de datos" (API) la información del asistente
     * usando el ID que sacamos de la URL.
     */
    const { data: assistant, isLoading, error } = useQuery({
        queryKey: ['assistant', id],
        queryFn: () => api.getAssistantById(id),
    });

    /**
     * useEffect: Cuando terminan de cargar los datos del asistente, cargamos sus reglas
     * actuales para que aparezcan en el cuadro de texto.
     */
    useEffect(() => {
        if (assistant) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setRules(prev => prev || assistant.rules || '');
        }
    }, [assistant]);

    /**
     * updateRulesMutation: Esta es la orden para "Guardar" las reglas en el servidor.
     */
    const updateRulesMutation = useMutation({
        mutationFn: (newRules: string) => api.updateRules(id, newRules),
        onSuccess: () => {
            // Si se guarda bien, avisamos al sistema que los datos han cambiado
            queryClient.invalidateQueries({ queryKey: ['assistant', id] });
            alert('¡Reglas guardadas con éxito!');
        },
        onError: () => {
            alert('Error al intentar guardar las reglas. Reintenta por favor.');
        }
    });

    // Esta función se activa al pulsar el botón "Guardar Reglas"
    const handleSave = () => {
        updateRulesMutation.mutate(rules);
    };

    // Mientras cargan los datos, mostramos una pantalla de carga a pantalla completa
    if (isLoading) return <FullScreenLoader />;

    if (error || !assistant) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-xl font-bold text-gray-900">Asistente no encontrado</h1>
                <Link href="/">
                    <Button variant="ghost" className="mt-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al inicio
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-base transition-colors duration-300">
            {/* Header */}
            <header className="bg-surface-base/90 border-b border-border-dim/50 sticky top-0 z-30 transition-colors duration-300 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button variant="ghost" size="sm" className="hover:bg-surface-raised">
                                    <ArrowLeft className="w-5 h-5 text-text-secondary" />
                                </Button>
                            </Link>
                            <div className="flex items-center gap-4">
                                {/* Logo for Light Mode */}
                                <div className="relative w-[110px] sm:w-[130px] aspect-[261/37] block dark:hidden">
                                    <Image
                                        src="/logo2.svg"
                                        alt="Funnelhot"
                                        fill
                                        priority
                                        className="object-contain hover:brightness-110 transition-all duration-300"
                                    />
                                </div>
                                {/* Logo for Dark Mode */}
                                <div className="relative w-[110px] sm:w-[130px] aspect-[261/37] hidden dark:block">
                                    <Image
                                        src="/logo.svg"
                                        alt="Funnelhot"
                                        fill
                                        priority
                                        className="object-contain hover:brightness-110 transition-all duration-300"
                                    />
                                </div>
                                <div className="w-px h-6 bg-border-dim/50 hidden sm:block" />
                                <div>
                                    <h1 className="text-lg font-bold text-text-primary leading-tight font-primary tracking-tight">
                                        {assistant.name}
                                    </h1>
                                    <div className="flex gap-2 text-xs mt-0.5">
                                        <Badge variant="info" className="px-2 py-0 text-[10px]">{assistant.language}</Badge>
                                        <Badge variant="default" className="px-2 py-0 text-[10px] bg-brand-accent/5 text-brand-accent border border-brand-accent/20">{assistant.tone}</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Columna Izquierda: Reglas de Entrenamiento */}
                    <div className="space-y-6">
                        <div className="glass-card rounded-2xl p-8 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-text-primary font-primary tracking-tight">Base de Conocimientos</h2>
                                    <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-1">Configura la lógica y el contexto del nodo</p>
                                </div>
                                <Button
                                    onClick={handleSave}
                                    isLoading={updateRulesMutation.isPending}
                                    className="gradient-danger shadow-lg shadow-brand-danger/20 border-none px-6 h-9 text-xs font-bold uppercase tracking-widest"
                                >
                                    <Save className="w-3.5 h-3.5 mr-2" />
                                    Guardar Reglas
                                </Button>
                            </div>

                            <div className="relative group">
                                <textarea
                                    value={rules}
                                    onChange={(e) => setRules(e.target.value)}
                                    placeholder="Ingresa las instrucciones del sistema, contexto y reglas de comportamiento aquí..."
                                    className="w-full h-[500px] p-6 text-sm text-text-primary bg-surface-raised/40 border border-border-dim/40 rounded-2xl focus:ring-1 focus:ring-brand-primary focus:border-transparent outline-none resize-none transition-all font-mono leading-relaxed shadow-inner backdrop-blur-sm"
                                    spellCheck={false}
                                />
                                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-text-muted tracking-widest uppercase bg-surface-overlay/5 px-2 py-1 rounded backdrop-blur-sm shadow-sm group-focus-within:text-brand-primary transition-colors">
                                    {rules.length} caracteres
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Simulación de Chat */}
                    <div className="space-y-6">
                        <div className="px-2">
                            <h2 className="text-xl font-bold text-text-primary font-primary tracking-tight">Simulador de Nodo</h2>
                            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-1">Validación en tiempo real</p>
                        </div>
                        <ChatInterface assistant={assistant} />
                    </div>

                </div>
            </main>
        </div>
    );
}
