import * as React from "react";
import { cn } from "@/lib/utils";

export const Alert = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-lg border p-3 text-sm", className)} role="alert" {...props} />
);
