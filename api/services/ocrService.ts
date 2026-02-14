/**
 * OCR Service
 * Handles text recognition from images and documents using Tesseract.js
 */
import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export interface OCROptions {
  language?: string;
  psm?: number;
  oem?: number;
  whitelist?: string;
  blacklist?: string;
}

export interface OCRResult {
  text: string;
  confidence: number;
  words?: Array<{
    text: string;
    confidence: number;
    bbox: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
  lines?: Array<{
    text: string;
    confidence: number;
    bbox: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface BusinessCardData {
  name?: string;
  company?: string;
  title?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
}

export interface ReceiptData {
  merchant?: string;
  date?: string;
  total?: string;
  items?: Array<{
    name: string;
    price: string;
    quantity?: string;
  }>;
  tax?: string;
  subtotal?: string;
}

export class OCRService {
  /**
   * Extract text from image using OCR
   */
  static async extractTextFromImage(
    imagePath: string,
    options: OCROptions = {}
  ): Promise<OCRResult> {
    try {
      const { language = 'eng', psm = 6, oem = 3 } = options;
      
      // Preprocess image for better OCR results
      const processedImagePath = await this.preprocessImage(imagePath);
      
      const { data } = await Tesseract.recognize(
        processedImagePath,
        language,
        {
          logger: m => console.log(m),
          tessedit_pageseg_mode: psm,
          tessedit_ocr_engine_mode: oem,
          tessedit_char_whitelist: options.whitelist,
          tessedit_char_blacklist: options.blacklist,
        }
      );
      
      // Clean up processed image if it's different from original
      if (processedImagePath !== imagePath && fs.existsSync(processedImagePath)) {
        fs.unlinkSync(processedImagePath);
      }
      
      return {
        text: data.text.trim(),
        confidence: data.confidence,
        words: data.words?.map(word => ({
          text: word.text,
          confidence: word.confidence,
          bbox: word.bbox
        })),
        lines: data.lines?.map(line => ({
          text: line.text,
          confidence: line.confidence,
          bbox: line.bbox
        }))
      };
    } catch (error) {
      console.error('OCR extraction error:', error);
      throw new Error(`Failed to extract text from image: ${error.message}`);
    }
  }
  
  /**
   * Extract text from PDF using OCR
   */
  static async extractTextFromPDF(
    pdfPath: string,
    options: OCROptions = {}
  ): Promise<OCRResult> {
    try {
      // Convert PDF pages to images first
      const imagePages = await this.convertPDFToImages(pdfPath);
      
      let allText = '';
      let totalConfidence = 0;
      const allWords: Array<{ text: string; confidence: number; bbox: { x0: number; y0: number; x1: number; y1: number } }> = [];
      const allLines: Array<{ text: string; confidence: number; bbox: { x0: number; y0: number; x1: number; y1: number } }> = [];
      
      for (const imagePage of imagePages) {
        const result = await this.extractTextFromImage(imagePage, options);
        allText += result.text + '\n\n';
        totalConfidence += result.confidence;
        
        if (result.words) allWords.push(...result.words);
        if (result.lines) allLines.push(...result.lines);
        
        // Clean up temporary image
        if (fs.existsSync(imagePage)) {
          fs.unlinkSync(imagePage);
        }
      }
      
      return {
        text: allText.trim(),
        confidence: totalConfidence / imagePages.length,
        words: allWords,
        lines: allLines
      };
    } catch (error) {
      console.error('PDF OCR error:', error);
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  }
  
  /**
   * Recognize handwriting from image
   */
  static async recognizeHandwriting(
    imagePath: string,
    options: OCROptions = {}
  ): Promise<OCRResult> {
    // Use specific settings optimized for handwriting
    const handwritingOptions = {
      ...options,
      language: options.language || 'eng',
      psm: 8, // Single word mode for better handwriting recognition
      oem: 1   // Neural nets LSTM engine only
    };
    
    return this.extractTextFromImage(imagePath, handwritingOptions);
  }
  
  /**
   * Extract table data from image
   */
  static async extractTableFromImage(
    imagePath: string,
    options: OCROptions = {}
  ): Promise<TableData> {
    try {
      const result = await this.extractTextFromImage(imagePath, {
        ...options,
        psm: 6 // Uniform block of text
      });
      
      // Parse text into table structure
      const lines = result.text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        return { headers: [], rows: [] };
      }
      
      // Assume first line contains headers
      const headers = this.parseTableRow(lines[0]);
      const rows = lines.slice(1).map(line => this.parseTableRow(line));
      
      return { headers, rows };
    } catch (error) {
      console.error('Table extraction error:', error);
      throw new Error(`Failed to extract table: ${error.message}`);
    }
  }
  
  /**
   * Extract business card information
   */
  static async extractBusinessCard(
    imagePath: string,
    options: OCROptions = {}
  ): Promise<BusinessCardData> {
    try {
      const result = await this.extractTextFromImage(imagePath, options);
      const text = result.text;
      
      // Extract business card information using regex patterns
      const businessCard: BusinessCardData = {};
      
      // Email pattern
      const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
      if (emailMatch) businessCard.email = emailMatch[0];
      
      // Phone pattern
      const phoneMatch = text.match(/[+]?[1-9]?[-\s()]?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}/g);
      if (phoneMatch) businessCard.phone = phoneMatch[0];
      
      // Website pattern
      const websiteMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]*\.[^\s]{2,}/g);
      if (websiteMatch) businessCard.website = websiteMatch[0];
      
      // Extract name (usually first line or largest text)
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        businessCard.name = lines[0].trim();
      }
      
      // Extract company (heuristic: line with common company indicators)
      const companyLine = lines.find(line => 
        /\b(inc|llc|corp|company|ltd|limited)\b/i.test(line)
      );
      if (companyLine) businessCard.company = companyLine.trim();
      
      return businessCard;
    } catch (error) {
      console.error('Business card extraction error:', error);
      throw new Error(`Failed to extract business card: ${error.message}`);
    }
  }
  
  /**
   * Extract receipt information
   */
  static async extractReceipt(
    imagePath: string,
    options: OCROptions = {}
  ): Promise<ReceiptData> {
    try {
      const result = await this.extractTextFromImage(imagePath, options);
      const text = result.text;
      
      const receipt: ReceiptData = {
        items: []
      };
      
      // Extract total amount
      const totalMatch = text.match(/total[:\s]*\$?([\d,]+\.\d{2})/i);
      if (totalMatch) receipt.total = totalMatch[1];
      
      // Extract date
      const dateMatch = text.match(/(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/g);
      if (dateMatch) receipt.date = dateMatch[0];
      
      // Extract merchant (usually first few lines)
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        receipt.merchant = lines[0].trim();
      }
      
      // Extract tax
      const taxMatch = text.match(/tax[:\s]*\$?([\d,]+\.\d{2})/i);
      if (taxMatch) receipt.tax = taxMatch[1];
      
      // Extract subtotal
      const subtotalMatch = text.match(/subtotal[:\s]*\$?([\d,]+\.\d{2})/i);
      if (subtotalMatch) receipt.subtotal = subtotalMatch[1];
      
      return receipt;
    } catch (error) {
      console.error('Receipt extraction error:', error);
      throw new Error(`Failed to extract receipt: ${error.message}`);
    }
  }
  
  /**
   * Read license plate from image
   */
  static async readLicensePlate(
    imagePath: string,
    options: OCROptions = {}
  ): Promise<string> {
    try {
      const result = await this.extractTextFromImage(imagePath, {
        ...options,
        psm: 8, // Single word mode
        whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      });
      
      // Clean up the result to get license plate format
      const plateText = result.text.replace(/[^A-Z0-9]/g, '').trim();
      
      return plateText;
    } catch (error) {
      console.error('License plate reading error:', error);
      throw new Error(`Failed to read license plate: ${error.message}`);
    }
  }
  
  /**
   * Read QR code from image
   */
  static async readQRCode(imagePath: string): Promise<string> {
    try {
      // For QR code reading, we'll use a simple OCR approach
      // In a production environment, you might want to use a dedicated QR code library
      const result = await this.extractTextFromImage(imagePath, {
        psm: 6 // Uniform block of text
      });
      
      return result.text.trim();
    } catch (error) {
      console.error('QR code reading error:', error);
      throw new Error(`Failed to read QR code: ${error.message}`);
    }
  }
  
  /**
   * Preprocess image for better OCR results
   */
  private static async preprocessImage(imagePath: string): Promise<string> {
    try {
      const outputPath = path.join(
        path.dirname(imagePath),
        `processed_${path.basename(imagePath)}`
      );
      
      await sharp(imagePath)
        .greyscale()
        .normalize()
        .sharpen()
        .png()
        .toFile(outputPath);
      
      return outputPath;
    } catch (error) {
      console.error('Image preprocessing error:', error);
      // Return original path if preprocessing fails
      return imagePath;
    }
  }
  
  /**
   * Convert PDF to images for OCR processing
   */
  private static async convertPDFToImages(pdfPath: string): Promise<string[]> {
    try {
      // This is a simplified implementation
      // In production, you might want to use pdf2pic or similar library
      // const outputDir = path.dirname(pdfPath);
      // const baseName = path.basename(pdfPath, '.pdf');
      
      // For now, return the PDF path itself
      // This would need to be implemented with actual PDF to image conversion
      return [pdfPath];
    } catch (error) {
      console.error('PDF to image conversion error:', error);
      throw new Error(`Failed to convert PDF to images: ${error.message}`);
    }
  }
  
  /**
   * Parse table row into cells
   */
  private static parseTableRow(rowText: string): string[] {
    // Simple table parsing - split by multiple spaces or tabs
    return rowText.split(/\s{2,}|\t/).map(cell => cell.trim()).filter(cell => cell);
  }
}