/**
 * Helper function to detect if the current path is a project page and extract the project ID
 * @param pathname Current pathname from Next.js usePathname hook
 * @returns Object with isProjectPage boolean and projectId string if available
 */
export function getProjectNavInfo(pathname: string) {
  // Check if we're on a project page
  const projectPathRegex = /^\/project\/([^\/]+)/;
  const match = pathname.match(projectPathRegex);
  
  if (match && match[1]) {
    return {
      isProjectPage: true,
      projectId: match[1]
    };
  }
  
  return {
    isProjectPage: false,
    projectId: null
  };
} 