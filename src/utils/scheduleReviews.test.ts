import { scheduleReviews } from "./scheduleReviews";

function assertEqual(actual: unknown, expected: unknown, message: string) {
  if (actual !== expected) {
    throw new Error(
      `${message}: expected ${String(expected)}, received ${String(actual)}`,
    );
  }
}

function assertSchedule(learnedAt: string, expectedDates: string[]) {
  const reviews = scheduleReviews(learnedAt);

  assertEqual(reviews.length, 3, "schedule count");
  reviews.forEach((review, index) => {
    assertEqual(review.day, [1, 4, 7][index], `review day ${index + 1}`);
    assertEqual(
      review.scheduledFor,
      expectedDates[index],
      `scheduled date ${index + 1}`,
    );
    assertEqual(review.completed, false, `completed state ${index + 1}`);
    assertEqual(review.completedAt, null, `completedAt state ${index + 1}`);
  });
}

assertSchedule("2026-09-01T10:30:00.000Z", [
  "2026-09-02T10:30:00.000Z",
  "2026-09-05T10:30:00.000Z",
  "2026-09-08T10:30:00.000Z",
]);

assertSchedule("2026-01-29T08:15:00.000Z", [
  "2026-01-30T08:15:00.000Z",
  "2026-02-02T08:15:00.000Z",
  "2026-02-05T08:15:00.000Z",
]);

assertSchedule("2025-12-29T23:45:00.000Z", [
  "2025-12-30T23:45:00.000Z",
  "2026-01-02T23:45:00.000Z",
  "2026-01-05T23:45:00.000Z",
]);
