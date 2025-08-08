import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  icon?: ReactNode;
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  icon,
  className,
  ...props
}) => {
  const baseStyles =
    'flex item-center justify-center gap-2 rounded-md font-medium focus:outline-none transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'px-4 py-2 bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'px-4 py-2 border border-gray-300 bg-white text-gray-800 hover:bg-gray-100',
    icon: 'p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      {icon && <span className="inline-flex items-center">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
