import { slug } from "github-slugger"

interface Item {
  title: string
  url: string
  items?: Item[]
}

interface TableOfContents {
  items?: Item[]
}

export async function getTableOfContents(content: string): Promise<TableOfContents> {
  const regXHeader = /\n(?<flag>#{1,6})\s+(?<content>.+)/g
  const headings = Array.from(content.matchAll(regXHeader))
  const items = headings.map(({ groups }) => {
    const flag = groups?.flag
    const content = groups?.content
    
    if (!flag || !content) return null

    const level = flag.length

    return {
      level,
      title: content,
      url: `#${slug(content)}`,
    }
  }).filter(Boolean)

  let result: TableOfContents = {
    items: [],
  }

  // Organize items into nested structure
  for (const item of items) {
    if (!item) continue
    
    if (item.level === 1) {
      result.items?.push({
        title: item.title,
        url: item.url,
        items: [],
      })
    } else if (item.level === 2) {
      if (result.items?.length) {
        result.items[result.items.length - 1].items?.push({
          title: item.title,
          url: item.url,
        })
      }
    }
  }

  return result
} 