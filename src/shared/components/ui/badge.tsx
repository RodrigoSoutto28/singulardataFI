import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary/15 text-primary hover:bg-primary/25 border border-primary/30",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent",
        destructive: "bg-destructive/15 text-destructive hover:bg-destructive/25 border border-destructive/30",
        success: "bg-success/15 text-success hover:bg-success/25 border border-success/30",
        warning: "bg-warning/15 text-warning hover:bg-warning/25 border border-warning/30",
        outline: "text-foreground border border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

