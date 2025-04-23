import { Metadata } from "next"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { DocsPageHeader } from "@/components/docs-page-header"
import { DocsPager } from "@/components/docs-pager"
import Link from "next/link"
import { sidebarNav } from "@/components/docs/constant"
import { getTableOfContents } from "@/lib/toc"
import { TableOfContents } from "@/components/docs/table-of-contents"

interface DocPageProps {
  params: {
    slug?: string[]
  }
}

const DOCS_DIRECTORY = path.join(process.cwd(), "src/content/docs")

export interface DocType {
  title: string
  description: string
  slugAsParams: string
  content: string
  previous?: {
    title: string
    href: string
  }
  next?: {
    title: string
    href: string
  }
}

// Get document by slug
async function getDocBySlug(slug: string): Promise<DocType | null> {
  try {
    // Try the direct file path first
    let filePath = path.join(DOCS_DIRECTORY, `${slug}.mdx`)
    
    // If direct file doesn't exist, try index.mdx in a subdirectory
    if (!fs.existsSync(filePath)) {
      filePath = path.join(DOCS_DIRECTORY, slug, "index.mdx")
      if (!fs.existsSync(filePath)) {
        console.log(`No MDX file found for slug: ${slug}`)
        return null
      }
    }
    
    // Read and parse the MDX file
    const fileContent = fs.readFileSync(filePath, "utf-8")
    const { data, content } = matter(fileContent)
    
    // Return the parsed document
    return {
      title: data.title || "",
      description: data.description || "",
      slugAsParams: slug,
      content: content
    }
  } catch (error) {
    console.error(`Error loading document for slug "${slug}":`, error)
    return null
  }
}

