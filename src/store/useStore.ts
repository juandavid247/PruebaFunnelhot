import { create } from 'zustand';
import { Assistant, ChatMessage } from '@/types';

/**
 * Interfaz para el estado del Modal. 
 * El Modal es la ventana emergente que usamos para crear o editar asistentes.
 */
interface ModalState {
    isOpen: boolean;        // Indica si la ventana está abierta o cerrada
    mode: 'create' | 'edit'; // Indica si estamos creando uno nuevo o editando uno existente
    step: 1 | 2;           // El formulario tiene 2 pasos, aquí guardamos en cuál estamos
    openModal: (mode: 'create' | 'edit', assistant?: Assistant) => void; // Función para abrir la ventana
    closeModal: () => void; // Función para cerrar la ventana
    setStep: (step: 1 | 2) => void; // Función para cambiar entre el paso 1 y 2
}

/**
 * Interfaz global del estado de la aplicación (AppState).
 * Aquí definimos todas las "variables globales" que la app necesita recordar.
 */
interface AppState {
    // --- Estado de la Ventana Emergente (Modal) ---
    modal: ModalState;

    // --- Asistente Seleccionado ---
    // Guardamos aquí el asistente que el usuario pulsó para editar
    selectedAssistant: Assistant | null;
    setSelectedAssistant: (assistant: Assistant | null) => void;

    // --- Historial del Chat ---
    // Guardamos los mensajes de cada asistente usando su ID como clave
    chatHistories: Record<string, ChatMessage[]>;
    addChatMessage: (assistantId: string, message: ChatMessage) => void;
    clearChatHistory: (assistantId: string) => void;

    // --- Indicador de Escritura ---
    // Guarda el ID del asistente que está "respondiendo" en el simulador
    currentTypingAssistantId: string | null;
    setTypingAssistantId: (id: string | null) => void;
}

/**
 * useStore: Nuestra "Tienda de Datos" centralizada.
 * Usamos Zustand para que cualquier componente de la web pueda leer o cambiar
 * estos datos de forma sencilla y rápida.
 */
export const useStore = create<AppState>((set) => ({
    // Lógica para la ventana emergente (Modal)
    modal: {
        isOpen: false,
        mode: 'create',
        step: 1,
        // Al abrir, configuramos si es creación o edición y cargamos los datos si existen
        openModal: (mode, assistant) => set((state) => ({
            modal: { ...state.modal, isOpen: true, mode, step: 1 },
            selectedAssistant: assistant || null
        })),
        // Al cerrar, reseteamos todo a los valores iniciales
        closeModal: () => set((state) => ({
            modal: { ...state.modal, isOpen: false, step: 1 },
            selectedAssistant: null
        })),
        // Cambia el paso actual del formulario
        setStep: (step) => set((state) => ({
            modal: { ...state.modal, step }
        }))
    },

    // Manejo del asistente que estamos editando
    selectedAssistant: null,
    setSelectedAssistant: (assistant) => set({ selectedAssistant: assistant }),

    // Manejo del historial de mensajes del simulador
    chatHistories: {},
    addChatMessage: (assistantId, message) => set((state) => ({
        chatHistories: {
            ...state.chatHistories,
            [assistantId]: [...(state.chatHistories[assistantId] || []), message]
        }
    })),
    // Limpia los mensajes del chat de un asistente
    clearChatHistory: (assistantId) => set((state) => ({
        chatHistories: {
            ...state.chatHistories,
            [assistantId]: []
        }
    })),

    // Manejo del indicador visual de "El asistente está escribiendo..."
    currentTypingAssistantId: null,
    setTypingAssistantId: (id) => set({ currentTypingAssistantId: id })
}));
