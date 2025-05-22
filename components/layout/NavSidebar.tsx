'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calculator, 
  Home, 
  FileText, 
  Brain, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';
import type { Session } from 'next-auth';

interface NavSidebarProps {
  user: Session['user'];
}

const navItems = [
  { href: '/renters', label: 'Renters Calc', icon: Calculator },
  { href: '/airbnb', label: 'Airbnb Calc', icon: Home },
  { href: '/wholesale', label: 'Wholesale Calc', icon: Calculator },
  { href: '/dashboard/saved', label: 'Saved Reports', icon: FileText },
  { href: '/dashboard/insights', label: 'AI Insights', icon: Brain },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function NavSidebar({ user }: NavSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-6 h-6" />
          <div>
            <p className="font-medium">{user.name || 'User'}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 pt-6 border-t border-border">
          {user.tier === 'free' && (
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:underline"
            >
              Upgrade to Pro
            </Link>
          )}
          
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:underline w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
} 