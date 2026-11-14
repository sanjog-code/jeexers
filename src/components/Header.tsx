import React from 'react';
import type { PageView } from '../types';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { BackpackIcon } from './BackpackIcon';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  cartCount: number;
  onOpenBag: () => void;
  theme: 'obsidian' | 'alabaster';
  onToggleTheme: () => void;
  bagAnimationState?: 'idle' | 'unzipping' | 'open' | 'zipping' | 'impact';
  bagIconRef?: React.RefObject<HTMLButtonElement | null>;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  onOpenBag,
  theme,
  onToggleTheme,
  bagAnimationState = 'idle',
  bagIconRef,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isOpen = bagAnimationState === 'unzipping' || bagAnimationState === 'open';

  const handleNav = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--bg-canvas)]/90 backdrop-blur-md border-b border-[var(--border-hairline)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex justify-between items-center">
        {/* Mobile Hamburger Menu Toggle */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* THE JEEXERS Stationary Wordmark with Crimson Red Specular Wave */}
        <button
          type="button"
          onClick={() => handleNav('store')}
          className="focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--border-focus)] rounded-lg py-1 px-1 sm:px-2 text-left"
          aria-label="THE JEEXERS - Return to Store"
        >
          <span className="font-logo text-2xl sm:text-3xl lg:text-[2.2rem] font-black uppercase tracking-[0.2em] leading-none text-[var(--text-primary)] logo-light-wave inline-block">
            THE JEEXERS
          </span>
        </button>

        {/* Dynamic Desktop Navigation Pages */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-10 text-xs tracking-[0.25em] uppercase font-mono">
          <button
            type="button"
            onClick={() => handleNav('store')}
            className={`transition-all duration-200 py-1.5 px-3 rounded-lg focus:outline-none nav-link-glow ${
              currentPage === 'store' || currentPage === 'detail'
                ? 'text-[var(--text-primary)] font-bold nav-underline-converge'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            STORE
          </button>
          <button
            type="button"
            onClick={() => handleNav('collections')}
            className={`transition-all duration-200 py-1.5 px-3 rounded-lg focus:outline-none nav-link-glow ${
              currentPage === 'collections'
                ? 'text-[var(--text-primary)] font-bold nav-underline-converge'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            COLLECTIONS
          </button>
          <button
            type="button"
            onClick={() => handleNav('bespoke')}
            className={`transition-all duration-200 py-1.5 px-3 rounded-lg focus:outline-none nav-link-glow ${
              currentPage === 'bespoke'
                ? 'text-[var(--text-primary)] font-bold nav-underline-converge'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            CUSTOM HOODIES
          </button>
          <button
            type="button"
            onClick={() => handleNav('studio')}
            className={`transition-all duration-200 py-1.5 px-3 rounded-lg focus:outline-none nav-link-glow ${
              currentPage === 'studio'
                ? 'text-[var(--text-primary)] font-bold nav-underline-converge'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            STUDIO
          </button>
        </nav>

        {/* Right Controls: Theme Toggle & Backpack Hero Icon with Red Dot Badge */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 sm:p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-full hover:bg-[var(--border-subtle)] focus:outline-none"
            aria-label={`Switch to ${theme === 'obsidian' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'obsidian' ? (
              <Sun className="w-4 h-4 transition-transform hover:rotate-90 duration-300" />
            ) : (
              <Moon className="w-4 h-4 transition-transform hover:-rotate-45 duration-300" />
            )}
          </button>

          {/* Hero Custom Backpack - Pure Icon with Red Counter Dot & Unzip Logic */}
          <button
            ref={bagIconRef}
            type="button"
            onClick={onOpenBag}
            className={`relative p-2 sm:p-2.5 rounded-full border border-transparent hover:border-[var(--border-hairline)] hover:bg-[var(--bg-surface)] transition-all duration-300 focus:outline-none ${
              isOpen
                ? 'animate-bag-unzip ring-2 ring-red-500 shadow-lg shadow-red-500/20'
                : bagAnimationState === 'impact'
                ? 'animate-bag-impact ring-2 ring-white shadow-xl shadow-red-600/40'
                : ''
            }`}
            aria-label={`View Shopping Backpack, ${cartCount} items`}
          >
            {/* Pure Architectural Backpack Hero Icon */}
            <BackpackIcon
              animationState={bagAnimationState}
              isUnzipped={isOpen}
              className="w-6 h-6 text-[var(--text-primary)]"
              theme={theme}
            />

            {/* Glowing Red Dot Badge with Product Count */}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-600/40 ring-2 ring-[var(--bg-canvas)] animate-scale-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-6 py-4 flex flex-col space-y-3 font-mono text-xs tracking-[0.2em] uppercase">
          <button
            type="button"
            onClick={() => handleNav('store')}
            className={`text-left py-2 ${
              currentPage === 'store' || currentPage === 'detail'
                ? 'text-[var(--text-primary)] font-bold'
                : 'text-[var(--text-secondary)]'
            }`}
          >
            STORE
          </button>
          <button
            type="button"
            onClick={() => handleNav('collections')}
            className={`text-left py-2 ${
              currentPage === 'collections'
                ? 'text-[var(--text-primary)] font-bold'
                : 'text-[var(--text-secondary)]'
            }`}
          >
            COLLECTIONS
          </button>
          <button
            type="button"
            onClick={() => handleNav('bespoke')}
            className={`text-left py-2 ${
              currentPage === 'bespoke'
                ? 'text-[var(--text-primary)] font-bold'
                : 'text-[var(--text-secondary)]'
            }`}
          >
            CUSTOM HOODIES
          </button>
          <button
            type="button"
            onClick={() => handleNav('studio')}
            className={`text-left py-2 ${
              currentPage === 'studio'
                ? 'text-[var(--text-primary)] font-bold'
                : 'text-[var(--text-secondary)]'
            }`}
          >
            STUDIO
          </button>
        </div>
      )}
    </header>
  );
};
