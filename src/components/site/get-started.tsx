import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function GetStarted() {
  return (
    <Link
      href="/qoute"
      className="group  inline-flex items-center gap-x-2  text-sm font-medium text-neutral-300 hover:text-accent"
    >
      
      <span className="underline-offset-4 group-hover:underline">
        Get Started
      </span>
      <ArrowRight className=" h-4 w-4" />
    </Link>
  )
}
