'use client';

import { FC, useState, useRef, useEffect } from 'react';
import { EllipsisVerticalIcon } from 'lucide-react';

import Button from './button';

interface DropdownAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

interface DropdownMenuProps {
  actions: DropdownAction[];
  buttonClassName?: string;
}

export const DropdownMenu: FC<DropdownMenuProps> = ({ actions, buttonClassName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const handleClick = (action: DropdownAction) => {
    action.onClick();
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
    <Button
      variant="icon"
      onClick={toggleDropdown}
      className={buttonClassName}
      icon={<EllipsisVerticalIcon className="w-5 h-5" />}
    />

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg border border-gray-200">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleClick(action)}
              className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
