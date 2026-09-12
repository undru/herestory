import { Platform } from 'react-native';
import { useUniwind } from 'uniwind';

/**
 * Raw color values for props that React Native must parse itself
 * (navigation, status bar, SVG, icon colors). The Uniwind tokens in
 * global.css hold the same values for className usage.
 */
export interface Palette {
  paper: string;
  stone: string;
  ink: string;
  inkSoft: string;
  inkFaint: string;
  hairline: string;
  lineFirm: string;
  plum: string;
  plumSoft: string;
  moss: string;
  mossSoft: string;
}

export const LIGHT: Palette = {
  paper: '#FBFBFA',
  stone: '#E8EBEC',
  ink: '#1B2326',
  inkSoft: '#586366',
  inkFaint: '#8A9295',
  hairline: '#D6DADB',
  lineFirm: '#B9BFC1',
  plum: '#6E3B52',
  plumSoft: '#EFE3E8',
  moss: '#4A6355',
  mossSoft: '#E1E9E4',
};

export const DARK: Palette = {
  paper: '#1D2427',
  stone: '#14191B',
  ink: '#E7EBEC',
  inkSoft: '#A3ADB0',
  inkFaint: '#798386',
  hairline: '#2C3538',
  lineFirm: '#414C50',
  plum: '#E0AFC2',
  plumSoft: '#3A2430',
  moss: '#A8C6B4',
  mossSoft: '#243329',
};

/** Colors for the active light or dark theme. */
export function usePalette(): Palette {
  const { theme } = useUniwind();
  return theme === 'dark' ? DARK : LIGHT;
}

const webFallback = (stack: string, family: string) =>
  Platform.OS === 'web' ? `${family}, ${stack}` : family;

/** Editorial serif (Newsreader, light) for headlines, quotes and moment cards. */
export const serif = {
  light: webFallback('Georgia, serif', 'Newsreader_300Light'),
  lightItalic: webFallback('Georgia, serif', 'Newsreader_300Light_Italic'),
  regular: webFallback('Georgia, serif', 'Newsreader_400Regular'),
} as const;

/** Clean sans (Inter) for body copy, labels and buttons. */
export const sans = {
  regular: webFallback('system-ui, sans-serif', 'Inter_400Regular'),
  medium: webFallback('system-ui, sans-serif', 'Inter_500Medium'),
  semibold: webFallback('system-ui, sans-serif', 'Inter_600SemiBold'),
  bold: webFallback('system-ui, sans-serif', 'Inter_700Bold'),
} as const;
