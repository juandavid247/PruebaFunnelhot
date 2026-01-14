'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { AssistantCard } from './AssistantCard';
import { Skeleton } from './ui/Skeleton';
import { useStore } from '@/store/useStore';
import { Plus } from 'lucide-react';
import { Button } from './ui/Button';
import { Assistant } from '@/types';
import { toast } from 'sonner';

export const AssistantList = () => {
    const queryClient = useQueryClient();
    const { modal } = useStore();

    /**
     * useQuery: Esta función se encarga de "pedir" los datos de los asistentes.
     * - queryKey: Es el nombre de la "cajita" donde se guarda la información en caché.
     * - queryFn: Es la función que realmente va a buscar los datos (la de nuestra API).
     */
    const { data: assistants, isLoading, error } = useQuery({
        queryKey: ['assistants'],
        queryFn: api.getAssistants,
    });

    /**
     * useMutation para borrar: Se usa cuando queremos cambiar algo en el "servidor".
     * Aquí implementamos la ACTUAlIZACIÓN OPTIMISTA.
     */
    const deleteMutation = useMutation({
        mutationFn: api.deleteAssistant,
        onMutate: async (id) => {
            // Cancelamos cualquier búsqueda en curso para que no sobrescriba nuestra actualización optimista
            await queryClient.cancelQueries({ queryKey: ['assistants'] });

            // Guardamos una "foto" del estado actual antes de cambiarlo (por si hay que volver atrás en caso de error)
            const previousAssistants = queryClient.getQueryData<Assistant[]>(['assistants']);

            // Actualizamos la interfaz AL INSTANTE: borramos el asistente visualmente antes de que el servidor responda
            if (previousAssistants) {
                queryClient.setQueryData<Assistant[]>(['assistants'],
                    previousAssistants.filter(a => a.id !== id)
                );
            }

            // Devolvemos el estado anterior por si algo sale mal y tenemos que restaurarlo
            return { previousAssistants };
        },
        onError: (err, id, context) => {
            // Si la eliminación falla en el servidor, restauramos la lista original (Rollback)
            if (context?.previousAssistants) {
                queryClient.setQueryData(['assistants'], context.previousAssistants);
            }
            toast.error(err instanceof Error ? err.message : 'Error al eliminar el asistente');
        },
        onSettled: () => {
            // Cuando todo termina (bien o mal), refrescamos los datos para estar sincronizados al 100%
            queryClient.invalidateQueries({ queryKey: ['assistants'] });
        },
    });

    const handleDelete = async (id: string) => {
        // Mostramos una confirmación usando la librería Sonner
        toast('¿Estás seguro?', {
            description: 'Esta acción no se puede deshacer.',
            action: {
                label: 'Eliminar',
                onClick: () => deleteMutation.mutate(id),
            },
            cancel: {
                label: 'Cancelar',
                onClick: () => { },
            }
        });
    };

    const handleEdit = (assistant: Assistant) => {
        modal.openModal('edit', assistant);
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-[200px] rounded-xl border border-border-dim p-6 space-y-4 bg-surface-raised/50">
                        <div className="flex justify-between">
                            <Skeleton className="h-6 w-1/2" />
                            <div className="flex gap-2">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                        </div>
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-2 w-full mt-4" />
                        <div className="flex gap-2 justify-end mt-8">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Si hubo un error en la carga inicial, mostramos este aviso
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-[var(--color-danger)] dark:text-[var(--color-danger)]">
                <p className="font-text">Ups, algo salió mal al cargar los asistentes.</p>
                <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Probar de nuevo</Button>
            </div>
        );
    }

    // Si la lista está vacía, mostramos un diseño bonito que invita a crear el primero
    if (!assistants || assistants.length === 0) {
        return (
            <div className="text-center py-20 bg-surface-raised border border-dashed border-border-standard rounded-2xl">
                <h3 className="mt-2 text-sm font-semibold text-text-primary font-primary">No tienes asistentes aún</h3>
                <p className="mt-1 text-sm text-text-secondary font-text">Es momento de crear tu primer nodo de automatización con IA.</p>
                <div className="mt-6">
                    <Button onClick={() => modal.openModal('create')}>
                        <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                        Crear Mi Primer Asistente
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assistants.map((assistant) => (
                <AssistantCard
                    key={assistant.id}
                    assistant={assistant}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isDeleting={deleteMutation.isPending && deleteMutation.variables === assistant.id}
                />
            ))}
        </div>
    );
};
