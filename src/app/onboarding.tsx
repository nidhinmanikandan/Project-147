import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { BaseButton } from "@/components/ui/BaseButton";
import {
  borderWidths,
  colors,
  radius,
  Spacing,
  typography,
} from "@/constants/theme";
import { saveUserName } from "@/services/learningStorage";

export default function OnboardingScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit() {
    if (!name.trim() || isSaving) {
      return;
    }

    setIsSaving(true);
    const saved = await saveUserName(name);

    if (saved) {
      router.replace("/(tabs)");
      return;
    }

    setIsSaving(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>LET&apos;S MAKE LEARNING STICK.</Text>
        <Text style={styles.question}>What should we call you?</Text>
        <TextInput
          autoCapitalize="words"
          autoFocus
          onChangeText={setName}
          onSubmitEditing={handleSubmit}
          placeholder="Your name"
          placeholderTextColor={colors.mutedText}
          returnKeyType="go"
          style={styles.input}
          value={name}
        />
        <BaseButton
          disabled={!name.trim() || isSaving}
          onPress={handleSubmit}
          title="LET'S GO"
          variant="yellow"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingTop: 120,
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    padding: Spacing.lg,
  },
  title: {
    maxWidth: 560,
    marginBottom: Spacing.xxxl,
    color: colors.text,
    fontFamily: typography.heading.fontFamily,
    fontSize: 40,
    fontWeight: typography.heading.fontWeight,
    lineHeight: 44,
  },
  question: {
    marginBottom: Spacing.sm,
    color: colors.text,
    fontFamily: typography.label.fontFamily,
    fontSize: 17,
    fontWeight: typography.label.fontWeight,
  },
  input: {
    minHeight: 56,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderWidth: borderWidths.default,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    color: colors.text,
    fontFamily: typography.body.fontFamily,
    fontSize: 17,
    shadowColor: colors.border,
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
});
