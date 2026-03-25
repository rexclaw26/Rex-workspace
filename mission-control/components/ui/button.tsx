import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-orange-500 text-white hover:bg-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.3)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]",
        secondary:
          "bg-[--bg-elevated] text-[--text-taupe] border border-[--border-card] hover:border-orange-500/40 hover:text-orange-400",
        ghost:
          "text-[--text-muted] hover:text-[--text-taupe] hover:bg-[--bg-elevated]",
        danger:
          "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25",
        outline:
          "border border-orange-500/40 text-orange-400 hover:bg-orange-500/10",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7 px-3 text-xs",
        lg: "h-11 px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
