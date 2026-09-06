import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { BodyText } from "@/components/ui/BodyText";
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
import type { LearningItem } from "@/types/learning";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

export default function ReviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<LearningItem | null>(null);

  useEffect(() => {
    getLearningItems().then((items) => {
      setItem(items.find((learningItem) => learningItem.id === id) ?? null);
    });
  }, [id]);

  const currentReview =
    item?.reviews.find((review) => !review.completed) ?? null;
  const completedReview = item
    ? ([...item.reviews].reverse().find((review) => review.completed) ?? null)
    : null;

  function isCurrentReviewDue() {
    return currentReview
      ? new Date(currentReview.scheduledFor).getTime() <= Date.now()
      : false;
  }

  async function handleRemember() {
    if (!item || !currentReview) {
      return;
    }

    const completedAt = new Date().toISOString();
    const updatedItem: LearningItem = {
      ...item,
      reviews: item.reviews.map((review) =>
        review.day === currentReview.day
          ? { ...review, completed: true, completedAt }
          : review,
      ),
    };

    const saved = await updateLearningItem(updatedItem);
    if (saved) {
      setItem(updatedItem);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.container}>
        <IconButton
          accessibilityLabel="Go back"
          icon={{
            ios: "chevron.left",
            android: "arrow_back",
            web: "arrow_back",
          }}
          onPress={() => router.back()}
        />

        {item ? (
          <>
            
            
            <BodyText style={styles.topic}>{item.topic}</BodyText>
            
            <BodyText style={styles.question}>
              Can you explain {item.topic} without looking at your notes?
            </BodyText>

            <View style={styles.actions}>
              {currentReview ? (
                <>
                  {completedReview ? (
                    <MutedText>{`Review ${completedReview.day} completed`}</MutedText>
                  ) : null}
                  <BaseButton
                    title="I REMEMBER"
                    onPress={handleRemember}
                    disabled={!isCurrentReviewDue()}
                    variant="yellow"
                  />
                </>
              ) : (
                <MutedText>
                  {completedReview
                    ? `Review ${completedReview.day} completed`
                    : "Review cycle complete."}
                </MutedText>
              )}
              <BaseButton
                title="NEED TO REVIEW"
                onPress={() => router.back()}
              />
            </View>

            <MutedText style={styles.learned}>
              Learned {formatDate(item.learnedAt)}
            </MutedText>

            <SectionTitle style={styles.timelineTitle}>
              1-4-7 TIMELINE
            </SectionTitle>
            <View style={styles.timeline}>
              {item.reviews.map((review) => (
                <View key={review.day} style={styles.timelineItem}>
                  <BodyText style={styles.timelineDay}>
                    DAY {review.day}
                  </BodyText>
                  <MutedText>{formatDate(review.scheduledFor)}</MutedText>
                  <MutedText>
                    {review.completed ? "Completed" : "Pending"}
                  </MutedText>
                </View>
              ))}
            </View>

            <SectionTitle style={styles.nextTitle}>NEXT REVIEW</SectionTitle>
            <MutedText>
              {currentReview
                ? formatDate(currentReview.scheduledFor)
                : "Review cycle complete."}
            </MutedText>
          </>
        ) : (
          <MutedText>Learning item not found.</MutedText>
        )}
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
    gap: Spacing.md,
    marginTop: Spacing.xxxl,
  },
  title: {
    marginTop: Spacing.lg,
  },
  category: {
    marginTop: Spacing.sm,
  },
  topic: {
    marginTop: Spacing.lg,
    fontFamily: typography.heading.fontFamily,
    fontSize: 32,
    fontWeight: typography.heading.fontWeight,
  },
  question: {
    marginTop: 0,
  },
  actions: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  learned: {
    marginTop: Spacing.md,
  },
  timelineTitle: {
    marginTop: Spacing.xl,
  },
  timeline: {
    ...hardShadow,
    gap: Spacing.md,
    padding: Spacing.lg,
    borderWidth: borderWidths.default,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  timelineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  timelineDay: {
    flex: 1,
  },
  nextTitle: {
    marginTop: Spacing.lg,
  },
});
