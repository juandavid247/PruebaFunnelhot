import { twMerge } from 'tailwind-merge';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
    className?: string;
}

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
    const variants = {
        default: 'bg-surface-raised text-text-primary border-border-standard',
        primary: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
        success: 'bg-brand-accent/10 text-brand-accent border-brand-accent/20',
        warning: 'bg-brand-warning/10 text-brand-warning border-brand-warning/20',
        danger: 'bg-brand-danger/10 text-brand-danger border-brand-danger/20',
        info: 'bg-brand-primary/5 text-brand-primary border-brand-primary/20',
    };

    return (
        <span className={twMerge(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-accent',
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
};
