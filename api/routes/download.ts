/**
 * Download API routes
 * Handle file downloads for processed files
 */
import { Router, type Request, type Response } from 'express';
import path from 'path';
import fs from 'fs/promises';

const router = Router();

/**
 * Download processed file
 * GET /api/download/:filename
 */
router.get('/:filename', async (req: Request, res: Response): Promise<void> => {
  try {
    const { filename } = req.params;
    
    console.log(`Download request for file: ${filename}`);
    
    // Look for the file in the uploads directory
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const filePath = path.join(uploadsDir, filename);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }
    
    // Get file stats
    const stats = await fs.stat(filePath);
    const fileExtension = path.extname(filename).toLowerCase();
    
    // Set appropriate content type based on file extension
    let contentType = 'application/octet-stream';
    switch (fileExtension) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.bmp':
        contentType = 'image/bmp';
        break;
      case '.tiff':
        contentType = 'image/tiff';
        break;
      case '.mp4':
        contentType = 'video/mp4';
        break;
      case '.txt':
        contentType = 'text/plain';
        break;
      case '.md':
        contentType = 'text/markdown';
        break;
      case '.html':
        contentType = 'text/html';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
    }
    
    // Set headers for file download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', stats.size.toString());
    res.setHeader('Cache-Control', 'no-cache');
    
    // Read and send the actual file
    const fileContent = await fs.readFile(filePath);
    res.send(fileContent);
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      error: 'Download failed'
    });
  }
});



export default router;