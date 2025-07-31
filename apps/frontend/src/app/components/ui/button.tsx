import { ButtonHTMLAttributes, FC } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  className,
  ...props
}) => {
  const baseStyles =
    'w-full px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 transition';

  const variants = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary:
      'bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 focus:ring-gray-400',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};
