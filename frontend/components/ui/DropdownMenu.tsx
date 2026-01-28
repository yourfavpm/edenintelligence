'use client';

import React, { useState, useRef, useEffect } from 'react';

// =============================================================================
// Dropdown Menu Component
// =============================================================================

interface DropdownMenuItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    href?: string;
    danger?: boolean;
    divider?: boolean;
}

interface DropdownMenuProps {
    trigger: React.ReactNode;
    items: DropdownMenuItem[];
    align?: 'left' | 'right';
}

export function DropdownMenu({ trigger, items, align = 'right' }: DropdownMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Close on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const handleItemClick = (item: DropdownMenuItem) => {
        item.onClick?.();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* Trigger */}
            <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

            {/* Menu */}
            {isOpen && (
                <div
                    className={`
            absolute z-50 mt-2 w-48 rounded-lg bg-white shadow-dropdown ring-1 ring-black ring-opacity-5 
            animate-fade-in
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
                >
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        {items.map((item) => {
                            if (item.divider) {
                                return (
                                    <div
                                        key={item.id}
                                        className="my-1 border-t border-neutral-200"
                                    />
                                );
                            }

                            const baseClass = `
                flex items-center gap-2 w-full px-4 py-2 text-sm text-left transition-colors
                ${item.danger
                                    ? 'text-error-600 hover:bg-error-50'
                                    : 'text-neutral-700 hover:bg-neutral-100'
                                }
              `;

                            if (item.href) {
                                return (
                                    <a
                                        key={item.id}
                                        href={item.href}
                                        className={baseClass}
                                        role="menuitem"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </a>
                                );
                            }

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleItemClick(item)}
                                    className={baseClass}
                                    role="menuitem"
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DropdownMenu;
