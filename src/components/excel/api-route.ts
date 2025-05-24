import { NextRequest, NextResponse } from 'next/server';
import { ExcelService } from './excel-service';
import { currentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.role || !['ADMIN', 'MEMBERSHIP'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const excel = ExcelService.getInstance();
    const workbook = await excel.generateWorkbook();
    const buffer = await workbook.xlsx.writeBuffer();
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="membership_${new Date().toISOString().split('T')[0]}.xlsx"`
      }
    });
  } catch (error) {
    console.error('Backup download failed:', error);
    return NextResponse.json({ error: 'Failed to generate backup' }, { status: 500 });
  }
} 