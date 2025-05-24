// This is a simple test script for the Excel backup functionality
// Run it with Node.js directly

// Set environment variable for backup path
process.env.BACKUP_PATH = 'C:\\nmbd-backups';

console.log('Testing Excel backup...');
console.log('Backup path:', process.env.BACKUP_PATH);

// Import dependencies directly
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs/promises');

async function testBackup() {
  try {
    console.log('Creating backup directory...');
    await fs.mkdir(process.env.BACKUP_PATH, { recursive: true });
    
    // Create a simple test workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Test');
    
    // Add some data
    sheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Date', key: 'date', width: 20 }
    ];
    
    // Add a row
    sheet.addRow({ id: 1, name: 'Test User', date: new Date().toISOString() });
    
    // Save to backup location
    const filePath = path.join(process.env.BACKUP_PATH, 'test_backup.xlsx');
    await workbook.xlsx.writeFile(filePath);
    
    console.log('Backup file created successfully at:', filePath);
    return filePath;
  } catch (error) {
    console.error('Backup failed:', error);
    return null;
  }
}

testBackup()
  .then(result => {
    if (result) {
      console.log('Test completed successfully!');
      process.exit(0);
    } else {
      console.log('Test failed!');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  }); 