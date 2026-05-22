"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type FeedbackFormProps = {
  sentiment: "positive" | "negative";
  onBack: () => void;
  onSubmit: (message: string) => void;
};

export function FeedbackForm({
  sentiment,
  onBack,
  onSubmit,
}: FeedbackFormProps) {
  const [message, setMessage] = useState("");
  const isPositive = sentiment === "positive";

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-[var(--color-main-text)]">
          {isPositive ? "What did you love?" : "What went wrong?"}
        </h2>
        <p className="text-sm leading-6 text-[var(--color-muted)]">
          {isPositive
            ? "We're glad you're enjoying Hintro!"
            : "We're sorry to hear that. Help us improve."}
        </p>
      </div>

      <div className="space-y-2">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={
            isPositive
              ? "Tell us what you love about Hintro..."
              : "Tell us what could be better..."
          }
          className="min-h-[120px] w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-main-bg)] px-3 py-3 text-base text-[var(--color-main-text)] outline-none transition-shadow placeholder:text-[var(--color-muted)] focus:ring-2 focus:ring-ring"
        />
        <p className="text-right text-xs text-[var(--color-muted)]">
          {message.length} characters
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={() => onSubmit(message)}>Submit</Button>
      </div>
    </div>
  );
}
