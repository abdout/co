import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function GetStarted() {
  return (
    <Link
      href="/get-started"
      className="group  inline-flex items-center gap-x-2  text-sm font-fabriga font-medium text-background/80 hover:text-background transition-colors cursor-pointer"
    >
      
      <span className="underline-offset-4 group-hover:underline">
        Get Started
      </span>
      <ArrowRight className=" h-4 w-4" />
    </Link>
  )
}
