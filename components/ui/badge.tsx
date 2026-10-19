import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold transition-colors", {
  variants: { variant: {
    default: "border-transparent bg-navy-800 text-white",
    gold: "border-transparent bg-gold-500 text-white",
    whatsapp: "border-transparent bg-green-100 text-green-800",
    secondary: "border-transparent bg-slate-100 text-navy-800",
    outline: "text-navy-800 border-slate-300 bg-white",
    red: "border-transparent bg-red-600 text-white",
  }},
  defaultVariants: { variant: "default" },
});
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}
function Badge({ className, variant, ...props }: BadgeProps) { return <span className={cn(badgeVariants({ variant }), className)} {...props} />; }
export { Badge, badgeVariants };
