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
import { toast } from 'sonner';

export default function TrainingPage() {
    const params = useParams();
    const id = params.id as string;
    const queryClient = useQueryClient();

    const [rules, setRules] = useState('');

    // Fetch Assistant
    const { data: assistant, isLoading, error } = useQuery({
        queryKey: ['assistant', id],
        queryFn: () => api.getAssistantById(id),
    });

    // Init local state when data loads
    useEffect(() => {
        if (assistant) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setRules(prev => prev || assistant.rules || '');
        }
    }, [assistant]);

    // Update Mutation
    const updateRulesMutation = useMutation({
        mutationFn: (newRules: string) => api.updateRules(id, newRules),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assistant', id] });
            toast.success('Rules saved successfully');
        },
        onError: () => {
            toast.error('Error saving rules');
        }
    });

    const handleSave = () => {
        updateRulesMutation.mutate(rules);
    };

    if (isLoading) return <FullScreenLoader />;

    if (error || !assistant) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen light:bg-gray-50 dark:bg-black">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Assistant Not Found</h1>
                <Link href="/">
                    <Button variant="ghost" className="mt-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-black transition-colors duration-300">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-600 p-2 rounded-lg">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
                                        {assistant.name}
                                    </h1>
                                    <div className="flex gap-2 text-xs mt-0.5">
                                        <Badge variant="info">{assistant.language}</Badge>
                                        <Badge variant="default" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">{assistant.tone}</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column: Training Rules */}
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Training Rules</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Define the behavior and knowledge base.</p>
                                </div>
                                <Button
                                    onClick={handleSave}
                                    isLoading={updateRulesMutation.isPending}
                                    className="min-w-[100px]"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save
                                </Button>
                            </div>

                            <textarea
                                value={rules}
                                onChange={(e) => setRules(e.target.value)}
                                placeholder="Enter system instructions, context, and behavior rules here..."
                                className="w-full h-[500px] p-4 text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all font-mono leading-relaxed placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                spellCheck={false}
                            />

                            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 text-right">
                                {rules.length} characters
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Chat Simulation */}
                    <div className="space-y-4">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Preview Simulator</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Test your assistant&apos;s responses in real-time.</p>
                        </div>
                        <ChatInterface assistant={assistant} />
                    </div>

                </div>
            </main>
        </div>
    );
}
