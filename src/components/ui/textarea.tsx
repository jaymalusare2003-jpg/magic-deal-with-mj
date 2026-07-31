import * as React from "react";
import * as TextareaPrimitive from "react-textarea-autosize";
import { cn } from "@/lib/utils";

export type TextareaProps = React.ComponentPropsWithoutRef<typeof TextareaPrimitive.default>;

const Textarea = React.forwardRef<
  React.ComponentRef<typeof TextareaPrimitive.default>,
  TextareaProps
>(({ className, ...props }, ref) => (
  <TextareaPrimitive.default
    className={cn(
      "flex min-h-[60px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y",
      className
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
export default Textarea;
