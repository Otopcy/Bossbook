import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse-fast rounded-md bg-muted/50 dark:bg-white/[0.05]", className)}
      {...props}
    />
  )
}

export { Skeleton }
