import React from 'react';
import { cn } from '@/lib/utils';

export const ClubCard = ({
  icon: Icon,
  label
}: {
  icon: React.ElementType;
  label: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-full cursor-pointer overflow-hidden rounded-xl border p-4 flex flex-col items-start justify-start gap-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <Icon size={24} className="text-gray-900 dark:text-gray-100" />
      <figcaption className="text-base font-medium text-gray-900 dark:text-gray-100">
        {label}
      </figcaption>
    </figure>
  );
};