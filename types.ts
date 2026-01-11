export interface QuoteState {
  text: string;
  isLoading: boolean;
  error: string | null;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  decay: number;
}
