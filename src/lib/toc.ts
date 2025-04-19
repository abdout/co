import { TableOfContents } from "@/types/toc"

export async function getTableOfContents(content: string): Promise<TableOfContents> {
  console.log("============ TOC ANALYZER START ============");
  console.log("RAW CONTENT ANALYSIS");
  console.log("Content length:", content.length);
  console.log("First 200 chars:", JSON.stringify(content.substring(0, 200)));
  console.log("First 200 chars hex:", content.substring(0, 200).split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' '));
  
  // Check for CR, LF, and CRLF
  const crCount = (content.match(/\r(?!\n)/g) || []).length;
  const lfCount = (content.match(/(?<!\r)\n/g) || []).length;
  const crlfCount = (content.match(/\r\n/g) || []).length;
  console.log("Line ending counts - CR only:", crCount, "LF only:", lfCount, "CRLF:", crlfCount);
  
  // Split content into lines for analysis
  let lines = [];
  if (crCount > 0 && lfCount === 0 && crlfCount === 0) {
    console.log("CR line endings detected");
    lines = content.split('\r');
  } else if (crCount === 0 && lfCount > 0 && crlfCount === 0) {
    console.log("LF line endings detected");
    lines = content.split('\n');
  } else if (crCount === 0 && lfCount === 0 && crlfCount > 0) {
    console.log("CRLF line endings detected");
    lines = content.split('\r\n');
  } else {
    console.log("Mixed line endings detected, using standard split");
    lines = content.split(/\r\n|\r|\n/);
  }
  
  console.log("Line count after split:", lines.length);
  console.log("First 5 lines with hex:");
  lines.slice(0, 5).forEach((line, i) => {
    console.log(`Line ${i+1} (${line.length} chars):`, JSON.stringify(line));
    console.log(`Line ${i+1} hex:`, line.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' '));
  });
  
  // Find heading lines with multiple methods
  console.log("\nHEADING DETECTION ANALYSIS");
  
  // Method 1: Standard regex
  const headingLinesStandard = lines.filter(line => line.match(/^#{1,6}\s+/));
  console.log("Method 1 - Standard regex found", headingLinesStandard.length, "headings");
  
  // Method 2: Trimmed regex
  const headingLinesTrimmed = lines.filter(line => line.trim().match(/^#{1,6}\s+/));
  console.log("Method 2 - Trimmed regex found", headingLinesTrimmed.length, "headings");
  
  // Method 3: Raw string starts with
  const headingLinesStartsWith = lines.filter(line => line.startsWith('#'));
  console.log("Method 3 - Starts with # found", headingLinesStartsWith.length, "headings");
  
  // Use the most effective method
  const headingLines = headingLinesTrimmed.length > headingLinesStandard.length ? 
                       headingLinesTrimmed : headingLinesStandard;
  
  console.log("\nFOUND HEADING LINES:", headingLines.length);
  headingLines.forEach((line, i) => {
    console.log(`Heading ${i+1}:`, JSON.stringify(line));
    console.log(`Heading ${i+1} hex:`, line.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' '));
  });
  
  // Process headings with detailed logging
  console.log("\nPROCESSING HEADINGS");
  const headings = headingLines.map((raw, i) => {
    console.log(`\nProcessing heading line ${i+1}:`, JSON.stringify(raw));
    
    // Try different regex approaches
    const standard = raw.match(/^(#{1,6})\s+(.*)$/);
    const trimmed = raw.trim().match(/^(#{1,6})\s+(.*)$/);
    const permissive = raw.match(/^(#+)\s+(.*?)$/);
    const noLineEnd = raw.match(/^(#{1,6})\s+([^]*)/);
    
    console.log("Standard regex match:", standard ? "YES" : "NO");
    console.log("Trimmed regex match:", trimmed ? "YES" : "NO");
    console.log("Permissive regex match:", permissive ? "YES" : "NO");
    console.log("No line end regex match:", noLineEnd ? "YES" : "NO");
    
    // Use the best match available
    const match = trimmed || permissive || noLineEnd || standard;
    
    if (!match) {
      console.log("NO MATCH FOUND for heading line:", JSON.stringify(raw));
      return null;
    }

    const level = match[1].length;
    const title = match[2].trim();
    
    // Create a slug from the title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    
    console.log(`Extracted - Level: ${level}, Title: "${title}", Slug: "${slug}"`);
    
    return {
      level,
      title,
      url: `#${slug}`,
    };
  }).filter(Boolean);
  
  console.log("\nEXTRACTED HEADINGS:", headings.length);
  headings.forEach((h, i) => console.log(`Heading ${i+1}:`, h));
  
  // Convert flat headings to nested structure
  console.log("\nBUILDING TOC STRUCTURE");
  const items: TableOfContents["items"] = [];
  const stack: any[] = [];

  headings.forEach((heading, i) => {
    if (!heading) return;
    
    console.log(`\nProcessing heading ${i+1}: ${heading.title} (Level ${heading.level})`);
    
    const item = {
      title: heading.title,
      url: heading.url,
      items: [],
    };

    if (stack.length === 0 || heading.level <= 2) {
      console.log(`Adding as top-level item (stack length: ${stack.length})`);
      items.push(item);
      stack.length = 0;
      stack.push({...item, level: heading.level});
      return;
    }

    // Find the parent heading
    let parent = stack[stack.length - 1];
    while (stack.length > 1 && parent && parent.level >= heading.level) {
      console.log(`Popping stack, parent level ${parent.level} >= heading level ${heading.level}`);
      stack.pop();
      parent = stack[stack.length - 1];
    }

    // Add this heading as a child of the parent
    if (parent && parent.items) {
      console.log(`Adding as child of "${parent.title}"`);
      parent.items.push(item);
    } else {
      console.log(`No suitable parent found, adding as top-level item`);
      items.push(item);
    }
    
    stack.push({...item, level: heading.level});
    console.log(`Stack depth now: ${stack.length}`);
  });

  console.log("\nFINAL TOC STRUCTURE:");
  console.log(JSON.stringify(items, null, 2));
  console.log("============ TOC ANALYZER END ============");
  
  return { items };
} 