// Simple function to convert MDX content to HTML
function mdxToHtml(content: string): string {
  // Process inline content with links and formatting
  function processInlineContent(text: string): string {
    return text
      // Links - process these first to avoid conflicts with other formatting
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="font-medium text-blue-600 underline hover:text-blue-800">$1</a>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="relative rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-800">$1</code>');
  }

  // Generate ID for headings
  function generateId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  // Add stand-in HTML for custom components
  content = content.replace(/<EquipmentImages\s*\/>/g, 
    `<div class="equipment-images-container">
      <div class="w-full overflow-x-auto whitespace-nowrap py-2" style="display: block">
        <span class="inline-block w-14 mx-1 text-center align-top">
          <img src="/kit/freja300.png" alt="Freja 300" class="w-12 h-12 object-contain border rounded p-1 mx-auto hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" />
          <span class="text-xs block truncate">Freja 300</span>
        </span>
        <span class="inline-block w-14 mx-1 text-center align-top">
          <img src="/kit/sverker750.png" alt="Sverker 750" class="w-12 h-12 object-contain border rounded p-1 mx-auto hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" />
          <span class="text-xs block truncate">Sverker 750</span>
        </span>
        <span class="inline-block w-14 mx-1 text-center align-top">
          <img src="/kit/cmc356.png" alt="CMC 356" class="w-12 h-12 object-contain border rounded p-1 mx-auto hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" />
          <span class="text-xs block truncate">CMC 356</span>
        </span>
        <span class="inline-block w-14 mx-1 text-center align-top">
          <img src="/kit/dlro600.png" alt="DLRO 600" class="w-12 h-12 object-contain border rounded p-1 mx-auto hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" />
          <span class="text-xs block truncate">DLRO 600</span>
        </span>
      </div>
    </div>`
  );

  // Also handle RelayEquipmentDisplay
  content = content.replace(/<RelayEquipmentDisplay\s*\/>/g, 
    `<div class="relay-equipment-display">
      <h2>Equipment Selection</h2>
      <div class="w-full overflow-x-auto whitespace-nowrap py-2" style="display: block">
        <span class="inline-block w-14 mx-1 text-center align-top">
          <img src="/kit/freja300.png" alt="freja300" class="w-12 h-12 object-contain border rounded p-1 mx-auto hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" />
          <span class="text-xs block truncate">freja300</span>
        </span>
        <span class="inline-block w-14 mx-1 text-center align-top">
          <img src="/kit/sverker750.png" alt="sverker750" class="w-12 h-12 object-contain border rounded p-1 mx-auto hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" />
          <span class="text-xs block truncate">sverker750</span>
        </span>
        <span class="inline-block w-14 mx-1 text-center align-top">
          <img src="/kit/cmc356.png" alt="cmc356" class="w-12 h-12 object-contain border rounded p-1 mx-auto hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" />
          <span class="text-xs block truncate">cmc356</span>
        </span>
        <span class="inline-block w-14 mx-1 text-center align-top">
          <img src="/kit/dlro600.png" alt="dlro600" class="w-12 h-12 object-contain border rounded p-1 mx-auto hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" />
          <span class="text-xs block truncate">dlro600</span>
        </span>
      </div>
    </div>`
  );

  // This is a very basic conversion to apply styling directly
  let lines = content.split('\n');
  let html = '';
  let inList = false;
  let inCodeBlock = false;
  let inActivitiesSection = false; // Track if we're in an Activities section
  let listItems: string[] = [];
  let currentListItemDescription = '';
  let codeContent = '';
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    const rawLine = lines[i]; // Preserve indentation for activity descriptions
    
    // Skip frontmatter
    if (line === '---' && (i === 0 || html === '')) {
      // Skip until the closing ---
      let j = i + 1;
      while (j < lines.length && lines[j].trim() !== '---') {
        j++;
      }
      i = j; // Skip to the end of frontmatter
      continue;
    }
    
    // Handle code blocks
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        html += '<pre class="mb-4 mt-6 overflow-x-auto rounded-lg bg-slate-900 p-4 text-white"><code>';
      } else {
        inCodeBlock = false;
        html += '</code></pre>';
      }
      continue;
    }
    
    if (inCodeBlock) {
      html += line + '\n';
      continue;
    }
    
    // Check for Activities section
    if (line.startsWith('## Activities') || line.startsWith('## Test Placeholders')) {
      inActivitiesSection = true;
      const headingText = line.substring(3);
      const headingId = generateId(headingText);
      html += `<h2 id="${headingId}" class="mt-8 scroll-m-20 text-3xl font-semibold tracking-tight">${processInlineContent(headingText)}</h2>`;
      continue;
    }
    // Check for any other heading - ends an Activities section
    else if (line.startsWith('## ') && inActivitiesSection) {
      inActivitiesSection = false;
    }
    
    // Handle indented description lines in Activities section
    if (inActivitiesSection && inList && rawLine.startsWith('    ') && line !== '') {
      // Add to the current list item description
      if (currentListItemDescription === '') {
        currentListItemDescription = `<div class="pl-2 text-sm text-gray-600 mt-1">${processInlineContent(line)}</div>`;
      } else {
        currentListItemDescription += `<br>${processInlineContent(line)}`;
      }
      continue;
    }
    
    // Handle headings
    if (line.startsWith('# ')) {
      const headingText = line.substring(2);
      const headingId = generateId(headingText);
      html += `<h1 id="${headingId}" class="mt-10 scroll-m-20 text-4xl font-bold tracking-tight">${processInlineContent(headingText)}</h1>`;
    }
    else if (line.startsWith('## ')) {
      const headingText = line.substring(3);
      const headingId = generateId(headingText);
      html += `<h2 id="${headingId}" class="mt-8 scroll-m-20 text-3xl font-semibold tracking-tight">${processInlineContent(headingText)}</h2>`;
    }
    else if (line.startsWith('### ')) {
      const headingText = line.substring(4);
      const headingId = generateId(headingText);
      html += `<h3 id="${headingId}" class="mt-6 scroll-m-20 text-2xl font-semibold tracking-tight">${processInlineContent(headingText)}</h3>`;
    }
    else if (line.startsWith('#### ')) {
      const headingText = line.substring(5);
      const headingId = generateId(headingText);
      html += `<h4 id="${headingId}" class="mt-4 scroll-m-20 text-xl font-semibold tracking-tight">${processInlineContent(headingText)}</h4>`;
    }
    // Handle bullet lists
    else if (line.startsWith('- ')) {
      if (!inList) {
        inList = true;
        listItems = [];
      }
      
      // If we have a description from a previous item, add it to the last list item
      if (currentListItemDescription !== '' && listItems.length > 0) {
        // Update the last item with the description
        listItems[listItems.length - 1] = listItems[listItems.length - 1].replace('</li>', `${currentListItemDescription}</li>`);
        currentListItemDescription = '';
      }
      
      // Process the list item content for links, bold, etc.
      const processedContent = processInlineContent(line.substring(2));
      listItems.push(`<li class="mt-2">${processedContent}</li>`);
    }
    // Handle numbered lists
    else if (/^\d+\.\s/.test(line)) {
      if (!inList) {
        inList = true;
        listItems = [];
      }
      
      // If we have a description from a previous item, add it to the last list item
      if (currentListItemDescription !== '' && listItems.length > 0) {
        // Update the last item with the description
        listItems[listItems.length - 1] = listItems[listItems.length - 1].replace('</li>', `${currentListItemDescription}</li>`);
        currentListItemDescription = '';
      }
      
      const text = line.replace(/^\d+\.\s/, '');
      // Process the list item content for links, bold, etc.
      const processedContent = processInlineContent(text);
      listItems.push(`<li class="mt-2">${processedContent}</li>`);
    }
    // Handle direct links on their own line (common in Activity lists)
    else if (line.match(/^\[.*?\]\(.*?\)$/) || (inActivitiesSection && line.indexOf('[') !== -1)) {
      if (!inList) {
        inList = true;
        listItems = [];
      }
      
      // If we have a description from a previous item, add it to the last list item
      if (currentListItemDescription !== '' && listItems.length > 0) {
        // Update the last item with the description
        listItems[listItems.length - 1] = listItems[listItems.length - 1].replace('</li>', `${currentListItemDescription}</li>`);
        currentListItemDescription = '';
      }
      
      // Process just the link
      const processedContent = processInlineContent(line);
      listItems.push(`<li class="mt-2">${processedContent}</li>`);
    }
    // Handle blockquotes
    else if (line.startsWith('> ')) {
      html += `<blockquote class="mt-6 border-l-4 border-slate-200 pl-6 italic text-slate-800">${processInlineContent(line.substring(2))}</blockquote>`;
    }
    // Handle horizontal rule
    else if (line === '---') {
      html += `<hr class="my-8 border-slate-200" />`;
    }
    // Handle regular paragraphs
    else if (line !== '') {
      if (inList) {
        // If we have a description from a previous item, add it to the last list item
        if (currentListItemDescription !== '' && listItems.length > 0) {
          // Update the last item with the description
          listItems[listItems.length - 1] = listItems[listItems.length - 1].replace('</li>', `${currentListItemDescription}</li>`);
          currentListItemDescription = '';
        }
        
        // Close the list before starting a paragraph
        if (listItems.length > 0) {
          html += `<ul class="my-6 ml-6 list-disc">${listItems.join('')}</ul>`;
          listItems = [];
          inList = false;
        }
      }
      
      // Process the paragraph content
      const processedContent = processInlineContent(line);
      html += `<p class="leading-7 [&:not(:first-child)]:mt-6">${processedContent}</p>`;
    }
    else {
      // Empty line - if we were in a list, close it
      if (inList && listItems.length > 0) {
        // If we have a description from the last item, add it before closing the list
        if (currentListItemDescription !== '') {
          // Update the last item with the description
          listItems[listItems.length - 1] = listItems[listItems.length - 1].replace('</li>', `${currentListItemDescription}</li>`);
          currentListItemDescription = '';
        }
        
        html += `<ul class="my-6 ml-6 list-disc">${listItems.join('')}</ul>`;
        listItems = [];
        inList = false;
      }
    }
  }
  
  // Close any open lists at the end
  if (inList && listItems.length > 0) {
    // If we have a description from the last item, add it before closing the list
    if (currentListItemDescription !== '') {
      // Update the last item with the description
      listItems[listItems.length - 1] = listItems[listItems.length - 1].replace('</li>', `${currentListItemDescription}</li>`);
    }
    
    html += `<ul class="my-6 ml-6 list-disc">${listItems.join('')}</ul>`;
  }
  
  return html;
}

