import React, { useState } from 'react';
import { ArrowUpRight, Eye, Layers } from 'lucide-react';
import { WORK_PROJECTS, WorkProject } from '../data/projects';

interface WorkSectionProps {
  onOpenPreview: (project: WorkProject) => void;
  onOpenOrloCaseStudy: () => void;
}

export const WorkSection: React.FC<WorkSectionProps> = ({
  onOpenPreview,
  onOpenOrloCaseStudy,
}) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const markFailed = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section
      id="work"
      aria-labelledby="my-work-heading"
      className="mx-auto max-w-[1340px] border-t border-black/10 px-6 py-16 md:px-10 md:py-24"
    >
      <div className="flex flex-col justify-between gap-4 pb-10 md:flex-row md:items-end">
        <div>
          <p className="text-[13px] font-medium text-[#575752]">Selected Projects</p>
          <h2
            id="my-work-heading"
            className="mt-1.5 font-display text-[clamp(1.85rem,2.8vw,2.65rem)] font-medium leading-[1.1] tracking-[-0.03em] text-[#111110]"
          >
            My Work
          </h2>
        </div>

        <p className="max-w-[42ch] text-[15px] leading-[1.6] text-[#4B4B46]">
          Interactive storefronts, spatial interfaces, and digital flagships crafted from concept
          through production engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        {WORK_PROJECTS.map((project) => {
          const isFeatured = Boolean(project.featured);
          const hasFailed = Boolean(failedImages[project.id]);

          return (
            <article
              key={project.id}
              className={`group flex flex-col justify-between overflow-hidden rounded-xl border border-black/10 bg-white transition-colors duration-150 hover:border-black/20 ${
                isFeatured ? 'lg:col-span-7' : 'lg:col-span-5'
              }`}
            >
              <div>
                <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-black/10 bg-[#ECECE8]">
                  {!hasFailed ? (
                    <img
                      src={project.imageSrc}
                      alt={project.imageAlt}
                      referrerPolicy="no-referrer"
                      onError={() => markFailed(project.id)}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#ECECE8] via-[#E1DFD8] to-[#D5D2C8] p-6 text-center">
                      <Layers className="h-8 w-8 text-[#575752]" aria-hidden="true" />
                      <p className="mt-3 font-display text-lg font-medium text-[#111110]">
                        {project.title}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-6 sm:p-7">
                  <p className="text-[13px] font-medium text-[#575752]">
                    {project.category}
                  </p>

                  <h3 className="font-display text-xl font-medium leading-[1.2] tracking-[-0.02em] text-[#111110] sm:text-2xl text-balance">
                    {project.title}
                  </h3>

                  <p className="text-[15px] leading-[1.6] text-[#4B4B46]">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/10 px-6 py-4 sm:px-7">
                {project.liveUrl ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onOpenPreview(project)}
                      className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#1E40AF] px-4 py-2 text-[14px] font-medium text-white transition-colors duration-150 hover:bg-[#1E3A8A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] whitespace-nowrap shrink-0"
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                      Interactive preview
                    </button>

                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[42px] items-center gap-1.5 py-2 text-[14px] font-medium text-[#111110] underline decoration-black/25 underline-offset-4 transition-colors duration-150 hover:decoration-[#111110] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E40AF] whitespace-nowrap shrink-0"
                    >
                      Open in new tab
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenOrloCaseStudy}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-black/15 bg-white px-4 py-2 text-[14px] font-medium text-[#111110] transition-colors duration-150 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] whitespace-nowrap shrink-0"
                  >
                    Inspect case study
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
