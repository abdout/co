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

export async function GET(req: NextRequest) {
  try {
    console.log('API: GET /api/project request received');
    
    // Return empty projects array for now
    return safeResponse({ projects: [] });
  } catch (error) {
    console.error('Error in GET /api/project:', error);
    return safeResponse({ error: 'Failed to fetch projects' }, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('API: POST /api/project request received');
    
    let data;
    try {
      data = await req.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return safeResponse({ error: 'Invalid JSON in request body' }, 400);
    }
    
    // In a real implementation, you would save the project to the database
    // For now, just return the data with a mock ID
    return safeResponse({ 
      success: true,
      project: { 
        ...data,
        _id: `project_${Date.now()}` 
      } 
    }, 201);
  } catch (error) {
    console.error('Error in POST /api/project:', error);
    return safeResponse({ error: 'Failed to create project' }, 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    console.log('API: DELETE /api/project request received');
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return safeResponse({ error: 'Project ID is required' }, 400);
    }
    
    console.log(`API: Deleting project with ID: ${id}`);
    
    // In a real implementation, you would delete the project from the database
    return safeResponse({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/project:', error);
    return safeResponse({ error: 'Failed to delete project' }, 500);
  }
} 