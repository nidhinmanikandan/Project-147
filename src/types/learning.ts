export type ReviewDay = 1 | 4 | 7;

export interface LearningReview {
  day: ReviewDay;
  scheduledFor: string;
  completed: boolean;
  completedAt: string | null;
}

export interface SubTopic {
  id: string;
  title: string;
}

export interface LearningItem {
  id: string;
  topic: string;
  category: string;
  learnedAt: string;
  reviews: LearningReview[];
  subTopics?: SubTopic[];
}

