import { twMerge } from "tailwind-merge";
import { motion, HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
}

export const Card = ({ children, className, ...props }: CardProps) => {
    return (
        <motion.div
            className={twMerge(
                "bg-surface-raised rounded-xl border border-border-dim shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const CardHeader = ({ children, className }: Pick<CardProps, 'children' | 'className'>) => (
    <div className={twMerge("px-6 py-4 border-b border-gray-100 dark:border-gray-700 font-primary", className)}>
        {children}
    </div>
);

export const CardContent = ({ children, className }: Pick<CardProps, 'children' | 'className'>) => (
    <div className={twMerge("p-6", className)}>
        {children}
    </div>
);

export const CardFooter = ({ children, className }: Pick<CardProps, 'children' | 'className'>) => (
    <div className={twMerge("px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700", className)}>
        {children}
    </div>
);
