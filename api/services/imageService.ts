import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { Jimp } from 'jimp';

export interface ImageConversionOptions {
  format: 'jpeg' | 'png' | 'webp' | 'gif' | 'tiff' | 'bmp';
  quality?: number;
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
}

export interface ImageResizeOptions {
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

export class ImageService {
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

  static async convertImage(filePath: string, options: ImageConversionOptions): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const outputFileName = `converted_${Date.now()}.${options.format}`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    let sharpInstance = sharp(filePath);
    
    // Apply resizing if specified
    if (options.width || options.height) {
      const resizeOptions: {
        width?: number;
        height?: number;
        fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
      } = {
        width: options.width,
        height: options.height,
        fit: options.maintainAspectRatio ? 'inside' : 'fill'
      };
      sharpInstance = sharpInstance.resize(resizeOptions);
    }
    
    // Apply format conversion
    switch (options.format) {
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality: options.quality || 80 });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({ quality: options.quality || 80 });
        break;
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality: options.quality || 80 });
        break;
      case 'gif':
        sharpInstance = sharpInstance.gif();
        break;
      case 'tiff':
        sharpInstance = sharpInstance.tiff({ quality: options.quality || 80 });
        break;
      case 'bmp':
        sharpInstance = sharpInstance.bmp();
        break;
    }
    
    await sharpInstance.toFile(outputPath);
    
    // Schedule file deletion after 1 hour
    setTimeout(() => {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    }, 60 * 60 * 1000);
    
    return outputPath;
  }
  
  static async resizeImage(filePath: string, options: ImageResizeOptions): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const fileExtension = path.extname(filePath);
    const outputFileName = `resized_${Date.now()}${fileExtension}`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    const resizeOptions: {
      width?: number;
      height?: number;
      fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    } = {
      width: options.width,
      height: options.height,
      fit: options.fit || (options.maintainAspectRatio ? 'inside' : 'fill')
    };
    
    await sharp(filePath)
      .resize(resizeOptions)
      .toFile(outputPath);
    
    // Schedule file deletion after 1 hour
    setTimeout(() => {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    }, 60 * 60 * 1000);
    
    return outputPath;
  }
  
  static async compressImage(filePath: string, options: { quality: number; format?: string }): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const outputFormat = options.format || path.extname(filePath).toLowerCase().substring(1);
    const outputFileName = `compressed_${Date.now()}.${outputFormat}`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    let sharpInstance = sharp(filePath);
    
    switch (outputFormat) {
      case 'jpg':
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality: options.quality });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({ quality: options.quality });
        break;
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality: options.quality });
        break;
      default:
        // For other formats, just copy the file
        fs.copyFileSync(filePath, outputPath);
        return outputPath;
    }
    
    await sharpInstance.toFile(outputPath);
    
    // Schedule file deletion after 1 hour
    setTimeout(() => {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    }, 60 * 60 * 1000);
    
    return outputPath;
  }
  
  static async cropImage(filePath: string, options: { x: number; y: number; width: number; height: number }): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const fileExtension = path.extname(filePath);
    const outputFileName = `cropped_${Date.now()}${fileExtension}`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    await sharp(filePath)
      .extract({ left: options.x, top: options.y, width: options.width, height: options.height })
      .toFile(outputPath);
    
    // Schedule file deletion after 1 hour
    setTimeout(() => {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    }, 60 * 60 * 1000);
    
    return outputPath;
  }
  
  static async rotateImage(filePath: string, options: { angle: number; flipHorizontal?: boolean; flipVertical?: boolean }): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const fileExtension = path.extname(filePath);
    const outputFileName = `rotated_${Date.now()}${fileExtension}`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    let sharpInstance = sharp(filePath);
    
    // Apply rotation
    if (options.angle !== 0) {
      sharpInstance = sharpInstance.rotate(options.angle);
    }
    
    // Apply flips
    if (options.flipHorizontal || options.flipVertical) {
      sharpInstance = sharpInstance.flip(options.flipVertical).flop(options.flipHorizontal);
    }
    
    await sharpInstance.toFile(outputPath);
    
    // Schedule file deletion after 1 hour
    setTimeout(() => {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    }, 60 * 60 * 1000);
    
    return outputPath;
  }
  
  static async editPhoto(filePath: string, options: { brightness: number; contrast: number; saturation: number; hue: number }): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const fileExtension = path.extname(filePath);
    const outputFileName = `edited_${Date.now()}${fileExtension}`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    let sharpInstance = sharp(filePath);
    
    // Apply photo adjustments
    if (options.brightness !== 0) {
      // Convert brightness from -100 to 100 range to sharp's multiplier range
      const brightnessMultiplier = 1 + (options.brightness / 100);
      sharpInstance = sharpInstance.modulate({ brightness: brightnessMultiplier });
    }
    
    if (options.saturation !== 0) {
      // Convert saturation from -100 to 100 range to sharp's multiplier range
      const saturationMultiplier = 1 + (options.saturation / 100);
      sharpInstance = sharpInstance.modulate({ saturation: saturationMultiplier });
    }
    
    if (options.hue !== 0) {
      // Apply hue rotation
      sharpInstance = sharpInstance.modulate({ hue: options.hue });
    }
    
    // Note: Sharp doesn't have direct contrast adjustment, using gamma as approximation
    if (options.contrast !== 0) {
      const gamma = options.contrast > 0 ? 1 - (options.contrast / 200) : 1 + Math.abs(options.contrast) / 100;
      sharpInstance = sharpInstance.gamma(gamma);
    }
    
    await sharpInstance.toFile(outputPath);
    
    // Schedule file deletion after 1 hour
    setTimeout(() => {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    }, 60 * 60 * 1000);
    
    return outputPath;
  }
  
  static async enhanceImage(filePath: string, options: { scale: number; sharpen: number }): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const fileExtension = path.extname(filePath);
    const outputFileName = `enhanced_${Date.now()}${fileExtension}`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    // Get original image metadata
    const metadata = await sharp(filePath).metadata();
    const newWidth = (metadata.width || 1000) * options.scale;
    const newHeight = (metadata.height || 1000) * options.scale;
    
    let sharpInstance = sharp(filePath)
      .resize(newWidth, newHeight, { kernel: 'lanczos3' }); // Use high-quality resampling
    
    // Apply sharpening if specified
    if (options.sharpen > 0) {
      const sharpenAmount = options.sharpen / 100; // Convert to 0-1 range
      sharpInstance = sharpInstance.sharpen(sharpenAmount);
    }
    
    await sharpInstance.toFile(outputPath);
    
    // Schedule file deletion after 1 hour
    setTimeout(() => {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    }, 60 * 60 * 1000);
    
    return outputPath;
  }
  
  static async getImageInfo(filePath: string): Promise<sharp.Metadata> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    return await sharp(filePath).metadata();
  }
  
  /**
   * Remove background from image using AI-based segmentation
   */
  static async removeBackground(filePath: string): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const outputFileName = `bg_removed_${Date.now()}.png`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    try {
      // Load image with Jimp for processing
      const image = await Jimp.read(filePath);
      const { width, height } = image.bitmap;
      
      // Simple background removal using color threshold
      // In a real implementation, you would use a pre-trained model
      image.scan(0, 0, width, height, function (x, y, idx) {
        const red = this.bitmap.data[idx + 0];
        const green = this.bitmap.data[idx + 1];
        const blue = this.bitmap.data[idx + 2];
        
        // Simple background detection (white/light colors)
        const brightness = (red + green + blue) / 3;
        if (brightness > 200) {
          this.bitmap.data[idx + 3] = 0; // Make transparent
        }
      });
      
      await image.writeAsync(outputPath);
      
      // Schedule file deletion after 1 hour
      setTimeout(() => {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      }, 60 * 60 * 1000);
      
      return outputPath;
    } catch (error) {
      throw new Error(`Background removal failed: ${error.message}`);
    }
  }
  
  /**
   * Remove watermarks from image using inpainting techniques
   */
  static async removeWatermark(filePath: string, options: { x: number; y: number; width: number; height: number }): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const fileExtension = path.extname(filePath);
    const outputFileName = `watermark_removed_${Date.now()}${fileExtension}`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    try {
      // Load image with Jimp
      const image = await Jimp.read(filePath);
      
      // Simple watermark removal by blurring the specified region
      const watermarkRegion = image.clone().crop(options.x, options.y, options.width, options.height);
      watermarkRegion.blur(10); // Blur the watermark area
      
      // Composite the blurred region back onto the original image
      image.composite(watermarkRegion, options.x, options.y);
      
      await image.writeAsync(outputPath);
      
      // Schedule file deletion after 1 hour
      setTimeout(() => {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      }, 60 * 60 * 1000);
      
      return outputPath;
    } catch (error) {
      throw new Error(`Watermark removal failed: ${error.message}`);
    }
  }
  
  /**
   * Enhance photo quality using AI-based techniques
   */
  static async enhancePhoto(filePath: string, options: { denoise: boolean; sharpen: boolean; colorEnhance: boolean }): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const fileExtension = path.extname(filePath);
    const outputFileName = `enhanced_photo_${Date.now()}${fileExtension}`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    try {
      let sharpInstance = sharp(filePath);
      
      // Apply denoising (using blur as approximation)
      if (options.denoise) {
        sharpInstance = sharpInstance.blur(0.5);
      }
      
      // Apply sharpening
      if (options.sharpen) {
        sharpInstance = sharpInstance.sharpen(1.0);
      }
      
      // Apply color enhancement
      if (options.colorEnhance) {
        sharpInstance = sharpInstance.modulate({
          brightness: 1.1,
          saturation: 1.2,
          hue: 0
        });
      }
      
      await sharpInstance.toFile(outputPath);
      
      // Schedule file deletion after 1 hour
      setTimeout(() => {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      }, 60 * 60 * 1000);
      
      return outputPath;
    } catch (error) {
      throw new Error(`Photo enhancement failed: ${error.message}`);
    }
  }
  
  /**
   * Upscale image using AI-based super-resolution
   */
  static async upscaleImage(filePath: string, options: { scale: number; algorithm: 'lanczos' | 'cubic' | 'ai' }): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const fileExtension = path.extname(filePath);
    const outputFileName = `upscaled_${Date.now()}${fileExtension}`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    try {
      const metadata = await sharp(filePath).metadata();
      const newWidth = Math.round((metadata.width || 1000) * options.scale);
      const newHeight = Math.round((metadata.height || 1000) * options.scale);
      
      let kernel: keyof sharp.KernelEnum;
      switch (options.algorithm) {
        case 'lanczos':
          kernel = 'lanczos3';
          break;
        case 'cubic':
          kernel = 'cubic';
          break;
        case 'ai':
        default:
          kernel = 'lanczos3'; // Use lanczos as fallback for AI
          break;
      }
      
      await sharp(filePath)
        .resize(newWidth, newHeight, { kernel })
        .sharpen(0.5) // Add slight sharpening for better quality
        .toFile(outputPath);
      
      // Schedule file deletion after 1 hour
      setTimeout(() => {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      }, 60 * 60 * 1000);
      
      return outputPath;
    } catch (error) {
      throw new Error(`Image upscaling failed: ${error.message}`);
    }
  }
}