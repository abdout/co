import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { sidebarNav } from "./docs/constant"

interface Doc {
  title: string;
  description?: string;
  slug: string;
}

interface DocsPagerProps {
  doc: Doc;
}

export function DocsPager({ doc }: DocsPagerProps) {
  const pager = getPagerForDoc(doc)

  if (!pager) {
    return null
  }

  return (
    <div className="flex flex-row items-center justify-between">
      {pager.prev && (
        <Link
          href={pager.prev.href}
          className="inline-flex items-center justify-center rounded-lg border border-transparent bg-transparent px-3 py-2 text-center text-sm font-medium text-muted-foreground hover:border-border hover:text-foreground"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {pager.prev.title}
        </Link>
      )}
      {pager.next && (
        <Link
          href={pager.next.href}
          className="inline-flex items-center justify-center rounded-lg border border-transparent bg-transparent px-3 py-2 text-center text-sm font-medium text-muted-foreground hover:border-border hover:text-foreground ml-auto"
        >
          {pager.next.title}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

interface PagerItem {
  title: string
  href: string
}

interface Pager {
  prev?: PagerItem
  next?: PagerItem
}

function getPagerForDoc(doc: Doc): Pager | null {
  const flattenedLinks = flatten(sidebarNav)
  const currentIndex = flattenedLinks.findIndex(
    (item) => item.href === `/docs/${doc.slug}`
  )

  if (currentIndex === -1) {
    return null
  }

  return {
    prev: flattenedLinks[currentIndex - 1],
    next: flattenedLinks[currentIndex + 1],
  }
}

function flatten(nav: typeof sidebarNav): PagerItem[] {
  const flattenedLinks: PagerItem[] = []

  nav.forEach((item) => {
    if (item.items) {
      item.items.forEach((subItem) => {
        if (subItem.href) {
          flattenedLinks.push({
            title: subItem.title,
            href: subItem.href,
          })
        }
      })
    }
  })

  return flattenedLinks
} 