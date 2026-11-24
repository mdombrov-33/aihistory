"use client";

// Report interface preview with no delivery or moderation service connected.

import { useState } from "react";
import { Flag } from "lucide-react";
import { toast } from "sonner";
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <form
          className="form-stack gap-5.5 grid [&>[data-slot=button]]:w-full"
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
            toast("Report preview complete. Nothing was submitted.");
          }}
        >
          <Label htmlFor="report-reason">What needs attention?</Label>
          <Select defaultValue="fact">
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
            required
            placeholder="Tell us which scene or passage you mean."
          />
          <Button type="submit">Preview report</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
