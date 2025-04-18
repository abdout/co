import { notFound } from "next/navigation"
import { Metadata } from "next"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { MDXContent } from 'mdx/types'
import { components } from "@/components/mdx-components"

import { DocsPager } from "@/components/pager"
import { TableOfContents } from "@/components/toc"
import { getTableOfContents } from "@/lib/toc"

interface DocPageProps {
  params: {
    slug: string[]
  }
}

async function getDocFromParams(params: DocPageProps["params"]) {
  try {
    const slug = params?.slug?.join("/") || "index"
    const filePath = path.join(process.cwd(), 'content/docs', `${slug}.mdx`)
    const indexPath = path.join(process.cwd(), 'content/docs', slug, 'index.mdx')
    
    let targetPath = filePath
    if (!fs.existsSync(filePath) && fs.existsSync(indexPath)) {
      targetPath = indexPath
    }
    
    if (!fs.existsSync(targetPath)) {
      return null
    }

    const fileContents = fs.readFileSync(targetPath, 'utf8')
    const { data: frontMatter, content } = matter(fileContents)

    return {
      title: frontMatter.title,
      description: frontMatter.description,
      slug: slug,
      content: content
    }
  } catch (error) {
    console.error("Error getting doc:", error)
    return null
  }
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const doc = await getDocFromParams(params)

  if (!doc) {
    return {
      title: "Not Found",
      description: "The page you are looking for does not exist.",
    }
  }

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: "article",
    },
  }
}

export async function generateStaticParams(): Promise<DocPageProps["params"][]> {
  try {
    const docsDirectory = path.join(process.cwd(), 'content/docs')
    const files = getAllMdxFiles(docsDirectory)
    
    return files.map(file => ({
      slug: file
        .replace(docsDirectory, '')
        .replace(/\.mdx?$/, '')
        .split(path.sep)
        .filter(Boolean)
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

function getAllMdxFiles(dir: string): string[] {
  const files = fs.readdirSync(dir)
  let mdxFiles: string[] = []

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      mdxFiles = mdxFiles.concat(getAllMdxFiles(filePath))
    } else if (file.endsWith('.mdx')) {
      mdxFiles.push(filePath)
    }
  })

  return mdxFiles
}

export default async function DocPage({ params }: DocPageProps) {
  const doc = await getDocFromParams(params)

  if (!doc) {
    notFound()
  }

  const toc = await getTableOfContents(doc.content)

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            {doc.title}
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
            {doc.title}
          </h1>
          {doc.description && (
            <p className="text-lg text-muted-foreground">{doc.description}</p>
          )}
        </div>
        <div className="pb-12 pt-8 prose dark:prose-invert">
          {doc.content}
        </div>
        <DocsPager doc={doc} />
      </div>
      {toc && toc.items && toc.items.length > 0 && (
        <div className="hidden text-sm xl:block">
          <div className="sticky top-16 -mt-10 pt-4">
            <TableOfContents toc={toc} />
          </div>
        </div>
      )}
    </main>
  )
} 