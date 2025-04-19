import Link from "next/link"
import { TableOfContents } from "@/types/toc"
import { cn } from "@/lib/utils"

interface DocsTocProps {
  toc: TableOfContents
}

export function DocsToc({ toc }: DocsTocProps) {
  if (!toc?.items) {
    return null
  }

  return (
    <div className="space-y-2">
      <p className="font-medium">On This Page</p>
      <Tree items={toc.items} />
    </div>
  )
}

function Tree({
  items,
  level = 1,
}: {
  items: TableOfContents["items"]
  level?: number
}) {
  return items?.length ? (
    <ul className={cn("m-0 list-none", { "pl-4": level !== 1 })}>
      {items.map((item, index) => {
        return (
          <li key={index} className={cn("mt-2 first:mt-0")}>
            <Link
              href={item.url}
              className={cn(
                "inline-block no-underline",
                "text-muted-foreground hover:text-foreground",
                "transition-colors"
              )}
            >
              {item.title}
            </Link>
            {item.items?.length ? (
              <Tree items={item.items} level={level + 1} />
            ) : null}
          </li>
        )
      })}
    </ul>
  ) : null
} 