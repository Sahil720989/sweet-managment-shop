import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Candy, Sparkles, ShoppingBag, Shield, ArrowRight } from 'lucide-react';

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-sweet-pink/10 blur-3xl" />
        </div>

        <div className="container flex min-h-screen flex-col items-center justify-center py-16 text-center">
          {/* Logo */}
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-accent shadow-golden animate-fade-in">
            <Candy className="h-12 w-12 text-accent-foreground" />
          </div>

          {/* Headline */}
          <h1 className="mb-6 font-display text-5xl font-bold leading-tight text-foreground animate-slide-up sm:text-6xl md:text-7xl">
            Sweet Haven
          </h1>
          <p className="mb-4 max-w-2xl text-xl text-muted-foreground animate-slide-up [animation-delay:100ms] sm:text-2xl">
            Artisan confectionery crafted with love
          </p>
          <p className="mb-12 max-w-xl text-muted-foreground animate-slide-up [animation-delay:200ms]">
            Discover our handcrafted sweets, from rich chocolates to delicate pastries.
            A treat for every occasion.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 animate-slide-up [animation-delay:300ms] sm:flex-row">
            {user ? (
              <Link to="/dashboard">
                <Button variant="hero" size="lg">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse Shop
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="hero" size="lg">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Features */}
          <div className="mt-24 grid w-full max-w-4xl gap-8 animate-slide-up [animation-delay:400ms] sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-medium">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                Premium Quality
              </h3>
              <p className="text-sm text-muted-foreground">
                Only the finest ingredients in every handcrafted treat
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-medium">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sweet-pink/20">
                <ShoppingBag className="h-6 w-6 text-sweet-pink" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                Easy Shopping
              </h3>
              <p className="text-sm text-muted-foreground">
                Browse, filter, and purchase your favorites instantly
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-medium">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sweet-mint/20">
                <Shield className="h-6 w-6 text-sweet-mint" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                Secure & Fast
              </h3>
              <p className="text-sm text-muted-foreground">
                Protected transactions with real-time inventory
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Candy className="h-5 w-5 text-accent" />
            <span className="font-display text-lg font-semibold">Sweet Haven</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Sweet Haven. Made with love for the Incubyte TDD Kata.
          </p>
        </div>
      </footer>
    </div>
  );
}
