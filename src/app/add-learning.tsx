import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import { AddLearningForm } from "@/components/learning/AddLearningForm";
import { BodyText } from "@/components/ui/BodyText";
import { IconButton } from "@/components/ui/IconButton";
import { MutedText } from "@/components/ui/MutedText";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { borderWidths, colors, radius, Spacing } from "@/constants/theme";
import {
  deleteLearningItem,
  getLearningItems,
  saveLearningItem,
} from "@/services/learningStorage";
import { scheduleReviews } from "@/utils/scheduleReviews";
import type { LearningItem } from "@/types/learning";

function createLearningItemId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export default function AddLearningScreen() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [learningItems, setLearningItems] = useState<LearningItem[]>([]);

  useEffect(() => {
    getLearningItems().then(setLearningItems);
  }, []);

  async function handleSubmit() {
    const trimmedTopic = topic.trim();
    const trimmedCategory = category.trim();

    if (!trimmedTopic || !trimmedCategory) {
      setErrorMessage("Topic and category are required.");
      return;
    }

    const learnedAt = new Date().toISOString();
    const item: LearningItem = {
      id: createLearningItemId(),
      topic: trimmedTopic,
      category: trimmedCategory,
      learnedAt,
      reviews: scheduleReviews(learnedAt),
    };

    const saved = await saveLearningItem(item);
    if (!saved) {
      setErrorMessage("Unable to save this learning item. Please try again.");
      return;
    }

    setTopic("");
    setCategory("");
    setErrorMessage("");
    setLearningItems((items) => [...items, item]);
    router.back();
  }

  async function handleDelete(id: string) {
    const deleted = await deleteLearningItem(id);
    if (!deleted) {
      setErrorMessage("Unable to delete this learning item. Please try again.");
      return;
    }

    setLearningItems((items) => items.filter((item) => item.id !== id));
    setErrorMessage("");
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <AddLearningForm
          topic={topic}
          category={category}
          onTopicChange={setTopic}
          onCategoryChange={setCategory}
          onSubmit={handleSubmit}
        />
        {errorMessage ? <MutedText>{errorMessage}</MutedText> : null}

        <View style={styles.recentSection}>
          <SectionTitle>Recent learning</SectionTitle>
          {learningItems.length > 0 ? (
            [...learningItems]
              .sort(
                (first, second) =>
                  new Date(second.learnedAt).getTime() -
                  new Date(first.learnedAt).getTime(),
              )
              .map((item) => (
                <View key={item.id} style={styles.recentItem}>
                  <View style={styles.recentDetails}>
                    <BodyText>{item.topic}</BodyText>
                    <MutedText>
                      {item.category} - {formatLearnedAt(item.learnedAt)}
                    </MutedText>
                  </View>
                  <IconButton
                    accessibilityLabel={`Delete ${item.topic}`}
                    icon={{ ios: "minus", android: "remove", web: "remove" }}
                    onPress={() => handleDelete(item.id)}
                  />
                </View>
              ))
          ) : (
            <MutedText>No learning added yet.</MutedText>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function formatLearnedAt(learnedAt: string) {
  const date = new Date(learnedAt);
  return Number.isNaN(date.getTime())
    ? learnedAt
    : date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
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
  },
  recentSection: {
    marginTop: Spacing.xxxl,
    gap: Spacing.md,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
    padding: Spacing.md,
    borderWidth: borderWidths.default,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  recentDetails: {
    flex: 1,
    gap: Spacing.xs,
  },
});
