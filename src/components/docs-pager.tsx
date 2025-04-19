import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DocType } from "@/app/docs/[[...slug]]/page"

interface DocsPagerProps {
  doc: DocType
}

export function DocsPager({ doc }: DocsPagerProps) {
  return (
    <div className="flex flex-row items-center justify-between">
      {doc.previous && (
        <Link
          href={doc.previous.href}
          className="inline-flex items-center justify-center rounded-lg border border-transparent bg-transparent px-3 py-2 text-center font-medium text-muted-foreground hover:border-border"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {doc.previous.title}
        </Link>
      )}
      {doc.next && (
        <Link
          href={doc.next.href}
          className="ml-auto inline-flex items-center justify-center rounded-lg border border-transparent bg-transparent px-3 py-2 text-center font-medium text-muted-foreground hover:border-border"
        >
          {doc.next.title}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      )}
    </div>
  )
} 