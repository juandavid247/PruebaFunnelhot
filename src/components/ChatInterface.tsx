'use client';

import { Assistant, ChatMessage } from '@/types';
import { useStore } from '@/store/useStore';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Send, RotateCcw, Bot } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

// Respuestas predefinidas que el asistente elegirá al azar para simular una conversación
const MOCK_RESPONSES = [
    "Entendido, ¿en qué más puedo ayudarte?",
    "Esa es una excelente pregunta. Déjame explicarte...",
    "Claro, con gusto te ayudo con eso.",
    "¿Podrías darme más detalles sobre tu consulta?",
    "Perfecto, he registrado esa información.",
    "Esa función está disponible en la configuración avanzada.",
    "Lo siento, no tengo información sobre eso en este momento."
];

interface ChatInterfaceProps {
    assistant: Assistant;
}

export const ChatInterface = ({ assistant }: ChatInterfaceProps) => {
    const { chatHistories, addChatMessage, clearChatHistory, currentTypingAssistantId, setTypingAssistantId } = useStore();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const messages = useMemo(() => chatHistories[assistant.id] || [], [chatHistories, assistant.id]);
    const isTyping = currentTypingAssistantId === assistant.id;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    /**
     * handleSendMessage: Esta función maneja el envío de mensajes en el chat simulado.
     */
    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault(); // Evitamos que la web se refresque al enviar
        if (!inputValue.trim() || isTyping) return; // Si no hay texto o el bot está escribiendo, salimos

        // 1. Creamos el mensaje del usuario (el que tú escribes)
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user', // "user" significa que lo escribe el humano
            content: inputValue,
            timestamp: Date.now()
        };

        // 2. Lo añadimos a la pantalla inmediatamente
        addChatMessage(assistant.id, userMsg);
        setInputValue(''); // Limpiamos el cajetín de texto

        // 3. Simulamos que el asistente está pensando activando los "puntitos" de escritura
        setTypingAssistantId(assistant.id);

        // 4. Esperamos un tiempo aleatorio (entre 1 y 2 segundos) para que parezca humano
        const delay = 1000 + Math.random() * 1000;

        setTimeout(() => {
            // Elegimos una respuesta al azar de nuestra lista predefinida (arriba)
            const randomResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];

            // Creamos el mensaje del asistente (la IA)
            const assistantMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant', // "assistant" es el papel de la IA
                content: randomResponse,
                timestamp: Date.now()
            };

            // Lo añadimos a la pantalla y desactivamos los "puntitos"
            addChatMessage(assistant.id, assistantMsg);
            setTypingAssistantId(null);
        }, delay);
    };

    return (
        <div className="flex flex-col h-[600px] bg-surface-base/80 rounded-2xl border border-border-dim/50 shadow-2xl overflow-hidden transition-all backdrop-blur-xl">
            {/* Chat Header */}
            <div className="bg-surface-raised/50 px-6 py-4 border-b border-border-dim/30 flex justify-between items-center backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-brand-primary/10 p-2 rounded-xl">
                        <Bot className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                        <span className="font-bold text-sm text-text-primary font-primary tracking-tight">Simulador</span>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest leading-none mt-0.5">Vista Previa Real</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearChatHistory(assistant.id)}
                    className="h-8 w-8 p-0 rounded-lg hover:bg-white/5"
                >
                    <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
                </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface-base/50">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-text-muted space-y-3">
                        <div className="p-4 rounded-3xl bg-surface-raised opacity-50">
                            <Bot className="w-8 h-8 mx-auto" />
                        </div>
                        <p className="text-sm font-medium font-text">Inicia una conversación para probar la lógica.</p>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={clsx(
                            "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
                            msg.role === 'user' ? "justify-end" : "justify-start"
                        )}
                    >
                        <div className={clsx(
                            "flex flex-col max-w-[85%]",
                            msg.role === 'user' ? "items-end" : "items-start"
                        )}>
                            <div className={clsx(
                                "rounded-2xl px-5 py-3 text-sm shadow-sm font-text font-medium leading-relaxed transition-all",
                                msg.role === 'user'
                                    ? "bg-brand-danger text-white rounded-tr-none shadow-brand-danger/10"
                                    : "bg-surface-raised border border-border-dim/40 text-text-primary rounded-tl-none"
                            )}>
                                {msg.content}
                            </div>
                            <span className="text-[9px] text-text-muted mt-1 px-1 font-bold uppercase tracking-widest">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-surface-raised border border-border-dim/30 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm">
                            <div className="flex gap-1.5">
                                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-5 bg-surface-raised/30 border-t border-border-dim/20 backdrop-blur-md">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Escribe un mensaje para probar..."
                        className="flex-1 bg-surface-base border-border-dim focus:ring-1 focus:ring-brand-primary"
                        disabled={isTyping}
                    />
                    <Button
                        type="submit"
                        disabled={!inputValue.trim() || isTyping}
                        className="gradient-primary border-none shadow-lg shadow-brand-primary/20 px-4 h-11"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
};
