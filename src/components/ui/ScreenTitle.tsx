import { StyleSheet, Text, type TextProps } from "react-native";

import { colors, typography } from "@/constants/theme";

export function ScreenTitle({ style, ...props }: TextProps) {
  return <Text {...props} style={[styles.title, style]} />;
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: typography.heading.fontWeight,
    lineHeight: 34,
  },
});
