import "@/global.css";

import { Platform } from "react-native";

export const colors = {
  background: "#F7F6F0",
  surface: "#FFFFFF",
  text: "#000000",
  mutedText: "#777777",
  border: "#000000",
  yellow: "#FFC700",
  electricGreen: "#39D353",
  lime: "#B7F000",
  pastelYellow: "#FFD86B",
  pink: "#FF5C8A",
  purple: "#9B7BFF",
  grey: "#BDBDBD",
} as const;

export const Colors = {
  light: {
    text: colors.text,
    background: colors.background,
    backgroundElement: colors.surface,
    backgroundSelected: colors.grey,
    textSecondary: colors.mutedText,
  },
  dark: {
    text: colors.text,
    background: colors.background,
    backgroundElement: colors.surface,
    backgroundSelected: colors.grey,
    textSecondary: colors.mutedText,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "Poppins_400Regular",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "Poppins_400Regular",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "Poppins_400Regular",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
} as const;

export const borderWidths = {
  default: 2,
  strong: 3,
} as const;

export const typography = {
  heading: {
    fontFamily: "Poppins_800ExtraBold",
    fontWeight: "normal" as const,
    lineHeight: 1.05,
  },
  body: {
    fontFamily: "Poppins_400Regular",
    fontWeight: "normal" as const,
  },
  label: {
    fontFamily: "Poppins_700Bold",
    fontWeight: "normal" as const,
  },
} as const;

export const hardShadow = {
  shadowColor: colors.border,
  shadowOffset: { width: 3, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  boxShadow: [
    {
      offsetX: 3,
      offsetY: 4,
      blurRadius: 0,
      color: colors.border,
    },
  ],
  elevation: 0,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
