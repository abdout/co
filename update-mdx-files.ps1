# PowerShell script to update all index.mdx files
# This script will:
# 1. Find all index.mdx files in the content directory
# 2. Remove the duplicate title after the frontmatter
# 3. Remove section numbering (e.g., "## 1. Overview" -> "## Overview")

# Get all index.mdx files in the content directory
$indexFiles = Get-ChildItem -Path "src\content" -Recurse -Filter "index.mdx"

foreach ($file in $indexFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Replace patterns in the content
    
    # 1. Remove duplicate title (title that appears as an h1 after the frontmatter)
    $titlePattern = '(?s)(---.*?---\s*)\n# [A-Za-z][A-Za-z\s-]*\n'
    $content = $content -replace $titlePattern, '$1'
    
    # 2. Remove section numbering
    $content = $content -replace '## \d+\. ([A-Za-z])', '## $1'
    
    # Save the modified content back to the file
    Set-Content -Path $file.FullName -Value $content
    
    Write-Host "Updated: $($file.FullName)"
}

Write-Host "All index.mdx files have been updated!" 