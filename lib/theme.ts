import { Platform } from 'react-native';

/**
 * Raw color values for props that React Native must parse itself
 * (navigation, status bar, SVG, native color props). The Uniwind tokens in
 * global.css hold the same values for className usage.
 */
export const PAPER = '#FAF8F5';
export const PAPER_RAISED = '#FDFCFA';
export const INK = '#1A1A1A';
export const INK_SOFT = '#6E6862';
export const INK_FAINT = '#9A948C';
export const TERRACOTTA = '#C4643F';
export const TERRACOTTA_DEEP = '#A9502F';
export const TERRACOTTA_SOFT = '#F2E4DC';
export const HAIRLINE = '#E7E1D7';
export const STONE = '#EFEBE4';

const webFallback = (stack: string, family: string) =>
  Platform.OS === 'web' ? `${family}, ${stack}` : family;

/** Editorial serif (Lora) for headlines, quotes and moment cards. */
export const serif = {
  regular: webFallback('Georgia, serif', 'Lora_400Regular'),
  medium: webFallback('Georgia, serif', 'Lora_500Medium'),
  semibold: webFallback('Georgia, serif', 'Lora_600SemiBold'),
  italic: webFallback('Georgia, serif', 'Lora_400Regular_Italic'),
} as const;

/** Clean sans (Inter) for body copy, labels and buttons. */
export const sans = {
  regular: webFallback('system-ui, sans-serif', 'Inter_400Regular'),
  medium: webFallback('system-ui, sans-serif', 'Inter_500Medium'),
  semibold: webFallback('system-ui, sans-serif', 'Inter_600SemiBold'),
  bold: webFallback('system-ui, sans-serif', 'Inter_700Bold'),
} as const;
