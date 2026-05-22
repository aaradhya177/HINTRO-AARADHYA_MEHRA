"use client";

import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";

import { StarRating } from "@/components/feedback/StarRating";
import { Button } from "@/components/ui/button";
import { useFeedbackModal } from "@/context/FeedbackModalContext";
import {
  clearFeedback,
  getFeedbackList,
  type FeedbackItem,
} from "@/lib/feedback";
import { cn } from "@/lib/utils";

function formatFeedbackDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const datePart = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${datePart} \u00b7 ${timePart}`;
}

function SentimentBadge({ sentiment }: { sentiment: FeedbackItem["sentiment"] }) {
  const isPositive = sentiment === "positive";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        isPositive
          ? "bg-[var(--color-accent-green)]/10 text-[var(--color-accent-green)]"
          : "bg-[var(--color-accent-red)]/10 text-[var(--color-accent-red)]",
      )}
    >
      {isPositive ? "Positive" : "Negative"}
    </span>
  );
}

export default function FeedbackHistoryPage() {
  const { openFeedbackModal } = useFeedbackModal();
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);

  function refreshFeedback() {
    setFeedback(getFeedbackList());
  }

  useEffect(() => {
    refreshFeedback();
    window.addEventListener("hintro_feedback_updated", refreshFeedback);

    return () => {
      window.removeEventListener("hintro_feedback_updated", refreshFeedback);
    };
  }, []);

  const sortedFeedback = useMemo(
    () =>
      [...feedback].sort(
        (first, second) =>
          new Date(second.submittedAt).getTime() -
          new Date(first.submittedAt).getTime(),
      ),
    [feedback],
  );

  function handleClearAll() {
    clearFeedback();
    refreshFeedback();
  }

  if (sortedFeedback.length === 0) {
    return (
      <section className="page-enter flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-x-hidden">
        <div className="flex max-w-md flex-col items-center text-center">
          <Star
            aria-hidden="true"
            className="h-12 w-12 text-[var(--color-muted)]"
          />
          <h1 className="mt-4 text-xl font-semibold text-[var(--color-main-text)]">
            No feedback yet
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            Share what is working or what could be better, and your feedback
            will show up here.
          </p>
          <Button className="mt-5 min-h-11" onClick={openFeedbackModal}>
            Give Feedback
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="page-enter space-y-5 overflow-x-hidden">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-main-text)]">
            Feedback History
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Review feedback submitted from this browser.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-main-bg)] shadow-sm">
        {sortedFeedback.map((item) => (
          <article
            key={item.id}
            className="grid gap-3 border-b border-[var(--color-border)] p-4 last:border-b-0 md:grid-cols-[110px_110px_minmax(0,1fr)_190px] md:items-start"
          >
            <StarRating
              value={item.rating}
              onChange={() => undefined}
              size="sm"
              readOnly
            />
            <SentimentBadge sentiment={item.sentiment} />
            <p
              className="overflow-hidden text-sm leading-6 text-[var(--color-main-text)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
              title={item.message}
            >
              {item.message || "No message provided."}
            </p>
            <time
              className="text-sm text-[var(--color-muted)] md:text-right"
              dateTime={item.submittedAt}
            >
              {formatFeedbackDate(item.submittedAt)}
            </time>
          </article>
        ))}
      </div>

      <Button
        variant="outline"
        className="min-h-11 border-[var(--color-accent-red)] text-[var(--color-accent-red)] hover:bg-[var(--color-card-bg)]"
        onClick={handleClearAll}
      >
        Clear all
      </Button>
    </section>
  );
}
