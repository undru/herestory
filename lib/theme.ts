import { Platform } from 'react-native';
import { useUniwind } from 'uniwind';

/**
 * Raw color values for props that React Native must parse itself
 * (navigation, status bar, SVG, icon and gradient colors). The Uniwind tokens
 * in global.css hold the same values for className usage.
 */
export interface Palette {
  /** App canvas and primary surface. */
  paper: string;
  /** Quiet page or secondary surface. */
  stone: string;
  /** Assistant / conversation bubble fill. */
  bubble: string;
  ink: string;
  inkSoft: string;
  inkFaint: string;
  hairline: string;
  lineFirm: string;
  /** Cobalt for icons, links, focus and selected states. */
  brand: string;
  brandSoft: string;
  /** Text and icons on the brand gradient. */
  onBrand: string;
  /** Horizontal cobalt-to-magenta gradient for primary emphasis only. */
  gradient: readonly [string, string];
}

export const LIGHT: Palette = {
  paper: '#FFFFFF',
  stone: '#FAF9FF',
  bubble: '#F5F4FA',
  ink: '#202126',
  inkSoft: '#6F7180',
  inkFaint: '#737584',
  hairline: '#D9DAE5',
  lineFirm: '#C8CADA',
  brand: '#3557FF',
  brandSoft: '#ECEFFF',
  onBrand: '#FFFFFF',
  gradient: ['#3557FF', '#DD32CF'],
};

export const DARK: Palette = {
  paper: '#16161B',
  stone: '#0F0F13',
  bubble: '#23232B',
  ink: '#EDEDF3',
  inkSoft: '#A7A9B8',
  inkFaint: '#9597A8',
  hairline: '#2D2E38',
  lineFirm: '#454759',
  brand: '#8C9EFF',
  brandSoft: '#262A4A',
  onBrand: '#FFFFFF',
  gradient: ['#3557FF', '#DD32CF'],
};

/** Start and end points for the horizontal brand gradient. */
export const GRADIENT_START = { x: 0, y: 0 } as const;
export const GRADIENT_END = { x: 1, y: 0 } as const;

/** Colors for the active light or dark theme. */
export function usePalette(): Palette {
  const { theme } = useUniwind();
  return theme === 'dark' ? DARK : LIGHT;
}

const webFallback = (stack: string, family: string) =>
  Platform.OS === 'web' ? `${family}, ${stack}` : family;

/** Inter, the app-wide typeface for headlines, quotes, body copy, chips and buttons. */
export const sans = {
  regular: webFallback('system-ui, sans-serif', 'Inter_400Regular'),
  medium: webFallback('system-ui, sans-serif', 'Inter_500Medium'),
  semibold: webFallback('system-ui, sans-serif', 'Inter_600SemiBold'),
  bold: webFallback('system-ui, sans-serif', 'Inter_700Bold'),
} as const;
