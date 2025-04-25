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
    <nav className="bg-[#111] border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-[#2ecc71]">
            PropInfera
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-[#2ecc71]'
                  : 'text-gray-400 hover:text-[#2ecc71]'
              }`}
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className={`text-sm font-medium transition-colors ${
                isActive('/pricing')
                  ? 'text-[#2ecc71]'
                  : 'text-gray-400 hover:text-[#2ecc71]'
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'text-[#2ecc71]'
                  : 'text-gray-400 hover:text-[#2ecc71]'
              }`}
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-400 hover:text-[#2ecc71]"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
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
                    ? 'text-[#2ecc71]'
                    : 'text-gray-400 hover:text-[#2ecc71]'
                }`}
              >
                Home
              </Link>
              <Link
                href="/pricing"
                className={`text-sm font-medium transition-colors ${
                  isActive('/pricing')
                    ? 'text-[#2ecc71]'
                    : 'text-gray-400 hover:text-[#2ecc71]'
                }`}
              >
                Pricing
              </Link>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'text-[#2ecc71]'
                    : 'text-gray-400 hover:text-[#2ecc71]'
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