'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';

import { useLogout } from '../hooks/useLogout';
import Button from './ui/button';
import Search from './search';

export default function Header() {
  const { logout, isLoading } = useLogout();
  return (
    <header className="flex items-center justify-between gap-3 mb-8">
      <Link href="/" className="text-2xl font-bold text-blue-800 hover:underline">
        Storium
      </Link>

      <div className="flex items-center gap-4">
        <Search />

        <Button
          variant="icon"
          onClick={logout}
          icon={<LogOut size={16} />}
          disabled={isLoading}
        />
      </div>
    </header>
  );
}