// Function to get a document from URL parameters
async function getDocFromParams(params: DocPageProps["params"]) {
  try {
    const slug = params?.slug?.join("/") || ""
    return await getDocBySlug(slug)
  } catch (error) {
    console.error("Error in getDocFromParams:", error)
    return null
  }
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  try {
    const doc = await getDocFromParams(params)
    
    if (!doc) {
      return {
        title: "Documentation",
        description: "Documentation page",
      }
    }
    
    return {
      title: doc.title,
      description: doc.description,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Documentation",
      description: "Documentation page",
    }
  }
}

// Main page component
export default async function DocPage({ params }: DocPageProps) {
  try {
    // If no slug, load the index.mdx from the docs directory
    if (!params.slug || params.slug.length === 0) {
      const doc = await getDocBySlug("");
      
      if (!doc) {
        return (
          <main className="relative py-6 lg:gap-10 lg:py-10">
            <div className="mx-auto w-full min-w-0">
              <h1 className="text-2xl font-bold mb-6 text-red-600">Error: Documentation index not found</h1>
              <p>The main documentation index file could not be loaded.</p>
            </div>
          </main>
        );
      }
      
      // Generate table of contents for the index page
      const toc = await getTableOfContents(doc.content);
      
      // Render the index content
      return (
        <main className="relative py-6 lg:gap-10 lg:py-10">
          <div className="mx-auto w-full min-w-0 pr-0 lg:pr-64">
            <DocsPageHeader heading={doc.title} text={doc.description} />
            
            <div className="prose prose-slate dark:prose-invert max-w-none mt-8"
              dangerouslySetInnerHTML={{ __html: mdxToHtml(doc.content) }}
            />
            
            <div className="hidden lg:block">
              <TableOfContents toc={toc} />
            </div>
          </div>
        </main>
      )
    }

    // Try to load the document
    const doc = await getDocFromParams(params)

    if (!doc) {
      return (
        <main className="relative py-6 lg:gap-10 lg:py-10">
          <div className="mx-auto w-full min-w-0">
            <h1 className="text-2xl font-bold mb-6 text-red-600">Document not found: {params.slug.join("/")}</h1>
            <Link href="/docs" className="text-blue-500 hover:underline">
              Return to Documentation Home
            </Link>
          </div>
        </main>
      )
    }

    // Generate table of contents
    const toc = await getTableOfContents(doc.content);

    // Render the content
    return (
      <main className="relative py-6 lg:gap-10 lg:py-10">
        <div className="mx-auto w-full min-w-0 pr-0 lg:pr-64">
          <DocsPageHeader heading={doc.title} text={doc.description} />
          
          <div className="prose prose-slate dark:prose-invert max-w-none mt-8"
            dangerouslySetInnerHTML={{ __html: mdxToHtml(doc.content) }}
          />
          
          <div className="hidden lg:block">
            <TableOfContents toc={toc} />
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error("Error in DocPage:", error)
    return (
      <main className="relative py-6 lg:gap-10 lg:py-10">
        <div className="mx-auto w-full min-w-0">
          <h1 className="text-2xl font-bold mb-6 text-red-600">An error occurred</h1>
          <p className="mb-4">There was a problem rendering the documentation.</p>
          <Link href="/docs" className="text-blue-500 hover:underline">
            Return to Documentation Home
          </Link>
        </div>
      </main>
    )
  }
} 