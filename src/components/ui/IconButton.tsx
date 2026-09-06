import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet } from "react-native";

import { colors, hardShadow, radius } from "@/constants/theme";

type IconButtonProps = {
  onPress: () => void;
  icon: SymbolViewProps["name"];
  accessibilityLabel: string;
  disabled?: boolean;
};

export function IconButton({
  onPress,
  icon,
  accessibilityLabel,
  disabled = false,
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressedButton,
        disabled && styles.disabledButton,
      ]}
    >
      <SymbolView name={icon} size={20} weight="bold" tintColor={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    ...hardShadow,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  pressedButton: {
    opacity: 0.72,
  },
  disabledButton: {
    opacity: 0.45,
  },
});
