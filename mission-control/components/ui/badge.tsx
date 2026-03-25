import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
  {
    variants: {
      variant: {
        active:
          "bg-green-500/15 text-green-400 border border-green-500/30",
        inactive:
          "bg-red-500/15 text-red-400 border border-red-500/30",
        warning:
          "bg-amber-500/15 text-amber-400 border border-amber-500/30",
        orange:
          "bg-orange-500/15 text-orange-400 border border-orange-500/30",
        blue:
          "bg-blue-500/15 text-blue-400 border border-blue-500/30",
        default:
          "bg-[--bg-elevated] text-[--text-taupe] border border-[--border-card]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
