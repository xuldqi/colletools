/**
 * Tools API routes
 * Handle file upload, processing, and download for various tools
 */
import express, { type Request, type Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
// Dynamic import for pdf-parse to avoid initialization issues
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { PDFService } from '../services/pdfService.js';
import { ImageService } from '../services/imageService.js';
import { AIService } from '../services/aiService.js';
import { VideoService } from '../services/videoService.js';
import { FileService } from '../services/fileService.js';
import { DeveloperService } from '../services/developerService.js';
import { ConverterService } from '../services/converterService.js';
import { OCRService } from '../services/ocrService.js';
import { getToolTranslation } from '../i18n/toolTranslations.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

/**
 * Get all available tools
 * GET /api/tools
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const tools = [
      {
        id: 'pdf-merge',
        name: 'Merge PDF',
        category: 'pdf',
        description: 'Combine multiple PDF files into one',
        icon: 'file-plus'
      },
      {
        id: 'pdf-split',
        name: 'Split PDF',
        category: 'pdf',
        description: 'Split a PDF file into multiple files',
        icon: 'scissors'
      },
      {
        id: 'pdf-compress',
        name: 'Compress PDF',
        category: 'pdf',
        description: 'Reduce PDF file size',
        icon: 'archive'
      },
      {
        id: 'pdf-to-excel',
        name: 'PDF to Excel',
        category: 'pdf',
        description: 'Convert PDF to Excel spreadsheet',
        icon: 'file-spreadsheet'
      },
      {
        id: 'pdf-to-powerpoint',
        name: 'PDF to PowerPoint',
        category: 'pdf',
        description: 'Convert PDF to PowerPoint presentation',
        icon: 'presentation'
      },
      {
        id: 'image-convert',
        name: 'Convert Image',
        category: 'image',
        description: 'Convert images between different formats',
        icon: 'image'
      },
      {
        id: 'image-resize',
        name: 'Resize Image',
        category: 'image',
        description: 'Resize images to specific dimensions',
        icon: 'maximize'
      },
      {
        id: 'image-compress',
        name: 'Compress Image',
        category: 'image',
        description: 'Reduce image file size without losing quality',
        icon: 'minimize-2'
      },
      {
        id: 'image-crop',
        name: 'Crop Image',
        category: 'image',
        description: 'Crop and resize images to desired dimensions',
        icon: 'crop'
      },
      {
        id: 'image-rotate',
        name: 'Rotate Image',
        category: 'image',
        description: 'Rotate images by any angle or flip horizontally/vertically',
        icon: 'rotate-cw'
      },
      {
        id: 'background-remover',
        name: 'Background Remover',
        category: 'image',
        description: 'Remove background from images automatically using AI',
        icon: 'scissors'
      },
      {
        id: 'photo-editor',
        name: 'Photo Editor',
        category: 'image',
        description: 'Edit photos with filters, adjustments, and effects',
        icon: 'edit-3'
      },
      {
        id: 'image-enhancer',
        name: 'Image Enhancer',
        category: 'image',
        description: 'Enhance image quality using AI upscaling and sharpening',
        icon: 'zap'
      },
      {
        id: 'watermark-remover',
        name: 'Watermark Remover',
        category: 'image',
        description: 'Remove watermarks from images using AI technology',
        icon: 'eye-off'
      },
      {
        id: 'ai-writer',
        name: 'AI Writer',
        category: 'ai-writing',
        description: 'Generate high-quality content with AI assistance',
        icon: 'PenTool',
        popular: true
      },
      {
        id: 'grammar-checker',
        name: 'Grammar Checker',
        category: 'ai-writing',
        description: 'Check and fix grammar, spelling, and punctuation errors',
        icon: 'CheckCircle',
        popular: true
      },
      {
        id: 'paraphraser',
        name: 'Paraphraser',
        category: 'ai-writing',
        description: 'Rewrite text while maintaining the original meaning',
        icon: 'MessageSquare',
        popular: true
      },
      {
        id: 'summarizer',
        name: 'Summarizer',
        category: 'ai-writing',
        description: 'Create concise summaries of long texts and articles',
        icon: 'FileText',
        popular: true
      },
      {
        id: 'essay-writer',
        name: 'Essay Writer',
        category: 'ai-writing',
        description: 'Generate well-structured essays on any topic',
        icon: 'BookOpen',
        popular: false
      },
      {
        id: 'content-ideas',
        name: 'Content Ideas',
        category: 'ai-writing',
        description: 'Get creative ideas and inspiration for your content',
        icon: 'Lightbulb',
        popular: false
      },
      {
        id: 'translator',
        name: 'Translator',
        category: 'ai-writing',
        description: 'Translate text between multiple languages accurately',
        icon: 'Globe',
        popular: false
      },
      {
        id: 'text-enhancer',
        name: 'Text Enhancer',
        category: 'ai-writing',
        description: 'Improve text clarity, tone, and readability',
        icon: 'Zap',
        popular: false
      },
      {
        id: 'plagiarism-checker',
        name: 'Plagiarism Checker',
        category: 'ai-writing',
        description: 'Check for plagiarism and ensure content originality',
        icon: 'CheckCircle',
        popular: false
      },
      {
        id: 'video-compress',
        name: 'Compress Video',
        category: 'video',
        description: 'Reduce video file size',
        icon: 'video'
      },
      {
        id: 'video-convert',
        name: 'Video Converter',
        category: 'video',
        description: 'Convert videos between different formats',
        icon: 'Video'
      },
      {
        id: 'video-editor',
        name: 'Video Editor',
        category: 'video',
        description: 'Basic video editing and trimming',
        icon: 'Scissors'
      },
      {
        id: 'gif-maker',
        name: 'GIF Maker',
        category: 'video',
        description: 'Convert videos to animated GIFs',
        icon: 'Image'
      },
      {
        id: 'csv-split',
        name: 'CSV Split',
        category: 'file',
        description: 'Split large CSV files into smaller chunks',
        icon: 'Split'
      },
      {
        id: 'excel-split',
        name: 'Excel Split',
        category: 'file',
        description: 'Split Excel files by rows or sheets',
        icon: 'FileSpreadsheet'
      },
      {
        id: 'xml-to-excel',
        name: 'XML to Excel',
        category: 'file',
        description: 'Convert XML files to Excel format',
        icon: 'ArrowRightLeft'
      },
      {
        id: 'excel-to-xml',
        name: 'Excel to XML',
        category: 'file',
        description: 'Convert Excel files to XML format',
        icon: 'ArrowRightLeft'
      },
      {
        id: 'csv-to-excel',
        name: 'CSV to Excel',
        category: 'file',
        description: 'Convert CSV files to Excel format',
        icon: 'ArrowRightLeft'
      },
      {
        id: 'xml-to-csv',
        name: 'XML to CSV',
        category: 'file',
        description: 'Convert XML files to CSV format',
        icon: 'ArrowRightLeft'
      },
      {
        id: 'xml-to-json',
        name: 'XML to JSON',
        category: 'file',
        description: 'Convert XML files to JSON format',
        icon: 'Code'
      },
      {
        id: 'json-to-xml',
        name: 'JSON to XML',
        category: 'file',
        description: 'Convert JSON files to XML format',
        icon: 'Code'
      },
      {
        id: 'csv-to-json',
        name: 'CSV to JSON',
        category: 'file',
        description: 'Convert CSV files to JSON format',
        icon: 'Database'
      },
      {
        id: 'video-trimmer',
        name: 'Video Trimmer',
        category: 'video',
        description: 'Trim and cut video clips',
        icon: 'Scissors'
      },
      {
        id: 'video-rotator',
        name: 'Video Rotator',
        category: 'video',
        description: 'Rotate and flip videos',
        icon: 'RotateCw'
      },
      {
        id: 'audio-extractor',
        name: 'Audio Extractor',
        category: 'video',
        description: 'Extract audio from video files',
        icon: 'Music'
      },
      {
        id: 'video-merger',
        name: 'Video Merger',
        category: 'video',
        description: 'Merge multiple videos into one',
        icon: 'Merge'
      },
      {
        id: 'video-downloader',
        name: 'Video Downloader',
        category: 'video',
        description: 'Download videos from URLs',
        icon: 'Download'
      },
      // Text Tools
      {
        id: 'word-counter',
        name: 'Word Counter',
        category: 'text',
        description: 'Count words, characters, paragraphs and lines in text',
        icon: 'Calculator',
        popular: true
      },
      {
        id: 'character-counter',
        name: 'Character Counter',
        category: 'text',
        description: 'Count characters with or without spaces',
        icon: 'Hash',
        popular: true
      },
      {
        id: 'case-converter',
        name: 'Case Converter',
        category: 'text',
        description: 'Convert text to uppercase, lowercase, title case, etc.',
        icon: 'Type',
        popular: true
      },
      {
        id: 'text-formatter',
        name: 'Text Formatter',
        category: 'text',
        description: 'Format text by removing extra spaces and lines',
        icon: 'AlignLeft'
      },
      {
        id: 'line-counter',
        name: 'Line Counter',
        category: 'text',
        description: 'Count total lines and non-empty lines',
        icon: 'List'
      },
      {
        id: 'text-reverser',
        name: 'Text Reverser',
        category: 'text',
        description: 'Reverse text by characters, words, or lines',
        icon: 'RotateCcw'
      },
      {
        id: 'text-sorter',
        name: 'Text Sorter',
        category: 'text',
        description: 'Sort text lines alphabetically or numerically',
        icon: 'ArrowUpDown'
      },
      {
        id: 'duplicate-remover',
        name: 'Duplicate Line Remover',
        category: 'text',
        description: 'Remove duplicate lines from text',
        icon: 'Trash2'
      },
      {
         id: 'text-diff',
         name: 'Text Difference Checker',
         category: 'text',
         description: 'Compare two texts and highlight differences',
         icon: 'GitCompare'
       },
       // OCR Tools
       {
         id: 'image-to-text',
         name: 'Image to Text',
         category: 'ocr',
         description: 'Extract text from images using OCR technology',
         icon: 'FileText',
         popular: true
       },
       {
         id: 'pdf-ocr',
         name: 'PDF OCR',
         category: 'ocr',
         description: 'Extract text from scanned PDF documents',
         icon: 'FileSearch',
         popular: true
       },
       {
         id: 'handwriting-recognition',
         name: 'Handwriting Recognition',
         category: 'ocr',
         description: 'Convert handwritten text to digital text',
         icon: 'PenTool'
       },
       {
         id: 'document-scanner',
         name: 'Document Scanner',
         category: 'ocr',
         description: 'Scan and digitize physical documents',
         icon: 'ScanLine'
       },
       {
         id: 'table-extractor',
         name: 'Table Extractor',
         category: 'ocr',
         description: 'Extract tables from images and convert to structured data',
         icon: 'Table'
       },
       {
         id: 'receipt-scanner',
         name: 'Receipt Scanner',
         category: 'ocr',
         description: 'Extract information from receipt images',
         icon: 'Receipt'
       },
       {
         id: 'business-card-scanner',
         name: 'Business Card Scanner',
         category: 'ocr',
         description: 'Extract contact information from business cards',
         icon: 'CreditCard'
       },
       {
         id: 'license-plate-reader',
         name: 'License Plate Reader',
         category: 'ocr',
         description: 'Read license plate numbers from images',
         icon: 'Car'
       },
       {
          id: 'qr-code-reader',
          name: 'QR Code Reader',
          category: 'ocr',
          description: 'Read and decode QR codes from images',
          icon: 'QrCode'
        }
    ];
    
    res.json({
      success: true,
      data: tools
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tools'
    });
  }
});

/**
 * Get tool by ID
 * GET /api/tools/:toolId
 */
router.get('/:toolId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { toolId } = req.params;
    
    // Mock tool data - in real app, this would come from database
    const toolsData: Record<string, {
      id: string;
      name: string;
      category: string;
      description: string;
      acceptedFormats: string[];
      maxFiles: number;
      options: Array<{
        name: string;
        label: string;
        type: string;
        options?: string[];
        default?: string | number;
        min?: number;
        max?: number;
        placeholder?: string;
        required?: boolean;
      }>;
    }> = {
      'pdf-merge': {
        id: 'pdf-merge',
        name: 'Merge PDF',
        category: 'pdf',
        description: 'Combine multiple PDF files into one document',
        acceptedFormats: ['.pdf'],
        maxFiles: 10,
        options: [
          {
            name: 'order',
            label: 'File Order',
            type: 'select',
            options: ['original', 'alphabetical', 'custom'],
            default: 'original'
          }
        ]
      },
      'video-convert': {
        id: 'video-convert',
        name: 'Video Converter',
        category: 'video',
        description: 'Convert videos between different formats',
        acceptedFormats: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm'],
        maxFiles: 1,
        options: [
          {
            name: 'format',
            label: 'Output Format',
            type: 'select',
            options: ['mp4', 'avi', 'mov', 'webm', 'mkv'],
            default: 'mp4'
          },
          {
            name: 'quality',
            label: 'Video Quality',
            type: 'select',
            options: ['low', 'medium', 'high', 'original'],
            default: 'medium'
          }
        ]
      },
      'video-compress': {
        id: 'video-compress',
        name: 'Video Compressor',
        category: 'video',
        description: 'Compress video files to reduce size',
        acceptedFormats: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm'],
        maxFiles: 1,
        options: [
          {
            name: 'compressionLevel',
            label: 'Compression Level',
            type: 'select',
            options: ['light', 'medium', 'heavy'],
            default: 'medium'
          },
          {
            name: 'targetSize',
            label: 'Target Size (MB)',
            type: 'number',
            min: 1,
            max: 1000
          }
        ]
      },
      'video-editor': {
        id: 'video-editor',
        name: 'Video Editor',
        category: 'video',
        description: 'Basic video editing and trimming',
        acceptedFormats: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm'],
        maxFiles: 1,
        options: [
          {
            name: 'startTime',
            label: 'Start Time (seconds)',
            type: 'number',
            min: 0,
            default: 0
          },
          {
            name: 'endTime',
            label: 'End Time (seconds)',
            type: 'number',
            min: 1
          },
          {
            name: 'brightness',
            label: 'Brightness',
            type: 'range',
            min: -100,
            max: 100,
            default: 0
          },
          {
            name: 'contrast',
            label: 'Contrast',
            type: 'range',
            min: -100,
            max: 100,
            default: 0
          }
        ]
      },
      'gif-maker': {
        id: 'gif-maker',
        name: 'GIF Maker',
        category: 'video',
        description: 'Convert videos to animated GIFs',
        acceptedFormats: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm'],
        maxFiles: 1,
        options: [
          {
            name: 'startTime',
            label: 'Start Time (seconds)',
            type: 'number',
            min: 0,
            default: 0
          },
          {
            name: 'duration',
            label: 'Duration (seconds)',
            type: 'number',
            min: 1,
            max: 30,
            default: 5
          },
          {
            name: 'fps',
            label: 'Frame Rate',
            type: 'select',
            options: ['10', '15', '20', '24', '30'],
            default: '15'
          },
          {
            name: 'width',
            label: 'Width (px)',
            type: 'number',
            min: 100,
            max: 1920,
            default: 480
          }
        ]
      },
      'video-trimmer': {
        id: 'video-trimmer',
        name: 'Video Trimmer',
        category: 'video',
        description: 'Trim and cut video clips',
        acceptedFormats: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm'],
        maxFiles: 1,
        options: [
          {
            name: 'startTime',
            label: 'Start Time (seconds)',
            type: 'number',
            min: 0,
            default: 0,
            required: true
          },
          {
            name: 'endTime',
            label: 'End Time (seconds)',
            type: 'number',
            min: 1,
            required: true
          }
        ]
      },
      'video-rotator': {
        id: 'video-rotator',
        name: 'Video Rotator',
        category: 'video',
        description: 'Rotate and flip videos',
        acceptedFormats: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm'],
        maxFiles: 1,
        options: [
          {
            name: 'rotation',
            label: 'Rotation',
            type: 'select',
            options: ['0', '90', '180', '270'],
            default: '90'
          },
          {
            name: 'flipHorizontal',
            label: 'Flip Horizontal',
            type: 'checkbox',
            default: false
          },
          {
            name: 'flipVertical',
            label: 'Flip Vertical',
            type: 'checkbox',
            default: false
          }
        ]
      },
      'audio-extractor': {
        id: 'audio-extractor',
        name: 'Audio Extractor',
        category: 'video',
        description: 'Extract audio from video files',
        acceptedFormats: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm'],
        maxFiles: 1,
        options: [
          {
            name: 'audioFormat',
            label: 'Audio Format',
            type: 'select',
            options: ['mp3', 'wav', 'aac', 'flac'],
            default: 'mp3'
          },
          {
            name: 'quality',
            label: 'Audio Quality',
            type: 'select',
            options: ['128kbps', '192kbps', '256kbps', '320kbps'],
            default: '192kbps'
          }
        ]
      },
      'video-merger': {
        id: 'video-merger',
        name: 'Video Merger',
        category: 'video',
        description: 'Merge multiple videos into one',
        acceptedFormats: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm'],
        maxFiles: 10,
        options: [
          {
            name: 'outputFormat',
            label: 'Output Format',
            type: 'select',
            options: ['mp4', 'avi', 'mov', 'webm'],
            default: 'mp4'
          },
          {
            name: 'transition',
            label: 'Transition Effect',
            type: 'select',
            options: ['none', 'fade', 'dissolve'],
            default: 'none'
          }
        ]
      },
      'video-downloader': {
        id: 'video-downloader',
        name: 'Video Downloader',
        category: 'video',
        description: 'Download videos from URLs',
        acceptedFormats: [],
        maxFiles: 0,
        options: [
          {
            name: 'url',
            label: 'Video URL',
            type: 'text',
            placeholder: 'Enter video URL...',
            required: true
          },
          {
            name: 'quality',
            label: 'Video Quality',
            type: 'select',
            options: ['best', 'worst', '720p', '480p', '360p'],
            default: 'best'
          },
          {
            name: 'format',
            label: 'Download Format',
            type: 'select',
            options: ['mp4', 'webm', 'audio-only'],
            default: 'mp4'
          }
        ]
      },
      'csv-split': {
        id: 'csv-split',
        name: 'CSV Split',
        category: 'file',
        description: 'Split large CSV files into smaller chunks',
        acceptedFormats: ['.csv'],
        maxFiles: 1,
        options: [
          {
            name: 'rowsPerFile',
            label: 'Rows per File',
            type: 'number',
            min: 100,
            max: 100000,
            default: 1000
          },
          {
            name: 'includeHeader',
            label: 'Include Header in Each File',
            type: 'checkbox',
            default: true
          }
        ]
      },
      'excel-split': {
        id: 'excel-split',
        name: 'Excel Split',
        category: 'file',
        description: 'Split Excel files by rows or sheets',
        acceptedFormats: ['.xlsx', '.xls'],
        maxFiles: 1,
        options: [
          {
            name: 'splitBy',
            label: 'Split By',
            type: 'select',
            options: ['rows', 'sheets'],
            default: 'rows'
          },
          {
            name: 'rowsPerFile',
            label: 'Rows per File',
            type: 'number',
            min: 100,
            max: 50000,
            default: 1000
          }
        ]
      },
      'xml-to-excel': {
        id: 'xml-to-excel',
        name: 'XML to Excel',
        category: 'file',
        description: 'Convert XML files to Excel format',
        acceptedFormats: ['.xml'],
        maxFiles: 1,
        options: [
          {
            name: 'sheetName',
            label: 'Sheet Name',
            type: 'text',
            default: 'Sheet1',
            placeholder: 'Enter sheet name...'
          },
          {
            name: 'includeAttributes',
            label: 'Include XML Attributes',
            type: 'checkbox',
            default: true
          }
        ]
      },
      'excel-to-xml': {
        id: 'excel-to-xml',
        name: 'Excel to XML',
        category: 'file',
        description: 'Convert Excel files to XML format',
        acceptedFormats: ['.xlsx', '.xls'],
        maxFiles: 1,
        options: [
          {
            name: 'rootElement',
            label: 'Root Element Name',
            type: 'text',
            default: 'data',
            placeholder: 'Enter root element name...'
          },
          {
            name: 'rowElement',
            label: 'Row Element Name',
            type: 'text',
            default: 'row',
            placeholder: 'Enter row element name...'
          }
        ]
      },
      'csv-to-excel': {
        id: 'csv-to-excel',
        name: 'CSV to Excel',
        category: 'file',
        description: 'Convert CSV files to Excel format',
        acceptedFormats: ['.csv'],
        maxFiles: 1,
        options: [
          {
            name: 'sheetName',
            label: 'Sheet Name',
            type: 'text',
            default: 'Sheet1',
            placeholder: 'Enter sheet name...'
          },
          {
            name: 'delimiter',
            label: 'CSV Delimiter',
            type: 'select',
            options: [',', ';', '\t', '|'],
            default: ','
          }
        ]
      },
      'xml-to-csv': {
        id: 'xml-to-csv',
        name: 'XML to CSV',
        category: 'file',
        description: 'Convert XML files to CSV format',
        acceptedFormats: ['.xml'],
        maxFiles: 1,
        options: [
          {
            name: 'delimiter',
            label: 'CSV Delimiter',
            type: 'select',
            options: [',', ';', '\t', '|'],
            default: ','
          },
          {
            name: 'includeAttributes',
            label: 'Include XML Attributes',
            type: 'checkbox',
            default: true
          }
        ]
      },
      'xml-to-json': {
        id: 'xml-to-json',
        name: 'XML to JSON',
        category: 'file',
        description: 'Convert XML files to JSON format',
        acceptedFormats: ['.xml'],
        maxFiles: 1,
        options: [
          {
            name: 'prettyPrint',
            label: 'Pretty Print JSON',
            type: 'checkbox',
            default: true
          },
          {
            name: 'includeAttributes',
            label: 'Include XML Attributes',
            type: 'checkbox',
            default: true
          }
        ]
      },
      'json-to-xml': {
        id: 'json-to-xml',
        name: 'JSON to XML',
        category: 'file',
        description: 'Convert JSON files to XML format',
        acceptedFormats: ['.json'],
        maxFiles: 1,
        options: [
          {
            name: 'rootElement',
            label: 'Root Element Name',
            type: 'text',
            default: 'root',
            placeholder: 'Enter root element name...'
          },
          {
            name: 'prettyPrint',
            label: 'Pretty Print XML',
            type: 'checkbox',
            default: true
          }
        ]
      },
      'csv-to-json': {
        id: 'csv-to-json',
        name: 'CSV to JSON',
        category: 'file',
        description: 'Convert CSV files to JSON format',
        acceptedFormats: ['.csv'],
        maxFiles: 1,
        options: [
          {
            name: 'delimiter',
            label: 'CSV Delimiter',
            type: 'select',
            options: [',', ';', '\t', '|'],
            default: ','
          },
          {
            name: 'prettyPrint',
            label: 'Pretty Print JSON',
            type: 'checkbox',
            default: true
          }
        ]
      },
      'image-convert': {
        id: 'image-convert',
        name: 'Convert Image',
        category: 'image',
        description: 'Convert images between different formats',
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
        maxFiles: 1,
        options: [
          {
            name: 'format',
            label: 'Output Format',
            type: 'select',
            options: ['jpg', 'png', 'webp', 'gif'],
            default: 'jpg'
          },
          {
            name: 'quality',
            label: 'Quality',
            type: 'range',
            min: 1,
            max: 100,
            default: 80
          }
        ]
      },
      'ai-writer': {
        id: 'ai-writer',
        name: 'AI Writer',
        category: 'ai-writing',
        description: 'Generate high-quality content with AI assistance',
        acceptedFormats: [],
        maxFiles: 0,
        options: [
          {
            name: 'prompt',
            label: 'Content Topic/Prompt',
            type: 'textarea',
            placeholder: 'Enter your topic or prompt here...',
            required: true
          },
          {
            name: 'contentType',
            label: 'Content Type',
            type: 'select',
            options: ['article', 'blog-post', 'essay', 'story', 'email', 'social-media'],
            default: 'article'
          },
          {
            name: 'length',
            label: 'Content Length',
            type: 'select',
            options: ['short', 'medium', 'long'],
            default: 'medium'
          },
          {
            name: 'tone',
            label: 'Writing Tone',
            type: 'select',
            options: ['professional', 'casual', 'creative', 'academic', 'persuasive'],
            default: 'professional'
          }
        ]
      },
      'grammar-checker': {
        id: 'grammar-checker',
        name: 'Grammar Checker',
        category: 'ai-writing',
        description: 'Check and fix grammar, spelling, and punctuation errors',
        acceptedFormats: ['.txt', '.doc', '.docx'],
        maxFiles: 1,
        options: [
          {
            name: 'text',
            label: 'Text to Check',
            type: 'textarea',
            placeholder: 'Paste your text here for grammar checking...',
            required: true
          },
          {
            name: 'language',
            label: 'Language',
            type: 'select',
            options: ['english', 'spanish', 'french', 'german', 'italian'],
            default: 'english'
          },
          {
            name: 'checkLevel',
            label: 'Check Level',
            type: 'select',
            options: ['basic', 'advanced', 'professional'],
            default: 'advanced'
          }
        ]
      },
      'paraphraser': {
        id: 'paraphraser',
        name: 'Paraphraser',
        category: 'ai-writing',
        description: 'Rewrite text while maintaining the original meaning',
        acceptedFormats: ['.txt', '.doc', '.docx'],
        maxFiles: 1,
        options: [
          {
            name: 'text',
            label: 'Text to Paraphrase',
            type: 'textarea',
            placeholder: 'Enter the text you want to paraphrase...',
            required: true
          },
          {
            name: 'mode',
            label: 'Paraphrasing Mode',
            type: 'select',
            options: ['standard', 'fluency', 'creative', 'formal', 'simple'],
            default: 'standard'
          },
          {
            name: 'strength',
            label: 'Paraphrasing Strength',
            type: 'select',
            options: ['light', 'medium', 'strong'],
            default: 'medium'
          }
        ]
      },
      'summarizer': {
        id: 'summarizer',
        name: 'Summarizer',
        category: 'ai-writing',
        description: 'Create concise summaries of long texts and articles',
        acceptedFormats: ['.txt', '.doc', '.docx', '.pdf'],
        maxFiles: 1,
        options: [
          {
            name: 'text',
            label: 'Text to Summarize',
            type: 'textarea',
            placeholder: 'Paste the text you want to summarize...',
            required: true
          },
          {
            name: 'summaryLength',
            label: 'Summary Length',
            type: 'select',
            options: ['short', 'medium', 'detailed'],
            default: 'medium'
          },
          {
            name: 'summaryType',
            label: 'Summary Type',
            type: 'select',
            options: ['extractive', 'abstractive', 'bullet-points'],
            default: 'abstractive'
          }
        ]
      },
      'essay-writer': {
        id: 'essay-writer',
        name: 'Essay Writer',
        category: 'ai-writing',
        description: 'Generate well-structured essays on any topic',
        acceptedFormats: [],
        maxFiles: 0,
        options: [
          {
            name: 'topic',
            label: 'Essay Topic',
            type: 'text',
            placeholder: 'Enter your essay topic...',
            required: true
          },
          {
            name: 'essayType',
            label: 'Essay Type',
            type: 'select',
            options: ['argumentative', 'descriptive', 'narrative', 'expository', 'persuasive'],
            default: 'argumentative'
          },
          {
            name: 'wordCount',
            label: 'Word Count',
            type: 'select',
            options: ['300', '500', '750', '1000', '1500'],
            default: '500'
          },
          {
            name: 'academicLevel',
            label: 'Academic Level',
            type: 'select',
            options: ['high-school', 'undergraduate', 'graduate'],
            default: 'undergraduate'
          }
        ]
      },
      'content-ideas': {
        id: 'content-ideas',
        name: 'Content Ideas',
        category: 'ai-writing',
        description: 'Get creative ideas and inspiration for your content',
        acceptedFormats: [],
        maxFiles: 0,
        options: [
          {
            name: 'niche',
            label: 'Content Niche/Industry',
            type: 'text',
            placeholder: 'e.g., technology, health, finance...',
            required: true
          },
          {
            name: 'contentFormat',
            label: 'Content Format',
            type: 'select',
            options: ['blog-posts', 'social-media', 'video-scripts', 'email-campaigns', 'product-descriptions'],
            default: 'blog-posts'
          },
          {
            name: 'ideaCount',
            label: 'Number of Ideas',
            type: 'select',
            options: ['5', '10', '15', '20'],
            default: '10'
          }
        ]
      },
      'translator': {
        id: 'translator',
        name: 'Translator',
        category: 'ai-writing',
        description: 'Translate text between multiple languages accurately',
        acceptedFormats: ['.txt', '.doc', '.docx'],
        maxFiles: 1,
        options: [
          {
            name: 'text',
            label: 'Text to Translate',
            type: 'textarea',
            placeholder: 'Enter text to translate...',
            required: true
          },
          {
            name: 'sourceLanguage',
            label: 'Source Language',
            type: 'select',
            options: ['auto', 'english', 'spanish', 'french', 'german', 'italian', 'portuguese', 'chinese', 'japanese'],
            default: 'auto'
          },
          {
            name: 'targetLanguage',
            label: 'Target Language',
            type: 'select',
            options: ['english', 'spanish', 'french', 'german', 'italian', 'portuguese', 'chinese', 'japanese'],
            default: 'english',
            required: true
          }
        ]
      },
      'text-enhancer': {
        id: 'text-enhancer',
        name: 'Text Enhancer',
        category: 'ai-writing',
        description: 'Improve text clarity, tone, and readability',
        acceptedFormats: ['.txt', '.doc', '.docx'],
        maxFiles: 1,
        options: [
          {
            name: 'text',
            label: 'Text to Enhance',
            type: 'textarea',
            placeholder: 'Enter text to improve...',
            required: true
          },
          {
            name: 'enhancementType',
            label: 'Enhancement Type',
            type: 'select',
            options: ['clarity', 'tone', 'readability', 'vocabulary', 'all'],
            default: 'all'
          },
          {
            name: 'targetAudience',
            label: 'Target Audience',
            type: 'select',
            options: ['general', 'academic', 'business', 'casual'],
            default: 'general'
          }
        ]
      },
      'plagiarism-checker': {
        id: 'plagiarism-checker',
        name: 'Plagiarism Checker',
        category: 'ai-writing',
        description: 'Check for plagiarism and ensure content originality',
        acceptedFormats: ['.txt', '.doc', '.docx', '.pdf'],
        maxFiles: 1,
        options: [
          {
            name: 'text',
            label: 'Text to Check',
            type: 'textarea',
            placeholder: 'Paste text to check for plagiarism...',
            required: true
          },
          {
            name: 'checkLevel',
            label: 'Check Level',
            type: 'select',
            options: ['basic', 'standard', 'deep'],
            default: 'standard'
          },
          {
            name: 'includeQuotes',
            label: 'Include Quoted Text',
            type: 'checkbox',
            default: false
          }
        ]
      },
      'word-to-pdf': {
        id: 'word-to-pdf',
        name: 'Word to PDF',
        category: 'pdf',
        description: 'Convert Word documents to PDF format',
        acceptedFormats: ['.doc', '.docx'],
        maxFiles: 1,
        options: [
          {
            name: 'quality',
            label: 'Output Quality',
            type: 'select',
            options: ['standard', 'high', 'maximum'],
            default: 'high'
          },
          {
            name: 'preserveFormatting',
            label: 'Preserve Formatting',
            type: 'checkbox',
            default: true
          }
        ]
      },
      'pdf-to-word': {
        id: 'pdf-to-word',
        name: 'PDF to Word',
        category: 'pdf',
        description: 'Convert PDF files to editable Word documents',
        acceptedFormats: ['.pdf'],
        maxFiles: 1,
        options: [
          {
            name: 'outputFormat',
            label: 'Output Format',
            type: 'select',
            options: ['docx', 'doc'],
            default: 'docx'
          },
          {
            name: 'preserveLayout',
            label: 'Preserve Layout',
            type: 'checkbox',
            default: true
          }
        ]
      },
      'excel-to-pdf': {
        id: 'excel-to-pdf',
        name: 'Excel to PDF',
        category: 'pdf',
        description: 'Convert Excel spreadsheets to PDF format',
        acceptedFormats: ['.xls', '.xlsx'],
        maxFiles: 1,
        options: [
          {
            name: 'orientation',
            label: 'Page Orientation',
            type: 'select',
            options: ['portrait', 'landscape'],
            default: 'portrait'
          },
          {
            name: 'fitToPage',
            label: 'Fit to Page',
            type: 'checkbox',
            default: true
          }
        ]
      },
      'powerpoint-to-pdf': {
        id: 'powerpoint-to-pdf',
        name: 'PowerPoint to PDF',
        category: 'pdf',
        description: 'Convert presentations to PDF format',
        acceptedFormats: ['.ppt', '.pptx'],
        maxFiles: 1,
        options: [
          {
            name: 'includeNotes',
            label: 'Include Speaker Notes',
            type: 'checkbox',
            default: false
          },
          {
            name: 'slidesPerPage',
            label: 'Slides per Page',
            type: 'select',
            options: ['1', '2', '4', '6'],
            default: '1'
          }
        ]
      },
      'pdf-compress': {
        id: 'pdf-compress',
        name: 'Compress PDF',
        category: 'pdf',
        description: 'Reduce PDF file size while maintaining quality',
        acceptedFormats: ['.pdf'],
        maxFiles: 1,
        options: [
          {
            name: 'quality',
            label: 'Compression Quality',
            type: 'select',
            options: ['low', 'medium', 'high'],
            default: 'medium'
          },
          {
            name: 'removeMetadata',
            label: 'Remove Metadata',
            type: 'checkbox',
            default: true
          }
        ]
      },
      'pdf-to-excel': {
        id: 'pdf-to-excel',
        name: 'PDF to Excel',
        category: 'pdf',
        description: 'Convert PDF tables and data to Excel spreadsheet',
        acceptedFormats: ['.pdf'],
        maxFiles: 1,
        options: [
          {
            name: 'outputFormat',
            label: 'Output Format',
            type: 'select',
            options: ['xlsx', 'xls'],
            default: 'xlsx'
          },
          {
            name: 'extractTables',
            label: 'Extract Tables Only',
            type: 'checkbox',
            default: false
          }
        ]
      },
      'pdf-to-powerpoint': {
        id: 'pdf-to-powerpoint',
        name: 'PDF to PowerPoint',
        category: 'pdf',
        description: 'Convert PDF pages to PowerPoint slides',
        acceptedFormats: ['.pdf'],
        maxFiles: 1,
        options: [
          {
            name: 'outputFormat',
            label: 'Output Format',
            type: 'select',
            options: ['pptx', 'ppt'],
            default: 'pptx'
          },
          {
            name: 'slidesPerPage',
            label: 'PDF Pages per Slide',
            type: 'select',
            options: ['1', '2', '4'],
            default: '1'
          }
        ]
      },
      'image-resize': {
        id: 'image-resize',
        name: 'Resize Image',
        category: 'image',
        description: 'Resize images to specific dimensions',
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
        maxFiles: 1,
        options: [
          {
            name: 'width',
            label: 'Width (px)',
            type: 'number',
            min: 1,
            max: 5000
          },
          {
            name: 'height',
            label: 'Height (px)',
            type: 'number',
            min: 1,
            max: 5000
          },
          {
            name: 'maintainAspectRatio',
            label: 'Maintain aspect ratio',
            type: 'checkbox',
            default: true
          },
          {
            name: 'fit',
            label: 'Resize mode',
            type: 'select',
            options: ['cover', 'contain', 'fill', 'inside', 'outside'],
            default: 'cover'
          }
        ]
      },
      'image-compress': {
        id: 'image-compress',
        name: 'Compress Image',
        category: 'image',
        description: 'Reduce image file size without losing quality',
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
        maxFiles: 1,
        options: [
          {
            name: 'quality',
            label: 'Quality (%)',
            type: 'range',
            min: 1,
            max: 100,
            default: 80
          },
          {
            name: 'format',
            label: 'Output format',
            type: 'select',
            options: ['jpeg', 'png', 'webp'],
            default: 'jpeg'
          }
        ]
      },
      'image-crop': {
        id: 'image-crop',
        name: 'Crop Image',
        category: 'image',
        description: 'Crop and resize images to desired dimensions',
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
        maxFiles: 1,
        options: [
          {
            name: 'x',
            label: 'X position',
            type: 'number',
            min: 0,
            default: 0
          },
          {
            name: 'y',
            label: 'Y position',
            type: 'number',
            min: 0,
            default: 0
          },
          {
            name: 'width',
            label: 'Width',
            type: 'number',
            min: 1,
            max: 5000,
            required: true
          },
          {
            name: 'height',
            label: 'Height',
            type: 'number',
            min: 1,
            max: 5000,
            required: true
          }
        ]
      },
      'image-rotate': {
        id: 'image-rotate',
        name: 'Rotate Image',
        category: 'image',
        description: 'Rotate images by any angle or flip horizontally/vertically',
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
        maxFiles: 1,
        options: [
          {
            name: 'angle',
            label: 'Rotation angle (degrees)',
            type: 'number',
            min: -360,
            max: 360,
            default: 90
          },
          {
            name: 'flipHorizontal',
            label: 'Flip horizontal',
            type: 'checkbox',
            default: false
          },
          {
            name: 'flipVertical',
            label: 'Flip vertical',
            type: 'checkbox',
            default: false
          }
        ]
      },
      'background-remover': {
        id: 'background-remover',
        name: 'Background Remover',
        category: 'image',
        description: 'Remove background from images automatically using AI',
        acceptedFormats: ['.jpg', '.jpeg', '.png'],
        maxFiles: 1,
        options: [
          {
            name: 'outputFormat',
            label: 'Output format',
            type: 'select',
            options: ['png', 'jpeg'],
            default: 'png'
          }
        ]
      },
      'photo-editor': {
        id: 'photo-editor',
        name: 'Photo Editor',
        category: 'image',
        description: 'Edit photos with filters, adjustments, and effects',
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
        maxFiles: 1,
        options: [
          {
            name: 'brightness',
            label: 'Brightness',
            type: 'range',
            min: -100,
            max: 100,
            default: 0
          },
          {
            name: 'contrast',
            label: 'Contrast',
            type: 'range',
            min: -100,
            max: 100,
            default: 0
          },
          {
            name: 'saturation',
            label: 'Saturation',
            type: 'range',
            min: -100,
            max: 100,
            default: 0
          },
          {
            name: 'hue',
            label: 'Hue',
            type: 'range',
            min: -180,
            max: 180,
            default: 0
          }
        ]
      },
      'image-enhancer': {
        id: 'image-enhancer',
        name: 'Image Enhancer',
        category: 'image',
        description: 'Enhance image quality using AI upscaling and sharpening',
        acceptedFormats: ['.jpg', '.jpeg', '.png'],
        maxFiles: 1,
        options: [
          {
            name: 'scale',
            label: 'Upscale factor',
            type: 'select',
            options: ['2x', '4x'],
            default: '2x'
          },
          {
            name: 'sharpen',
            label: 'Sharpen',
            type: 'range',
            min: 0,
            max: 100,
            default: 50
          }
        ]
      },
      'watermark-remover': {
        id: 'watermark-remover',
        name: 'Watermark Remover',
        category: 'image',
        description: 'Remove watermarks from images using AI technology',
        acceptedFormats: ['.jpg', '.jpeg', '.png'],
        maxFiles: 1,
        options: [
          {
            name: 'sensitivity',
            label: 'Detection sensitivity',
            type: 'range',
            min: 1,
            max: 10,
            default: 5
          }
        ]
      },
      // Text Tools
      'word-counter': {
        id: 'word-counter',
        name: 'Word Counter',
        category: 'text',
        description: 'Count words, characters, paragraphs and lines in text',
        acceptedFormats: ['.txt'],
        maxFiles: 1,
        options: [
          {
            name: 'text',
            label: 'Text to Analyze',
            type: 'textarea',
            placeholder: 'Enter or paste your text here...',
            required: true
          },
          {
            name: 'includeSpaces',
            label: 'Include Spaces in Character Count',
            type: 'checkbox',
            default: true
          },
          {
            name: 'countParagraphs',
            label: 'Count Paragraphs',
            type: 'checkbox',
            default: true
          }
        ]
      },
      'character-counter': {
        id: 'character-counter',
        name: 'Character Counter',
        category: 'text',
        description: 'Count characters with or without spaces',
        acceptedFormats: ['.txt'],
        maxFiles: 1,
        options: [
          {
            name: 'text',
            label: 'Text to Count',
            type: 'textarea',
            placeholder: 'Enter or paste your text here...',
            required: true
          },
          {
            name: 'includeSpaces',
            label: 'Include Spaces',
            type: 'checkbox',
            default: true
          },
          {
            name: 'includeNewlines',
            label: 'Include Newlines',
            type: 'checkbox',
            default: true
          }
        ]
      },
      'case-converter': {
        id: 'case-converter',
        name: 'Case Converter',
        category: 'text',
        description: 'Convert text to uppercase, lowercase, title case, etc.',
        acceptedFormats: ['.txt'],
        maxFiles: 1,
        options: [
          {
            name: 'text',
            label: 'Text to Convert',
            type: 'textarea',
            placeholder: 'Enter or paste your text here...',
            required: true
          },
          {
            name: 'caseType',
            label: 'Case Type',
            type: 'select',
            options: ['uppercase', 'lowercase', 'titlecase', 'sentencecase', 'camelcase', 'pascalcase', 'snakecase', 'kebabcase'],
            default: 'uppercase',
            required: true
          }
        ]
      },
      'text-formatter': {
        id: 'text-formatter',
        name: 'Text Formatter',
        category: 'text',
        description: 'Format text by removing extra spaces and lines',
        acceptedFormats: ['.txt'],
        maxFiles: 1,
        options: [
          {
            name: 'text',
            label: 'Text to Format',
            type: 'textarea',
            placeholder: 'Enter or paste your text here...',
            required: true
          },
          {
            name: 'removeExtraSpaces',
            label: 'Remove Extra Spaces',
            type: 'checkbox',
            default: true
          },
          {
            name: 'removeEmptyLines',
            label: 'Remove Empty Lines',
            type: 'checkbox',
            default: true
          },
          {
            name: 'trimLines',
            label: 'Trim Line Endings',
            type: 'checkbox',
            default: true
          }
        ]
      },
      'line-counter': {
        id: 'line-counter',
        name: 'Line Counter',
        category: 'text',
        description: 'Count total lines and non-empty lines',
        acceptedFormats: ['.txt'],
        maxFiles: 1,
        options: [
          {
            name: 'text',
            label: 'Text to Count',
            type: 'textarea',
            placeholder: 'Enter or paste your text here...',
            required: true
          },
          {
            name: 'countEmptyLines',
            label: 'Count Empty Lines',
            type: 'checkbox',
            default: true
          }
        ]
      },
      'text-reverser': {
        id: 'text-reverser',
        name: 'Text Reverser',
        category: 'text',
        description: 'Reverse text by characters, words, or lines',
        acceptedFormats: ['.txt'],
        maxFiles: 1,
        options: [
          {
            name: 'text',
            label: 'Text to Reverse',
            type: 'textarea',
            placeholder: 'Enter or paste your text here...',
            required: true
          },
          {
            name: 'reverseType',
            label: 'Reverse Type',
            type: 'select',
            options: ['characters', 'words', 'lines'],
            default: 'characters',
            required: true
          }
        ]
      },
      'text-sorter': {
        id: 'text-sorter',
        name: 'Text Sorter',
        category: 'text',
        description: 'Sort text lines alphabetically or numerically',
        acceptedFormats: ['.txt'],
        maxFiles: 1,
        options: [
          {
            name: 'text',
            label: 'Text to Sort',
            type: 'textarea',
            placeholder: 'Enter or paste your text here (one item per line)...',
            required: true
          },
          {
            name: 'sortType',
            label: 'Sort Type',
            type: 'select',
            options: ['alphabetical', 'numerical', 'reverse-alphabetical', 'reverse-numerical'],
            default: 'alphabetical',
            required: true
          },
          {
            name: 'caseSensitive',
            label: 'Case Sensitive',
            type: 'checkbox',
            default: false
          }
        ]
      },
      'duplicate-remover': {
        id: 'duplicate-remover',
        name: 'Duplicate Line Remover',
        category: 'text',
        description: 'Remove duplicate lines from text',
        acceptedFormats: ['.txt'],
        maxFiles: 1,
        options: [
          {
            name: 'text',
            label: 'Text to Process',
            type: 'textarea',
            placeholder: 'Enter or paste your text here (one item per line)...',
            required: true
          },
          {
            name: 'caseSensitive',
            label: 'Case Sensitive',
            type: 'checkbox',
            default: false
          },
          {
            name: 'keepFirst',
            label: 'Keep First Occurrence',
            type: 'checkbox',
            default: true
          }
        ]
      },
      'text-diff': {
        id: 'text-diff',
        name: 'Text Difference Checker',
        category: 'text',
        description: 'Compare two texts and highlight differences',
        acceptedFormats: ['.txt'],
        maxFiles: 2,
        options: [
          {
            name: 'ignoreWhitespace',
            label: 'Ignore Whitespace',
            type: 'checkbox',
            default: false
          },
          {
            name: 'ignoreCase',
            label: 'Ignore Case',
            type: 'checkbox',
            default: false
          }
        ]
      },
      // Developer Tools
      'hash-generator': {
        id: 'hash-generator',
        name: 'Hash Generator',
        category: 'developer',
        description: 'Generate MD5, SHA1, SHA256, SHA512 hashes from text',
        acceptedFormats: ['.txt'],
        maxFiles: 1,
        options: [
          {
            name: 'text',
            label: 'Text to Hash',
            type: 'textarea',
            placeholder: 'Enter text to generate hash...',
            required: true
          },
          {
            name: 'algorithm',
            label: 'Hash Algorithm',
            type: 'select',
            options: ['md5', 'sha1', 'sha256', 'sha512'],
            default: 'sha256',
            required: true
          }
        ]
      },
      'base64-encoder': {
        id: 'base64-encoder',
        name: 'Base64 Encoder/Decoder',
        category: 'developer',
        description: 'Encode and decode text to/from Base64',
        acceptedFormats: ['.txt'],
        maxFiles: 1,
        options: [
          {
            name: 'text',
            label: 'Text to Process',
            type: 'textarea',
            placeholder: 'Enter text to encode/decode...',
            required: true
          },
          {
            name: 'operation',
            label: 'Operation',
            type: 'select',
            options: ['encode', 'decode'],
            default: 'encode',
            required: true
          }
        ]
      },
      'url-encoder': {
        id: 'url-encoder',
        name: 'URL Encoder/Decoder',
        category: 'developer',
        description: 'Encode and decode URLs and query parameters',
        acceptedFormats: ['.txt'],
        maxFiles: 1,
        options: [
          {
            name: 'text',
            label: 'URL/Text to Process',
            type: 'textarea',
            placeholder: 'Enter URL or text to encode/decode...',
            required: true
          },
          {
            name: 'operation',
            label: 'Operation',
            type: 'select',
            options: ['encode', 'decode'],
            default: 'encode',
            required: true
          }
        ]
      },
      'json-formatter': {
        id: 'json-formatter',
        name: 'JSON Formatter/Validator',
        category: 'developer',
        description: 'Format, validate and beautify JSON data',
        acceptedFormats: ['.json', '.txt'],
        maxFiles: 1,
        options: [
          {
            name: 'json',
            label: 'JSON Data',
            type: 'textarea',
            placeholder: 'Enter JSON data to format/validate...',
            required: true
          },
          {
            name: 'indent',
            label: 'Indentation',
            type: 'select',
            options: ['2', '4', '8'],
            default: '2'
          },
          {
            name: 'validateOnly',
            label: 'Validate Only',
            type: 'checkbox',
            default: false
          }
        ]
      },
      'qr-generator': {
        id: 'qr-generator',
        name: 'QR Code Generator',
        category: 'developer',
        description: 'Generate QR codes from text, URLs, or data',
        acceptedFormats: [],
        maxFiles: 0,
        options: [
          {
            name: 'text',
            label: 'Text/URL to Encode',
            type: 'textarea',
            placeholder: 'Enter text, URL, or data for QR code...',
            required: true
          },
          {
            name: 'size',
            label: 'QR Code Size',
            type: 'select',
            options: ['128', '256', '512', '1024'],
            default: '256'
          },
          {
            name: 'format',
            label: 'Output Format',
            type: 'select',
            options: ['png', 'svg'],
            default: 'png'
          },
          {
            name: 'errorCorrection',
            label: 'Error Correction Level',
            type: 'select',
            options: ['L', 'M', 'Q', 'H'],
            default: 'M'
          }
        ]
      },
      'color-picker': {
        id: 'color-picker',
        name: 'Color Picker/Converter',
        category: 'developer',
        description: 'Convert colors between HEX, RGB, HSL, HSV formats',
        acceptedFormats: [],
        maxFiles: 0,
        options: [
          {
            name: 'color',
            label: 'Color Value',
            type: 'text',
            placeholder: 'Enter color (e.g., #FF0000, rgb(255,0,0))...',
            required: true
          },
          {
            name: 'targetFormat',
            label: 'Convert To',
            type: 'select',
            options: ['hex', 'rgb', 'hsl', 'hsv'],
            default: 'hex',
            required: true
          }
        ]
      },
      'timestamp-converter': {
        id: 'timestamp-converter',
        name: 'Timestamp Converter',
        category: 'developer',
        description: 'Convert between Unix timestamps, ISO dates, and readable formats',
        acceptedFormats: [],
        maxFiles: 0,
        options: [
          {
            name: 'input',
            label: 'Input Value',
            type: 'text',
            placeholder: 'Enter timestamp, date, or ISO string...',
            required: true
          },
          {
            name: 'inputFormat',
            label: 'Input Format',
            type: 'select',
            options: ['unix', 'iso', 'date'],
            default: 'unix',
            required: true
          },
          {
            name: 'outputFormat',
            label: 'Output Format',
            type: 'select',
            options: ['unix', 'iso', 'date', 'readable'],
            default: 'readable',
            required: true
          }
        ]
      },
      'uuid-generator': {
        id: 'uuid-generator',
        name: 'UUID Generator',
        category: 'developer',
        description: 'Generate unique identifiers (UUIDs)',
        acceptedFormats: [],
        maxFiles: 0,
        options: [
          {
            name: 'version',
            label: 'UUID Version',
            type: 'select',
            options: ['v4'],
            default: 'v4'
          },
          {
            name: 'count',
            label: 'Number of UUIDs',
            type: 'number',
            min: 1,
            max: 100,
            default: 1
          }
        ]
      },
      'password-generator': {
        id: 'password-generator',
        name: 'Password Generator',
        category: 'developer',
        description: 'Generate secure passwords with customizable options',
        acceptedFormats: [],
        maxFiles: 0,
        options: [
          {
            name: 'length',
            label: 'Password Length',
            type: 'number',
            min: 4,
            max: 128,
            default: 12
          },
          {
            name: 'includeUppercase',
            label: 'Include Uppercase Letters',
            type: 'checkbox',
            default: true
          },
          {
            name: 'includeLowercase',
            label: 'Include Lowercase Letters',
            type: 'checkbox',
            default: true
          },
          {
            name: 'includeNumbers',
            label: 'Include Numbers',
            type: 'checkbox',
            default: true
          },
          {
            name: 'includeSymbols',
            label: 'Include Symbols',
            type: 'checkbox',
            default: false
          },
          {
            name: 'excludeSimilar',
            label: 'Exclude Similar Characters (0, O, l, I)',
            type: 'checkbox',
            default: false
          }
        ]
      },
      // Converter Tools
      'unit-converter': {
        id: 'unit-converter',
        name: 'Unit Converter',
        category: 'converter',
        description: 'Convert between different units of measurement (length, weight, temperature, volume, area)',
        acceptedFormats: [],
        maxFiles: 0,
        options: [
          {
            name: 'value',
            label: 'Value to Convert',
            type: 'number',
            placeholder: 'Enter value...',
            required: true
          },
          {
            name: 'unitType',
            label: 'Unit Type',
            type: 'select',
            options: ['length', 'weight', 'temperature', 'volume', 'area'],
            default: 'length',
            required: true
          },
          {
            name: 'fromUnit',
            label: 'From Unit',
            type: 'select',
            options: ['mm', 'cm', 'm', 'km', 'inch', 'ft', 'yard', 'mile'],
            default: 'm',
            required: true
          },
          {
            name: 'toUnit',
            label: 'To Unit',
            type: 'select',
            options: ['mm', 'cm', 'm', 'km', 'inch', 'ft', 'yard', 'mile'],
            default: 'ft',
            required: true
          }
        ]
      },
      'currency-converter': {
        id: 'currency-converter',
        name: 'Currency Converter',
        category: 'converter',
        description: 'Convert between different currencies with current exchange rates',
        acceptedFormats: [],
        maxFiles: 0,
        options: [
          {
            name: 'amount',
            label: 'Amount to Convert',
            type: 'number',
            placeholder: 'Enter amount...',
            required: true,
            min: 0
          },
          {
            name: 'fromCurrency',
            label: 'From Currency',
            type: 'select',
            options: ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'CHF', 'SEK', 'NOK'],
            default: 'USD',
            required: true
          },
          {
            name: 'toCurrency',
            label: 'To Currency',
            type: 'select',
            options: ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'CHF', 'SEK', 'NOK'],
            default: 'EUR',
            required: true
          }
        ]
      },
      'number-base-converter': {
        id: 'number-base-converter',
        name: 'Number Base Converter',
        category: 'converter',
        description: 'Convert numbers between different bases (binary, octal, decimal, hexadecimal)',
        acceptedFormats: [],
        maxFiles: 0,
        options: [
          {
            name: 'number',
            label: 'Number to Convert',
            type: 'text',
            placeholder: 'Enter number...',
            required: true
          },
          {
            name: 'fromBase',
            label: 'From Base',
            type: 'select',
            options: ['2', '8', '10', '16'],
            default: '10',
            required: true
          },
          {
            name: 'toBase',
            label: 'To Base',
            type: 'select',
            options: ['2', '8', '10', '16'],
            default: '2',
            required: true
          }
        ]
      },
      'color-converter': {
        id: 'color-converter',
        name: 'RGB/HEX Color Converter',
        category: 'converter',
        description: 'Convert colors between HEX, RGB, HSL, and HSV formats',
        acceptedFormats: [],
        maxFiles: 0,
        options: [
          {
            name: 'color',
            label: 'Color Value',
            type: 'text',
            placeholder: 'Enter color (e.g., #FF0000, rgb(255,0,0))...',
            required: true
          },
          {
            name: 'targetFormat',
            label: 'Convert To',
            type: 'select',
            options: ['hex', 'rgb', 'hsl', 'hsv'],
            default: 'hex',
            required: true
          }
        ]
      },
      'timezone-converter': {
        id: 'timezone-converter',
        name: 'Timezone Converter',
        category: 'converter',
        description: 'Convert time between different timezones',
        acceptedFormats: [],
        maxFiles: 0,
        options: [
          {
            name: 'dateTime',
            label: 'Date and Time',
            type: 'datetime-local',
            required: true
          },
          {
            name: 'fromTimezone',
            label: 'From Timezone',
            type: 'select',
            options: ['UTC', 'America/New_York', 'America/Los_Angeles', 'America/Chicago', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Kolkata', 'Australia/Sydney', 'Pacific/Auckland'],
            default: 'UTC',
            required: true
          },
          {
            name: 'toTimezone',
            label: 'To Timezone',
            type: 'select',
            options: ['UTC', 'America/New_York', 'America/Los_Angeles', 'America/Chicago', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Kolkata', 'Australia/Sydney', 'Pacific/Auckland'],
            default: 'America/New_York',
            required: true
          }
        ]
      },
      'image-format-converter': {
        id: 'image-format-converter',
        name: 'Image Format Converter',
        category: 'converter',
        description: 'Convert images between different formats (PNG, JPEG, WebP, GIF, BMP)',
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff'],
        maxFiles: 1,
        options: [
          {
            name: 'format',
            label: 'Target Format',
            type: 'select',
            options: ['jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff'],
            default: 'png',
            required: true
          },
          {
            name: 'quality',
            label: 'Quality (for JPEG/WebP)',
            type: 'range',
            min: 1,
            max: 100,
            default: 80
          }
        ]
      },
      'audio-format-converter': {
        id: 'audio-format-converter',
        name: 'Audio Format Converter',
        category: 'converter',
        description: 'Convert audio files between different formats (MP3, WAV, AAC, OGG)',
        acceptedFormats: ['.mp3', '.wav', '.aac', '.ogg', '.m4a', '.flac'],
        maxFiles: 1,
        options: [
          {
            name: 'format',
            label: 'Target Format',
            type: 'select',
            options: ['mp3', 'wav', 'aac', 'ogg'],
            default: 'mp3',
            required: true
          },
          {
            name: 'bitrate',
            label: 'Bitrate (kbps)',
            type: 'select',
            options: ['128', '192', '256', '320'],
            default: '192'
          }
        ]
      },
      'document-format-converter': {
        id: 'document-format-converter',
        name: 'Document Format Converter',
        category: 'converter',
        description: 'Convert documents between different formats (PDF, DOCX, TXT, HTML)',
        acceptedFormats: ['.pdf', '.docx', '.doc', '.txt', '.html', '.rtf'],
        maxFiles: 1,
        options: [
          {
            name: 'format',
            label: 'Target Format',
            type: 'select',
            options: ['pdf', 'docx', 'txt', 'html'],
            default: 'pdf',
            required: true
          },
          {
            name: 'preserveFormatting',
            label: 'Preserve Formatting',
            type: 'checkbox',
            default: true
          }
        ]
      },
      'encoding-converter': {
        id: 'encoding-converter',
        name: 'Encoding Converter',
        category: 'converter',
        description: 'Convert text between different character encodings (UTF-8, Base64, Hex, ASCII)',
        acceptedFormats: ['.txt'],
        maxFiles: 1,
        options: [
          {
            name: 'text',
            label: 'Text to Convert',
            type: 'textarea',
            placeholder: 'Enter text to convert encoding...',
            required: true
          },
          {
            name: 'fromEncoding',
            label: 'From Encoding',
            type: 'select',
            options: ['utf8', 'base64', 'hex', 'ascii'],
            default: 'utf8',
            required: true
          },
          {
            name: 'toEncoding',
            label: 'To Encoding',
            type: 'select',
            options: ['utf8', 'base64', 'hex', 'ascii'],
            default: 'base64',
            required: true
          }
        ]
      }
    };
    
    const tool = toolsData[toolId];
    if (!tool) {
      res.status(404).json({
        success: false,
        error: 'Tool not found'
      });
      return;
    }
    
    // Get language from Accept-Language header or query parameter
    const language = req.query.lang as string || req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
    
    // Get translation for the tool
    const translation = getToolTranslation(toolId, language);
    
    // Apply translation if available
     const localizedTool = translation ? {
       ...tool,
       name: translation.name,
       description: translation.description,
       options: tool.options.map(option => {
         const optionTranslation = translation.options[option.name];
         if (optionTranslation) {
           return {
             ...option,
             label: optionTranslation.label,
             placeholder: optionTranslation.placeholder || option.placeholder,
             options: optionTranslation.options || option.options
           };
         }
         return option;
       })
     } : { ...tool };
    
    res.json({
      success: true,
      data: localizedTool
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tool details'
    });
  }
});

