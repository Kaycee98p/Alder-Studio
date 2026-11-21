import React, { useEffect, useState } from 'react';
import { ArrowUpRight, CheckCircle2, X } from 'lucide-react';

export type ActiveModal = 'work' | 'about' | 'contact' | 'ask' | null;

interface HeroModalsProps {
  activeModal: ActiveModal;
  onClose: () => void;
  onSwitchModal: (modal: ActiveModal) => void;
  heroImageSrc: string;
  profileImageSrc: string;
}

const INQUIRY_TOPICS = [
  'Product & Web',
  'Spatial & Brand',
  'Frontier Tech',
  'General Question',
] as const;

export const HeroModals: React.FC<HeroModalsProps> = ({
  activeModal,
  onClose,
  onSwitchModal,
  heroImageSrc,
  profileImageSrc,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<(typeof INQUIRY_TOPICS)[number]>('Product & Web');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const [mailtoUrl, setMailtoUrl] = useState('');

  useEffect(() => {
    if (!activeModal) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, onClose]);

  useEffect(() => {
    setError(null);
    setIsSubmitting(false);
    setSubmitted(false);
    setDelivered(false);
    setMailtoUrl('');
  }, [activeModal]);

  if (!activeModal) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (trimmedMessage.length < 8) {
      setError('Please share a brief note about what you are building or asking.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          topic,
          message: trimmedMessage,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || 'Could not send your message. Please try again.');
        return;
      }

      setDelivered(Boolean(data?.delivered));
      setMailtoUrl(
        typeof data?.mailtoUrl === 'string'
          ? data.mailtoUrl
          : `mailto:alderstudiosx@gmail.com?subject=${encodeURIComponent(
              `[Alder Inquiry · ${topic}] from ${trimmedName}`
            )}&body=${encodeURIComponent(trimmedMessage)}`
      );
      setSubmitted(true);
    } catch {
      setError('Network error while sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setMessage('');
    setError(null);
    setSubmitted(false);
    setDelivered(false);
    setMailtoUrl('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-2xl rounded-xl border border-black/10 bg-[#F7F7F5] p-6 text-[#111110] shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-5">
          <div>
            <p className="text-[13px] font-medium text-[#575752]">
              {activeModal === 'work' && 'Featured Work · 2026'}
              {activeModal === 'about' && 'Alder Studio · Overview'}
              {(activeModal === 'contact' || activeModal === 'ask') &&
                'Alder Studio · Direct Inquiry'}
            </p>
            <h2
              id="modal-heading"
              className="mt-1 font-display text-2xl font-medium tracking-[-0.025em] text-[#111110]"
            >
              {activeModal === 'work' && 'Orlō — Tribeca Fitness Studio'}
              {activeModal === 'about' && 'Design-led thinking meets frontier technology'}
              {activeModal === 'contact' && 'Get in touch with the studio'}
              {activeModal === 'ask' && 'Ask us about a project or idea'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black/10 text-[#111110] transition-colors duration-150 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {activeModal === 'work' && (
          <div className="mt-6 space-y-6">
            <div className="overflow-hidden rounded-lg border border-black/10 bg-[#E6E5E0]">
              <img
                src={heroImageSrc}
                alt="Desktop monitor on a wooden desk displaying the Orlō website with a sunlit Tribeca fitness studio"
                referrerPolicy="no-referrer"
                className="aspect-[16/10] w-full object-cover"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <p className="text-[15px] leading-[1.6] text-[#3F3F3B]">
                  For Orlō’s flagship space in Tribeca, we unified spatial architecture, brand
                  identity, and a real-time class booking web flagship into one cohesive calm
                  experience.
                </p>
              </div>
              <div className="space-y-2 border-t border-black/10 pt-4 text-[13px] text-[#575752] sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
                <div>Web Flagship</div>
                <div>Design System</div>
                <div>Booking Architecture</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-5">
              <span className="text-[13px] text-[#575752]">
                Client · Orlō Studio
              </span>
              <button
                type="button"
                onClick={() => onSwitchModal('ask')}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#1E40AF] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#1E3A8A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] whitespace-nowrap shrink-0"
              >
                Ask about a similar build
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {activeModal === 'about' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-12">
              <div className="overflow-hidden rounded-lg border border-black/10 bg-[#E6E5E0] sm:col-span-4">
                <img
                  src={profileImageSrc}
                  alt="Portrait of Onele Fortune, Founding Partner at Alder Studio"
                  referrerPolicy="no-referrer"
                  className="aspect-[3/4] w-full object-cover object-bottom"
                />
              </div>
              <div className="space-y-4 sm:col-span-8">
                <p className="text-[13px] font-medium text-[#575752]">
                  Onele Fortune · Founding Partner
                </p>
                <p className="text-[17px] leading-[1.6] text-[#111110]">
                  We&apos;re a design &amp; technology studio for the products, places, and
                  experiences people fall in love with.
                </p>
                <p className="text-[15px] leading-[1.65] text-[#4B4B46]">
                  We blend design-led thinking with frontier technologies to create experiences that
                  feel clear, useful, human, and impossible to ignore. From physical hospitality
                  and fitness flagships to AI-native software products, we work closely with
                  founders and brand leaders from first sketch to production launch.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 border-t border-black/10 pt-5 text-sm sm:grid-cols-3">
              <div>
                <div className="font-medium text-[#111110]">01. Brand &amp; Direction</div>
                <div className="mt-1 text-[13px] text-[#575752]">
                  Identity systems and editorial storytelling
                </div>
              </div>
              <div>
                <div className="font-medium text-[#111110]">02. Product &amp; Web</div>
                <div className="mt-1 text-[13px] text-[#575752]">
                  Flagship websites, commerce, and applications
                </div>
              </div>
              <div>
                <div className="font-medium text-[#111110]">03. Frontier Tech</div>
                <div className="mt-1 text-[13px] text-[#575752]">
                  Applied AI, spatial interfaces, and custom engineering
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-black/10 pt-5">
              <button
                type="button"
                onClick={() => onSwitchModal('ask')}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#1E40AF] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#1E3A8A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] whitespace-nowrap shrink-0"
              >
                Start a conversation
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {(activeModal === 'contact' || activeModal === 'ask') && (
          <div className="mt-6">
            {submitted ? (
              <div className="space-y-5 py-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#1E40AF]"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display text-lg font-medium text-[#111110]">
                      {delivered ? 'Message sent' : 'Ready to send to alderstudiosx@gmail.com'}
                    </h3>
                    <p className="mt-1 text-[15px] leading-[1.6] text-[#4B4B46]">
                      {delivered ? (
                        <>
                          Thank you, {name.trim()}. Your{' '}
                          <span className="font-medium text-[#111110]">{topic}</span> inquiry has
                          been delivered to{' '}
                          <span className="font-medium text-[#111110]">
                            alderstudiosx@gmail.com
                          </span>
                          , and we&apos;ll reply to{' '}
                          <span className="font-medium text-[#111110]">{email.trim()}</span>.
                        </>
                      ) : (
                        <>
                          Thank you, {name.trim()}. Your note is prepared for{' '}
                          <span className="font-medium text-[#111110]">
                            alderstudiosx@gmail.com
                          </span>
                          . Open your email client below to complete delivery directly.
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-black/10 pt-5">
                  {!delivered && mailtoUrl && (
                    <a
                      href={mailtoUrl}
                      className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#1E40AF] px-5 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#1E3A8A] whitespace-nowrap shrink-0"
                    >
                      Send via email app
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={resetForm}
                    className="min-h-[42px] rounded-lg border border-black/15 px-4 py-2 text-sm font-medium text-[#111110] transition-colors duration-150 hover:bg-black/5 whitespace-nowrap shrink-0"
                  >
                    Send another note
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="min-h-[42px] rounded-lg bg-[#111110] px-5 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-black/85 whitespace-nowrap shrink-0"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <span className="block text-[13px] font-medium text-[#4B4B46]">Topic</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {INQUIRY_TOPICS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setTopic(item)}
                        className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] ${
                          topic === item
                            ? 'bg-[#111110] text-white'
                            : 'border border-black/12 bg-white text-[#3F3F3B] hover:border-black/25 hover:text-[#111110]'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="studio-name"
                      className="block text-[13px] font-medium text-[#4B4B46]"
                    >
                      Name
                    </label>
                    <input
                      id="studio-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jordan Ellis"
                      className="mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-[15px] text-[#111110] placeholder:text-[#8A8A82] focus:border-[#1E40AF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="studio-email"
                      className="block text-[13px] font-medium text-[#4B4B46]"
                    >
                      Email
                    </label>
                    <input
                      id="studio-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jordan@company.com"
                      className="mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-[15px] text-[#111110] placeholder:text-[#8A8A82] focus:border-[#1E40AF] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="studio-message"
                    className="block text-[13px] font-medium text-[#4B4B46]"
                  >
                    {activeModal === 'ask' ? 'What would you like to ask?' : 'Project or message'}
                  </label>
                  <textarea
                    id="studio-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your brand, timeline, or question."
                    className="mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-[15px] text-[#111110] placeholder:text-[#8A8A82] focus:border-[#1E40AF] focus:outline-none"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-[13px] font-medium text-[#B91C1C]">
                    {error}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-5">
                  <a
                    href="mailto:alderstudiosx@gmail.com"
                    className="text-[13px] text-[#575752] underline decoration-black/20 underline-offset-4 transition-colors duration-150 hover:text-[#111110]"
                  >
                    alderstudiosx@gmail.com
                  </a>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#1E40AF] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#1E3A8A] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] whitespace-nowrap shrink-0"
                  >
                    {isSubmitting ? 'Sending...' : 'Send message'}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
