export interface WorkProject {
  id: string;
  title: string;
  category: string;
  description: string;
  year: string;
  imageSrc: string;
  imageAlt: string;
  liveUrl?: string;
  modalType?: 'work';
  featured?: boolean;
}

export const WORK_PROJECTS: WorkProject[] = [
  {
    id: 'alder-ring-5',
    title: 'Alder Ring 5 — Interactive 3D E-Commerce Storefront',
    category: 'E-Commerce · 3D WebGL & Product Design',
    description:
      'Scroll-choreographed Three.js product showcase with mechanical cutaway reveal, live finish switching, health sensing tabs, and cart drawer.',
    year: '2026',
    imageSrc: '/src/assets/images/work_alder_ring_5_1795280104626.jpg',
    imageAlt:
      'Precision-machined brushed titanium Alder Ring 5 resting on a sunlit travertine stone plinth',
    liveUrl: 'https://alder-studio-1.ai.studio',
    featured: true,
  },
  {
    id: 'orlo-tribeca',
    title: 'Orlō — Tribeca Fitness Studio',
    category: 'Hospitality · Digital Flagship & Brand System',
    description:
      'Unified spatial architecture, brand identity, and real-time class booking flagship designed to feel calm, tactile, and effortless.',
    year: '2026',
    imageSrc: '/src/assets/images/hero_orlo_studio_monitor_1795273714669.jpg',
    imageAlt:
      'Desktop monitor on a wooden desk displaying the Orlō website with a sunlit Tribeca fitness studio',
    modalType: 'work',
    featured: false,
  },
];
