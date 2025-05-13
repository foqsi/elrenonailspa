import React from 'react';

export default function Throbber({ size = 32, color = 'text-red-600' }: { size?: number; color?: string }) {
    return (
        <div
            className={`animate-spin rounded-full border-4 border-t-transparent ${color}`}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                borderColor: 'currentColor',
                borderTopColor: 'transparent',
            }}
            role="status"
            aria-label="Loading"
        />
    );
}
