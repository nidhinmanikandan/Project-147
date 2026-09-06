import type { LearningReview, ReviewDay } from "@/types/learning";

const reviewDays: ReviewDay[] = [1, 4, 7];

export function scheduleReviews(learnedAt: Date | string): LearningReview[] {
  const learnedDate =
    learnedAt instanceof Date
      ? new Date(learnedAt.getTime())
      : new Date(learnedAt);

  if (Number.isNaN(learnedDate.getTime())) {
    throw new Error("learnedAt must be a valid date");
  }

  return reviewDays.map((day) => {
    const scheduledDate = new Date(learnedDate.getTime());
    scheduledDate.setUTCDate(scheduledDate.getUTCDate() + day);

    return {
      day,
      scheduledFor: scheduledDate.toISOString(),
      completed: false,
      completedAt: null,
    };
  });
}
