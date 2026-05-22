"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

type LogoutModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LogoutModal({ open, onOpenChange }: LogoutModalProps) {
  const { logout } = useAuth();

  function handleLogout() {
    onOpenChange(false);
    toast.success("See you next time 👋");
    logout();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leaving already?</DialogTitle>
          <DialogDescription>
            You can log back in anytime to continue your meetings with Hintro.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleLogout}>Log out</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
