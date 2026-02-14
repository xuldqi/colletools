/**
 * File Service
 * Handle file conversion and splitting operations
 */
import fs from 'fs/promises';
import { parse as csvParse } from 'csv-parse';
import { stringify as csvStringify } from 'csv-stringify';
import * as XLSX from 'xlsx';

export class FileService {
  /**
   * Split CSV file into smaller chunks
   */
  static async splitCSV(inputPath: string, options: {
    rowsPerFile: number;
    includeHeader: boolean;
  }): Promise<string[]> {
    const { rowsPerFile, includeHeader } = options;
    const outputFiles: string[] = [];
      
      try {
        const fileContent = await fs.readFile(inputPath, 'utf-8');
        let header: string[] = [];
      
      return new Promise((resolve, reject) => {
        csvParse(fileContent, {
          skip_empty_lines: true
        }, async (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          
          if (data.length === 0) {
            resolve([]);
            return;
          }
          
          header = data[0];
          const dataRows = data.slice(1);
          
          const chunks = [];
          for (let i = 0; i < dataRows.length; i += rowsPerFile) {
            chunks.push(dataRows.slice(i, i + rowsPerFile));
          }
          
          for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const outputPath = inputPath.replace('.csv', `_part${i + 1}.csv`);
            
            const csvData = includeHeader ? [header, ...chunk] : chunk;
            
            csvStringify(csvData, (err, output) => {
              if (err) {
                reject(err);
                return;
              }
              
              fs.writeFile(outputPath, output).then(() => {
                outputFiles.push(outputPath);
                
                if (outputFiles.length === chunks.length) {
                  resolve(outputFiles);
                }
              }).catch(reject);
            });
          }
        });
      });
    } catch (error) {
      throw new Error(`Failed to split CSV: ${error}`);
    }
  }
  
  /**
   * Split Excel file into smaller chunks
   */
  static async splitExcel(inputPath: string, options: {
    splitBy: 'rows' | 'sheets';
    rowsPerFile: number;
  }): Promise<string[]> {
    const { splitBy, rowsPerFile } = options;
    const outputFiles: string[] = [];
    
    try {
      const workbook = XLSX.readFile(inputPath);
      
      if (splitBy === 'sheets') {
        // Split by sheets
        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const newWorkbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(newWorkbook, worksheet, sheetName);
          
          const outputPath = inputPath.replace(/\.(xlsx|xls)$/, `_${sheetName}.$1`);
          XLSX.writeFile(newWorkbook, outputPath);
          outputFiles.push(outputPath);
        }
      } else {
        // Split by rows
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        
        if (jsonData.length === 0) {
          return [];
        }
        
        const header = jsonData[0];
        const dataRows = jsonData.slice(1);
        
        const chunks = [];
        for (let i = 0; i < dataRows.length; i += rowsPerFile) {
          chunks.push(dataRows.slice(i, i + rowsPerFile));
        }
        
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          const newWorkbook = XLSX.utils.book_new();
          const newWorksheet = XLSX.utils.aoa_to_sheet([header, ...chunk]);
          XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Sheet1');
          
          const outputPath = inputPath.replace(/\.(xlsx|xls)$/, `_part${i + 1}.$1`);
          XLSX.writeFile(newWorkbook, outputPath);
          outputFiles.push(outputPath);
        }
      }
      
      return outputFiles;
    } catch (error) {
      throw new Error(`Failed to split Excel: ${error}`);
    }
  }
  
  /**
   * Convert XML to Excel
   */
  static async xmlToExcel(inputPath: string, options: {
    sheetName: string;
    includeAttributes: boolean;
  }): Promise<string> {
    const { sheetName, includeAttributes } = options;
    
    try {
      const xmlContent = await fs.readFile(inputPath, 'utf-8');
      
      // Simple XML parsing - convert to flat structure
      const lines = xmlContent.split('\n');
      const headers = new Set<string>();
      const data: Record<string, string>[] = [];
      
      // Basic XML parsing (simplified)
      let currentRecord: Record<string, string> = {};
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('<') && trimmed.endsWith('>') && !trimmed.startsWith('</') && !trimmed.startsWith('<?')) {
          const tagMatch = trimmed.match(/<([^\s>]+)([^>]*)>([^<]*)<\/\1>/);
          if (tagMatch) {
            const [, tagName, attributes, content] = tagMatch;
            headers.add(tagName);
            currentRecord[tagName] = content;
            
            if (includeAttributes && attributes) {
              const attrMatch = attributes.match(/(\w+)="([^"]*)"/g);
              if (attrMatch) {
                attrMatch.forEach(attr => {
                  const [key, value] = attr.split('=');
                  const attrKey = `${tagName}_${key}`;
                  headers.add(attrKey);
                  currentRecord[attrKey] = value.replace(/"/g, '');
                });
              }
            }
          }
        } else if (trimmed.includes('</') && Object.keys(currentRecord).length > 0) {
          data.push({ ...currentRecord });
          currentRecord = {};
        }
      }
      
      const headerArray = Array.from(headers);
      const rows: string[][] = [headerArray];
      
      data.forEach(record => {
        const row = headerArray.map(header => record[header] || '');
        rows.push(row);
      });
      
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      
      const outputPath = inputPath.replace('.xml', '.xlsx');
      XLSX.writeFile(workbook, outputPath);
      
      return outputPath;
    } catch (error) {
      throw new Error(`Failed to convert XML to Excel: ${error}`);
    }
  }
  
  /**
   * Convert Excel to XML
   */
  static async excelToXml(inputPath: string, options: {
    rootElement: string;
    rowElement: string;
  }): Promise<string> {
    const { rootElement, rowElement } = options;
    
    try {
      const workbook = XLSX.readFile(inputPath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length === 0) {
        throw new Error('Excel file is empty');
      }
      
      const headers = jsonData[0] as string[];
      const dataRows = jsonData.slice(1);
      
      let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootElement}>\n`;
      
      dataRows.forEach(row => {
        xmlContent += `  <${rowElement}>\n`;
        headers.forEach((header, index) => {
          const value = row[index] || '';
          const cleanHeader = header.toString().replace(/[^a-zA-Z0-9]/g, '_');
          xmlContent += `    <${cleanHeader}>${value}</${cleanHeader}>\n`;
        });
        xmlContent += `  </${rowElement}>\n`;
      });
      
      xmlContent += `</${rootElement}>`;
      
      const outputPath = inputPath.replace(/\.(xlsx|xls)$/, '.xml');
      await fs.writeFile(outputPath, xmlContent);
      
      return outputPath;
    } catch (error) {
      throw new Error(`Failed to convert Excel to XML: ${error}`);
    }
  }
  
  /**
   * Convert CSV to Excel
   */
  static async csvToExcel(inputPath: string, options: {
    sheetName: string;
    delimiter: string;
  }): Promise<string> {
    const { sheetName, delimiter } = options;
    
    try {
      const fileContent = await fs.readFile(inputPath, 'utf-8');
      
      return new Promise((resolve, reject) => {
        csvParse(fileContent, {
          delimiter: delimiter === '\t' ? '\t' : delimiter,
          skip_empty_lines: true
        }, (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          
          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils.aoa_to_sheet(data);
          XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
          
          const outputPath = inputPath.replace('.csv', '.xlsx');
          XLSX.writeFile(workbook, outputPath);
          
          resolve(outputPath);
        });
      });
    } catch (error) {
      throw new Error(`Failed to convert CSV to Excel: ${error}`);
    }
  }
  
  /**
   * Convert XML to CSV
   */
  static async xmlToCsv(inputPath: string, options: {
    delimiter: string;
    includeAttributes: boolean;
  }): Promise<string> {
    const { delimiter, includeAttributes } = options;
    
    try {
      const xmlContent = await fs.readFile(inputPath, 'utf-8');
      
      // Simple XML parsing
      const headers = new Set<string>();
      const data: Record<string, string>[] = [];
      let currentRecord: Record<string, string> = {};
      
      const lines = xmlContent.split('\n');
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('<') && trimmed.endsWith('>') && !trimmed.startsWith('</') && !trimmed.startsWith('<?')) {
          const tagMatch = trimmed.match(/<([^\s>]+)([^>]*)>([^<]*)<\/\1>/);
          if (tagMatch) {
            const [, tagName, attributes, content] = tagMatch;
            headers.add(tagName);
            currentRecord[tagName] = content;
            
            if (includeAttributes && attributes) {
              const attrMatch = attributes.match(/(\w+)="([^"]*)"/g);
              if (attrMatch) {
                attrMatch.forEach(attr => {
                  const [key, value] = attr.split('=');
                  const attrKey = `${tagName}_${key}`;
                  headers.add(attrKey);
                  currentRecord[attrKey] = value.replace(/"/g, '');
                });
              }
            }
          }
        } else if (trimmed.includes('</') && Object.keys(currentRecord).length > 0) {
          data.push({ ...currentRecord });
          currentRecord = {};
        }
      }
      
      const headerArray = Array.from(headers);
      const csvRows = [headerArray];
      
      data.forEach(record => {
        const row = headerArray.map(header => record[header] || '');
        csvRows.push(row);
      });
      
      return new Promise((resolve, reject) => {
        csvStringify(csvRows, {
          delimiter: delimiter === '\t' ? '\t' : delimiter
        }, async (err, output) => {
          if (err) {
            reject(err);
            return;
          }
          
          const outputPath = inputPath.replace('.xml', '.csv');
          await fs.writeFile(outputPath, output);
          resolve(outputPath);
        });
      });
    } catch (error) {
      throw new Error(`Failed to convert XML to CSV: ${error}`);
    }
  }
  
  /**
   * Convert XML to JSON
   */
  static async xmlToJson(inputPath: string, options: {
    prettyPrint: boolean;
    includeAttributes: boolean;
  }): Promise<string> {
    const { prettyPrint, includeAttributes } = options;
    
    try {
      const xmlContent = await fs.readFile(inputPath, 'utf-8');
      
      // Simple XML to JSON conversion
        const data: Record<string, unknown>[] = [];
        let currentRecord: Record<string, unknown> = {};
      
      const lines = xmlContent.split('\n');
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('<') && trimmed.endsWith('>') && !trimmed.startsWith('</') && !trimmed.startsWith('<?')) {
          const tagMatch = trimmed.match(/<([^\s>]+)([^>]*)>([^<]*)<\/\1>/);
          if (tagMatch) {
            const [, tagName, attributes, content] = tagMatch;
            currentRecord[tagName] = content;
            
            if (includeAttributes && attributes) {
              const attrMatch = attributes.match(/(\w+)="([^"]*)"/g);
              if (attrMatch) {
                const attrs: Record<string, string> = {};
                attrMatch.forEach(attr => {
                  const [key, value] = attr.split('=');
                  attrs[key] = value.replace(/"/g, '');
                });
                currentRecord[`${tagName}_attributes`] = attrs;
              }
            }
          }
        } else if (trimmed.includes('</') && Object.keys(currentRecord).length > 0) {
          data.push({ ...currentRecord });
          currentRecord = {};
        }
      }
      
      const jsonContent = prettyPrint ? JSON.stringify(data, null, 2) : JSON.stringify(data);
      
      const outputPath = inputPath.replace('.xml', '.json');
      await fs.writeFile(outputPath, jsonContent);
      
      return outputPath;
    } catch (error) {
      throw new Error(`Failed to convert XML to JSON: ${error}`);
    }
  }
  
  /**
   * Convert JSON to XML
   */
  static async jsonToXml(inputPath: string, options: {
    rootElement: string;
    prettyPrint: boolean;
  }): Promise<string> {
    const { rootElement, prettyPrint } = options;
    
    try {
      const jsonContent = await fs.readFile(inputPath, 'utf-8');
      const data = JSON.parse(jsonContent);
      
      let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootElement}>\n`;
      
      const convertToXml = (obj: unknown, indent: string = '  '): string => {
        let xml = '';
        
        if (Array.isArray(obj)) {
          obj.forEach(item => {
            xml += `${indent}<item>\n`;
            xml += convertToXml(item, indent + '  ');
            xml += `${indent}</item>\n`;
          });
        } else if (typeof obj === 'object' && obj !== null) {
          Object.keys(obj).forEach(key => {
            const value = obj[key];
            const cleanKey = key.replace(/[^a-zA-Z0-9]/g, '_');
            
            if (typeof value === 'object' && value !== null) {
              xml += `${indent}<${cleanKey}>\n`;
              xml += convertToXml(value, indent + '  ');
              xml += `${indent}</${cleanKey}>\n`;
            } else {
              xml += `${indent}<${cleanKey}>${value}</${cleanKey}>\n`;
            }
          });
        }
        
        return xml;
      };
      
      xmlContent += convertToXml(data);
      xmlContent += `</${rootElement}>`;
      
      if (!prettyPrint) {
        xmlContent = xmlContent.replace(/\n\s*/g, '');
      }
      
      const outputPath = inputPath.replace('.json', '.xml');
      await fs.writeFile(outputPath, xmlContent);
      
      return outputPath;
    } catch (error) {
      throw new Error(`Failed to convert JSON to XML: ${error}`);
    }
  }
  
  /**
   * Convert CSV to JSON
   */
  static async csvToJson(inputPath: string, options: {
    delimiter: string;
    prettyPrint: boolean;
  }): Promise<string> {
    const { delimiter, prettyPrint } = options;
    
    try {
      const fileContent = await fs.readFile(inputPath, 'utf-8');
      
      return new Promise((resolve, reject) => {
        csvParse(fileContent, {
          delimiter: delimiter === '\t' ? '\t' : delimiter,
          columns: true,
          skip_empty_lines: true
        }, async (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          
          const jsonContent = prettyPrint ? JSON.stringify(data, null, 2) : JSON.stringify(data);
          
          const outputPath = inputPath.replace('.csv', '.json');
          await fs.writeFile(outputPath, jsonContent);
          
          resolve(outputPath);
        });
      });
    } catch (error) {
      throw new Error(`Failed to convert CSV to JSON: ${error}`);
    }
  }
}