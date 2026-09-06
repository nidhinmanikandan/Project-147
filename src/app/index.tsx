import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <Text style={styles.greeting}>GOOD MORNING, NIDHIN 👋</Text>

        {/* Today */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TODAY</Text>

          <View style={styles.todayRow}>
            <View>
              <Text style={styles.todayNumber}>2</Text>
              <Text style={styles.todayLabel}>reviews due</Text>
            </View>

            <View>
              <Text style={styles.todayNumber}>1</Text>
              <Text style={styles.todayLabel}>upcoming</Text>
            </View>
          </View>
        </View>

        {/* Next Review */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NEXT REVIEW</Text>

          <View style={styles.reviewCard}>
            <Text style={styles.category}>DBMS</Text>

            <Text style={styles.topic}>Normalization</Text>

            <Text style={styles.learned}>
              Learned 4 days ago
            </Text>

            <Pressable style={styles.reviewButton}>
              <Text style={styles.reviewButtonText}>
                REVIEW NOW
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Today's Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TODAY'S REVIEWS</Text>

          <View style={styles.reviewList}>
            <Text style={styles.reviewItem}>• Normalization</Text>
            <Text style={styles.reviewItem}>• OOP — Polymorphism</Text>
            <Text style={styles.reviewItem}>• Arrays — Sliding Window</Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Button */}
      <Pressable style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 120,
  },

  greeting: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 40,

  },

  section: {
    marginBottom: 32,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#777777",
    marginBottom: 14,
  },

  todayRow: {
    flexDirection: "row",
    gap: 50,
  },

  todayNumber: {
    fontSize: 28,
    fontWeight: "700",
  },

  todayLabel: {
    fontSize: 14,
    color: "#777777",
    marginTop: 2,
  },

  reviewCard: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 16,
    padding: 20,
  },

  category: {
    fontSize: 13,
    fontWeight: "600",
    color: "#777777",
    marginBottom: 6,
  },

  topic: {
    fontSize: 22,
    fontWeight: "700",
  },

  learned: {
    fontSize: 14,
    color: "#777777",
    marginTop: 8,
    marginBottom: 20,
  },

  reviewButton: {
    backgroundColor: "#111111",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  reviewButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },

  reviewList: {
    gap: 14,
  },

  reviewItem: {
    fontSize: 16,
  },

  addButton: {
    position: "absolute",
    right: 24,
    bottom: 30,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "300",
    marginTop: -3,
  },
});