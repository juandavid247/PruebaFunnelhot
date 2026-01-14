import { ComponentProps, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface SelectProps extends ComponentProps<'select'> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 ml-1">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={twMerge(
                        "bg-surface-raised rounded-xl border border-border-dim shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex h-10 w-full px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 font-text",
                        error && 'border-border-danger focus:ring-focus-danger',
                        className
                    )}
                    {...props}
                >
                    <option value="" disabled>Select an option</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-sm text-[var(--color-danger)] dark:text-[var(--color-danger)] font-text">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';
