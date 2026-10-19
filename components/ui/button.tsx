import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-navy-800 text-white hover:bg-navy-700 shadow-soft",
        gold: "bg-gold-500 text-white hover:bg-gold-600 shadow-soft",
        whatsapp: "bg-[#22C55E] text-white hover:bg-[#16A34A] shadow-soft",
        outline: "border-2 border-navy-800/20 bg-white text-navy-800 hover:bg-navy-50 hover:border-navy-800/40",
        secondary: "bg-slate-100 text-navy-800 hover:bg-slate-200",
        ghost: "hover:bg-slate-100 text-navy-800",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        link: "text-navy-700 underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default: "h-11 px-6 py-2", sm: "h-9 rounded-lg px-4 text-xs", lg: "h-13 rounded-xl px-8 text-base py-3.5", icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";
export { Button, buttonVariants };
