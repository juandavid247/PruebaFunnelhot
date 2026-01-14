import { Assistant, CreateAssistantDTO, UpdateAssistantDTO } from '@/types';

// Datos iniciales para que la aplicación no se vea vacía al cargar
const INITIAL_ASSISTANTS: Assistant[] = [
    {
        id: '1',
        name: 'Asistente de Ventas',
        language: 'Español',
        tone: 'Profesional',
        responseParams: {
            short: 30,
            medium: 50,
            long: 20
        },
        audioEnabled: true,
        rules: "Eres un asistente especializado en ventas. Siempre sé cordial y enfócate en identificar necesidades del cliente antes de ofrecer productos."
    },
    {
        id: '2',
        name: 'Soporte Técnico',
        language: 'Inglés',
        tone: 'Amigable',
        responseParams: {
            short: 20,
            medium: 30,
            long: 50
        },
        audioEnabled: false,
        rules: "Ayudas a resolver problemas técnicos de manera clara y paso a paso. Siempre confirma que el usuario haya entendido antes de continuar."
    }
];

/**
 * Almacén en memoria: Esta variable guarda los asistentes mientras la página esté abierta.
 * Si refrescas el navegador (F5), se reiniciará con los datos iniciales.
 */
let assistants = [...INITIAL_ASSISTANTS];

/**
 * Función de retardo (delay): Sirve para simular el tiempo que tardaría un servidor real 
 * en responder por internet (latencia).
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Objeto API: Aquí definimos todas las funciones que manipulan los datos de los asistentes.
 * Usamos "async" porque las funciones no responden al instante (esperan el delay).
 */
export const api = {
    // Obtiene la lista completa de asistentes
    getAssistants: async (): Promise<Assistant[]> => {
        await delay(500); // Esperamos medio segundo
        return [...assistants];
    },

    // Busca un asistente específico por su identificador (ID)
    getAssistantById: async (id: string): Promise<Assistant | undefined> => {
        await delay(300);
        return assistants.find(a => a.id === id);
    },

    // Crea un nuevo asistente y le asigna un ID aleatorio
    createAssistant: async (data: CreateAssistantDTO): Promise<Assistant> => {
        await delay(800);
        const newAssistant: Assistant = {
            ...data,
            id: Math.random().toString(36).substr(2, 9), // Generamos un código corto al azar
            rules: '' // Por defecto empieza sin instrucciones de entrenamiento
        };
        assistants.push(newAssistant);
        return newAssistant;
    },

    // Actualiza los datos básicos de un asistente ya existente
    updateAssistant: async (data: UpdateAssistantDTO): Promise<Assistant> => {
        await delay(600);
        const index = assistants.findIndex(a => a.id === data.id);
        if (index === -1) throw new Error('Asistente no encontrado');

        assistants[index] = { ...assistants[index], ...data };
        return assistants[index];
    },

    // Elimina un asistente de la lista
    deleteAssistant: async (id: string): Promise<void> => {
        await delay(800);

        // Simulamos un 10% de probabilidad de error para probar cómo reacciona la interfaz
        if (Math.random() < 0.1) {
            throw new Error('Error simulado al eliminar (10% probabilidad)');
        }

        assistants = assistants.filter(a => a.id !== id);
    },

    // Guarda las instrucciones de entrenamiento (reglas) para un asistente
    updateRules: async (id: string, rules: string): Promise<Assistant> => {
        await delay(600);
        const index = assistants.findIndex(a => a.id === id);
        if (index === -1) throw new Error('Asistente no encontrado');

        assistants[index] = { ...assistants[index], rules };
        return assistants[index];
    }
};
