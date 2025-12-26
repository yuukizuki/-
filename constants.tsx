
import { RenderStyle } from './types';

export const RENDER_STYLES: RenderStyle[] = [
  {
    id: 'planning-aerial',
    name: 'Planning Aerial View',
    description: 'Professional urban design look with clean masses, clear hierarchy, and bird-eye perspective.',
    prompt: 'Generate a professional urban planning aerial rendering from a bird-eye perspective. Use a clean architectural aesthetic with stylized building volumes in off-white or light gray. Clearly define road hierarchies, pedestrian zones, and lush integrated green spaces. The lighting should be soft and even, highlighting the urban structure and masterplan organization in a high-end presentation style.',
    previewUrl: 'https://images.unsplash.com/photo-1541888941259-79273ceb0c2a?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 'modern-photoreal',
    name: 'Modern Photorealistic',
    description: 'Crisp glass towers, asphalt roads, and realistic daylight.',
    prompt: 'Transform this city fabric into a high-end photorealistic 3D architectural rendering. Use modern materials like glass, steel, and concrete. High-quality daylight lighting, realistic shadows, and lush urban greenery.',
    previewUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=400&h=300'
  }
];

export const PATTERN_MODES = [
  { id: 'natural', name: 'Natural / Organic', description: 'Fluid, varied textures that avoid obvious tiling.' },
  { id: 'geometric', name: 'Geometric / Grid', description: 'Structured, repeating patterns aligned to urban grids.' },
  { id: 'chaotic', name: 'Complex / Dense', description: 'Intricate, high-frequency details with overlapping layers.' },
  { id: 'abstract', name: 'Minimalist / Abstract', description: 'Large, clean surfaces with minimal repeating motifs.' }
];
