"use client";

// Shared lesson action variants and labelled parameter ranges.

import { useId, type ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export function LabRange({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  const id = useId();

  return (
    <div className="lab-range min-w-0">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[15px]">
        {label}
        <output htmlFor={id} className="text-primary tabular-nums">
          {Number(value.toFixed(2))}
          {unit}
        </output>
      </label>
      <input
        id={id}
        type="range"
        className="block h-8 w-full cursor-pointer accent-primary focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-ring"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

const labButtonVariants = cva(
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-input bg-background px-3.5 py-[9px] text-[14px] text-foreground hover:bg-muted aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-65",
  {
    variants: {
      variant: {
        default: "",
        primary: "border-primary bg-primary text-primary-foreground hover:bg-primary",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

// Native lesson actions share one visual contract, including selection and disabled states.
export function LabButton({
  className,
  variant,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof labButtonVariants>) {
  return <button className={cn(labButtonVariants({ variant }), className)} {...props} />;
}
