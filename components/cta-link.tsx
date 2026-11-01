import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

export function CtaLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string
  children: React.ReactNode
  variant?: "primary" | "secondary" | "inverse"
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: variant === "secondary" || variant === "inverse" ? "outline" : "default", size: "lg" }),
        "h-11 rounded-full px-5 text-[15px] font-semibold",
        variant === "primary" && "hover:bg-[#1d4ed8]",
        variant === "inverse" && "border-white/30 bg-transparent text-white hover:bg-white/10",
        className,
      )}
    >
      {children}
    </Link>
  )
}
