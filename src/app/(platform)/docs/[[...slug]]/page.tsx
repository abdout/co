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

    // ******* Extended debugging for ins-resist path *******
    const isTargetPath = slugs.join('/') === 'transformer/power-transformer/ins-resist'
    if (isTargetPath) {
      console.log('DEBUGGING TARGET PATH: transformer/power-transformer/ins-resist')
      
      // Check if the content directory exists
      const contentDir = path.join(process.cwd(), 'content')
      console.log(`Content directory exists: ${fs.existsSync(contentDir)}`)
      
      // Check if the docs directory exists
      const docsDir = path.join(contentDir, 'docs')
      console.log(`Docs directory exists: ${fs.existsSync(docsDir)}`)
      
      // Check if transformer dir exists
      const transformerDir = path.join(docsDir, 'transformer')
      console.log(`Transformer directory exists: ${fs.existsSync(transformerDir)}`)
      
      if (fs.existsSync(transformerDir)) {
        // List files in transformer dir
        console.log('Files in transformer directory:')
        fs.readdirSync(transformerDir).forEach(file => {
          console.log(`- ${file}`)
        })
        
        // Check power-transformer dir
        const powerTransformerDir = path.join(transformerDir, 'power-transformer')
        console.log(`Power-transformer directory exists: ${fs.existsSync(powerTransformerDir)}`)
        
        if (fs.existsSync(powerTransformerDir)) {
          // List files in power-transformer dir
          console.log('Files in power-transformer directory:')
          fs.readdirSync(powerTransformerDir).forEach(file => {
            console.log(`- ${file}`)
          })
        }
      }
    }
    
    // Try multiple possible paths
    const possiblePaths = [
      // Path 1: Exact path with .mdx extension
      path.join(process.cwd(), 'content', 'docs', ...slugs) + '.mdx',
      
      // Path 2: Directory path with index.mdx
      path.join(process.cwd(), 'content', 'docs', ...slugs, 'index.mdx'),
      
      // Path 3: Try with hyphens between slugs (common issue)
      path.join(process.cwd(), 'content', 'docs', slugs.join('-')) + '.mdx',
      
      // Path 4: Try with underscores between slugs
      path.join(process.cwd(), 'content', 'docs', slugs.join('_')) + '.mdx',
      
      // Path 5: Try with the first slug as directory and remaining as filename
      ...(slugs.length > 1 
        ? [path.join(process.cwd(), 'content', 'docs', slugs[0], slugs.slice(1).join('-') + '.mdx')]
        : []),
        
      // Path 6: Try with different case (some filesystems are case sensitive)
      path.join(process.cwd(), 'content', 'docs', ...slugs.map(s => s.toLowerCase())) + '.mdx',
      
      // Path 7: Try based on common slug format from sidebarData
      ...getPathsFromSidebar(slugs)
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
    
    // Last resort: scan the entire docs directory for a file with a similar name
    if (isTargetPath) {
      console.log('Attempting to find similar files in docs directory...')
      const similarFiles = findSimilarFiles(path.join(process.cwd(), 'content', 'docs'), 'ins-resist')
      console.log('Possible similar files:')
      similarFiles.forEach(file => console.log(`- ${file}`))
      
      // If we found exactly one similar file, use it
      if (similarFiles.length === 1) {
        console.log(`Using similar file: ${similarFiles[0]}`)
        return fs.readFileSync(similarFiles[0], 'utf8')
      }
    }
    
    return null
  } catch (error) {
    console.error('Error reading MDX file:', error)
    return null
  }
}

// Function to get potential paths from sidebar data
function getPathsFromSidebar(slugs: string[]): string[] {
  if (slugs.length !== 3) return []
  
  const paths: string[] = []
  
  // Find matching item in sidebar
  const item = sidebarData.find(item => 
    toSlug(item.item) === slugs[0]
  )
  
  if (!item) return paths
  
  // Find matching subitem
  const subitem = item.subitems.find(subitem => 
    toSlug(subitem.name) === slugs[1]
  )
  
  if (!subitem) return paths
  
  // Find matching activity
  const activityName = subitem.activities.find(activity => 
    toSlug(activity) === slugs[2]
  )
  
  if (!activityName) return paths
  
  // Create path based on the exact names in the sidebar
  const basePath = path.join(
    process.cwd(), 
    'content', 
    'docs'
  )
  
  // Try various combinations of item/subitem/activity file patterns
  paths.push(path.join(basePath, item.item, subitem.name, activityName + '.mdx'))
  paths.push(path.join(basePath, toSlug(item.item), toSlug(subitem.name), toSlug(activityName) + '.mdx'))
  paths.push(path.join(basePath, item.item.toLowerCase(), subitem.name.toLowerCase(), activityName.toLowerCase() + '.mdx'))
  
  return paths
}

// Function to recursively find files with similar names
function findSimilarFiles(dir: string, targetName: string): string[] {
  const results: string[] = []
  
  // Check if directory exists
  if (!fs.existsSync(dir)) return results
  
  const files = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    
    if (file.isDirectory()) {
      // Recurse into subdirectories
      results.push(...findSimilarFiles(fullPath, targetName))
    } else if (file.name.toLowerCase().includes(targetName.toLowerCase())) {
      // Check if filename includes the target name
      results.push(fullPath)
    }
  }
  
  return results
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
    return (
      <div className="py-8 px-4 mx-auto max-w-screen-md text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">Page Not Found</h1>
        <p className="mb-8 font-light text-gray-500 sm:text-xl">
          The documentation page you're looking for doesn't exist yet.
        </p>
        <p className="mb-4">
          Looking for: <code className="bg-gray-100 p-1 rounded">/docs/{slugs.join('/')}</code>
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <a href="/docs" className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
            Documentation Home
          </a>
        </div>
      </div>
    )
  }
  
  return (
    <div className="prose prose-blue max-w-none px-4 py-8">
      <MDXRemote source={content} />
    </div>
  )
} 