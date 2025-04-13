import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { sidebarData } from '@/components/docs/constant'

// Helper function to convert a string to a slug
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

// Function to safely read params
async function readParams(params: any) {
  return params?.slug || []
}

// Function to get content based on slug path
async function getDocContent(slugs: string[] = []) {
  try {
    // If no slugs provided, show the index page
    if (slugs.length === 0) {
      const indexPath = path.join(process.cwd(), 'content', 'docs', 'index.mdx')
      if (fs.existsSync(indexPath)) {
        return fs.readFileSync(indexPath, 'utf8')
      }
      
      // Fallback content if index.mdx doesn't exist
      return `
# Documentation

Welcome to the documentation. Please select a topic from the sidebar.
      `
    }

    // Try multiple possible paths
    const possiblePaths = [
      // Path 1: Exact path with .mdx extension
      path.join(process.cwd(), 'content', 'docs', ...slugs) + '.mdx',
      
      // Path 2: Directory path with index.mdx
      path.join(process.cwd(), 'content', 'docs', ...slugs, 'index.mdx')
    ]

    // Check each possible path
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        console.log(`Found file at: ${filePath}`)
        return fs.readFileSync(filePath, 'utf8')
      }
    }
    
    console.log(`No file found for slugs: ${slugs.join('/')}`)
    console.log(`Tried paths:`)
    possiblePaths.forEach(p => console.log(`- ${p}`))
    
    return null
  } catch (error) {
    console.error('Error reading MDX file:', error)
    return null
  }
}

// Generate static paths at build time
export async function generateStaticParams() {
  const paths: { slug: string[] }[] = []
  
  // Add index path
  paths.push({ slug: [] })
  
  // Add paths for each item, subitem, and activity in the sidebar data
  sidebarData.forEach(itemData => {
    const itemSlug = toSlug(itemData.item)
    
    // Add path for the item
    paths.push({ slug: [itemSlug] })
    
    itemData.subitems.forEach(subitem => {
      const subitemSlug = toSlug(subitem.name)
      
      // Add path for the subitem
      paths.push({ slug: [itemSlug, subitemSlug] })
      
      subitem.activities.forEach(activity => {
        const activitySlug = toSlug(activity)
        
        // Add path for the activity
        paths.push({ slug: [itemSlug, subitemSlug, activitySlug] })
      })
    })
  })
  
  return paths
}

export default async function DocPage({ params }: { params: { slug?: string[] } }) {
  // Await the params to fix the error
  const slugs = await readParams(params)
  
  // Log the requested path for debugging
  console.log(`Requested path: /docs/${slugs.join('/')}`)
  
  const content = await getDocContent(slugs)
  
  if (!content) {
    console.log('Content not found, returning 404')
    notFound()
  }
  
  return <MDXRemote source={content} />
} 