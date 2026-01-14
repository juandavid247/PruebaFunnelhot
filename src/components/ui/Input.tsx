import { ComponentProps, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends ComponentProps<'input'> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 ml-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={twMerge(
                        'flex h-10 w-full rounded-md border border-border-standard bg-surface-raised px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all font-text',
                        error && 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]',
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-[var(--color-danger)] dark:text-[var(--color-danger)] font-text">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
