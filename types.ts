
export interface RenderStyle {
  id: string;
  name: string;
  description: string;
  prompt: string;
  previewUrl: string;
}

export interface RenderingState {
  sourceImage: string | null;
  resultImage: string | null;
  isLoading: boolean;
  error: string | null;
  selectedStyle: string;
  granularity: number;
  patternMode: string;
}
