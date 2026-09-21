import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { BaseButton } from "@/components/ui/BaseButton";
import { IconButton } from "@/components/ui/IconButton";
import { MutedText } from "@/components/ui/MutedText";
import { ScreenTitle } from "@/components/ui/ScreenTitle";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  borderWidths,
  colors,
  hardShadow,
  radius,
  Spacing,
  typography,
} from "@/constants/theme";
import {
  getLearningItems,
  updateLearningItem,
} from "@/services/learningStorage";
import type { LearningItem, SubTopic } from "@/types/learning";

function createSubTopicId() {
  return `st-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export default function EditLearningScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [originalItem, setOriginalItem] = useState<LearningItem | null>(null);
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("");
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  const [newSubTopicTitle, setNewSubTopicTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getLearningItems().then((items) => {
      const found = items.find((item) => item.id === id);
      if (found) {
        setOriginalItem(found);
        setTopic(found.topic);
        setCategory(found.category);
        const loadedSubTopics = Array.isArray(found.subTopics)
          ? found.subTopics.map((st, index) =>
              typeof st === "string"
                ? { id: `st-legacy-${index}`, title: st }
                : st,
            )
          : [];
        setSubTopics(loadedSubTopics);
      }
    });
  }, [id]);

  function handleAddSubTopic() {
    const trimmed = newSubTopicTitle.trim();
    if (!trimmed) {
      return;
    }
    const newSubTopic: SubTopic = {
      id: createSubTopicId(),
      title: trimmed,
    };
    setSubTopics((prev) => [...prev, newSubTopic]);
    setNewSubTopicTitle("");
  }

  function handleUpdateSubTopic(subId: string, updatedTitle: string) {
    setSubTopics((prev) =>
      prev.map((st) => (st.id === subId ? { ...st, title: updatedTitle } : st)),
    );
  }

  function handleDeleteSubTopic(subId: string) {
    setSubTopics((prev) => prev.filter((st) => st.id !== subId));
  }

  async function handleSave() {
    if (!originalItem) {
      return;
    }

    const trimmedTopic = topic.trim();
    const trimmedCategory = category.trim();

    if (!trimmedTopic || !trimmedCategory) {
      setErrorMessage("Topic and category are required.");
      return;
    }

    const updatedItem: LearningItem = {
      ...originalItem,
      topic: trimmedTopic,
      category: trimmedCategory,
      subTopics: subTopics
        .map((st) => ({ ...st, title: st.title.trim() }))
        .filter((st) => st.title.length > 0),
    };

    const saved = await updateLearningItem(updatedItem);
    if (!saved) {
      setErrorMessage("Failed to save changes. Please try again.");
      return;
    }

    router.back();
  }

  if (!originalItem) {
    return (
      <View style={styles.notFoundContainer}>
        <MutedText>Learning item not found.</MutedText>
        <BaseButton title="GO BACK" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <IconButton
            accessibilityLabel="Go back"
            icon={{
              ios: "chevron.left",
              android: "arrow_back",
              web: "arrow_back",
            }}
            onPress={() => router.back()}
          />
          <ScreenTitle style={styles.headerTitle}>EDIT LEARNING</ScreenTitle>
        </View>

        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <SectionTitle>TOPIC DETAILS</SectionTitle>
          <View style={styles.field}>
            <Text style={styles.prefix}>#</Text>
            <TextInput
              accessibilityLabel="Edit Topic"
              placeholder="Topic"
              placeholderTextColor={colors.mutedText}
              style={styles.input}
              value={topic}
              onChangeText={setTopic}
            />
          </View>

          <View style={styles.field}>
            <TextInput
              accessibilityLabel="Edit Category"
              placeholder="Category"
              placeholderTextColor={colors.mutedText}
              style={styles.input}
              value={category}
              onChangeText={setCategory}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>SUB-TOPICS & NOTES</SectionTitle>
          <MutedText style={styles.sectionHint}>
            Sub-topics are only visible inside edit/detail views and kept hidden
            from the main recent learning list.
          </MutedText>

          <View style={styles.addSubTopicRow}>
            <View style={[styles.field, styles.addSubTopicInputWrapper]}>
              <TextInput
                accessibilityLabel="New sub-topic title"
                placeholder="Add sub-topic or note..."
                placeholderTextColor={colors.mutedText}
                style={styles.input}
                value={newSubTopicTitle}
                onChangeText={setNewSubTopicTitle}
                onSubmitEditing={handleAddSubTopic}
              />
            </View>
            <IconButton
              accessibilityLabel="Add sub-topic"
              icon={{ ios: "plus", android: "add", web: "add" }}
              onPress={handleAddSubTopic}
              disabled={!newSubTopicTitle.trim()}
            />
          </View>

          {subTopics.length > 0 ? (
            <View style={styles.subTopicsList}>
              {subTopics.map((subTopic) => (
                <View key={subTopic.id} style={styles.subTopicCard}>
                  <Text style={styles.bullet}>•</Text>
                  <TextInput
                    accessibilityLabel={`Sub-topic ${subTopic.title}`}
                    style={styles.subTopicInput}
                    value={subTopic.title}
                    onChangeText={(text) =>
                      handleUpdateSubTopic(subTopic.id, text)
                    }
                  />
                  <IconButton
                    accessibilityLabel={`Delete sub-topic ${subTopic.title}`}
                    icon={{ ios: "trash", android: "delete", web: "delete" }}
                    onPress={() => handleDeleteSubTopic(subTopic.id)}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptySubTopics}>
              <MutedText>No sub-topics added yet.</MutedText>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <BaseButton
            title="SAVE CHANGES"
            variant="yellow"
            onPress={() => void handleSave()}
          />
          <BaseButton title="CANCEL" onPress={() => router.back()} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: Spacing.lg,
    backgroundColor: colors.background,
  },
  container: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    gap: Spacing.xl,
    marginTop: Spacing.xl,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
    gap: Spacing.lg,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  headerTitle: {
    fontFamily: typography.heading.fontFamily,
    fontSize: 24,
  },
  section: {
    gap: Spacing.md,
  },
  sectionHint: {
    fontSize: 13,
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
  addSubTopicRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  addSubTopicInputWrapper: {
    flex: 1,
  },
  subTopicsList: {
    gap: Spacing.sm,
  },
  subTopicCard: {
    ...hardShadow,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderWidth: borderWidths.default,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  bullet: {
    fontFamily: typography.heading.fontFamily,
    fontSize: 18,
    color: colors.text,
    marginLeft: Spacing.xs,
  },
  subTopicInput: {
    fontFamily: typography.body.fontFamily,
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  emptySubTopics: {
    padding: Spacing.md,
    borderWidth: borderWidths.default,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  errorContainer: {
    padding: Spacing.md,
    borderWidth: borderWidths.default,
    borderColor: colors.pink,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  errorText: {
    fontFamily: typography.body.fontFamily,
    color: colors.pink,
    fontSize: 14,
  },
  actions: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
});
