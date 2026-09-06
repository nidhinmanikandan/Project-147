import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { ScreenTitle } from "@/components/ui/ScreenTitle";
import {
  borderWidths,
  colors,
  hardShadow,
  radius,
  Spacing,
  typography,
} from "@/constants/theme";

type AddLearningFormProps = {
  topic: string;
  category: string;
  onTopicChange: (topic: string) => void;
  onCategoryChange: (category: string) => void;
  onSubmit: () => void;
};

export function AddLearningForm({
  topic,
  category,
  onTopicChange,
  onCategoryChange,
  onSubmit,
}: AddLearningFormProps) {
  return (
    <View style={styles.form}>
      <ScreenTitle>What did you learn?</ScreenTitle>

      <View style={styles.field}>
        <Text style={styles.prefix}>#</Text>
        <TextInput
          accessibilityLabel="Topic"
          placeholder="Topic"
          placeholderTextColor={colors.mutedText}
          returnKeyType="next"
          style={styles.input}
          value={topic}
          onChangeText={onTopicChange}
        />
      </View>

      <View style={styles.field}>
        <TextInput
          accessibilityLabel="Category"
          placeholder="Category"
          placeholderTextColor={colors.mutedText}
          style={styles.input}
          value={category}
          onChangeText={onCategoryChange}
        />
        <Text accessibilityElementsHidden style={styles.chevron}>
          ▼
        </Text>
      </View>

      <Pressable
        accessibilityLabel="Add learning"
        accessibilityRole="button"
        onPress={onSubmit}
        style={({ pressed }) => [
          styles.submitButton,
          pressed && styles.pressedButton,
        ]}
      >
        <Text style={styles.plus}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.md,
  },
  field: {
    ...hardShadow,
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: borderWidths.default,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: Spacing.lg,
  },
  prefix: {
    fontFamily: typography.label.fontFamily,
    color: colors.text,
    fontSize: 18,
    fontWeight: typography.label.fontWeight,
    marginRight: Spacing.sm,
  },
  input: {
    fontFamily: typography.body.fontFamily,
    flex: 1,
    minHeight: 48,
    color: colors.text,
    fontSize: 16,
    fontWeight: typography.body.fontWeight,
    paddingVertical: 0,
  },
  chevron: {
    fontFamily: typography.label.fontFamily,
    color: colors.text,
    fontSize: 14,
    fontWeight: typography.label.fontWeight,
    marginLeft: Spacing.sm,
  },
  submitButton: {
    ...hardShadow,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    borderWidth: borderWidths.default,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.yellow,
  },
  pressedButton: {
    opacity: 0.72,
  },
  plus: {
    fontFamily: typography.heading.fontFamily,
    color: colors.text,
    fontSize: 28,
    fontWeight: typography.heading.fontWeight,
    lineHeight: 30,
  },
});
