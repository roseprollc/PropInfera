'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary">
            PropInfera
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className={`text-sm font-medium transition-colors ${
                isActive('/pricing')
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-muted-foreground hover:text-primary"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Home
              </Link>
              <Link
                href="/pricing"
                className={`text-sm font-medium transition-colors ${
                  isActive('/pricing')
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Pricing
              </Link>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 