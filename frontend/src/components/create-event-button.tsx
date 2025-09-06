'use client';

import * as React from 'react';
import { twMerge } from 'tailwind-merge';

type CreateEventButtonProps = {
    children: React.ReactNode;
    bgColor?: string;
    hoverMode?: 'invert' | 'color';
    withBorder?: boolean;
    fontSize?: string;
    className?: string;
    onClick?: () => void;
};

export function CreateEventButton({
    children,
    bgColor = 'bg-emerald-500',
    hoverMode = 'color',
    withBorder = false,
    fontSize = 'text-base',
    className,
    onClick,
}: CreateEventButtonProps) {
    const baseStyles =
        'flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-300 cursor-pointer';

    const hoverStyles =
        hoverMode === 'color'
            ? 'hover:bg-emerald-600 text-white'
            : 'hover:bg-white hover:text-[#333] text-white';

    const borderStyles = withBorder ? 'border border-white' : '';

    return (
        <button
            onClick={onClick}
            className={twMerge(baseStyles, bgColor, fontSize, hoverStyles, borderStyles, className)}
        >
            {children}
        </button>
    );
}
