import { Pressable, StyleSheet, Text } from "react-native";

import {
  colors,
  hardShadow,
  radius,
  Spacing,
  typography,
} from "@/constants/theme";

type BaseButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "default" | "yellow" | "black";
};

export function BaseButton({
  title,
  onPress,
  disabled = false,
  variant = "default",
}: BaseButtonProps) {
  const isBlackVariant = variant === "black";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "yellow" && styles.yellowButton,
        isBlackVariant && styles.blackButton,
        pressed && styles.pressedButton,
        disabled && styles.disabledButton,
      ]}
    >
      <Text style={[styles.label, isBlackVariant && styles.blackLabel]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    ...hardShadow,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: Spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  yellowButton: {
    backgroundColor: colors.yellow,
  },
  blackButton: {
    backgroundColor: colors.text,
  },
  pressedButton: {
    opacity: 0.72,
  },
  disabledButton: {
    opacity: 0.45,
  },
  label: {
    fontFamily: typography.label.fontFamily,
    color: colors.text,
    fontSize: 15,
    fontWeight: typography.label.fontWeight,
  },
  blackLabel: {
    color: colors.surface,
  },
});
