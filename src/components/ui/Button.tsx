import { forwardRef, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';

// Omit children from HTMLMotionProps and explicitly type it as ReactNode
interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] font-primary';

        // Custom theme colors
        const variants = {
            primary: 'bg-[var(--color-primary)] text-white hover:opacity-90 dark:bg-[var(--color-primary)] dark:hover:opacity-80 focus:ring-[var(--color-primary)] dark:focus:ring-offset-gray-900',
            secondary: 'bg-[var(--color-secondary)] text-white hover:opacity-90 dark:bg-[var(--color-secondary)] dark:hover:opacity-80 focus:ring-[var(--color-secondary)]',
            danger: 'bg-[var(--color-danger)] text-white hover:opacity-90 dark:bg-[var(--color-danger)] dark:hover:opacity-80 focus:ring-[var(--color-danger)]',
            ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200 hover:text-gray-900 focus:ring-gray-500',
            outline: 'border border-gray-300 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-[var(--color-primary)]'
        };

        const sizes = {
            sm: 'h-8 px-3 text-sm',
            md: 'h-10 px-4 py-2',
            lg: 'h-12 px-6 text-lg'
        };

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.98 }}
                className={twMerge(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';
