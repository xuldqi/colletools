import { PDFDocument, PDFTextField, PDFCheckBox, PDFDropdown, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { OCRService } from './ocrService.js';

export interface PDFMergeOptions {
  outputFileName?: string;
  pageRange?: string;
}

export class PDFService {
  private static uploadsDir = path.join(process.cwd(), 'uploads');
  private static outputDir = path.join(process.cwd(), 'output');

  static async ensureDirectories() {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  static async mergePDFs(filePaths: string[], options: PDFMergeOptions = {}): Promise<string> {
    await this.ensureDirectories();
    
    const mergedPdf = await PDFDocument.create();
    
    for (const filePath of filePaths) {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      
      const pdfBytes = fs.readFileSync(filePath);
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      
      pages.forEach((page) => mergedPdf.addPage(page));
    }
    
    const outputFileName = options.outputFileName || `merged_${Date.now()}.pdf`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    const pdfBytes = await mergedPdf.save();
    fs.writeFileSync(outputPath, pdfBytes);
    
    // Schedule file deletion after 1 hour
    setTimeout(() => {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    }, 60 * 60 * 1000);
    
    return outputPath;
  }
  
  static async splitPDF(filePath: string, pageRanges: string[]): Promise<string[]> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const pdfBytes = fs.readFileSync(filePath);
    const pdf = await PDFDocument.load(pdfBytes);
    const totalPages = pdf.getPageCount();
    
    const outputPaths: string[] = [];
    
    for (let i = 0; i < pageRanges.length; i++) {
      const range = pageRanges[i];
      const newPdf = await PDFDocument.create();
      
      // Parse page range (e.g., "1-3", "5", "7-9")
      const [start, end] = range.split('-').map(n => parseInt(n.trim()) - 1);
      const startPage = Math.max(0, start);
      const endPage = end !== undefined ? Math.min(totalPages - 1, end) : startPage;
      
      const pageIndices = [];
      for (let pageIndex = startPage; pageIndex <= endPage; pageIndex++) {
        pageIndices.push(pageIndex);
      }
      
      const pages = await newPdf.copyPages(pdf, pageIndices);
      pages.forEach((page) => newPdf.addPage(page));
      
      const outputFileName = `split_${Date.now()}_part${i + 1}.pdf`;
      const outputPath = path.join(this.outputDir, outputFileName);
      
      const splitPdfBytes = await newPdf.save();
      fs.writeFileSync(outputPath, splitPdfBytes);
      
      outputPaths.push(outputPath);
      
      // Schedule file deletion after 1 hour
      setTimeout(() => {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      }, 60 * 60 * 1000);
    }
    
    return outputPaths;
  }
  
  static async compressPDF(filePath: string, quality: number = 0.7): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const pdfBytes = fs.readFileSync(filePath);
    const pdf = await PDFDocument.load(pdfBytes);
    
    // Basic compression by re-saving the PDF
    // Note: quality parameter is for future enhancement with advanced compression
    const outputFileName = `compressed_${Date.now()}.pdf`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    const compressedBytes = await pdf.save({
      useObjectStreams: quality > 0.5,
      addDefaultPage: false
    });
    
    fs.writeFileSync(outputPath, compressedBytes);
    
    // Schedule file deletion after 1 hour
    setTimeout(() => {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    }, 60 * 60 * 1000);
    
    return outputPath;
  }
  
  /**
   * Extract text from PDF using OCR
   */
  static async extractTextFromPDF(filePath: string, options: { language?: string } = {}): Promise<{ text: string; confidence: number }> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    try {
      return await OCRService.extractTextFromPDF(filePath, options);
    } catch (error) {
      throw new Error(`PDF OCR failed: ${error.message}`);
    }
  }
  
  /**
   * Fill PDF form fields
   */
  static async fillPDFForm(filePath: string, formData: Record<string, string | boolean>): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    try {
      const pdfBytes = fs.readFileSync(filePath);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const form = pdfDoc.getForm();
      
      // Fill form fields based on provided data
      Object.entries(formData).forEach(([fieldName, value]) => {
        try {
          const field = form.getField(fieldName);
          
          if (field instanceof PDFTextField) {
            field.setText(String(value));
          } else if (field instanceof PDFCheckBox) {
            if (value) {
              field.check();
            } else {
              field.uncheck();
            }
          } else if (field instanceof PDFDropdown) {
            field.select(String(value));
          }
        } catch (error) {
          console.warn(`Could not fill field ${fieldName}:`, error.message);
        }
      });
      
      const outputFileName = `form_filled_${Date.now()}.pdf`;
      const outputPath = path.join(this.outputDir, outputFileName);
      
      const filledPdfBytes = await pdfDoc.save();
      fs.writeFileSync(outputPath, filledPdfBytes);
      
      // Schedule file deletion after 1 hour
      setTimeout(() => {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      }, 60 * 60 * 1000);
      
      return outputPath;
    } catch (error) {
      throw new Error(`PDF form filling failed: ${error.message}`);
    }
  }
  
  /**
   * Add digital signature to PDF
   */
  static async addSignatureToPDF(filePath: string, signatureOptions: {
    text: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    page?: number;
  }): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    try {
      const pdfBytes = fs.readFileSync(filePath);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      
      const pageIndex = (signatureOptions.page || 1) - 1;
      if (pageIndex < 0 || pageIndex >= pages.length) {
        throw new Error(`Page ${signatureOptions.page} does not exist`);
      }
      
      const page = pages[pageIndex];
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      // Add signature text
      page.drawText(signatureOptions.text, {
        x: signatureOptions.x,
        y: signatureOptions.y,
        size: 12,
        font: font,
        color: rgb(0, 0, 0)
      });
      
      // Add signature box
      if (signatureOptions.width && signatureOptions.height) {
        page.drawRectangle({
          x: signatureOptions.x - 5,
          y: signatureOptions.y - 5,
          width: signatureOptions.width,
          height: signatureOptions.height,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1
        });
      }
      
      const outputFileName = `signed_${Date.now()}.pdf`;
      const outputPath = path.join(this.outputDir, outputFileName);
      
      const signedPdfBytes = await pdfDoc.save();
      fs.writeFileSync(outputPath, signedPdfBytes);
      
      // Schedule file deletion after 1 hour
      setTimeout(() => {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      }, 60 * 60 * 1000);
      
      return outputPath;
    } catch (error) {
      throw new Error(`PDF signature failed: ${error.message}`);
    }
  }
  
  /**
   * Add watermark to PDF
   */
  static async addWatermarkToPDF(filePath: string, watermarkOptions: {
    text: string;
    opacity?: number;
    fontSize?: number;
    rotation?: number;
    color?: { r: number; g: number; b: number };
  }): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    try {
      const pdfBytes = fs.readFileSync(filePath);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      const opacity = watermarkOptions.opacity || 0.3;
      const fontSize = watermarkOptions.fontSize || 48;
      const rotation = watermarkOptions.rotation || -45;
      const color = watermarkOptions.color || { r: 0.5, g: 0.5, b: 0.5 };
      
      // Add watermark to all pages
      pages.forEach(page => {
        const { width, height } = page.getSize();
        
        page.drawText(watermarkOptions.text, {
          x: width / 2,
          y: height / 2,
          size: fontSize,
          font: font,
          color: rgb(color.r, color.g, color.b),
          opacity: opacity,
          rotate: { type: 'degrees', angle: rotation },
          xSkew: { type: 'degrees', angle: 0 },
          ySkew: { type: 'degrees', angle: 0 }
        });
      });
      
      const outputFileName = `watermarked_${Date.now()}.pdf`;
      const outputPath = path.join(this.outputDir, outputFileName);
      
      const watermarkedPdfBytes = await pdfDoc.save();
      fs.writeFileSync(outputPath, watermarkedPdfBytes);
      
      // Schedule file deletion after 1 hour
      setTimeout(() => {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      }, 60 * 60 * 1000);
      
      return outputPath;
    } catch (error) {
      throw new Error(`PDF watermark failed: ${error.message}`);
    }
  }
}