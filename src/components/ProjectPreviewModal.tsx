import React, { useEffect, useState } from 'react';
import { ExternalLink, Monitor, Smartphone, X } from 'lucide-react';
import { WorkProject } from '../data/projects';

interface ProjectPreviewModalProps {
  project: WorkProject | null;
  onClose: () => void;
}

export const ProjectPreviewModal: React.FC<ProjectPreviewModalProps> = ({
  project,
  onClose,
}) => {
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!project) return;
    setIsLoaded(false);
    setViewportMode('desktop');

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project || !project.liveUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 backdrop-blur-[2px] sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-black/15 bg-[#F7F7F5] text-[#111110] shadow-2xl">
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium text-[#575752]">
              {project.category}
            </p>
            <h2
              id="preview-modal-title"
              className="mt-0.5 truncate font-display text-lg font-medium tracking-[-0.02em] text-[#111110] sm:text-xl"
            >
              {project.title}
            </h2>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Viewport Switcher */}
            <div className="hidden items-center gap-1 rounded-lg border border-black/10 bg-white p-1 sm:flex">
              <button
                type="button"
                onClick={() => setViewportMode('desktop')}
                aria-label="Desktop preview width"
                aria-pressed={viewportMode === 'desktop'}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  viewportMode === 'desktop'
                    ? 'bg-[#111110] text-white'
                    : 'text-[#575752] hover:text-[#111110]'
                }`}
              >
                <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setViewportMode('mobile')}
                aria-label="Mobile preview width"
                aria-pressed={viewportMode === 'mobile'}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  viewportMode === 'mobile'
                    ? 'bg-[#111110] text-white'
                    : 'text-[#575752] hover:text-[#111110]'
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
                Mobile
              </button>
            </div>

            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#1E40AF] px-4 py-2 text-[13px] font-medium text-white transition-colors duration-150 hover:bg-[#1E3A8A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] whitespace-nowrap shrink-0"
            >
              Open in new tab
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close live preview"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white text-[#111110] transition-colors duration-150 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Interactive Iframe Stage */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#EAEAE6] p-3 sm:p-5">
          {!isLoaded && (
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[#EAEAE6]">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/15 border-t-[#1E40AF]" />
              <p className="text-[13px] font-medium text-[#575752]">
                Loading interactive storefront...
              </p>
            </div>
          )}

          <div
            className={`h-full overflow-hidden rounded-lg border border-black/12 bg-white shadow-lg transition-[width] duration-200 ${
              viewportMode === 'mobile' ? 'w-full max-w-[390px]' : 'w-full'
            }`}
          >
            <iframe
              src={project.liveUrl}
              title={project.title}
              onLoad={() => setIsLoaded(true)}
              referrerPolicy="no-referrer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="h-full w-full border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
