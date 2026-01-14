import { Assistant } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { BrainCircuit, Edit2, Trash2, Bot } from 'lucide-react';
import Link from 'next/link';

interface AssistantCardProps {
    assistant: Assistant;
    onEdit: (assistant: Assistant) => void;
    onDelete: (id: string) => void;
    isDeleting?: boolean;
}

export const AssistantCard = ({ assistant, onEdit, onDelete, isDeleting }: AssistantCardProps) => {
    return (
        <Card className="group relative flex flex-col h-full bg-surface-raised/40 backdrop-blur-sm border-border-dim/40 hover:border-[var(--color-primary)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
            {/* Top Indicator Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-primary)] opacity-70 group-hover:opacity-100 transition-opacity" />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-none">
                <div className="flex flex-col space-y-1.5">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-[var(--color-primary)]/10">
                            <Bot className="w-3 h-3 text-[var(--color-primary)]" />
                        </div>
                        <h3 className="font-semibold text-base text-text-primary line-clamp-1 font-primary tracking-tight">
                            {assistant.name}
                        </h3>
                    </div>
                    <div className="flex gap-2 mt-1">
                        <Badge variant="info" className="text-[10px] px-2 py-0">{assistant.language}</Badge>
                        <Badge variant="default" className="bg-[var(--color-accent)]/5 text-[var(--color-accent)] border border-[var(--color-accent)]/20 font-accent text-[10px] px-2 py-0">
                            {assistant.tone}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 px-6 py-2">
                <div className="space-y-4">
                    <div className="text-sm">
                        <div className="flex justify-between items-center mb-1.5">
                            <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider font-accent">Distribución</p>
                            <span className="text-[10px] font-bold text-text-muted">{assistant.responseParams.short}% / {assistant.responseParams.medium}% / {assistant.responseParams.long}%</span>
                        </div>
                        <div className="flex w-full h-1.5 bg-surface-raised rounded-full overflow-hidden shadow-inner border border-border-dim/50">
                            <div
                                className="bg-[var(--color-primary)] opacity-80"
                                style={{ width: `${assistant.responseParams.short}%` }}
                            />
                            <div
                                className="bg-[var(--color-accent)] opacity-80"
                                style={{ width: `${assistant.responseParams.medium}%` }}
                            />
                            <div
                                className="bg-[var(--color-warning)] opacity-80"
                                style={{ width: `${assistant.responseParams.long}%` }}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between pt-4 pb-6 px-6 gap-3 border-none mt-auto bg-transparent">
                <Link href={`/assistant/${assistant.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs h-8 border-border-dim hover:bg-brand-primary hover:text-white transition-colors">
                        <BrainCircuit className="w-3.5 h-3.5 mr-2" />
                        Configurar
                    </Button>
                </Link>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(assistant)}
                        className="h-8 w-8 p-0 text-text-muted hover:text-brand-primary hover:bg-brand-primary/10"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(assistant.id)}
                        isLoading={isDeleting}
                        className="h-8 w-8 p-0 text-text-muted hover:text-brand-danger hover:bg-brand-danger/10"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};
