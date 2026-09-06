import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { BodyText } from "@/components/ui/BodyText";
import { BaseButton } from "@/components/ui/BaseButton";
import { IconButton } from "@/components/ui/IconButton";
import { MutedText } from "@/components/ui/MutedText";
import { ScreenTitle } from "@/components/ui/ScreenTitle";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getLearningItems } from "@/services/learningStorage";
import {
  borderWidths,
  colors,
  hardShadow,
  radius,
  Spacing,
  typography,
} from "@/constants/theme";
import type { LearningItem, LearningReview } from "@/types/learning";

const noop = () => {};

type ReviewWithItem = {
  item: LearningItem;
  review: LearningReview;
};

function getReviewState(items: LearningItem[], now = new Date()) {
  const endOfToday = new Date(now.getTime());
  endOfToday.setHours(23, 59, 59, 999);

  const reviews = items.flatMap((item) =>
    item.reviews.map((review) => ({ item, review })),
  );
  const incompleteReviews = reviews.filter(({ review }) => !review.completed);
  const dueReviews = incompleteReviews.filter(
    ({ review }) =>
      new Date(review.scheduledFor).getTime() <= endOfToday.getTime(),
  );
  const upcomingReviews = incompleteReviews.filter(
    ({ review }) =>
      new Date(review.scheduledFor).getTime() > endOfToday.getTime(),
  );
  const nextReview = [...dueReviews, ...upcomingReviews].sort(
    (first, second) =>
      new Date(first.review.scheduledFor).getTime() -
      new Date(second.review.scheduledFor).getTime(),
  )[0];
  const todayTopics = dueReviews.filter(
    ({ item }, index, dueItems) =>
      dueItems.findIndex(({ item: dueItem }) => dueItem.id === item.id) ===
      index,
  );

  return {
    dueCount: dueReviews.length,
    upcomingCount: upcomingReviews.length,
    nextReview: nextReview ?? null,
    todayTopics,
  };
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

export default function HomeScreen() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [learningItems, setLearningItems] = useState<LearningItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    getLearningItems().then((items) => {
      if (isMounted) {
        setLearningItems(items);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const reviewState = getReviewState(learningItems);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenTitle style={styles.greeting}>GOOD MORNING, NIDHIN.</ScreenTitle>

        <View style={styles.section}>
          <SectionTitle style={styles.sectionTitle}>TODAY</SectionTitle>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{reviewState.dueCount}</Text>
              <MutedText>reviews due</MutedText>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{reviewState.upcomingCount}</Text>
              <MutedText>upcoming</MutedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle style={styles.sectionTitle}>NEXT REVIEW</SectionTitle>
          <View style={styles.reviewCard}>
            {reviewState.nextReview ? (
              <>
                <MutedText style={styles.category}>
                  {reviewState.nextReview.item.category}
                </MutedText>
                <BodyText style={styles.topic}>
                  {reviewState.nextReview.item.topic}
                </BodyText>
                <MutedText style={styles.learned}>
                  Learned{" "}
                  {formatLearnedAt(reviewState.nextReview.item.learnedAt)}
                </MutedText>
                <BaseButton title="REVIEW NOW" onPress={noop} variant="black" />
              </>
            ) : (
              <MutedText>No reviews scheduled yet.</MutedText>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle style={styles.sectionTitle}>
            TODAY&apos;S REVIEWS
          </SectionTitle>
          <View style={styles.reviewList}>
            {reviewState.todayTopics.length > 0 ? (
              reviewState.todayTopics.map(({ item }) => (
                <BodyText key={item.id}>• {item.topic}</BodyText>
              ))
            ) : (
              <MutedText>No reviews due today.</MutedText>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.floatingActions}>
        {isMenuOpen && (
          <View style={styles.menuOptions}>
            <IconButton
              accessibilityLabel="Settings"
              icon={{ ios: "gear", android: "settings", web: "settings" }}
              onPress={noop}
            />
            <IconButton
              accessibilityLabel="Review history"
              icon={{
                ios: "clock.arrow.circlepath",
                android: "history",
                web: "history",
              }}
              onPress={noop}
            />
            <IconButton
              accessibilityLabel="Search"
              icon={{
                ios: "magnifyingglass",
                android: "search",
                web: "search",
              }}
              onPress={noop}
            />
          </View>
        )}
        <IconButton
          accessibilityLabel={isMenuOpen ? "Collapse menu" : "Expand menu"}
          icon={{
            ios: isMenuOpen ? "chevron.down" : "chevron.up",
            android: isMenuOpen ? "expand_more" : "expand_less",
            web: isMenuOpen ? "expand_more" : "expand_less",
          }}
          onPress={() => setIsMenuOpen((value) => !value)}
        />
        <IconButton
          accessibilityLabel="Add learning"
          icon={{ ios: "plus", android: "add", web: "add" }}
          onPress={noop}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: 120,
  },
  greeting: {
    fontFamily: "Poppins_800ExtraBold",
    marginTop: 64,
    marginBottom: Spacing.xxxl,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  statCard: {
    ...hardShadow,
    flex: 1,
    minHeight: 96,
    justifyContent: "center",
    padding: Spacing.lg,
    borderWidth: borderWidths.default,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  statNumber: {
    fontFamily: typography.heading.fontFamily,
    color: colors.text,
    fontSize: 28,
    fontWeight: typography.heading.fontWeight,
    lineHeight: 32,
  },
  reviewCard: {
    ...hardShadow,
    padding: Spacing.lg,
    borderWidth: borderWidths.default,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  category: {
    marginBottom: Spacing.sm,
  },
  topic: {
    fontFamily: typography.heading.fontFamily,
    fontSize: 22,
    fontWeight: typography.heading.fontWeight,
  },
  learned: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  reviewList: {
    gap: Spacing.md,
  },
  floatingActions: {
    position: "absolute",
    right: Spacing.lg,
    bottom: Spacing.lg,
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  menuOptions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
});
