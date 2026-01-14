import { twMerge } from "tailwind-merge";

interface SkeletonProps {
    className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
    return (
        <div className={twMerge("animate-pulse rounded-md bg-gray-200 dark:bg-gray-800", className)} />
    );
};
