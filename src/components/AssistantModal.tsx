'use client';

import { useStore } from '@/store/useStore';
import { Modal } from './ui/Modal';
import { useForm } from 'react-hook-form';
import { Assistant, CreateAssistantDTO, Language, Tone } from '@/types';
import { useEffect } from 'react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

export const AssistantModal = () => {
    const { modal, selectedAssistant } = useStore();
    const queryClient = useQueryClient();

    /**
     * useForm: Maneja todo el formulario de forma inteligente.
     * - register: Registra cada campo (input) en el sistema.
     * - handleSubmit: Se encarga de procesar el envío final.
     * - watch: "Vigila" los campos en tiempo real (para la barrita de % ).
     * - trigger: Lógica manual para validar (ej. antes de pasar al paso 2).
     */
    const { register, handleSubmit, watch, reset, formState: { errors }, trigger } = useForm<CreateAssistantDTO>({
        defaultValues: {
            name: '',
            language: 'Español' as Language,
            tone: 'Profesional' as Tone,
            responseParams: { short: 30, medium: 40, long: 30 },
            audioEnabled: false,
        },
        mode: 'onChange' // Valida mientras el usuario escribe
    });

    // Vigilamos los porcentajes para calcular el total
    const responseParams = watch('responseParams');
    const totalPercentage = (responseParams?.short || 0) + (responseParams?.medium || 0) + (responseParams?.long || 0);

    /**
     * useEffect para resetear el formulario.
     * Si abrimos para editar, carga los datos del asistente.
     * Si abrimos para crear, lo deja todo limpio.
     */
    useEffect(() => {
        if (modal.isOpen && selectedAssistant) {
            reset({
                name: selectedAssistant.name,
                language: selectedAssistant.language,
                tone: selectedAssistant.tone,
                responseParams: selectedAssistant.responseParams,
                audioEnabled: selectedAssistant.audioEnabled,
            });
        } else if (modal.isOpen && !selectedAssistant) {
            reset({
                name: '',
                language: 'Español',
                tone: 'Profesional',
                responseParams: { short: 30, medium: 40, long: 30 },
                audioEnabled: false,
            });
        }
    }, [modal.isOpen, selectedAssistant, reset]);

    /**
     * Mutación para Crear: Implementamos actualización optimista básica.
     * Mostramos el nuevo asistente en la lista al segundo, antes de que el servidor guarde.
     */
    const createMutation = useMutation({
        mutationFn: api.createAssistant,
        onMutate: async (newAssistant) => {
            await queryClient.cancelQueries({ queryKey: ['assistants'] });
            const previousAssistants = queryClient.getQueryData<Assistant[]>(['assistants']);

            if (previousAssistants) {
                queryClient.setQueryData<Assistant[]>(['assistants'], [
                    ...previousAssistants,
                    { ...newAssistant, id: 'temp-' + Date.now(), rules: '' } as Assistant
                ]);
            }
            return { previousAssistants };
        },
        onSuccess: () => {
            modal.closeModal();
            toast.success('¡Asistente creado con éxito!');
        },
        onError: (err, _, context) => {
            if (context?.previousAssistants) {
                queryClient.setQueryData(['assistants'], context.previousAssistants);
            }
            toast.error('Ocurrió un error al crear el asistente.');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['assistants'] });
        },
    });

    /**
     * Mutación para Actualizar/Editar: Actualización optimista impecable.
     * Cambia los datos en la pantalla instantáneamente.
     */
    const updateMutation = useMutation({
        mutationFn: api.updateAssistant,
        onMutate: async (updatedAssistant) => {
            await queryClient.cancelQueries({ queryKey: ['assistants'] });
            const previousAssistants = queryClient.getQueryData<Assistant[]>(['assistants']);

            if (previousAssistants) {
                queryClient.setQueryData<Assistant[]>(['assistants'],
                    previousAssistants.map(a => a.id === updatedAssistant.id ? { ...a, ...updatedAssistant } : a)
                );
            }
            return { previousAssistants };
        },
        onSuccess: () => {
            modal.closeModal();
            toast.success('¡Asistente actualizado con éxito!');
        },
        onError: (err, _, context) => {
            if (context?.previousAssistants) {
                queryClient.setQueryData(['assistants'], context.previousAssistants);
            }
            toast.error('Ocurrió un error al actualizar los datos.');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['assistants'] });
        },
    });

    /**
     * Función que manda los datos finales a la API.
     * Decide si llamar a 'create' o a 'update' según el modo.
     */
    const onSubmit = (data: CreateAssistantDTO) => {
        if (modal.mode === 'create') {
            createMutation.mutate(data);
        } else {
            if (selectedAssistant) {
                updateMutation.mutate({ ...data, id: selectedAssistant.id });
            }
        }
    };

    /**
     * Control del Paso 1: Antes de pasar al Paso 2, revisamos que 
     * el nombre esté bien escrito y que se hayan elegido el idioma y el tono.
     */
    const handleNextStep = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const isStep1Valid = await trigger(['name', 'language', 'tone']);
        if (isStep1Valid) {
            modal.setStep(2);
        } else {
            toast.error('Completa los campos en rojo para continuar');
        }
    };

    /**
     * Maneja el envío del formulario completo.
     * Si estamos en el paso 1, el botón de "Enter" o envío se ignora
     * para no saltarse la validación visual.
     */
    const handleFormSubmit = (e: React.FormEvent) => {
        if (modal.step === 1) {
            e.preventDefault();
            return;
        }
        handleSubmit(onSubmit)(e);
    };

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <Modal
            isOpen={modal.isOpen}
            onClose={modal.closeModal}
            title={modal.mode === 'create' ? 'Crear Nuevo Nodo' : 'Editar Nodo de Automatización'}
            description={modal.step === 1 ? 'Paso 1: Identificación del Nodo' : 'Paso 2: Parámetros de Ejecución'}
            className="max-w-xl glass-card"
        >
            <form onSubmit={handleFormSubmit} className="mt-6">
                {/* Step Indicator */}
                <div className="flex items-center justify-center mb-10">
                    <div className={clsx(
                        "flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold transition-all duration-300 font-primary",
                        modal.step === 1 ? "bg-brand-danger text-white shadow-lg shadow-brand-danger/20" : "bg-surface-raised text-text-muted border border-border-dim/30"
                    )}>1</div>
                    <div className="w-16 h-0.5 bg-border-dim/20 mx-3 rounded-full overflow-hidden">
                        <div className={clsx("h-full bg-brand-danger transition-all duration-500", modal.step === 2 ? "w-full" : "w-0")} />
                    </div>
                    <div className={clsx(
                        "flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold transition-all duration-300 font-primary",
                        modal.step === 2 ? "bg-brand-danger text-white shadow-lg shadow-brand-danger/20" : "bg-surface-raised text-text-muted border border-border-dim/30"
                    )}>2</div>
                </div>

                {/* Step 1 Content */}
                {modal.step === 1 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-500">
                        <Input
                            label="Nombre del Nodo"
                            {...register('name', {
                                required: 'El nombre es obligatorio',
                                minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                            })}
                            error={errors.name?.message}
                            placeholder="ej. Asistente de Ventas"
                            autoFocus
                            className="bg-surface-base/50 border-border-dim/30 focus:border-brand-primary"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Idioma"
                                {...register('language', { required: true })}
                                options={[
                                    { value: 'Español', label: 'Español' },
                                    { value: 'Inglés', label: 'Inglés' },
                                    { value: 'Portugués', label: 'Portugués' },
                                ]}
                            />

                            <Select
                                label="Tono"
                                {...register('tone', { required: true })}
                                options={[
                                    { value: 'Formal', label: 'Formal' },
                                    { value: 'Casual', label: 'Casual' },
                                    { value: 'Profesional', label: 'Profesional' },
                                    { value: 'Amigable', label: 'Amigable' },
                                ]}
                            />
                        </div>
                    </div>
                )}

                {/* Step 2 Content */}
                {modal.step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div>
                            <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-4 font-accent">Distribución de Ejecución</p>

                            <div className="grid grid-cols-3 gap-4">
                                <Input
                                    type="number"
                                    label="Corta"
                                    {...register('responseParams.short', { valueAsNumber: true })}
                                    min={0} max={100}
                                />
                                <Input
                                    type="number"
                                    label="Media"
                                    {...register('responseParams.medium', { valueAsNumber: true })}
                                    min={0} max={100}
                                />
                                <Input
                                    type="number"
                                    label="Larga"
                                    {...register('responseParams.long', { valueAsNumber: true })}
                                    min={0} max={100}
                                />
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm font-bold text-text-primary font-primary">
                                    Carga Total: <span className={clsx(
                                        totalPercentage === 100 ? "text-brand-accent" : "text-brand-danger"
                                    )}>{totalPercentage}%</span>
                                </div>
                                {totalPercentage !== 100 && (
                                    <span className="text-[10px] text-brand-danger font-bold uppercase tracking-tight">Debe sumar exactamente 100%</span>
                                )}
                            </div>

                            {/* Visual Bar */}
                            <div className="flex w-full h-1.5 bg-surface-raised rounded-full mt-3 overflow-hidden shadow-inner border border-border-dim/30">
                                <div className="bg-brand-primary transition-all duration-500" style={{ width: `${responseParams?.short || 0}%` }} />
                                <div className="bg-brand-accent transition-all duration-500" style={{ width: `${responseParams?.medium || 0}%` }} />
                                <div className="bg-brand-warning transition-all duration-500" style={{ width: `${responseParams?.long || 0}%` }} />
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-surface-raised/40 border border-border-dim/30 rounded-xl transition-all hover:bg-surface-raised/60 backdrop-blur-sm">
                            <input
                                type="checkbox"
                                id="audioEnabled"
                                {...register('audioEnabled')}
                                className="h-4 w-4 text-brand-danger focus:ring-brand-danger border-border-standard rounded bg-surface-raised"
                            />
                            <label htmlFor="audioEnabled" className="text-xs font-semibold text-text-secondary select-none cursor-pointer font-accent">
                                Habilitar Respuestas de Voz (TTS)
                            </label>
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/5">
                    {modal.step === 2 && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => modal.setStep(1)}
                            disabled={isSaving}
                            className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-text-primary"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                            Atrás
                        </Button>
                    )}

                    {modal.step === 1 ? (
                        <Button
                            type="button"
                            onClick={handleNextStep}
                            disabled={!watch('name')}
                            className="gradient-primary border-none shadow-lg shadow-brand-primary/20 text-xs font-bold uppercase tracking-widest px-6"
                        >
                            Siguiente
                            <ArrowRight className="w-3.5 h-3.5 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            isLoading={isSaving}
                            disabled={totalPercentage !== 100}
                            className="gradient-danger border-none shadow-lg shadow-brand-danger/20 text-xs font-bold uppercase tracking-widest px-8"
                        >
                            <Save className="w-3.5 h-3.5 mr-2" />
                            Guardar Nodo
                        </Button>
                    )}
                </div>
            </form>
        </Modal>
    );
};
