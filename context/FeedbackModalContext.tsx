"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { FeedbackModal } from "@/components/feedback/FeedbackModal";

type FeedbackModalContextValue = {
  openFeedbackModal: () => void;
};

const FeedbackModalContext = createContext<
  FeedbackModalContextValue | undefined
>(undefined);

export function FeedbackModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      openFeedbackModal: () => setIsOpen(true),
    }),
    [],
  );

  return (
    <FeedbackModalContext.Provider value={value}>
      {children}
      <FeedbackModal open={isOpen} onOpenChange={setIsOpen} />
    </FeedbackModalContext.Provider>
  );
}

export function useFeedbackModal() {
  const context = useContext(FeedbackModalContext);

  if (!context) {
    throw new Error(
      "useFeedbackModal must be used within a FeedbackModalProvider",
    );
  }

  return context;
}
