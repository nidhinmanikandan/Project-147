import { StyleSheet, Text, type TextProps } from "react-native";

import { colors, typography } from "@/constants/theme";

export function MutedText({ style, ...props }: TextProps) {
  return <Text {...props} style={[styles.text, style]} />;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: typography.body.fontFamily,
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: typography.body.fontWeight,
  },
});
