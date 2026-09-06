import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import { AddLearningForm } from "@/components/learning/AddLearningForm";
import { MutedText } from "@/components/ui/MutedText";
import { colors, Spacing } from "@/constants/theme";
import { saveLearningItem } from "@/services/learningStorage";
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
  },
});
