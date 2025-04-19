import { TableOfContents } from "@/types/toc"

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
      <Tree tree={toc} />
    </div>
  )
}

function Tree({ tree, level = 1 }: { tree: TableOfContents; level?: number }) {
  return (
    <ul className={`m-0 list-none ${level !== 1 ? "pl-4" : ""}`}>
      {tree.items?.map((item, index) => {
        return (
          <li key={index} className="mt-2 first:mt-0">
            <a
              href={item.url}
              className={`inline-block no-underline transition-colors hover:text-foreground ${
                level === 1 ? "text-sm" : "text-xs"
              } ${
                item.url.startsWith("#")
                  ? "text-muted-foreground"
                  : "font-medium text-foreground"
              }`}
            >
              {item.title}
            </a>
            {item.items?.length ? (
              <Tree tree={{ items: item.items }} level={level + 1} />
            ) : null}
          </li>
        )
      })}
    </ul>
  )
} 