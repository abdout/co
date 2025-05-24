'use server';

import ExcelJS from 'exceljs';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import path from 'path';
import fs from 'fs/promises';

/**
 * Server action to generate membership Excel file and return its contents as a base64 string
 */
export async function generateMembershipExcel(): Promise<{
  success: boolean;
  data?: string;
  filename?: string;
  error?: string;
}> {
  try {
    const user = await currentUser();
    if (!user?.role || !['ADMIN', 'MEMBERSHIP'].includes(user.role)) {
      return { success: false, error: 'Unauthorized' };
    }
    
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Members');
    
    // Set up columns
    sheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Full Name', key: 'fullname', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'WhatsApp', key: 'whatsapp', width: 15 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Birth Date', key: 'birthDate', width: 15 },
      { header: 'Current Country', key: 'currentCountry', width: 15 },
      { header: 'Current State', key: 'currentState', width: 15 },
      { header: 'Current Locality', key: 'currentLocality', width: 20 },
      { header: 'Education Level', key: 'educationLevel', width: 20 },
      { header: 'Institution', key: 'institution', width: 30 },
      { header: 'Major', key: 'major', width: 20 },
      { header: 'Current Occupation', key: 'currentOccupation', width: 25 },
      { header: 'Employment Sector', key: 'employmentSector', width: 20 },
      { header: 'Company', key: 'companyName', width: 25 },
      { header: 'Party Member', key: 'partyMember', width: 15 },
      { header: 'Party Name', key: 'partyName', width: 20 },
      { header: 'Application Status', key: 'applicationStatus', width: 15 },
      { header: 'Member Since', key: 'createdAt', width: 15 }
    ];
    
    // Style the header
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    // Get members data
    const members = await db.user.findMany({
      where: {
        OR: [
          { role: "MEMBER" },
          { role: "MEMBERSHIP" }
        ]
      },
      select: {
        name: true,
        fullname: true,
        email: true,
        phone: true,
        whatsapp: true,
        gender: true,
        birthDate: true,
        currentCountry: true,
        currentState: true,
        currentLocality: true,
        educationLevel: true,
        institution: true,
        major: true,
        currentOccupation: true,
        employmentSector: true,
        companyName: true,
        partyMember: true,
        partyName: true,
        applicationStatus: true,
        createdAt: true,
      }
    });
    
    // Add data rows
    members.forEach(member => {
      sheet.addRow({
        ...member,
        birthDate: member.birthDate ? new Date(member.birthDate).toLocaleDateString() : '',
        createdAt: member.createdAt ? new Date(member.createdAt).toLocaleDateString() : '',
        partyMember: member.partyMember ? 'Yes' : 'No'
      });
    });
    
    // Add auto-filter
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: sheet.columns.length }
    };
    
    // Generate buffer and convert to base64
    const buffer = await workbook.xlsx.writeBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');
    
    // Also update the backup file
    await updateExcelBackup(workbook);
    
    return {
      success: true,
      data: base64Data,
      filename: `membership_${new Date().toISOString().split('T')[0]}.xlsx`
    };
  } catch (error) {
    console.error('Excel generation failed:', error);
    return { success: false, error: 'Failed to generate Excel file' };
  }
}

/**
 * Updates the Excel backup files
 */
export async function updateExcelBackup(workbook?: ExcelJS.Workbook): Promise<string | null> {
  try {
    const backupPath = process.env.BACKUP_PATH || './backups';
    
    // Ensure backup directory exists
    await fs.mkdir(backupPath, { recursive: true });
    
    // If workbook is not provided, create a new one
    if (!workbook) {
      workbook = await generateMembershipWorkbook();
    }
    
    const filePath = path.join(backupPath, 'membership_data.xlsx');
    
    // Save the workbook
    await workbook.xlsx.writeFile(filePath);
    
    // Also save a timestamped version monthly
    const now = new Date();
    if (now.getDate() === 1) { // First day of month
      const monthlyPath = path.join(
        backupPath, 
        `membership_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}.xlsx`
      );
      await workbook.xlsx.writeFile(monthlyPath);
    }
    
    return filePath;
  } catch (error) {
    console.error('Failed to update Excel backup:', error);
    return null;
  }
}

/**
 * Generate a workbook without authorization checks
 * Used internally by the backup function
 */
async function generateMembershipWorkbook(): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Members');
  
  // Set up columns
  sheet.columns = [
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Full Name', key: 'fullname', width: 30 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'WhatsApp', key: 'whatsapp', width: 15 },
    { header: 'Gender', key: 'gender', width: 10 },
    { header: 'Birth Date', key: 'birthDate', width: 15 },
    { header: 'Current Country', key: 'currentCountry', width: 15 },
    { header: 'Current State', key: 'currentState', width: 15 },
    { header: 'Current Locality', key: 'currentLocality', width: 20 },
    { header: 'Education Level', key: 'educationLevel', width: 20 },
    { header: 'Institution', key: 'institution', width: 30 },
    { header: 'Major', key: 'major', width: 20 },
    { header: 'Current Occupation', key: 'currentOccupation', width: 25 },
    { header: 'Employment Sector', key: 'employmentSector', width: 20 },
    { header: 'Company', key: 'companyName', width: 25 },
    { header: 'Party Member', key: 'partyMember', width: 15 },
    { header: 'Party Name', key: 'partyName', width: 20 },
    { header: 'Application Status', key: 'applicationStatus', width: 15 },
    { header: 'Member Since', key: 'createdAt', width: 15 }
  ];
  
  // Style the header
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD3D3D3' }
  };
  
  // Get members data
  const members = await db.user.findMany({
    where: {
      OR: [
        { role: "MEMBER" },
        { role: "MEMBERSHIP" }
      ]
    },
    select: {
      name: true,
      fullname: true,
      email: true,
      phone: true,
      whatsapp: true,
      gender: true,
      birthDate: true,
      currentCountry: true,
      currentState: true,
      currentLocality: true,
      educationLevel: true,
      institution: true,
      major: true,
      currentOccupation: true,
      employmentSector: true,
      companyName: true,
      partyMember: true,
      partyName: true,
      applicationStatus: true,
      createdAt: true,
    }
  });
  
  // Add data rows
  members.forEach(member => {
    sheet.addRow({
      ...member,
      birthDate: member.birthDate ? new Date(member.birthDate).toLocaleDateString() : '',
      createdAt: member.createdAt ? new Date(member.createdAt).toLocaleDateString() : '',
      partyMember: member.partyMember ? 'Yes' : 'No'
    });
  });
  
  // Add auto-filter
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: sheet.columns.length }
  };
  
  return workbook;
} 