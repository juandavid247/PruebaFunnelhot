'use client';

import { AssistantList } from '@/components/AssistantList';
import { AssistantModal } from '@/components/AssistantModal';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { Plus, Bot } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Image from 'next/image';

export default function Home() {
  /**
   * useStore: Accedemos a la tienda de datos para controlar el Modal (la ventana emergente).
   */
  const { modal } = useStore();

  return (
    <main className="min-h-screen bg-surface-base transition-colors duration-300">
      {/* --- Encabezado (Header) --- */}
      <header className="bg-surface-base/90 border-b border-border-dim/50 sticky top-0 z-30 transition-colors duration-300 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logotipos: Cambian según si el usuario usa Modo Claro o Oscuro */}
            <div className="flex items-center gap-3">
              {/* Logo para Modo Claro */}
              <div className="relative w-[120px] sm:w-[150px] aspect-[261/37] block dark:hidden">
                <Image
                  src="/logo2.svg"
                  alt="Funnelhot Logo"
                  fill
                  priority
                  className="object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* Logo para Modo Oscuro */}
              <div className="relative w-[120px] sm:w-[150px] aspect-[261/37] hidden dark:block">
                <Image
                  src="/logo.svg"
                  alt="Funnelhot Logo"
                  fill
                  priority
                  className="object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Acciones del Header: Interruptor de tema y botón de creación */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button
                onClick={() => modal.openModal('create')} // Al hacer clic, abrimos el modal en modo "crear"
                className="gradient-danger shadow-lg shadow-brand-danger/20 border-none h-9 text-sm px-5"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Nodo
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* --- Contenido Principal --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Título y descripción atractiva */}
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-3xl font-bold text-brand-danger font-primary tracking-tight">Tus Nodos de Automatización</h2>
          <p className="mt-2 text-sm text-text-secondary font-text max-w-2xl font-medium">
            Configura tus asistentes de IA como nodos en tu espacio de trabajo. Llega a tus prospectos con precisión y el tono adecuado.
          </p>
        </div>

        {/* Componente que dibuja la lista de asistentes (tarjetas) */}
        <AssistantList />
      </div>

      {/* 
        Componente del Modal: Aunque está aquí al final, es invisible hasta que 
        'modal.isOpen' sea verdadero. 
      */}
      <AssistantModal />
    </main>
  );
}
