'use client';

import { Menu, Moon, Sun, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationCenter } from '@/components/notification-center';
import { useNotifications } from '@/hooks/use-notifications';
import { useSidebar } from '@/contexts/sidebar-context';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/payments': 'Payments',
  '/cards': 'Cards',
  '/transactions': 'Transactions',
  '/taxes': 'Taxes',
  '/users': 'Users',
  '/settings': 'Settings',
  '/profile': 'Profile',
};

export function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { isCollapsed, setIsMobileOpen } = useSidebar();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
    addNotification,
  } = useNotifications();

  // Simulate incoming notifications
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification(
        'success',
        'Payment Processed',
        'Payment to Acme Corporation has been successfully completed.'
      );
    }, 3000);

    return () => clearTimeout(timer);
  }, [addNotification]);

  return (
    <header
      className={cn(
        'fixed z-30 flex h-20 items-center justify-between px-4 transition-all duration-300 md:px-8 md:top-0 left-0 right-0 top-0 md:left-auto',
        isCollapsed ? 'md:w-[calc(100%-6rem)]' : 'md:w-[calc(100%-18.5rem)]'
      )}
    >
      <div className="flex items-center min-w-0 gap-2.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Open navigation menu"
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden flex border border-border/50 rounded-full shrink-0"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground tracking-tight">
          {pageTitles[pathname] ?? 'FinPay'}
        </h1>
      </div>

      <div className="flex items-center shrink-0 gap-3 bg-secondary/40 rounded-full p-1.5 border border-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-1 bg-background/50 rounded-full p-1">
          <button
            type="button"
            aria-label="Switch to dark mode"
            disabled={!isMounted}
            onClick={() => setTheme('dark')}
            className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors [&_svg]:w-4 [&_svg]:h-4", isMounted && resolvedTheme === 'dark' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            <Moon />
          </button>
          <button
            type="button"
            aria-label="Switch to light mode"
            disabled={!isMounted}
            onClick={() => setTheme('light')}
            className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors [&_svg]:w-4 [&_svg]:h-4", isMounted && resolvedTheme === 'light' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            <Sun />
          </button>
        </div>

        <Link href="/settings" className="w-9 h-9 rounded-full flex items-center justify-center bg-background/50 text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors [&_svg]:w-4 [&_svg]:h-4">
          <Settings />
        </Link>
        
        <div className="relative">
          <NotificationCenter
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onClear={clearNotification}
            onClearAll={clearAll}
          />
        </div>

        <Link
          href="/profile"
          aria-label="Open profile"
          className="ml-1 w-9 h-9 rounded-full overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-colors"
        >
          {/* Default placeholder avatar */}
          <div className="w-full h-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-primary-foreground font-semibold text-xs">
            JD
          </div>
        </Link>
      </div>
    </header>
  );
}
