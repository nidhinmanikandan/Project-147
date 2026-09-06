import { SymbolView, type SymbolViewProps } from "expo-symbols";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  borderWidths,
  colors,
  hardShadow,
  radius,
  Spacing,
  typography,
} from "@/constants/theme";

type FolderCardProps = {
  title: string;
  count: number | string;
  countLabel: string;
  icon: SymbolViewProps["name"];
  accentColor: string;
  onPress: () => void;
  badge?: ReactNode;
};

export function FolderCard({
  title,
  count,
  countLabel,
  icon,
  accentColor,
  onPress,
  badge,
}: FolderCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
    >
      <View
        pointerEvents="none"
        style={[styles.tab, { backgroundColor: accentColor }]}
      />

      <View style={styles.body}>
        <View style={styles.header}>
          <View
            style={[styles.iconContainer, { backgroundColor: accentColor }]}
          >
            <SymbolView
              name={icon}
              size={20}
              weight="bold"
              tintColor={colors.text}
            />
          </View>
          <Text style={styles.metadata}>
            {count} {countLabel}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>
          {badge ? <View style={styles.badge}>{badge}</View> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "relative",
    width: "100%",
    paddingTop: Spacing.sm,
  },
  tab: {
    position: "absolute",
    top: 0,
    left: Spacing.lg,
    zIndex: 0,
    width: 64,
    height: 16,
    borderWidth: borderWidths.default,
    borderBottomWidth: 0,
    borderColor: colors.border,
    borderTopLeftRadius: radius.sm,
    borderTopRightRadius: radius.sm,
  },
  body: {
    ...hardShadow,
    zIndex: 1,
    minHeight: 148,
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderWidth: borderWidths.default,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: borderWidths.default,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
  metadata: {
    flexShrink: 1,
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: typography.body.fontWeight,
    textAlign: "right",
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: typography.heading.fontWeight,
  },
  badge: {
    flexShrink: 0,
  },
  pressedCard: {
    opacity: 0.78,
  },
});
