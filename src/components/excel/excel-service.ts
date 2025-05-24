import ExcelJS from 'exceljs';
import { db } from '@/lib/db';
import path from 'path';
import fs from 'fs/promises';

export class ExcelService {
  private static instance: ExcelService;
  private backupPath: string;
  
  constructor() {
    // Store in a designated backup folder
    this.backupPath = process.env.BACKUP_PATH || './backups';
  }
  
  static getInstance() {
    if (!ExcelService.instance) {
      ExcelService.instance = new ExcelService();
    }
    return ExcelService.instance;
  }
  
  async generateWorkbook() {
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
  
  async updateBackup() {
    try {
      // Ensure backup directory exists
      await fs.mkdir(this.backupPath, { recursive: true });
      
      const workbook = await this.generateWorkbook();
      const filePath = path.join(this.backupPath, 'membership_data.xlsx');
      
      // Save the workbook
      await workbook.xlsx.writeFile(filePath);
      
      // Also save a timestamped version monthly
      const now = new Date();
      if (now.getDate() === 1) { // First day of month
        const monthlyPath = path.join(
          this.backupPath, 
          `membership_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}.xlsx`
        );
        await workbook.xlsx.writeFile(monthlyPath);
      }
      
      return filePath;
    } catch (error) {
      console.error('Failed to update Excel backup:', error);
      throw error;
    }
  }
} 