/**
 * Process tool with uploaded files
 * POST /api/tools/:toolId/process
 */
router.post('/:toolId/process', upload.array('files', 10), async (req: Request, res: Response): Promise<void> => {
  try {
    const { toolId } = req.params;
    const files = req.files as Express.Multer.File[];
    const options = req.body;
    
    console.log(`Processing tool ${toolId} with ${files?.length || 0} files`);
    console.log('Options:', options);
    
    let result;
    let outputPath: string;
    
    switch (toolId) {
      case 'pdf-merge': {
        if (!files || files.length < 2) {
          return res.status(400).json({ error: 'At least 2 PDF files are required for merging' });
        }
        const filePaths = files.map(file => file.path);
        outputPath = await PDFService.mergePDFs(filePaths, {
          outputFileName: options.outputFileName
        });
        result = {
          fileId: path.basename(outputPath),
          fileName: path.basename(outputPath),
          fileSize: fs.statSync(outputPath).size,
          message: `Successfully merged ${files.length} PDF files`
        };
        break;
      }

      case 'pdf-split': {
        if (!files || files.length !== 1) {
          return res.status(400).json({ error: 'Exactly 1 PDF file is required for splitting' });
        }
        const pageRanges = options.pageRanges ? options.pageRanges.split(',') : ['1-1'];
        const splitPaths = await PDFService.splitPDF(files[0].path, pageRanges);
        result = {
          fileId: path.basename(splitPaths[0]), // Return first split file
          fileName: path.basename(splitPaths[0]),
          fileSize: fs.statSync(splitPaths[0]).size,
          message: `Successfully split PDF into ${splitPaths.length} parts`,
          additionalFiles: splitPaths.slice(1).map(p => path.basename(p))
        };
        break;
      }
        
      case 'image-convert': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 image file is required for conversion' });
          return;
        }
        outputPath = await ImageService.convertImage(files[0].path, {
          format: options.format || 'jpeg',
          quality: parseInt(options.quality) || 80,
          width: options.width ? parseInt(options.width) : undefined,
          height: options.height ? parseInt(options.height) : undefined,
          maintainAspectRatio: options.maintainAspectRatio !== 'false'
        });
        result = {
          fileId: path.basename(outputPath),
          fileName: path.basename(outputPath),
          fileSize: fs.statSync(outputPath).size,
          message: `Successfully converted image to ${options.format || 'jpeg'}`
        };
        break;
      }
        
      case 'image-resize': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 image file is required for resizing' });
          return;
        }
        outputPath = await ImageService.resizeImage(files[0].path, {
          width: options.width ? parseInt(options.width) : undefined,
          height: options.height ? parseInt(options.height) : undefined,
          maintainAspectRatio: options.maintainAspectRatio !== 'false',
          fit: options.fit || 'inside'
        });
        result = {
          fileId: path.basename(outputPath),
          fileName: path.basename(outputPath),
          fileSize: fs.statSync(outputPath).size,
          message: 'Successfully resized image'
        };
        break;
      }
        
      case 'image-compress': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 image file is required for compression' });
          return;
        }
        outputPath = await ImageService.compressImage(files[0].path, {
          quality: parseInt(options.quality) || 80,
          format: options.format || 'jpeg'
        });
        const originalSize = fs.statSync(files[0].path).size;
        const compressedSize = fs.statSync(outputPath).size;
        const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
        result = {
          fileId: path.basename(outputPath),
          fileName: path.basename(outputPath),
          fileSize: compressedSize,
          message: `Successfully compressed image by ${compressionRatio}% (${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(compressedSize / 1024 / 1024).toFixed(2)}MB)`
        };
        break;
      }
         
       case 'image-crop': {
         if (!files || files.length !== 1) {
           res.status(400).json({ success: false, error: 'Exactly 1 image file is required for cropping' });
           return;
         }
         outputPath = await ImageService.cropImage(files[0].path, {
           x: parseInt(options.x) || 0,
           y: parseInt(options.y) || 0,
           width: parseInt(options.width),
           height: parseInt(options.height)
         });
         result = {
           fileId: path.basename(outputPath),
           fileName: path.basename(outputPath),
           fileSize: fs.statSync(outputPath).size,
           message: `Successfully cropped image to ${options.width}x${options.height} pixels`
         };
         break;
       }
         
       case 'image-rotate': {
         if (!files || files.length !== 1) {
           res.status(400).json({ success: false, error: 'Exactly 1 image file is required for rotation' });
           return;
         }
         outputPath = await ImageService.rotateImage(files[0].path, {
           angle: parseInt(options.angle) || 90,
           flipHorizontal: options.flipHorizontal === 'true',
           flipVertical: options.flipVertical === 'true'
         });
         result = {
           fileId: path.basename(outputPath),
           fileName: path.basename(outputPath),
           fileSize: fs.statSync(outputPath).size,
           message: `Successfully rotated image by ${options.angle || 90} degrees`
         };
         break;
       }
          
        case 'background-remover':
          if (!files || files.length !== 1) {
            res.status(400).json({ success: false, error: 'Exactly 1 image file is required for background removal' });
            return;
          }
          // Note: This is a placeholder implementation. In production, you would integrate with
          // AI services like Remove.bg API, or use local AI models for background removal
          outputPath = await ImageService.convertImage(files[0].path, {
            format: options.outputFormat === 'jpeg' ? 'jpeg' : 'png',
            quality: 90
          });
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: 'Background removal completed (placeholder implementation - integrate with AI service for production)'
          };
          break;
          
        case 'photo-editor':
          if (!files || files.length !== 1) {
            res.status(400).json({ success: false, error: 'Exactly 1 image file is required for photo editing' });
            return;
          }
          outputPath = await ImageService.editPhoto(files[0].path, {
            brightness: parseInt(options.brightness) || 0,
            contrast: parseInt(options.contrast) || 0,
            saturation: parseInt(options.saturation) || 0,
            hue: parseInt(options.hue) || 0
          });
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: 'Photo editing completed successfully'
          };
          break;
          
        case 'image-enhancer':
          if (!files || files.length !== 1) {
            res.status(400).json({ success: false, error: 'Exactly 1 image file is required for image enhancement' });
            return;
          }
          // Note: This is a placeholder implementation. In production, you would integrate with
          // AI upscaling services or use local AI models for image enhancement
          {
            const scale = options.scale === '4x' ? 4 : 2;
            outputPath = await ImageService.enhanceImage(files[0].path, {
              scale: scale,
              sharpen: parseInt(options.sharpen) || 50
            });
            result = {
              fileId: path.basename(outputPath),
              fileName: path.basename(outputPath),
              fileSize: fs.statSync(outputPath).size,
              message: `Image enhanced with ${scale}x upscaling (placeholder implementation - integrate with AI service for production)`
            };
          }
          break;
          
        // watermark-remover case moved to advanced image processing section
          
        case 'ai-text-generator':
        {
        outputPath = await AIService.generateText({
          prompt: options.prompt || 'Write a creative story',
          maxTokens: parseInt(options.maxTokens) || 500,
          temperature: parseFloat(options.temperature) || 0.7,
          outputFormat: options.outputFormat || 'text'
        });
        result = {
          fileId: path.basename(outputPath),
          fileName: path.basename(outputPath),
          fileSize: fs.statSync(outputPath).size,
          message: 'Successfully generated AI content'
        };
        }
        break;

      case 'word-to-pdf': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 Word document is required for conversion' });
          return;
        }
        
        try {
          const inputFile = files[0];
          const outputFileName = `${path.parse(inputFile.originalname).name}.pdf`;
          outputPath = path.join(path.dirname(inputFile.path), outputFileName);
          
          // Read Word document using mammoth
          const mammoth = (await import('mammoth')).default;
          const result_mammoth = await mammoth.convertToHtml({ path: inputFile.path });
          
          if (!result_mammoth.value || result_mammoth.value.trim().length === 0) {
            res.status(400).json({ success: false, error: 'No content found in Word document' });
            return;
          }
          
          // Create HTML content for PDF generation
          const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>Converted from ${inputFile.originalname}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                h1, h2, h3 { color: #333; }
                p { margin-bottom: 10px; }
              </style>
            </head>
            <body>
              <h1>Converted from Word: ${inputFile.originalname}</h1>
              <hr>
              ${result_mammoth.value}
            </body>
            </html>
          `;
          
          // Generate PDF using puppeteer
          const puppeteer = (await import('puppeteer')).default;
          const browser = await puppeteer.launch({ headless: true });
          const page = await browser.newPage();
          
          await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
          const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: {
              top: '20mm',
              right: '20mm',
              bottom: '20mm',
              left: '20mm'
            },
            printBackground: true
          });
          
          await browser.close();
          
          // Save PDF file
          fs.writeFileSync(outputPath, pdfBuffer);
          
          result = {
            fileId: path.basename(outputPath),
            fileName: outputFileName,
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully converted Word document to PDF`
          };
        } catch (error) {
          console.error('Word to PDF conversion error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to convert Word to PDF. The Word document may be corrupted or in an unsupported format.' 
          });
          return;
        }
        break;
      }

                  case 'pdf-to-word': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 PDF file is required for conversion' });
          return;
        }
        
        try {
          const inputFile = files[0];
          const outputFormat = options.outputFormat || 'docx';
          const outputFileName = `${path.parse(inputFile.originalname).name}.${outputFormat}`;
          outputPath = path.join(path.dirname(inputFile.path), outputFileName);
          
          // 读取PDF文件
          const pdfBuffer = fs.readFileSync(inputFile.path);
          const pdfParse = (await import('pdf-parse')).default;
          const pdfData = await pdfParse(pdfBuffer);
          
          if (!pdfData.text || pdfData.text.trim().length === 0) {
            // 如果无法提取文本，创建一个说明文档
            const doc = new Document({
              sections: [{
                properties: {},
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `PDF文件: ${inputFile.originalname}`,
                        bold: true,
                        size: 28
                      })
                    ]
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "此PDF文件无法提取文本内容，可能是图片格式或受密码保护。",
                        size: 24
                      })
                    ]
                  })
                ]
              }]
            });
            
            const buffer = await Packer.toBuffer(doc);
            fs.writeFileSync(outputPath, buffer);
            
            result = {
              fileId: path.basename(outputPath),
              fileName: outputFileName,
              fileSize: fs.statSync(outputPath).size,
              message: "PDF文件已转换，但无法提取文本内容"
            };
          } else {
            // 成功提取文本，创建Word文档
            const doc = new Document({
              sections: [{
                properties: {},
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `从PDF转换: ${inputFile.originalname}`,
                        bold: true,
                        size: 28
                      })
                    ]
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "",
                        break: 1
                      })
                    ]
                  }),
                  ...pdfData.text.split('\n').map(line => 
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: line || " ",
                          size: 24
                        })
                      ]
                    })
                  )
                ]
              }]
            });
            
            const buffer = await Packer.toBuffer(doc);
            fs.writeFileSync(outputPath, buffer);
            
            result = {
              fileId: path.basename(outputPath),
              fileName: outputFileName,
              fileSize: fs.statSync(outputPath).size,
              message: `成功转换PDF为${outputFormat.toUpperCase()}，共${pdfData.numpages || 1}页`
            };
          }
        } catch (error) {
          console.error('PDF to Word conversion error:', error);
          res.status(500).json({ 
            success: false, 
            error: `PDF转Word失败: ${error.message}`
          });
          return;
        }
        break;
      }

      case 'excel-to-pdf': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 Excel file is required for conversion' });
          return;
        }
        
        try {
          const ExcelJS = await import('exceljs');
          const puppeteer = await import('puppeteer');
          
          const inputFile = files[0];
          const outputFileName = `${path.parse(inputFile.originalname).name}.pdf`;
          outputPath = path.join(path.dirname(inputFile.path), outputFileName);
          
          // Read Excel file
          const workbook = new ExcelJS.default.Workbook();
          await workbook.xlsx.readFile(inputFile.path);
          
          let htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>Excel to PDF</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; font-weight: bold; }
                .worksheet-title { font-size: 18px; font-weight: bold; margin: 20px 0 10px 0; }
              </style>
            </head>
            <body>
          `;
          
          // Convert each worksheet to HTML table
          workbook.eachSheet((worksheet) => {
             htmlContent += `<div class="worksheet-title">${worksheet.name}</div>`;
             htmlContent += '<table>';
             
             worksheet.eachRow((row, rowNumber) => {
               htmlContent += '<tr>';
               row.eachCell((cell) => {
                 const cellValue = cell.value || '';
                 const tag = rowNumber === 1 ? 'th' : 'td';
                 htmlContent += `<${tag}>${cellValue}</${tag}>`;
               });
               htmlContent += '</tr>';
             });
            
            htmlContent += '</table>';
          });
          
          htmlContent += '</body></html>';
          
          // Generate PDF using Puppeteer
          const browser = await puppeteer.default.launch({ headless: true });
          const page = await browser.newPage();
          await page.setContent(htmlContent);
          
          const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
              top: '20px',
              right: '20px',
              bottom: '20px',
              left: '20px'
            }
          });
          
          await browser.close();
          
          // Save PDF file
          fs.writeFileSync(outputPath, pdfBuffer);
          
          result = {
            fileId: path.basename(outputPath),
            fileName: outputFileName,
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully converted Excel to PDF with ${workbook.worksheets.length} worksheet(s)`
          };
        } catch (error) {
          console.error('Excel to PDF conversion error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to convert Excel to PDF. The Excel file may be corrupted or in an unsupported format.' 
          });
          return;
        }
        break;
      }

      case 'powerpoint-to-pdf': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 PowerPoint file is required for conversion' });
          return;
        }
        
        try {
          const libre = await import('libreoffice-convert');
          const { promisify } = await import('util');
          const convertAsync = promisify(libre.default.convert);
          
          const inputFile = files[0];
          const outputFileName = `${path.parse(inputFile.originalname).name}.pdf`;
          outputPath = path.join(path.dirname(inputFile.path), outputFileName);
          
          // Read PowerPoint file
          const inputBuffer = fs.readFileSync(inputFile.path);
          
          // Convert PowerPoint to PDF using LibreOffice
          const pdfBuffer = await convertAsync(inputBuffer, '.pdf', undefined);
          
          // Save PDF file
          fs.writeFileSync(outputPath, pdfBuffer);
          
          result = {
            fileId: path.basename(outputPath),
            fileName: outputFileName,
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully converted PowerPoint to PDF`
          };
        } catch (error) {
          console.error('PowerPoint to PDF conversion error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to convert PowerPoint to PDF. The PowerPoint file may be corrupted or LibreOffice is not installed on the system.' 
          });
          return;
        }
        break;
      }

      case 'pdf-compress': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 PDF file is required for compression' });
          return;
        }
        
        try {
          const { PDFDocument } = await import('pdf-lib');
          
          const inputFile = files[0];
          const outputFileName = `${path.parse(inputFile.originalname).name}_compressed.pdf`;
          outputPath = path.join(path.dirname(inputFile.path), outputFileName);
          
          // Read PDF file
          const pdfBuffer = fs.readFileSync(inputFile.path);
          const pdfDoc = await PDFDocument.load(pdfBuffer);
          
          // Remove metadata if requested
          if (options.removeMetadata !== 'false') {
            pdfDoc.setTitle('');
            pdfDoc.setAuthor('');
            pdfDoc.setSubject('');
            pdfDoc.setKeywords([]);
            pdfDoc.setProducer('');
            pdfDoc.setCreator('');
          }
          
          // Compress PDF by reducing image quality and removing unnecessary data
          const compressedPdfBytes = await pdfDoc.save({
            useObjectStreams: true,
            addDefaultPage: false,
            objectsPerTick: 50
          });
          
          // Save compressed PDF
          fs.writeFileSync(outputPath, compressedPdfBytes);
          
          const originalSize = fs.statSync(inputFile.path).size;
          const compressedSize = fs.statSync(outputPath).size;
          const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
          
          result = {
            fileId: path.basename(outputPath),
            fileName: outputFileName,
            fileSize: compressedSize,
            message: `Successfully compressed PDF by ${compressionRatio}% (${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(compressedSize / 1024 / 1024).toFixed(2)}MB)`
          };
        } catch (error) {
          console.error('PDF compression error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to compress PDF. The PDF file may be corrupted or password-protected.' 
          });
          return;
        }
        break;
      }

      case 'pdf-to-excel': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 PDF file is required for conversion' });
          return;
        }
        
        try {
          const ExcelJS = await import('exceljs');
          const pdfParse = (await import('pdf-parse')).default;
          
          const inputFile = files[0];
          const outputFormat = options.outputFormat || 'xlsx';
          const outputFileName = `${path.parse(inputFile.originalname).name}.${outputFormat}`;
          outputPath = path.join(path.dirname(inputFile.path), outputFileName);
          
          // Read and parse PDF file
          const pdfBuffer = fs.readFileSync(inputFile.path);
          const pdfData = await pdfParse(pdfBuffer);
          
          if (!pdfData.text || pdfData.text.trim().length === 0) {
            res.status(400).json({ success: false, error: 'No text content found in PDF file' });
            return;
          }
          
          // Create Excel workbook
          const workbook = new ExcelJS.default.Workbook();
          const worksheet = workbook.addWorksheet('PDF Content');
          
          // Split text into lines and try to detect table-like structures
          const lines = pdfData.text.split('\n').filter(line => line.trim().length > 0);
          
          // Simple table detection: lines with multiple spaces or tabs
          const tableLines = lines.filter(line => {
            const parts = line.split(/\s{2,}|\t/);
            return parts.length > 1;
          });
          
          if (options.extractTables === 'true' && tableLines.length > 0) {
            // Extract table data
            let rowIndex = 1;
            tableLines.forEach(line => {
              const cells = line.split(/\s{2,}|\t/).map(cell => cell.trim());
              cells.forEach((cell, colIndex) => {
                worksheet.getCell(rowIndex, colIndex + 1).value = cell;
              });
              rowIndex++;
            });
          } else {
            // Extract all text as simple rows
            lines.forEach((line, index) => {
              worksheet.getCell(index + 1, 1).value = line.trim();
            });
          }
          
          // Style the worksheet
          worksheet.getRow(1).font = { bold: true };
          worksheet.columns.forEach(column => {
            column.width = 20;
          });
          
          // Save Excel file
          await workbook.xlsx.writeFile(outputPath);
          
          result = {
            fileId: path.basename(outputPath),
            fileName: outputFileName,
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully converted PDF to ${outputFormat.toUpperCase()} with ${lines.length} rows of data`
          };
        } catch (error) {
          console.error('PDF to Excel conversion error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to convert PDF to Excel. The PDF file may be corrupted or password-protected.' 
          });
          return;
        }
        break;
      }

      case 'pdf-to-powerpoint': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 PDF file is required for conversion' });
          return;
        }
        
        try {
          const pptxgen = await import('pptxgenjs');
          const pdfParse = (await import('pdf-parse')).default;
          
          const inputFile = files[0];
          const outputFormat = options.outputFormat || 'pptx';
          const outputFileName = `${path.parse(inputFile.originalname).name}.${outputFormat}`;
          outputPath = path.join(path.dirname(inputFile.path), outputFileName);
          
          // Read and parse PDF file
          const pdfBuffer = fs.readFileSync(inputFile.path);
          const pdfData = await pdfParse(pdfBuffer);
          
          if (!pdfData.text || pdfData.text.trim().length === 0) {
            res.status(400).json({ success: false, error: 'No text content found in PDF file' });
            return;
          }
          
          // Create PowerPoint presentation
          const pres = new pptxgen.default();
          
          // Split content by pages or logical sections
          const pages = pdfData.text.split('\f'); // Form feed character often separates pages
          
          if (pages.length <= 1) {
            // If no page breaks found, split by paragraphs
            const paragraphs = pdfData.text.split('\n\n').filter(p => p.trim().length > 0);
            const chunksPerSlide = Math.max(1, Math.ceil(paragraphs.length / 10)); // Max 10 slides
            
            for (let i = 0; i < paragraphs.length; i += chunksPerSlide) {
              const slide = pres.addSlide();
              const slideContent = paragraphs.slice(i, i + chunksPerSlide).join('\n\n');
              
              slide.addText(`Slide ${Math.floor(i / chunksPerSlide) + 1}`, {
                x: 0.5,
                y: 0.5,
                w: 9,
                h: 0.8,
                fontSize: 24,
                bold: true,
                color: '363636'
              });
              
              slide.addText(slideContent.substring(0, 500) + (slideContent.length > 500 ? '...' : ''), {
                x: 0.5,
                y: 1.5,
                w: 9,
                h: 5,
                fontSize: 14,
                color: '363636',
                valign: 'top'
              });
            }
          } else {
            // Create slides from PDF pages
            pages.forEach((pageContent, index) => {
              if (pageContent.trim().length > 0) {
                const slide = pres.addSlide();
                
                slide.addText(`Page ${index + 1}`, {
                  x: 0.5,
                  y: 0.5,
                  w: 9,
                  h: 0.8,
                  fontSize: 24,
                  bold: true,
                  color: '363636'
                });
                
                slide.addText(pageContent.substring(0, 800) + (pageContent.length > 800 ? '...' : ''), {
                  x: 0.5,
                  y: 1.5,
                  w: 9,
                  h: 5,
                  fontSize: 12,
                  color: '363636',
                  valign: 'top'
                });
              }
            });
          }
          
          // Save PowerPoint file
          await pres.writeFile({ fileName: outputPath });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: outputFileName,
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully converted PDF to ${outputFormat.toUpperCase()} with ${pres.slides.length} slides`
          };
        } catch (error) {
          console.error('PDF to PowerPoint conversion error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to convert PDF to PowerPoint. The PDF file may be corrupted or password-protected.' 
          });
          return;
        }
        break;
      }

      case 'video-convert': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 video file is required for conversion' });
          return;
        }
        
        try {
          const inputFile = files[0];
          const format = options.format || 'mp4';
          const quality = options.quality || 'medium';
          
          const outputPath = await VideoService.convertVideo(inputFile.path, {
            format: format as 'mp4' | 'avi' | 'mov' | 'webm',
            quality: quality as 'low' | 'medium' | 'high'
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: `${path.parse(inputFile.originalname).name}.${format}`,
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully converted video to ${format.toUpperCase()}`
          };
        } catch (error) {
          console.error('Video conversion error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to convert video. Please ensure FFmpeg is installed.' 
          });
          return;
        }
        break;
      }

      case 'video-compress': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 video file is required for compression' });
          return;
        }
        
        try {
          const inputFile = files[0];
          const compressionLevel = options.compressionLevel || 'medium';
          const targetSize = options.targetSize;
          
          const quality = compressionLevel === 'light' ? 80 : compressionLevel === 'medium' ? 60 : 40;
          
          const outputPath = await VideoService.compressVideo(inputFile.path, {
            quality,
            targetSize: targetSize ? `${targetSize}MB` : undefined
          });
          
          const originalSize = fs.statSync(inputFile.path).size;
          const compressedSize = fs.statSync(outputPath).size;
          const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
          
          result = {
            fileId: path.basename(outputPath),
            fileName: `compressed_${inputFile.originalname}`,
            fileSize: compressedSize,
            originalSize,
            compressionRatio: `${compressionRatio}%`,
            message: `Successfully compressed video by ${compressionRatio}%`
          };
        } catch (error) {
          console.error('Video compression error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to compress video. Please ensure FFmpeg is installed.' 
          });
          return;
        }
        break;
      }

      case 'video-trimmer': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 video file is required for trimming' });
          return;
        }
        
        try {
          const inputFile = files[0];
          const startTime = options.startTime || 0;
          const endTime = options.endTime;
          
          if (!endTime || endTime <= startTime) {
            res.status(400).json({ success: false, error: 'End time must be greater than start time' });
            return;
          }
          
          const duration = endTime - startTime;
          
          const outputPath = await VideoService.trimVideo(inputFile.path, {
            startTime: `${startTime}`,
            duration: `${duration}`
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: `trimmed_${inputFile.originalname}`,
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully trimmed video from ${startTime}s to ${endTime}s`
          };
        } catch (error) {
          console.error('Video trimming error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to trim video. Please ensure FFmpeg is installed.' 
          });
          return;
        }
        break;
      }

      case 'video-rotator': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 video file is required for rotation' });
          return;
        }
        
        try {
          const inputFile = files[0];
          const rotation = parseInt(options.rotation) || 90;
          const flipHorizontal = options.flipHorizontal === 'true';
          const flipVertical = options.flipVertical === 'true';
          
          const outputPath = await VideoService.rotateVideo(inputFile.path, {
            angle: rotation,
            flipHorizontal,
            flipVertical
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: `rotated_${inputFile.originalname}`,
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully rotated video by ${rotation} degrees`
          };
        } catch (error) {
          console.error('Video rotation error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to rotate video. Please ensure FFmpeg is installed.' 
          });
          return;
        }
        break;
      }

      case 'audio-extractor': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 video file is required for audio extraction' });
          return;
        }
        
        try {
          const inputFile = files[0];
          const audioFormat = options.audioFormat || 'mp3';
          
          const outputPath = await VideoService.extractAudio(inputFile.path, audioFormat as 'mp3' | 'wav' | 'aac' | 'flac');
          
          result = {
            fileId: path.basename(outputPath),
            fileName: `${path.parse(inputFile.originalname).name}.${audioFormat}`,
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully extracted audio as ${audioFormat.toUpperCase()}`
          };
        } catch (error) {
          console.error('Audio extraction error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to extract audio. Please ensure FFmpeg is installed.' 
          });
          return;
        }
        break;
      }

      case 'video-merger': {
        if (!files || files.length < 2) {
          res.status(400).json({ success: false, error: 'At least 2 video files are required for merging' });
          return;
        }
        
        try {
          const filePaths = files.map(file => file.path);
          const outputFormat = options.outputFormat || 'mp4';
          
          const outputPath = await VideoService.mergeVideos(filePaths);
          
          result = {
            fileId: path.basename(outputPath),
            fileName: `merged_videos.${outputFormat}`,
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully merged ${files.length} videos`
          };
        } catch (error) {
          console.error('Video merging error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to merge videos. Please ensure FFmpeg is installed.' 
          });
          return;
        }
        break;
      }

      case 'gif-maker': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 video file is required for GIF creation' });
          return;
        }
        
        try {
          const inputFile = files[0];
          const startTime = options.startTime || 0;
          const duration = options.duration || 5;
          const fps = parseInt(options.fps) || 15;
          const width = parseInt(options.width) || 480;
          
          const outputPath = await VideoService.createGif(inputFile.path, {
            startTime: `${startTime}`,
            duration: `${duration}`,
            fps,
            width
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: `${path.parse(inputFile.originalname).name}.gif`,
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully created GIF from video (${duration}s, ${fps}fps)`
          };
        } catch (error) {
          console.error('GIF creation error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to create GIF. Please ensure FFmpeg is installed.' 
          });
          return;
        }
        break;
      }

      case 'video-editor': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 video file is required for editing' });
          return;
        }
        
        try {
          const inputFile = files[0];
          const startTime = options.startTime || 0;
          const endTime = options.endTime;
          
          // For now, video editor just does trimming
          // In a full implementation, this would handle brightness, contrast, etc.
          const outputPath = await VideoService.trimVideo(inputFile.path, {
            startTime: `${startTime}`,
            endTime: endTime ? `${endTime}` : undefined
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: `edited_${inputFile.originalname}`,
            fileSize: fs.statSync(outputPath).size,
            message: 'Successfully edited video'
          };
        } catch (error) {
          console.error('Video editing error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to edit video. Please ensure FFmpeg is installed.' 
          });
          return;
        }
        break;
      }



      case 'ai-writer': {
        try {
          const prompt = options.prompt;
          const contentType = options.contentType || 'article';
          const length = options.length || 'medium';
          const tone = options.tone || 'professional';
          
          if (!prompt) {
            res.status(400).json({ success: false, error: 'Content prompt is required' });
            return;
          }
          
          const outputPath = await AIService.generateText({
            prompt: `Write a ${length} ${contentType} about: ${prompt}. Use a ${tone} tone.`,
            maxTokens: length === 'short' ? 500 : length === 'medium' ? 1000 : 2000,
            temperature: 0.7
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: `ai_content_${Date.now()}.txt`,
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully generated ${contentType} content`
          };
        } catch (error) {
          console.error('AI Writer error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to generate content. Please check your OpenAI API configuration.' 
          });
          return;
        }
        break;
      }

      case 'grammar-checker': {
        try {
          let textToCheck = options.text;
          
          // If file is uploaded, read text from file
          if (files && files.length > 0) {
            const inputFile = files[0];
            if (inputFile.originalname.endsWith('.txt')) {
              textToCheck = fs.readFileSync(inputFile.path, 'utf-8');
            } else if (inputFile.originalname.endsWith('.docx')) {
              const mammoth = await import('mammoth');
              const result = await mammoth.extractRawText({ path: inputFile.path });
              textToCheck = result.value;
            }
          }
          
          if (!textToCheck) {
            res.status(400).json({ success: false, error: 'Text content is required for grammar checking' });
            return;
          }
          
          const language = options.language || 'english';
          const checkLevel = options.checkLevel || 'advanced';
          
          const outputPath = await AIService.generateText({
            prompt: `Please check and correct the grammar, spelling, and punctuation in the following ${language} text. Provide the corrected version and highlight the changes made. Check level: ${checkLevel}\n\nText to check:\n${textToCheck}`,
            maxTokens: Math.min(textToCheck.length * 2, 4000),
            temperature: 0.3
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: `grammar_checked_${Date.now()}.txt`,
            fileSize: fs.statSync(outputPath).size,
            message: 'Successfully checked and corrected grammar'
          };
        } catch (error) {
          console.error('Grammar Checker error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to check grammar. Please check your OpenAI API configuration.' 
          });
          return;
        }
        break;
      }

      case 'paraphraser': {
        try {
          let textToParaphrase = options.text;
          
          // If file is uploaded, read text from file
          if (files && files.length > 0) {
            const inputFile = files[0];
            if (inputFile.originalname.endsWith('.txt')) {
              textToParaphrase = fs.readFileSync(inputFile.path, 'utf-8');
            } else if (inputFile.originalname.endsWith('.docx')) {
              const mammoth = await import('mammoth');
              const result = await mammoth.extractRawText({ path: inputFile.path });
              textToParaphrase = result.value;
            }
          }
          
          if (!textToParaphrase) {
            res.status(400).json({ success: false, error: 'Text content is required for paraphrasing' });
            return;
          }
          
          const mode = options.mode || 'standard';
          const strength = options.strength || 'medium';
          
          const outputPath = await AIService.generateText({
            prompt: `Please paraphrase the following text using ${mode} mode with ${strength} strength. Maintain the original meaning while changing the wording and structure:\n\n${textToParaphrase}`,
            maxTokens: Math.min(textToParaphrase.length * 1.5, 4000),
            temperature: 0.7
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: `paraphrased_${Date.now()}.txt`,
            fileSize: fs.statSync(outputPath).size,
            message: 'Successfully paraphrased text'
          };
        } catch (error) {
          console.error('Paraphraser error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to paraphrase text. Please check your OpenAI API configuration.' 
          });
          return;
        }
        break;
      }

      case 'summarizer': {
        try {
          let textToSummarize = options.text;
          
          // If file is uploaded, read text from file
          if (files && files.length > 0) {
            const inputFile = files[0];
            if (inputFile.originalname.endsWith('.txt')) {
              textToSummarize = fs.readFileSync(inputFile.path, 'utf-8');
            } else if (inputFile.originalname.endsWith('.docx')) {
              const mammoth = await import('mammoth');
              const result = await mammoth.extractRawText({ path: inputFile.path });
              textToSummarize = result.value;
            } else if (inputFile.originalname.endsWith('.pdf')) {
              const pdfParse = (await import('pdf-parse')).default;
              const pdfBuffer = fs.readFileSync(inputFile.path);
              const pdfData = await pdfParse(pdfBuffer);
              textToSummarize = pdfData.text;
            }
          }
          
          if (!textToSummarize) {
            res.status(400).json({ success: false, error: 'Text content is required for summarization' });
            return;
          }
          
          const summaryLength = options.summaryLength || 'medium';
          const summaryType = options.summaryType || 'abstractive';
          
          const lengthInstruction = summaryLength === 'short' ? 'in 2-3 sentences' : 
                                  summaryLength === 'medium' ? 'in 1-2 paragraphs' : 
                                  'in 3-4 detailed paragraphs';
          
          const typeInstruction = summaryType === 'extractive' ? 'using key sentences from the original text' :
                                summaryType === 'bullet-points' ? 'as bullet points' :
                                'in your own words';
          
          const outputPath = await AIService.generateText({
            prompt: `Please create a ${summaryLength} ${summaryType} summary of the following text ${lengthInstruction} ${typeInstruction}:\n\n${textToSummarize}`,
            maxTokens: summaryLength === 'short' ? 200 : summaryLength === 'medium' ? 500 : 1000,
            temperature: 0.5
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: `summary_${Date.now()}.txt`,
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully created ${summaryLength} ${summaryType} summary`
          };
        } catch (error) {
          console.error('Summarizer error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to summarize text. Please check your OpenAI API configuration.' 
          });
          return;
        }
        break;
      }

      case 'essay-writer': {
        try {
          const topic = options.topic;
          const essayType = options.essayType || 'argumentative';
          const wordCount = options.wordCount || '500';
          const academicLevel = options.academicLevel || 'undergraduate';
          
          if (!topic) {
            res.status(400).json({ success: false, error: 'Essay topic is required' });
            return;
          }
          
          const outputPath = await AIService.generateText({
            prompt: `Write a ${wordCount}-word ${essayType} essay on the topic: "${topic}". The essay should be appropriate for ${academicLevel} level. Include an introduction, body paragraphs with clear arguments/points, and a conclusion. Use proper academic structure and citations where appropriate.`,
            maxTokens: parseInt(wordCount) * 1.5,
            temperature: 0.7
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: `essay_${topic.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.txt`,
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully generated ${wordCount}-word ${essayType} essay`
          };
        } catch (error) {
          console.error('Essay Writer error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to generate essay. Please check your OpenAI API configuration.' 
          });
          return;
        }
        break;
      }

      case 'content-ideas': {
        try {
          const niche = options.niche;
          const contentFormat = options.contentFormat || 'blog-posts';
          const ideaCount = parseInt(options.ideaCount) || 10;
          
          if (!niche) {
            res.status(400).json({ success: false, error: 'Content niche/industry is required' });
            return;
          }
          
          const outputPath = await AIService.generateText({
            prompt: `Generate ${ideaCount} creative and engaging ${contentFormat} ideas for the ${niche} niche/industry. For each idea, provide a catchy title and a brief description (2-3 sentences) explaining the content concept. Make sure the ideas are unique, relevant, and would appeal to the target audience.`,
            maxTokens: ideaCount * 100,
            temperature: 0.8
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: `content_ideas_${niche.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.txt`,
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully generated ${ideaCount} ${contentFormat} ideas for ${niche}`
          };
        } catch (error) {
          console.error('Content Ideas error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to generate content ideas. Please check your OpenAI API configuration.' 
          });
          return;
        }
        break;
      }

      case 'translator': {
        try {
          let textToTranslate = options.text;
          
          // If file is uploaded, read text from file
          if (files && files.length > 0) {
            const inputFile = files[0];
            if (inputFile.originalname.endsWith('.txt')) {
              textToTranslate = fs.readFileSync(inputFile.path, 'utf-8');
            } else if (inputFile.originalname.endsWith('.docx')) {
              const mammoth = await import('mammoth');
              const result = await mammoth.extractRawText({ path: inputFile.path });
              textToTranslate = result.value;
            }
          }
          
          if (!textToTranslate) {
            res.status(400).json({ success: false, error: 'Text content is required for translation' });
            return;
          }
          
          const sourceLanguage = options.sourceLanguage || 'auto';
          const targetLanguage = options.targetLanguage;
          
          if (!targetLanguage) {
            res.status(400).json({ success: false, error: 'Target language is required' });
            return;
          }
          
          const sourceInstruction = sourceLanguage === 'auto' ? 'Detect the source language and' : `From ${sourceLanguage},`;
          
          const outputPath = await AIService.generateText({
            prompt: `${sourceInstruction} translate the following text to ${targetLanguage}. Maintain the original meaning, tone, and context. Provide only the translation without explanations:\n\n${textToTranslate}`,
            maxTokens: Math.min(textToTranslate.length * 2, 4000),
            temperature: 0.3
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: `translated_${targetLanguage}_${Date.now()}.txt`,
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully translated text to ${targetLanguage}`
          };
        } catch (error) {
          console.error('Translator error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to translate text. Please check your OpenAI API configuration.' 
          });
          return;
        }
        break;
      }

      case 'text-enhancer': {
        try {
          let textToEnhance = options.text;
          
          // If file is uploaded, read text from file
          if (files && files.length > 0) {
            const inputFile = files[0];
            if (inputFile.originalname.endsWith('.txt')) {
              textToEnhance = fs.readFileSync(inputFile.path, 'utf-8');
            } else if (inputFile.originalname.endsWith('.docx')) {
              const mammoth = await import('mammoth');
              const result = await mammoth.extractRawText({ path: inputFile.path });
              textToEnhance = result.value;
            }
          }
          
          if (!textToEnhance) {
            res.status(400).json({ success: false, error: 'Text content is required for enhancement' });
            return;
          }
          
          const enhancementType = options.enhancementType || 'all';
          const targetAudience = options.targetAudience || 'general';
          
          const enhancementInstructions = {
            clarity: 'improve clarity and remove ambiguity',
            tone: 'enhance the tone and style',
            readability: 'improve readability and flow',
            vocabulary: 'enhance vocabulary and word choice',
            all: 'improve clarity, tone, readability, and vocabulary'
          };
          
          const outputPath = await AIService.generateText({
            prompt: `Please enhance the following text by ${enhancementInstructions[enhancementType]}. The target audience is ${targetAudience}. Maintain the original meaning while making the text more engaging and professional:\n\n${textToEnhance}`,
            maxTokens: Math.min(textToEnhance.length * 1.5, 4000),
            temperature: 0.6
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: `enhanced_text_${Date.now()}.txt`,
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully enhanced text for ${targetAudience} audience`
          };
        } catch (error) {
          console.error('Text Enhancer error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to enhance text. Please check your OpenAI API configuration.' 
          });
          return;
        }
        break;
      }

      case 'plagiarism-checker': {
        try {
          let textToCheck = options.text;
          
          // If file is uploaded, read text from file
          if (files && files.length > 0) {
            const inputFile = files[0];
            if (inputFile.originalname.endsWith('.txt')) {
              textToCheck = fs.readFileSync(inputFile.path, 'utf-8');
            } else if (inputFile.originalname.endsWith('.docx')) {
              const mammoth = await import('mammoth');
              const result = await mammoth.extractRawText({ path: inputFile.path });
              textToCheck = result.value;
            } else if (inputFile.originalname.endsWith('.pdf')) {
              const pdfParse = (await import('pdf-parse')).default;
              const pdfBuffer = fs.readFileSync(inputFile.path);
              const pdfData = await pdfParse(pdfBuffer);
              textToCheck = pdfData.text;
            }
          }
          
          if (!textToCheck) {
            res.status(400).json({ success: false, error: 'Text content is required for plagiarism checking' });
            return;
          }
          
          const checkLevel = options.checkLevel || 'standard';
          const includeQuotes = options.includeQuotes === true;
          
          // Note: This is a simplified plagiarism check using AI
          // A real implementation would use specialized plagiarism detection APIs
          const outputPath = await AIService.generateText({
            prompt: `Analyze the following text for potential plagiarism issues. Check level: ${checkLevel}. ${includeQuotes ? 'Include quoted text in analysis.' : 'Exclude properly quoted text from analysis.'} Provide a detailed report including:\n1. Overall originality score (percentage)\n2. Potentially problematic sections\n3. Suggestions for improvement\n4. Citation recommendations\n\nText to analyze:\n${textToCheck}`,
            maxTokens: Math.min(textToCheck.length + 1000, 4000),
            temperature: 0.4
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: `plagiarism_report_${Date.now()}.txt`,
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully completed ${checkLevel} plagiarism check`
          };
        } catch (error) {
          console.error('Plagiarism Checker error:', error);
          res.status(500).json({ 
            success: false, 
            error: 'Failed to check plagiarism. Please check your OpenAI API configuration.' 
          });
          return;
        }
        break;
      }
        
      // File Tools
      case 'csv-split': {
        try {
          if (!files || files.length === 0) {
            res.status(400).json({ success: false, error: 'CSV file is required' });
            return;
          }
          
          const inputFile = files[0];
          const rowsPerFile = parseInt(options.rowsPerFile) || 1000;
          const includeHeader = options.includeHeader !== false;
          
          const outputFiles = await FileService.splitCSV(inputFile.path, {
            rowsPerFile,
            includeHeader
          });
          
          result = {
            fileId: path.basename(outputFiles[0]),
            fileName: `split_csv_${Date.now()}.zip`,
            fileSize: 0,
            message: `Successfully split CSV into ${outputFiles.length} files`,
            additionalFiles: outputFiles.map(file => path.basename(file))
          };
        } catch (error) {
          console.error('CSV Split error:', error);
          res.status(500).json({ success: false, error: 'Failed to split CSV file' });
          return;
        }
        break;
      }
      
      case 'excel-split': {
        try {
          if (!files || files.length === 0) {
            res.status(400).json({ success: false, error: 'Excel file is required' });
            return;
          }
          
          const inputFile = files[0];
          const splitBy = options.splitBy || 'rows';
          const rowsPerFile = parseInt(options.rowsPerFile) || 1000;
          
          const outputFiles = await FileService.splitExcel(inputFile.path, {
            splitBy,
            rowsPerFile
          });
          
          result = {
            fileId: path.basename(outputFiles[0]),
            fileName: `split_excel_${Date.now()}.zip`,
            fileSize: 0,
            message: `Successfully split Excel into ${outputFiles.length} files`,
            additionalFiles: outputFiles.map(file => path.basename(file))
          };
        } catch (error) {
          console.error('Excel Split error:', error);
          res.status(500).json({ success: false, error: 'Failed to split Excel file' });
          return;
        }
        break;
      }
      
      case 'xml-to-excel': {
        try {
          if (!files || files.length === 0) {
            res.status(400).json({ success: false, error: 'XML file is required' });
            return;
          }
          
          const inputFile = files[0];
          const sheetName = options.sheetName || 'Sheet1';
          const includeAttributes = options.includeAttributes !== false;
          
          const outputPath = await FileService.xmlToExcel(inputFile.path, {
            sheetName,
            includeAttributes
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: 'Successfully converted XML to Excel'
          };
        } catch (error) {
          console.error('XML to Excel error:', error);
          res.status(500).json({ success: false, error: 'Failed to convert XML to Excel' });
          return;
        }
        break;
      }
      
      case 'excel-to-xml': {
        try {
          if (!files || files.length === 0) {
            res.status(400).json({ success: false, error: 'Excel file is required' });
            return;
          }
          
          const inputFile = files[0];
          const rootElement = options.rootElement || 'data';
          const rowElement = options.rowElement || 'row';
          
          const outputPath = await FileService.excelToXml(inputFile.path, {
            rootElement,
            rowElement
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: 'Successfully converted Excel to XML'
          };
        } catch (error) {
          console.error('Excel to XML error:', error);
          res.status(500).json({ success: false, error: 'Failed to convert Excel to XML' });
          return;
        }
        break;
      }
      
      case 'csv-to-excel': {
        try {
          if (!files || files.length === 0) {
            res.status(400).json({ success: false, error: 'CSV file is required' });
            return;
          }
          
          const inputFile = files[0];
          const sheetName = options.sheetName || 'Sheet1';
          const delimiter = options.delimiter || ',';
          
          const outputPath = await FileService.csvToExcel(inputFile.path, {
            sheetName,
            delimiter
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: 'Successfully converted CSV to Excel'
          };
        } catch (error) {
          console.error('CSV to Excel error:', error);
          res.status(500).json({ success: false, error: 'Failed to convert CSV to Excel' });
          return;
        }
        break;
      }
      
      case 'xml-to-csv': {
        try {
          if (!files || files.length === 0) {
            res.status(400).json({ success: false, error: 'XML file is required' });
            return;
          }
          
          const inputFile = files[0];
          const delimiter = options.delimiter || ',';
          const includeAttributes = options.includeAttributes !== false;
          
          const outputPath = await FileService.xmlToCsv(inputFile.path, {
            delimiter,
            includeAttributes
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: 'Successfully converted XML to CSV'
          };
        } catch (error) {
          console.error('XML to CSV error:', error);
          res.status(500).json({ success: false, error: 'Failed to convert XML to CSV' });
          return;
        }
        break;
      }
      
      case 'xml-to-json': {
        try {
          if (!files || files.length === 0) {
            res.status(400).json({ success: false, error: 'XML file is required' });
            return;
          }
          
          const inputFile = files[0];
          const prettyPrint = options.prettyPrint !== false;
          const includeAttributes = options.includeAttributes !== false;
          
          const outputPath = await FileService.xmlToJson(inputFile.path, {
            prettyPrint,
            includeAttributes
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: 'Successfully converted XML to JSON'
          };
        } catch (error) {
          console.error('XML to JSON error:', error);
          res.status(500).json({ success: false, error: 'Failed to convert XML to JSON' });
          return;
        }
        break;
      }
      
      case 'json-to-xml': {
        try {
          if (!files || files.length === 0) {
            res.status(400).json({ success: false, error: 'JSON file is required' });
            return;
          }
          
          const inputFile = files[0];
          const rootElement = options.rootElement || 'root';
          const prettyPrint = options.prettyPrint !== false;
          
          const outputPath = await FileService.jsonToXml(inputFile.path, {
            rootElement,
            prettyPrint
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: 'Successfully converted JSON to XML'
          };
        } catch (error) {
          console.error('JSON to XML error:', error);
          res.status(500).json({ success: false, error: 'Failed to convert JSON to XML' });
          return;
        }
        break;
      }
      
      case 'csv-to-json': {
        try {
          if (!files || files.length === 0) {
            res.status(400).json({ success: false, error: 'CSV file is required' });
            return;
          }
          
          const inputFile = files[0];
          const delimiter = options.delimiter || ',';
          const prettyPrint = options.prettyPrint !== false;
          
          const outputPath = await FileService.csvToJson(inputFile.path, {
            delimiter,
            prettyPrint
          });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: 'Successfully converted CSV to JSON'
          };
        } catch (error) {
          console.error('CSV to JSON error:', error);
          res.status(500).json({ success: false, error: 'Failed to convert CSV to JSON' });
          return;
        }
        break;
      }
      
      // Text Tools
      case 'word-counter':
      case 'character-counter':
      case 'case-converter':
      case 'text-formatter':
      case 'line-counter':
      case 'text-reverser':
      case 'text-sorter':
      case 'duplicate-remover':
      case 'text-diff': {
        try {
          const { TextService } = await import('../services/textService.js');
          
          if (toolId === 'text-diff') {
            if (!files || files.length < 2) {
              res.status(400).json({ success: false, error: 'Two text files are required for comparison' });
              return;
            }
            
            const text1 = fs.readFileSync(files[0].path, 'utf8');
            const text2 = fs.readFileSync(files[1].path, 'utf8');
            
            const differences = TextService.findTextDifferences(text1, text2, options);
            
            result = {
              fileId: `text-diff-${Date.now()}.json`,
              fileName: 'text-differences.json',
              fileSize: JSON.stringify(differences).length,
              message: 'Text comparison completed',
              data: differences
            };
          } else {
            let inputText = '';
            
            if (files && files.length > 0) {
              inputText = fs.readFileSync(files[0].path, 'utf8');
            } else if (options.text) {
              inputText = options.text;
            } else {
              res.status(400).json({ success: false, error: 'Text input is required' });
              return;
            }
            
            let processedText = '';
            let analysis = null;
            
            switch (toolId) {
              case 'word-counter':
                analysis = TextService.countWords(inputText, options);
                break;
              case 'character-counter':
                analysis = TextService.countCharacters(inputText, options);
                break;
              case 'case-converter':
                processedText = TextService.convertCase(inputText, options.caseType);
                break;
              case 'text-formatter':
                processedText = TextService.formatText(inputText, options);
                break;
              case 'line-counter':
                analysis = TextService.countLines(inputText, options);
                break;
              case 'text-reverser':
                processedText = TextService.reverseText(inputText, options.reverseType);
                break;
              case 'text-sorter':
                processedText = TextService.sortText(inputText, options);
                break;
              case 'duplicate-remover':
                processedText = TextService.removeDuplicateLines(inputText, options);
                break;
            }
            
            if (analysis) {
              result = {
                fileId: `${toolId}-${Date.now()}.json`,
                fileName: `${toolId}-analysis.json`,
                fileSize: JSON.stringify(analysis).length,
                message: 'Text analysis completed',
                data: analysis
              };
            } else {
              const outputPath = path.join(process.cwd(), 'uploads', `${toolId}-${Date.now()}.txt`);
              fs.writeFileSync(outputPath, processedText, 'utf8');
              
              result = {
                fileId: path.basename(outputPath),
                fileName: path.basename(outputPath),
                fileSize: fs.statSync(outputPath).size,
                message: 'Text processing completed'
              };
            }
          }
        } catch (error) {
          console.error(`${toolId} error:`, error);
          res.status(500).json({ success: false, error: `Failed to process text with ${toolId}` });
          return;
        }
        break;
      }
      
      // Developer Tools
      case 'hash-generator':
      case 'base64-encoder':
      case 'url-encoder':
      case 'json-formatter':
      case 'qr-generator':
      case 'color-picker':
      case 'timestamp-converter':
      case 'uuid-generator':
      case 'password-generator': {
        try {
          // Use imported DeveloperService
          
          switch (toolId) {
            case 'hash-generator': {
              const text = options.text;
              const algorithm = options.algorithm || 'sha256';
              
              if (!text) {
                res.status(400).json({ success: false, error: 'Text is required for hash generation' });
                return;
              }
              
              const hash = DeveloperService.generateHash(text, algorithm);
              
              result = {
                fileId: `hash-${Date.now()}.txt`,
                fileName: `${algorithm}-hash.txt`,
                fileSize: hash.length,
                message: `Successfully generated ${algorithm.toUpperCase()} hash`,
                data: { hash, algorithm, originalText: text }
              };
              break;
            }
            
            case 'base64-encoder': {
              const text = options.text;
              const operation = options.operation || 'encode';
              
              if (!text) {
                res.status(400).json({ success: false, error: 'Text is required for Base64 operation' });
                return;
              }
              
              let processedText;
              if (operation === 'encode') {
                processedText = DeveloperService.encodeBase64(text);
              } else {
                processedText = DeveloperService.decodeBase64(text);
              }
              
              const outputPath = path.join(process.cwd(), 'uploads', `base64-${operation}-${Date.now()}.txt`);
              fs.writeFileSync(outputPath, processedText, 'utf8');
              
              result = {
                fileId: path.basename(outputPath),
                fileName: path.basename(outputPath),
                fileSize: fs.statSync(outputPath).size,
                message: `Successfully ${operation}d text with Base64`
              };
              break;
            }
            
            case 'url-encoder': {
              const text = options.text;
              const operation = options.operation || 'encode';
              
              if (!text) {
                res.status(400).json({ success: false, error: 'Text is required for URL operation' });
                return;
              }
              
              let processedText;
              if (operation === 'encode') {
                processedText = DeveloperService.encodeURL(text);
              } else {
                processedText = DeveloperService.decodeURL(text);
              }
              
              const outputPath = path.join(process.cwd(), 'uploads', `url-${operation}-${Date.now()}.txt`);
              fs.writeFileSync(outputPath, processedText, 'utf8');
              
              result = {
                fileId: path.basename(outputPath),
                fileName: path.basename(outputPath),
                fileSize: fs.statSync(outputPath).size,
                message: `Successfully ${operation}d URL/text`
              };
              break;
            }
            
            case 'json-formatter': {
              const jsonText = options.json;
              const indent = parseInt(options.indent) || 2;
              const validateOnly = options.validateOnly === true;
              
              if (!jsonText) {
                res.status(400).json({ success: false, error: 'JSON data is required' });
                return;
              }
              
              const formatResult = DeveloperService.formatJSON(jsonText, indent);
              
              if (validateOnly) {
                result = {
                  fileId: `json-validation-${Date.now()}.json`,
                  fileName: 'json-validation-result.json',
                  fileSize: JSON.stringify(formatResult).length,
                  message: formatResult.valid ? 'JSON is valid' : 'JSON is invalid',
                  data: formatResult
                };
              } else {
                const outputPath = path.join(process.cwd(), 'uploads', `formatted-json-${Date.now()}.json`);
                fs.writeFileSync(outputPath, formatResult.formatted, 'utf8');
                
                result = {
                  fileId: path.basename(outputPath),
                  fileName: path.basename(outputPath),
                  fileSize: fs.statSync(outputPath).size,
                  message: formatResult.valid ? 'Successfully formatted JSON' : 'JSON formatted with errors',
                  data: { valid: formatResult.valid, error: formatResult.error }
                };
              }
              break;
            }
            
            case 'qr-generator': {
              const text = options.text;
              const size = parseInt(options.size) || 256;
              const format = options.format || 'png';
              const errorCorrection = options.errorCorrection || 'M';
              
              if (!text) {
                res.status(400).json({ success: false, error: 'Text is required for QR code generation' });
                return;
              }
              
              const qrResult = await DeveloperService.generateQRCode(text, {
                size,
                format,
                errorCorrectionLevel: errorCorrection
              });
              
              if (format === 'svg') {
                const outputPath = path.join(process.cwd(), 'uploads', `qr-code-${Date.now()}.svg`);
                fs.writeFileSync(outputPath, qrResult, 'utf8');
                
                result = {
                  fileId: path.basename(outputPath),
                  fileName: path.basename(outputPath),
                  fileSize: fs.statSync(outputPath).size,
                  message: 'Successfully generated QR code (SVG)'
                };
              } else {
                result = {
                  fileId: path.basename(qrResult),
                  fileName: path.basename(qrResult),
                  fileSize: fs.statSync(qrResult).size,
                  message: 'Successfully generated QR code (PNG)'
                };
              }
              break;
            }
            
            case 'color-picker': {
              const color = options.color;
              const targetFormat = options.targetFormat || 'hex';
              
              if (!color) {
                res.status(400).json({ success: false, error: 'Color value is required' });
                return;
              }
              
              const convertedColor = DeveloperService.convertColor(color, targetFormat);
              
              result = {
                fileId: `color-conversion-${Date.now()}.json`,
                fileName: 'color-conversion-result.json',
                fileSize: JSON.stringify({ original: color, converted: convertedColor, format: targetFormat }).length,
                message: `Successfully converted color to ${targetFormat.toUpperCase()}`,
                data: { original: color, converted: convertedColor, format: targetFormat }
              };
              break;
            }
            
            case 'timestamp-converter': {
              const input = options.input;
              const inputFormat = options.inputFormat || 'unix';
              const outputFormat = options.outputFormat || 'readable';
              
              if (!input) {
                res.status(400).json({ success: false, error: 'Input value is required' });
                return;
              }
              
              const convertedTimestamp = DeveloperService.convertTimestamp(input, inputFormat, outputFormat);
              
              result = {
                fileId: `timestamp-conversion-${Date.now()}.json`,
                fileName: 'timestamp-conversion-result.json',
                fileSize: JSON.stringify({ original: input, converted: convertedTimestamp, inputFormat, outputFormat }).length,
                message: `Successfully converted timestamp to ${outputFormat}`,
                data: { original: input, converted: convertedTimestamp, inputFormat, outputFormat }
              };
              break;
            }
            
            case 'uuid-generator': {
              const version = options.version || 'v4';
              const count = parseInt(options.count) || 1;
              
              const uuids = [];
              for (let i = 0; i < count; i++) {
                uuids.push(DeveloperService.generateUUID(version));
              }
              
              const outputPath = path.join(process.cwd(), 'uploads', `uuids-${Date.now()}.txt`);
              fs.writeFileSync(outputPath, uuids.join('\n'), 'utf8');
              
              result = {
                fileId: path.basename(outputPath),
                fileName: path.basename(outputPath),
                fileSize: fs.statSync(outputPath).size,
                message: `Successfully generated ${count} UUID${count > 1 ? 's' : ''}`,
                data: { uuids, count, version }
              };
              break;
            }
            
            case 'password-generator': {
              const length = parseInt(options.length) || 12;
              const includeUppercase = options.includeUppercase !== false;
              const includeLowercase = options.includeLowercase !== false;
              const includeNumbers = options.includeNumbers !== false;
              const includeSymbols = options.includeSymbols === true;
              const excludeSimilar = options.excludeSimilar === true;
              
              const password = DeveloperService.generatePassword({
                length,
                includeUppercase,
                includeLowercase,
                includeNumbers,
                includeSymbols,
                excludeSimilar
              });
              
              const strength = DeveloperService.analyzePasswordStrength(password);
              
              result = {
                fileId: `password-${Date.now()}.json`,
                fileName: 'generated-password.json',
                fileSize: JSON.stringify({ password, strength }).length,
                message: `Successfully generated ${strength.strength.toLowerCase()} password`,
                data: { password, strength, options: { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar } }
              };
              break;
            }
          }
        } catch (error) {
          console.error(`${toolId} error:`, error);
          res.status(500).json({ success: false, error: `Failed to process with ${toolId}: ${error.message}` });
          return;
        }
        break;
      }

      // Converter Tools
      case 'unit-converter':
      case 'currency-converter':
      case 'number-base-converter':
      case 'color-converter':
      case 'timezone-converter':
      case 'image-format-converter':
      case 'audio-format-converter':
      case 'document-format-converter':
      case 'encoding-converter': {
        try {
          // Use imported ConverterService
          
          switch (toolId) {
            case 'unit-converter': {
              const value = parseFloat(options.value);
              const unitType = options.unitType || 'length';
              const fromUnit = options.fromUnit;
              const toUnit = options.toUnit;
              
              if (isNaN(value) || !fromUnit || !toUnit) {
                res.status(400).json({ success: false, error: 'Value, from unit, and to unit are required' });
                return;
              }
              
              const convertedValue = ConverterService.convertUnit(value, fromUnit, toUnit, unitType);
              
              result = {
                fileId: `unit-conversion-${Date.now()}.json`,
                fileName: 'unit-conversion-result.json',
                fileSize: JSON.stringify({ original: value, converted: convertedValue, fromUnit, toUnit, unitType }).length,
                message: `Successfully converted ${value} ${fromUnit} to ${convertedValue.toFixed(6)} ${toUnit}`,
                data: { original: value, converted: convertedValue, fromUnit, toUnit, unitType }
              };
              break;
            }
            
            case 'currency-converter': {
              const amount = parseFloat(options.amount);
              const fromCurrency = options.fromCurrency;
              const toCurrency = options.toCurrency;
              
              if (isNaN(amount) || !fromCurrency || !toCurrency) {
                res.status(400).json({ success: false, error: 'Amount, from currency, and to currency are required' });
                return;
              }
              
              const conversionResult = await ConverterService.convertCurrency(amount, fromCurrency, toCurrency);
              
              result = {
                fileId: `currency-conversion-${Date.now()}.json`,
                fileName: 'currency-conversion-result.json',
                fileSize: JSON.stringify(conversionResult).length,
                message: `Successfully converted ${amount} ${fromCurrency} to ${conversionResult.convertedAmount} ${toCurrency}`,
                data: conversionResult
              };
              break;
            }
            
            case 'number-base-converter': {
              const number = options.number;
              const fromBase = parseInt(options.fromBase);
              const toBase = parseInt(options.toBase);
              
              if (!number || !fromBase || !toBase) {
                res.status(400).json({ success: false, error: 'Number, from base, and to base are required' });
                return;
              }
              
              const convertedNumber = ConverterService.convertNumberBase(number, fromBase, toBase);
              
              result = {
                fileId: `number-base-conversion-${Date.now()}.json`,
                fileName: 'number-base-conversion-result.json',
                fileSize: JSON.stringify({ original: number, converted: convertedNumber, fromBase, toBase }).length,
                message: `Successfully converted ${number} (base ${fromBase}) to ${convertedNumber} (base ${toBase})`,
                data: { original: number, converted: convertedNumber, fromBase, toBase }
              };
              break;
            }
            
            case 'color-converter': {
              const color = options.color;
              const targetFormat = options.targetFormat || 'hex';
              
              if (!color) {
                res.status(400).json({ success: false, error: 'Color value is required' });
                return;
              }
              
              const convertedColor = ConverterService.convertColorFormat(color, targetFormat);
              
              result = {
                fileId: `color-conversion-${Date.now()}.json`,
                fileName: 'color-conversion-result.json',
                fileSize: JSON.stringify({ original: color, converted: convertedColor, format: targetFormat }).length,
                message: `Successfully converted color to ${targetFormat.toUpperCase()}`,
                data: { original: color, converted: convertedColor, format: targetFormat }
              };
              break;
            }
            
            case 'timezone-converter': {
              const dateTime = options.dateTime;
              const fromTimezone = options.fromTimezone;
              const toTimezone = options.toTimezone;
              
              if (!dateTime || !fromTimezone || !toTimezone) {
                res.status(400).json({ success: false, error: 'Date/time, from timezone, and to timezone are required' });
                return;
              }
              
              const conversionResult = ConverterService.convertTimezone(dateTime, fromTimezone, toTimezone);
              
              result = {
                fileId: `timezone-conversion-${Date.now()}.json`,
                fileName: 'timezone-conversion-result.json',
                fileSize: JSON.stringify(conversionResult).length,
                message: `Successfully converted time from ${fromTimezone} to ${toTimezone}`,
                data: conversionResult
              };
              break;
            }
            
            case 'image-format-converter': {
              if (!files || files.length !== 1) {
                res.status(400).json({ success: false, error: 'Exactly 1 image file is required for format conversion' });
                return;
              }
              
              const format = options.format || 'png';
              const quality = parseInt(options.quality) || 80;
              
              // Use existing ImageService for format conversion
              // Use imported ImageService
              outputPath = await ImageService.convertImage(files[0].path, {
                format,
                quality
              });
              
              result = {
                fileId: path.basename(outputPath),
                fileName: path.basename(outputPath),
                fileSize: fs.statSync(outputPath).size,
                message: `Successfully converted image to ${format.toUpperCase()}`
              };
              break;
            }
            
            case 'audio-format-converter': {
              if (!files || files.length !== 1) {
                res.status(400).json({ success: false, error: 'Exactly 1 audio file is required for format conversion' });
                return;
              }
              
              const format = options.format || 'mp3';
              const bitrate = options.bitrate || '192';
              
              // Use existing VideoService for audio conversion
              // Use imported VideoService
              outputPath = await VideoService.extractAudio(files[0].path, {
                format,
                bitrate: `${bitrate}k`
              });
              
              result = {
                fileId: path.basename(outputPath),
                fileName: path.basename(outputPath),
                fileSize: fs.statSync(outputPath).size,
                message: `Successfully converted audio to ${format.toUpperCase()}`
              };
              break;
            }
            
            case 'document-format-converter': {
              if (!files || files.length !== 1) {
                res.status(400).json({ success: false, error: 'Exactly 1 document file is required for format conversion' });
                return;
              }
              
              const format = options.format || 'pdf';
              const preserveFormatting = options.preserveFormatting !== false;
              
              // Use existing FileService for document conversion
              // Use imported FileService
              
              if (format === 'pdf') {
                outputPath = await FileService.convertToPDF(files[0].path, {
                  preserveFormatting
                });
              } else {
                // For other formats, use appropriate conversion method
                outputPath = await FileService.convertDocument(files[0].path, format, {
                  preserveFormatting
                });
              }
              
              result = {
                fileId: path.basename(outputPath),
                fileName: path.basename(outputPath),
                fileSize: fs.statSync(outputPath).size,
                message: `Successfully converted document to ${format.toUpperCase()}`
              };
              break;
            }
            
            case 'encoding-converter': {
              const text = options.text || (files && files[0] ? fs.readFileSync(files[0].path, 'utf8') : '');
              const fromEncoding = options.fromEncoding || 'utf8';
              const toEncoding = options.toEncoding || 'base64';
              
              if (!text) {
                res.status(400).json({ success: false, error: 'Text is required for encoding conversion' });
                return;
              }
              
              const convertedText = ConverterService.convertEncoding(text, fromEncoding, toEncoding);
              
              const outputPath = path.join(process.cwd(), 'uploads', `encoding-conversion-${Date.now()}.txt`);
              fs.writeFileSync(outputPath, convertedText, 'utf8');
              
              result = {
                fileId: path.basename(outputPath),
                fileName: path.basename(outputPath),
                fileSize: fs.statSync(outputPath).size,
                message: `Successfully converted text from ${fromEncoding} to ${toEncoding}`
              };
              break;
            }
          }
        } catch (error) {
          console.error(`${toolId} error:`, error);
          res.status(500).json({ success: false, error: `Failed to process with ${toolId}: ${error.message}` });
          return;
        }
        break;
      }
      
      case 'watermark-remover': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 image file is required for watermark removal' });
          return;
        }
        
        try {
          const x = parseInt(options.x) || 0;
          const y = parseInt(options.y) || 0;
          const width = parseInt(options.width) || 100;
          const height = parseInt(options.height) || 100;
          
          const outputPath = await ImageService.removeWatermark(files[0].path, { x, y, width, height });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: 'Successfully removed watermark from image'
          };
        } catch (error) {
          console.error('Watermark removal error:', error);
          res.status(500).json({ success: false, error: `Failed to remove watermark: ${error.message}` });
          return;
        }
        break;
      }
      
      case 'photo-enhancer': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 image file is required for photo enhancement' });
          return;
        }
        
        try {
          const denoise = options.denoise === 'true' || options.denoise === true;
          const sharpen = options.sharpen === 'true' || options.sharpen === true;
          const colorEnhance = options.colorEnhance === 'true' || options.colorEnhance === true;
          
          const outputPath = await ImageService.enhancePhoto(files[0].path, { denoise, sharpen, colorEnhance });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: 'Successfully enhanced photo quality'
          };
        } catch (error) {
          console.error('Photo enhancement error:', error);
          res.status(500).json({ success: false, error: `Failed to enhance photo: ${error.message}` });
          return;
        }
        break;
      }
      
      case 'image-upscaler': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 image file is required for image upscaling' });
          return;
        }
        
        try {
          const scale = parseFloat(options.scale) || 2.0;
          const algorithm = options.algorithm || 'lanczos';
          
          const outputPath = await ImageService.upscaleImage(files[0].path, { scale, algorithm });
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully upscaled image by ${scale}x using ${algorithm} algorithm`
          };
        } catch (error) {
          console.error('Image upscaling error:', error);
          res.status(500).json({ success: false, error: `Failed to upscale image: ${error.message}` });
          return;
        }
        break;
      }
      
      // OCR Tools
      case 'image-to-text': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 image file is required for OCR' });
          return;
        }
        
        try {
          const language = options.language || 'eng';
          const ocrResult = await OCRService.extractTextFromImage(files[0].path, { language });
          
          const outputPath = path.join(process.cwd(), 'uploads', `ocr-text-${Date.now()}.txt`);
          fs.writeFileSync(outputPath, ocrResult.text, 'utf8');
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully extracted text with ${ocrResult.confidence.toFixed(1)}% confidence`,
            data: { text: ocrResult.text, confidence: ocrResult.confidence }
          };
        } catch (error) {
          console.error('Image to text OCR error:', error);
          res.status(500).json({ success: false, error: `Failed to extract text from image: ${error.message}` });
          return;
        }
        break;
      }
      
      case 'pdf-ocr': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 PDF file is required for OCR' });
          return;
        }
        
        try {
          const language = options.language || 'eng';
          const ocrResult = await OCRService.extractTextFromPDF(files[0].path, { language });
          
          const outputPath = path.join(process.cwd(), 'uploads', `pdf-ocr-${Date.now()}.txt`);
          fs.writeFileSync(outputPath, ocrResult.text, 'utf8');
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully extracted text from PDF with ${ocrResult.confidence.toFixed(1)}% confidence`,
            data: { text: ocrResult.text, confidence: ocrResult.confidence }
          };
        } catch (error) {
          console.error('PDF OCR error:', error);
          res.status(500).json({ success: false, error: `Failed to extract text from PDF: ${error.message}` });
          return;
        }
        break;
      }
      
      case 'handwriting-recognition': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 image file is required for handwriting recognition' });
          return;
        }
        
        try {
          const language = options.language || 'eng';
          const ocrResult = await OCRService.recognizeHandwriting(files[0].path, { language });
          
          const outputPath = path.join(process.cwd(), 'uploads', `handwriting-${Date.now()}.txt`);
          fs.writeFileSync(outputPath, ocrResult.text, 'utf8');
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully recognized handwriting with ${ocrResult.confidence.toFixed(1)}% confidence`,
            data: { text: ocrResult.text, confidence: ocrResult.confidence }
          };
        } catch (error) {
          console.error('Handwriting recognition error:', error);
          res.status(500).json({ success: false, error: `Failed to recognize handwriting: ${error.message}` });
          return;
        }
        break;
      }
      
      case 'document-scanner': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 image file is required for document scanning' });
          return;
        }
        
        try {
          const language = options.language || 'eng';
          const ocrResult = await OCRService.extractTextFromImage(files[0].path, { language });
          
          const outputPath = path.join(process.cwd(), 'uploads', `scanned-document-${Date.now()}.txt`);
          fs.writeFileSync(outputPath, ocrResult.text, 'utf8');
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully scanned document with ${ocrResult.confidence.toFixed(1)}% confidence`,
            data: { text: ocrResult.text, confidence: ocrResult.confidence }
          };
        } catch (error) {
          console.error('Document scanner error:', error);
          res.status(500).json({ success: false, error: `Failed to scan document: ${error.message}` });
          return;
        }
        break;
      }
      
      case 'table-extractor': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 image file is required for table extraction' });
          return;
        }
        
        try {
          const language = options.language || 'eng';
          const tableData = await OCRService.extractTableFromImage(files[0].path, { language });
          
          const outputPath = path.join(process.cwd(), 'uploads', `table-data-${Date.now()}.json`);
          fs.writeFileSync(outputPath, JSON.stringify(tableData, null, 2), 'utf8');
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully extracted table with ${tableData.headers.length} columns and ${tableData.rows.length} rows`,
            data: tableData
          };
        } catch (error) {
          console.error('Table extraction error:', error);
          res.status(500).json({ success: false, error: `Failed to extract table: ${error.message}` });
          return;
        }
        break;
      }
      
      case 'receipt-scanner': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 image file is required for receipt scanning' });
          return;
        }
        
        try {
          const language = options.language || 'eng';
          const receiptData = await OCRService.extractReceipt(files[0].path, { language });
          
          const outputPath = path.join(process.cwd(), 'uploads', `receipt-data-${Date.now()}.json`);
          fs.writeFileSync(outputPath, JSON.stringify(receiptData, null, 2), 'utf8');
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully scanned receipt from ${receiptData.merchant || 'unknown merchant'}`,
            data: receiptData
          };
        } catch (error) {
          console.error('Receipt scanner error:', error);
          res.status(500).json({ success: false, error: `Failed to scan receipt: ${error.message}` });
          return;
        }
        break;
      }
      
      case 'business-card-scanner': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 image file is required for business card scanning' });
          return;
        }
        
        try {
          const language = options.language || 'eng';
          const businessCardData = await OCRService.extractBusinessCard(files[0].path, { language });
          
          const outputPath = path.join(process.cwd(), 'uploads', `business-card-${Date.now()}.json`);
          fs.writeFileSync(outputPath, JSON.stringify(businessCardData, null, 2), 'utf8');
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully scanned business card for ${businessCardData.name || 'unknown person'}`,
            data: businessCardData
          };
        } catch (error) {
          console.error('Business card scanner error:', error);
          res.status(500).json({ success: false, error: `Failed to scan business card: ${error.message}` });
          return;
        }
        break;
      }
      
      case 'license-plate-reader': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 image file is required for license plate reading' });
          return;
        }
        
        try {
          const plateText = await OCRService.readLicensePlate(files[0].path);
          
          const outputPath = path.join(process.cwd(), 'uploads', `license-plate-${Date.now()}.txt`);
          fs.writeFileSync(outputPath, plateText, 'utf8');
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: `Successfully read license plate: ${plateText}`,
            data: { plateNumber: plateText }
          };
        } catch (error) {
          console.error('License plate reader error:', error);
          res.status(500).json({ success: false, error: `Failed to read license plate: ${error.message}` });
          return;
        }
        break;
      }
      
      case 'qr-code-reader': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 image file is required for QR code reading' });
          return;
        }
        
        try {
          const qrContent = await OCRService.readQRCode(files[0].path);
          
          const outputPath = path.join(process.cwd(), 'uploads', `qr-content-${Date.now()}.txt`);
          fs.writeFileSync(outputPath, qrContent, 'utf8');
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: 'Successfully read QR code content',
            data: { content: qrContent }
          };
        } catch (error) {
          console.error('QR code reader error:', error);
          res.status(500).json({ success: false, error: `Failed to read QR code: ${error.message}` });
          return;
        }
        break;
      }
      
      // Advanced PDF Tools
      case 'pdf-form-filler': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 PDF file is required for form filling' });
          return;
        }
        
        try {
          const formData = JSON.parse(options.formData || '{}');
          const outputPath = await PDFService.fillPDFForm(files[0].path, formData);
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: 'Successfully filled PDF form'
          };
        } catch (error) {
          console.error('PDF form filling error:', error);
          res.status(500).json({ success: false, error: `Failed to fill PDF form: ${error.message}` });
          return;
        }
        break;
      }
      
      case 'pdf-signature': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 PDF file is required for signature' });
          return;
        }
        
        try {
          const signatureOptions = {
            text: options.signatureText || 'Digital Signature',
            x: parseInt(options.x) || 100,
            y: parseInt(options.y) || 100,
            width: parseInt(options.width) || 200,
            height: parseInt(options.height) || 50,
            page: parseInt(options.page) || 1
          };
          
          const outputPath = await PDFService.addSignatureToPDF(files[0].path, signatureOptions);
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: 'Successfully added signature to PDF'
          };
        } catch (error) {
          console.error('PDF signature error:', error);
          res.status(500).json({ success: false, error: `Failed to add signature: ${error.message}` });
          return;
        }
        break;
      }
      
      case 'pdf-watermark': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 PDF file is required for watermark' });
          return;
        }
        
        try {
          const watermarkOptions = {
            text: options.watermarkText || 'CONFIDENTIAL',
            opacity: parseFloat(options.opacity) || 0.3,
            fontSize: parseInt(options.fontSize) || 48,
            rotation: parseInt(options.rotation) || -45,
            color: {
              r: parseFloat(options.colorR) || 0.5,
              g: parseFloat(options.colorG) || 0.5,
              b: parseFloat(options.colorB) || 0.5
            }
          };
          
          const outputPath = await PDFService.addWatermarkToPDF(files[0].path, watermarkOptions);
          
          result = {
            fileId: path.basename(outputPath),
            fileName: path.basename(outputPath),
            fileSize: fs.statSync(outputPath).size,
            message: 'Successfully added watermark to PDF'
          };
        } catch (error) {
          console.error('PDF watermark error:', error);
          res.status(500).json({ success: false, error: `Failed to add watermark: ${error.message}` });
          return;
        }
        break;
      }
        
      default:
        res.status(400).json({
          success: false,
          error: 'Unsupported tool'
        });
        return;
    }
    
    // Clean up uploaded files after processing
    if (files) {
      files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    res.json({
      success: true,
      data: result,
      downloadUrl: `/api/download/${result.fileId}`
    });
  } catch (error) {
    console.error('Tool processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Processing failed',
      details: error.message
    });
  }
});



export default router;