"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type RejectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
};

export function RejectDialog({
  open,
  onOpenChange,
  onConfirm,
}: RejectDialogProps) {
  const [reason, setReason] = useState("");

  function handleConfirm() {
    if (!reason.trim()) return; // ❗ cegah submit kosong
    onConfirm(reason);
    setReason("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Tutor Application</DialogTitle>
        </DialogHeader>

        <Textarea
          placeholder="Masukkan alasan penolakan..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim()}
          >
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
