"use client";

import { Button } from "@/components/ui/button";

type FeedbackSuccessProps = {
  onClose: () => void;
};

export function FeedbackSuccess({ onClose }: FeedbackSuccessProps) {
  return (
    <div className="flex flex-col items-center py-4 text-center">
      <div className="text-6xl" aria-hidden="true">
        🌟
      </div>
      <h2 className="mt-5 text-xl font-semibold text-[var(--color-main-text)]">
        Thanks for your feedback!
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--color-muted)]">
        We'll use it to keep making Hintro better.
      </p>
      <Button className="mt-6 min-w-28" onClick={onClose}>
        Close
      </Button>
    </div>
  );
}
