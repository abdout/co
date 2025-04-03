/**
 * This file contains utilities for generating DOCX files for test reports
 * In a production application, you would use a library like docx.js or
 * create a backend API endpoint to handle document generation.
 */

import type { SaveOptions } from 'file-saver';

// Placeholder for actual document generation
// In a real implementation, you would use docx.js to create the document
export interface ReportData {
  // Report info
  client: string;
  contractor: string;
  consultant?: string;
  date: Date;
  clientLogo?: string | null;
  contractorLogo?: string | null;
  consultantLogo?: string | null;
  
  // Equipment info
  tag: string;
  panel: string;
  location: string;
  
  // Test details
  category: string;
  subcategory: string;
  activity: string;
  notes?: string;
  
  // Equipment list
  equipment: Array<{
    name: string;
    model: string;
    serialNumber: string;
    calibrationDate: string;
  }>;
  
  // Witness list
  witnesses: Array<{
    name: string;
    company: string;
    role: string;
    signature: string | null;
  }>;
  
  // Engineer details
  engineer: {
    name: string;
    id: string;
    signature?: string | null;
  };
}

/**
 * Generate a DOCX file from the report data
 * In a real implementation, this would create a DOCX document
 * @param reportData The data for the report
 * @returns A Promise that resolves to a Blob containing the document
 */
export async function generateDocx(reportData: ReportData): Promise<Blob> {
  console.log('Generating DOCX file with data:', reportData);
  
  // This is a placeholder - in a real app you would use a library like docx.js
  // to create the document, or call a backend API

  // Mock implementation that returns a simple text file pretending to be a DOCX
  // In reality, you would create a real DOCX document with proper formatting
  const mockDocContent = `
    Test Report
    ===========
    
    Client: ${reportData.client}
    Contractor: ${reportData.contractor}
    ${reportData.consultant ? `Consultant: ${reportData.consultant}` : ''}
    Date: ${reportData.date.toLocaleDateString()}
    
    Equipment: ${reportData.tag}
    Panel: ${reportData.panel}
    Location: ${reportData.location}
    
    Category: ${reportData.category}
    Subcategory: ${reportData.subcategory}
    Activity: ${reportData.activity}
    
    Equipment Used:
    ${reportData.equipment.map(e => `- ${e.name} (${e.model}), S/N: ${e.serialNumber}, Cal Due: ${e.calibrationDate}`).join('\n')}
    
    ${reportData.notes ? `Notes: ${reportData.notes}` : ''}
    
    Witnesses:
    ${reportData.witnesses.map(w => `- ${w.name} (${w.company}), ${w.role}`).join('\n')}
    
    Engineer: ${reportData.engineer.name} (${reportData.engineer.id})
  `;
  
  // Return a Blob pretending to be a DOCX file
  // In a real application, this would be a properly formatted DOCX document
  return new Blob([mockDocContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}

/**
 * Save a document to the user's device
 * @param blob The document as a Blob
 * @param filename The filename to save as
 */
export async function saveDocx(blob: Blob, filename: string) {
  try {
    // This is a simplified implementation.
    // In a real app, you would use file-saver or a similar library
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.docx') ? filename : `${filename}.docx`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    
    return true;
  } catch (error) {
    console.error('Error saving document:', error);
    return false;
  }
}

/**
 * Generate a report and save it to the user's device
 * @param reportData The data for the report
 * @param filename The filename to save as
 * @returns A Promise that resolves to a boolean indicating success
 */
export async function generateAndSaveReport(reportData: ReportData, filename: string): Promise<boolean> {
  try {
    const docBlob = await generateDocx(reportData);
    return await saveDocx(docBlob, filename);
  } catch (error) {
    console.error('Error generating and saving report:', error);
    return false;
  }
} 