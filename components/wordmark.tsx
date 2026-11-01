import { cn } from "cn"

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("wordmark text-[1.7rem] leading-none font-extrabold tracking-[-0.045em]", className)}>
      siboost
    </span>
  )
}
