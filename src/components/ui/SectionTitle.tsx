import { StyleSheet, Text, type TextProps } from "react-native";

import { colors, typography } from "@/constants/theme";

export function SectionTitle({ style, ...props }: TextProps) {
  return <Text {...props} style={[styles.title, style]} />;
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: typography.label.fontWeight,
    lineHeight: 22,
  },
});
