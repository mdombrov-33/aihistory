"use client";

// Report interface preview with no delivery or moderation service connected.

import { formText } from "@/lib/forms";
import { useState } from "react";
import { Flag } from "lucide-react";
import { updateJourney } from "@/state/guest/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ReportStory({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [receipt, setReceipt] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (value) setReceipt(false);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Flag />
          Report a concern
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Help us look closer.</DialogTitle>
          <DialogDescription>
            Report a concern about {title}. In this static preview, no report is submitted.
          </DialogDescription>
        </DialogHeader>
        {receipt ? (
          <div className="grid gap-4">
            <h3 className="font-heading text-xl">Report saved on this device.</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              No report was delivered. In the connected product, this confirmation would include
              tracking and review status; it would not promise a factual correction.
            </p>
            <Button onClick={() => setOpen(false)}>Done</Button>
          </div>
        ) : (
          <form
            className="form-stack gap-5.5 grid [&>[data-slot=button]]:w-full"
            onSubmit={(e) => {
              e.preventDefault();

              const data = new FormData(e.currentTarget);
              const detail = formText(data, "detail").trim();

              if (detail.length < 4) return;

              updateJourney((s) => ({
                ...s,
                product: {
                  ...s.product,
                  reports: [
                    {
                      id: crypto.randomUUID(),
                      title: title.slice(0, 200),
                      reason: formText(data, "reason", "fact"),
                      detail,
                      createdAt: Date.now(),
                    },
                    ...s.product.reports,
                  ].slice(0, 100),
                },
              }));
              setReceipt(true);
            }}
          >
            <Label htmlFor="report-reason">What needs attention?</Label>
            <Select name="reason" defaultValue="fact">
              <SelectTrigger id="report-reason" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fact">A fact or source</SelectItem>
                <SelectItem value="broken">Something isn’t working</SelectItem>
                <SelectItem value="content">Inappropriate public content</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="report-detail">What should we check?</Label>
            <Textarea
              id="report-detail"
              name="detail"
              minLength={4}
              maxLength={2000}
              required
              placeholder="Tell us which scene or passage you mean."
            />
            <Button type="submit">Preview report</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
