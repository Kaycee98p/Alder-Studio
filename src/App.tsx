/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowUpRight, Menu, User, X } from 'lucide-react';
import { ActiveModal, HeroModals } from './components/HeroModals';
import { ProjectPreviewModal } from './components/ProjectPreviewModal';
import { WorkSection } from './components/WorkSection';
import { WorkProject } from './data/projects';

const HERO_IMAGE_SRC = '/src/assets/images/hero_orlo_studio_monitor_1795273714669.jpg';
const HERO_PROFILE_SRC = '/assets/aistudio/IMG_1266_6586d4b8.jpg';

type NavKey = 'Home' | 'Work' | 'About' | 'Contact';

const NAV_ITEMS: { label: NavKey; modal: ActiveModal }[] = [
  { label: 'Home', modal: null },
  { label: 'Work', modal: null },
  { label: 'About', modal: 'about' },
  { label: 'Contact', modal: 'contact' },
];

export default function App() {
  const [activeNav, setActiveNav] = useState<NavKey>('Home');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [previewProject, setPreviewProject] = useState<WorkProject | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileError, setProfileError] = useState(false);

  const handleNavSelect = (item: { label: NavKey; modal: ActiveModal }) => {
    setActiveNav(item.label);
    setMobileMenuOpen(false);

    if (item.label === 'Work') {
      setActiveModal(null);
      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (item.label === 'Home') {
      setActiveModal(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveModal(item.modal);
  };

  const handleOpenAsk = () => {
    setActiveModal('ask');
    setMobileMenuOpen(false);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setActiveNav('Home');
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#111110]">
      {/* Top Bar: strict 3-zone contract */}
      <header className="mx-auto flex h-[76px] max-w-[1340px] items-center justify-between gap-8 px-6 md:px-10">
        {/* Zone 1: Single-line brand wordmark */}
        <a
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            handleNavSelect({ label: 'Home', modal: null });
          }}
          className="font-display text-xl font-semibold tracking-[-0.03em] text-[#111110] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E40AF]"
        >
          Alder
        </a>

        {/* Zone 2: 4 clean single-line text nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-8 md:flex"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavSelect(item)}
                className={`relative py-2 text-[14px] font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E40AF] ${
                  isActive
                    ? 'text-[#111110]'
                    : 'text-[#575752] hover:text-[#111110]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute right-0 bottom-0.5 left-0 h-[1.5px] bg-[#111110] transition-transform duration-150 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + mobile menu button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleOpenAsk}
            className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-[#111110] px-5 py-2 text-[14px] font-medium text-white transition-colors duration-150 hover:bg-[#292926] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] whitespace-nowrap shrink-0"
          >
            Ask
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/12 text-[#111110] transition-colors duration-150 hover:bg-black/5 md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-y border-black/10 bg-[#F7F7F5] px-6 py-4 md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavSelect(item)}
                className={`flex min-h-[44px] items-center justify-between rounded-lg px-3 text-left text-[15px] font-medium transition-colors duration-150 ${
                  activeNav === item.label
                    ? 'bg-black/5 text-[#111110]'
                    : 'text-[#575752] hover:text-[#111110]'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main id="top">
        <div className="mx-auto max-w-[1340px] px-6 pt-4 pb-10 md:px-10 md:pt-6 md:pb-14">
          <section
            aria-labelledby="hero-headline"
            className="grid grid-cols-1 items-stretch gap-8 md:min-h-[calc(100vh-116px)] md:grid-cols-12 lg:gap-12"
          >
            {/* Left Typographic Column */}
            <div className="flex flex-col justify-between gap-8 py-1 md:col-span-6 md:py-2">
              <div className="space-y-6">
                <p className="text-[13px] font-medium tracking-[0.01em] text-[#575752]">
                  Design &amp; Technology Studio
                </p>

                <h1
                  id="hero-headline"
                  className="font-display text-[clamp(2.35rem,3.8vw,3.75rem)] font-medium leading-[1.06] tracking-[-0.032em] text-[#111110] text-balance"
                >
                  Building the experiences that move brands forward.
                </h1>

                <p className="max-w-[44ch] text-[17px] leading-[1.6] text-[#4B4B46]">
                  We&apos;re a design &amp; technology studio for the products, places, and
                  experiences people fall in love with
                </p>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleOpenAsk}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#1E40AF] px-6 py-2.5 text-[15px] font-medium text-white transition-colors duration-150 hover:bg-[#1E3A8A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] whitespace-nowrap shrink-0"
                  >
                    Start a conversation
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Grounded Editorial Thesis */}
              <div className="border-t border-black/10 pt-6">
                <p className="max-w-[46ch] text-[15px] leading-[1.65] text-[#4B4B46]">
                  We blend design-led thinking with frontier technologies to create experiences that
                  feel clear, useful, human, and impossible to ignore.
                </p>
              </div>
            </div>

            {/* Right Side-by-Side Hero Portrait Column */}
            <div className="flex md:col-span-6">
              <figure className="relative flex min-h-[420px] w-full flex-col justify-end overflow-hidden rounded-xl border border-black/10 bg-[#E6E5E0] sm:min-h-[500px] md:h-full md:min-h-[560px]">
                {!profileError ? (
                  <img
                    src={HERO_PROFILE_SRC}
                    alt="Portrait of Onele Fortune, Founding Partner at Alder Studio"
                    referrerPolicy="no-referrer"
                    onError={() => setProfileError(true)}
                    className="absolute inset-0 h-full w-full object-cover object-bottom"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#ECECE8] via-[#E1DFD8] to-[#D5D2C8] p-8 text-center">
                    <User className="h-10 w-10 text-[#575752]" aria-hidden="true" />
                    <p className="mt-4 max-w-md font-display text-xl font-medium text-[#111110]">
                      Onele Fortune
                    </p>
                    <p className="mt-1 max-w-md text-sm text-[#575752]">
                      Founding Partner · Alder Studio
                    </p>
                  </div>
                )}

                {/* Measured bottom contrast scrim for unboxed metadata */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/75 via-black/30 to-transparent"
                />

                <figcaption className="relative z-10 flex flex-wrap items-end justify-between gap-4 px-6 py-5 text-white">
                  <div>
                    <span className="block text-[14px] font-medium tracking-[-0.01em] text-white">
                      Onele Fortune · Founding Partner
                    </span>
                    <span className="mt-0.5 block text-[13px] text-white/80">
                      Alder Studio
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveNav('About');
                      setActiveModal('about');
                    }}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-white/15 px-3.5 py-1.5 text-[13px] font-medium text-white backdrop-blur-xs transition-colors duration-150 hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white whitespace-nowrap shrink-0"
                  >
                    Studio profile
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </figcaption>
              </figure>
            </div>
          </section>
        </div>

        <WorkSection
          onOpenPreview={(project) => setPreviewProject(project)}
          onOpenOrloCaseStudy={() => {
            setActiveNav('Work');
            setActiveModal('work');
          }}
        />
      </main>

      <footer className="mx-auto flex max-w-[1340px] flex-wrap items-center justify-between gap-4 border-t border-black/10 px-6 py-8 text-[13px] text-[#575752] md:px-10">
        <span>© {new Date().getFullYear()} Alder Studio</span>
        <a
          href="mailto:alderstudiosx@gmail.com"
          className="text-[#111110] underline decoration-black/20 underline-offset-4 transition-colors duration-150 hover:decoration-[#111110]"
        >
          alderstudiosx@gmail.com
        </a>
      </footer>

      <HeroModals
        activeModal={activeModal}
        onClose={handleCloseModal}
        onSwitchModal={(modal) => {
          setActiveModal(modal);
          if (modal === 'work') setActiveNav('Work');
          else if (modal === 'about') setActiveNav('About');
          else if (modal === 'contact') setActiveNav('Contact');
        }}
        heroImageSrc={HERO_IMAGE_SRC}
        profileImageSrc={HERO_PROFILE_SRC}
      />

      <ProjectPreviewModal
        project={previewProject}
        onClose={() => setPreviewProject(null)}
      />
    </div>
  );
}
