'use client';

import { handleSignOut } from '@/lib/actions';
import { LogOut } from 'lucide-react';

export function SignOutButton() {
  return (
    <form action={handleSignOut}>
      <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full">
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </form>
  );
}
