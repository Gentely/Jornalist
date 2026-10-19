import * as React from "react";
import { cn } from "@/lib/utils";
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, ...props }, ref) => (
  <input type={type} className={cn("flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-600/30 focus:border-navy-600 disabled:opacity-50", className)} ref={ref} {...props} />
));
Input.displayName = "Input";
export { Input };
const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => <label className={cn("text-sm font-bold text-navy-900 block mb-1.5", className)} {...props} />;
export { Label };
