"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { FeedbackSuccess } from "@/components/feedback/FeedbackSuccess";
import { StarRating } from "@/components/feedback/StarRating";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { saveFeedback, type FeedbackItem } from "@/lib/feedback";

type FeedbackModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FeedbackStep = "rating" | "form" | "success";

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const [step, setStep] = useState<FeedbackStep>("rating");
  const [rating, setRating] = useState<FeedbackItem["rating"] | 0>(0);

  useEffect(() => {
    if (!open) {
      const timeout = window.setTimeout(() => {
        setStep("rating");
        setRating(0);
      }, 200);

      return () => window.clearTimeout(timeout);
    }
  }, [open]);

  const sentiment = rating >= 4 ? "positive" : "negative";

  function handleSubmit(message: string) {
    if (!rating) {
      return;
    }

    saveFeedback({
      id: Date.now(),
      rating,
      sentiment,
      message,
      submittedAt: new Date().toISOString(),
    });
    window.dispatchEvent(new Event("hintro_feedback_updated"));
    toast.success("Feedback saved ✓");
    setStep("success");
  }

  function handleClose() {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {step === "rating" ? (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle>Rate your experience</DialogTitle>
              <DialogDescription>
                How would you rate Hintro so far?
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-center py-2">
              <StarRating value={rating} onChange={setRating} />
            </div>

            <div className="flex justify-end">
              <Button disabled={!rating} onClick={() => setStep("form")}>
                Next
              </Button>
            </div>
          </div>
        ) : null}

        {step === "form" && rating ? (
          <FeedbackForm
            sentiment={sentiment}
            onBack={() => setStep("rating")}
            onSubmit={handleSubmit}
          />
        ) : null}

        {step === "success" ? <FeedbackSuccess onClose={handleClose} /> : null}
      </DialogContent>
    </Dialog>
  );
}
