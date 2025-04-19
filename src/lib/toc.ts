import { TableOfContents } from "@/types/toc"

export async function getTableOfContents(content: string): Promise<TableOfContents> {
  const headingLines = content.split("\n").filter((line) => {
    return line.match(/^#{1,6}\s+/)
  })

  const headings = headingLines.map((raw) => {
    const match = raw.match(/^(#{1,6})\s+(.*)$/)
    
    if (!match) {
      return null
    }

    const level = match[1].length
    const title = match[2].trim()
    
    // Create a slug from the title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")

    return {
      level,
      title,
      url: `#${slug}`,
    }
  }).filter(Boolean)

  // Convert flat headings to nested structure
  const items: TableOfContents["items"] = []
  const stack: any[] = []

  headings.forEach((heading) => {
    if (!heading) return
    
    const item = {
      title: heading.title,
      url: heading.url,
      items: [],
    }

    if (stack.length === 0 || heading.level <= 2) {
      // Level 1 or 2 headings go straight to the top level
      items.push(item)
      stack.length = 0
      stack.push(item)
      return
    }

    // Find the parent heading
    let parent = stack[stack.length - 1]
    while (stack.length > 1 && parent && parent.level >= heading.level) {
      stack.pop()
      parent = stack[stack.length - 1]
    }

    // Add this heading as a child of the parent
    if (parent && parent.items) {
      parent.items.push(item)
    } else {
      items.push(item)
    }
    
    stack.push(item)
  })

  return { items }
} 