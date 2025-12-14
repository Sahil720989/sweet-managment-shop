import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Candy, LogOut, User, Shield } from 'lucide-react';

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
            <Candy className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">
            Sweet Shop
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button
                  variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}
                  size="sm"
                >
                  Dashboard
                </Button>
              </Link>
              <Link to="/order-history">
                <Button
                  variant={location.pathname === '/order-history' ? 'default' : 'ghost'}
                  size="sm"
                >
                  Order History
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button
                    variant={location.pathname === '/admin' ? 'default' : 'ghost'}
                    size="sm"
                  >
                    <Shield className="mr-1 h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {user.email?.split('@')[0]}
                </span>
                {isAdmin && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                    Admin
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
