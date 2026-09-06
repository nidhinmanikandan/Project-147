import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import { AddLearningForm } from "@/components/learning/AddLearningForm";
import { BodyText } from "@/components/ui/BodyText";
import { MutedText } from "@/components/ui/MutedText";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { borderWidths, colors, radius, Spacing } from "@/constants/theme";
import { getLearningItems, saveLearningItem } from "@/services/learningStorage";
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
                  <BodyText>{item.topic}</BodyText>
                  <MutedText>
                    {item.category} - {formatLearnedAt(item.learnedAt)}
                  </MutedText>
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
    padding: Spacing.md,
    borderWidth: borderWidths.default,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
});
