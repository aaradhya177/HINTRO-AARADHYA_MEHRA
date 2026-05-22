export type FeedbackItem = {
  id: number;
  rating: 1 | 2 | 3 | 4 | 5;
  sentiment: "positive" | "negative";
  message: string;
  submittedAt: string;
};

const FEEDBACK_KEY = "hintro_feedback";

function isFeedbackItem(value: unknown): value is FeedbackItem {
  const item = value as Partial<FeedbackItem> | null;

  return (
    typeof item?.id === "number" &&
    [1, 2, 3, 4, 5].includes(item.rating ?? 0) &&
    (item.sentiment === "positive" || item.sentiment === "negative") &&
    typeof item.message === "string" &&
    typeof item.submittedAt === "string"
  );
}

export function getFeedbackList(): FeedbackItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(FEEDBACK_KEY);
    const parsed = stored ? JSON.parse(stored) : [];

    return Array.isArray(parsed) ? parsed.filter(isFeedbackItem) : [];
  } catch {
    return [];
  }
}

export function saveFeedback(item: FeedbackItem): void {
  if (typeof window === "undefined") {
    return;
  }

  const feedback = getFeedbackList();
  window.localStorage.setItem(FEEDBACK_KEY, JSON.stringify([...feedback, item]));
}

export function clearFeedback(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(FEEDBACK_KEY);
}
