import { NextRequest, NextResponse } from 'next/server';

// Helper function to ensure we always return proper JSON
const safeResponse = (data: any, status: number = 200) => {
  try {
    // Make sure we're sending proper JSON
    return NextResponse.json(data, { status });
  } catch (error) {
    console.error('Error creating JSON response:', error);
    // Emergency fallback if something is wrong with the data
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`API: GET /api/project/${params.id} request received`);
    
    const id = params.id;
    
    if (!id) {
      return safeResponse({ error: 'Project ID is required' }, 400);
    }
    
    console.log(`API: Fetching project with ID: ${id}`);
    
    // In a real implementation, you would fetch the project from the database
    // For now, return a mock project
    return safeResponse({
      success: true,
      project: {
        _id: id,
        name: `Project ${id}`,
        description: 'This is a mock project',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error(`Error in GET /api/project/${params.id}:`, error);
    return safeResponse({ error: 'Failed to fetch project' }, 500);
  }
} 