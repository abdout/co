import { useMemo } from "react"
import { cn } from "@/lib/utils"

interface TableOfContentsProps {
  toc: {
    items?: {
      title: string
      url: string
      items?: {
        title: string
        url: string
      }[]
    }[]
  }
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const items = useMemo(() => {
    return toc?.items || []
  }, [toc?.items])

  if (!items.length) {
    return null
  }

  return (
    <div className="space-y-2">
      <p className="font-medium">On This Page</p>
      <Tree items={items} />
    </div>
  )
}

function Tree({
  items,
  level = 1,
}: {
  items: TableOfContentsProps["toc"]["items"]
  level?: number
}) {
  return items?.length ? (
    <ul className={cn("m-0 list-none", { "pl-4": level !== 1 })}>
      {items.map((item, index) => {
        return (
          <li key={index} className={cn("mt-0 pt-2")}>
            <a
              href={item.url}
              className={cn(
                "inline-block no-underline",
                "text-muted-foreground hover:text-foreground",
                "transition-colors"
              )}
            >
              {item.title}
            </a>
            {item.items?.length ? (
              <Tree items={item.items} level={level + 1} />
            ) : null}
          </li>
        )
      })}
    </ul>
  ) : null
} 