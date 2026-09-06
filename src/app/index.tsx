import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

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

const noop = () => {};

export default function HomeScreen() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              <Text style={styles.statNumber}>2</Text>
              <MutedText>reviews due</MutedText>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>1</Text>
              <MutedText>upcoming</MutedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle style={styles.sectionTitle}>NEXT REVIEW</SectionTitle>
          <View style={styles.reviewCard}>
            <MutedText style={styles.category}>DBMS</MutedText>
            <BodyText style={styles.topic}>Normalization</BodyText>
            <MutedText style={styles.learned}>Learned 4 days ago</MutedText>
            <BaseButton title="REVIEW NOW" onPress={noop} variant="black" />
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle style={styles.sectionTitle}>
            TODAY&apos;S REVIEWS
          </SectionTitle>
          <View style={styles.reviewList}>
            <BodyText>• Normalization</BodyText>
            <BodyText>• OOP — Polymorphism</BodyText>
            <BodyText>• Arrays — Sliding Window</BodyText>
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
    marginTop: Spacing.xxxl,
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
