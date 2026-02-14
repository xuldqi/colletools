import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

// Set the FFmpeg path to the installed binary
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export interface VideoConversionOptions {
  format: 'mp4' | 'avi' | 'mov' | 'wmv' | 'flv' | 'mkv' | 'webm' | '3gp';
  quality?: 'low' | 'medium' | 'high';
  resolution?: string; // e.g., '1920x1080', '1280x720'
  bitrate?: string; // e.g., '1000k', '2M'
}

export interface VideoCompressionOptions {
  quality: number; // 1-100
  targetSize?: string; // e.g., '10MB'
  resolution?: string;
}

export interface VideoEditOptions {
  startTime?: string; // e.g., '00:00:10'
  duration?: string; // e.g., '00:01:30'
  endTime?: string;
}

export interface VideoRotateOptions {
  angle: number; // 90, 180, 270
  flipHorizontal?: boolean;
  flipVertical?: boolean;
}

export class VideoService {
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

  static async convertVideo(filePath: string, options: VideoConversionOptions): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const outputFileName = `converted_${Date.now()}.${options.format}`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    return new Promise((resolve, reject) => {
      let command = ffmpeg(filePath)
        .videoCodec('libx264')
        .audioCodec('aac');
      
      // Add quality settings
      if (options.quality) {
        const crf = options.quality === 'high' ? 18 : options.quality === 'medium' ? 23 : 28;
        command = command.addOption('-crf', crf.toString());
      }
      
      // Add resolution if specified
      if (options.resolution) {
        command = command.size(options.resolution);
      }
      
      // Add bitrate if specified
      if (options.bitrate) {
        command = command.videoBitrate(options.bitrate);
      }
      
      command
        .output(outputPath)
        .on('end', () => {
          // Schedule file deletion after 1 hour
          setTimeout(() => {
            if (fs.existsSync(outputPath)) {
              fs.unlinkSync(outputPath);
            }
          }, 60 * 60 * 1000);
          
          resolve(outputPath);
        })
        .on('error', (error) => {
          reject(error);
        })
        .run();
    });
  }
  
  static async compressVideo(filePath: string, options: VideoCompressionOptions): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const fileExtension = path.extname(filePath);
    const outputFileName = `compressed_${Date.now()}${fileExtension}`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    return new Promise((resolve, reject) => {
      // Convert quality (1-100) to CRF (0-51, lower is better)
      const crf = Math.round(51 - (options.quality / 100) * 51);
      
      let command = ffmpeg(filePath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .addOption('-crf', crf.toString());
      
      // Add resolution if specified
      if (options.resolution) {
        command = command.size(options.resolution);
      }
      
      // Add target file size if specified
      if (options.targetSize) {
        command = command.addOption('-fs', options.targetSize);
      }
      
      command
        .output(outputPath)
        .on('end', () => {
          // Schedule file deletion after 1 hour
          setTimeout(() => {
            if (fs.existsSync(outputPath)) {
              fs.unlinkSync(outputPath);
            }
          }, 60 * 60 * 1000);
          
          resolve(outputPath);
        })
        .on('error', (error) => {
          reject(error);
        })
        .run();
    });
  }
  
  static async trimVideo(filePath: string, options: VideoEditOptions): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const fileExtension = path.extname(filePath);
    const outputFileName = `trimmed_${Date.now()}${fileExtension}`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    return new Promise((resolve, reject) => {
      let command = ffmpeg(filePath);
      
      if (options.startTime) {
        command = command.seekInput(options.startTime);
      }
      
      if (options.duration) {
        command = command.duration(options.duration);
      } else if (options.endTime && options.startTime) {
        // Calculate duration from start and end time
        const startSeconds = this.timeToSeconds(options.startTime);
        const endSeconds = this.timeToSeconds(options.endTime);
        const duration = endSeconds - startSeconds;
        command = command.duration(duration);
      }
      
      command
        .videoCodec('copy')
        .audioCodec('copy')
        .output(outputPath)
        .on('end', () => {
          // Schedule file deletion after 1 hour
          setTimeout(() => {
            if (fs.existsSync(outputPath)) {
              fs.unlinkSync(outputPath);
            }
          }, 60 * 60 * 1000);
          
          resolve(outputPath);
        })
        .on('error', (error) => {
          reject(error);
        })
        .run();
    });
  }
  
  static async rotateVideo(filePath: string, options: VideoRotateOptions): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const fileExtension = path.extname(filePath);
    const outputFileName = `rotated_${Date.now()}${fileExtension}`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    return new Promise((resolve, reject) => {
      // Build video filter for rotation and flipping
      let videoFilter = '';
      
      if (options.angle === 90) {
        videoFilter = 'transpose=1';
      } else if (options.angle === 180) {
        videoFilter = 'transpose=1,transpose=1';
      } else if (options.angle === 270) {
        videoFilter = 'transpose=2';
      }
      
      if (options.flipHorizontal) {
        videoFilter = videoFilter ? `${videoFilter},hflip` : 'hflip';
      }
      
      if (options.flipVertical) {
        videoFilter = videoFilter ? `${videoFilter},vflip` : 'vflip';
      }
      
      let command = ffmpeg(filePath).audioCodec('copy');
      
      if (videoFilter) {
        command = command.videoFilters(videoFilter);
      }
      
      command
        .output(outputPath)
        .on('end', () => {
          // Schedule file deletion after 1 hour
          setTimeout(() => {
            if (fs.existsSync(outputPath)) {
              fs.unlinkSync(outputPath);
            }
          }, 60 * 60 * 1000);
          
          resolve(outputPath);
        })
        .on('error', (error) => {
          reject(error);
        })
        .run();
    });
  }
  
  static async extractAudio(filePath: string, format: 'mp3' | 'wav' | 'aac' = 'mp3'): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const outputFileName = `audio_${Date.now()}.${format}`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    return new Promise((resolve, reject) => {
      const audioCodec = format === 'mp3' ? 'libmp3lame' : format === 'wav' ? 'pcm_s16le' : 'aac';
      
      ffmpeg(filePath)
        .noVideo()
        .audioCodec(audioCodec)
        .output(outputPath)
        .on('end', () => {
          // Schedule file deletion after 1 hour
          setTimeout(() => {
            if (fs.existsSync(outputPath)) {
              fs.unlinkSync(outputPath);
            }
          }, 60 * 60 * 1000);
          
          resolve(outputPath);
        })
        .on('error', (error) => {
          reject(error);
        })
        .run();
    });
  }
  
  static async mergeVideos(filePaths: string[]): Promise<string> {
    await this.ensureDirectories();
    
    if (filePaths.length < 2) {
      throw new Error('At least 2 video files are required for merging');
    }
    
    // Verify all files exist
    for (const filePath of filePaths) {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
    }
    
    const outputFileName = `merged_${Date.now()}.mp4`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    return new Promise((resolve, reject) => {
      let command = ffmpeg();
      
      // Add all input files
      filePaths.forEach(filePath => {
        command = command.input(filePath);
      });
      
      command
        .on('end', () => {
          // Schedule file deletion after 1 hour
          setTimeout(() => {
            if (fs.existsSync(outputPath)) {
              fs.unlinkSync(outputPath);
            }
          }, 60 * 60 * 1000);
          
          resolve(outputPath);
        })
        .on('error', (error) => {
          reject(error);
        })
        .mergeToFile(outputPath);
    });
  }
  
  static async createGif(filePath: string, options: { startTime?: string; duration?: string; width?: number; fps?: number } = {}): Promise<string> {
    await this.ensureDirectories();
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const outputFileName = `gif_${Date.now()}.gif`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    return new Promise((resolve, reject) => {
      let command = ffmpeg(filePath);
      
      if (options.startTime) {
        command = command.seekInput(options.startTime);
      }
      
      if (options.duration) {
        command = command.duration(options.duration);
      }
      
      // Video filter for GIF optimization
      let videoFilter = `fps=${options.fps || 10}`;
      if (options.width) {
        videoFilter += `,scale=${options.width}:-1:flags=lanczos`;
      }
      
      command
        .videoFilters(videoFilter)
        .output(outputPath)
        .on('end', () => {
          // Schedule file deletion after 1 hour
          setTimeout(() => {
            if (fs.existsSync(outputPath)) {
              fs.unlinkSync(outputPath);
            }
          }, 60 * 60 * 1000);
          
          resolve(outputPath);
        })
        .on('error', (error) => {
          reject(error);
        })
        .run();
    });
  }
  
  static async getVideoInfo(filePath: string): Promise<{
    format: {
      duration: string;
      size: string;
      bit_rate: string;
    };
    streams: Array<{
      codec_type: string;
      codec_name: string;
      width?: number;
      height?: number;
      duration?: string;
    }>;
  }> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (error, metadata) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            format: {
              duration: metadata.format.duration?.toString() || '0',
              size: metadata.format.size?.toString() || '0',
              bit_rate: metadata.format.bit_rate?.toString() || '0'
            },
            streams: metadata.streams.map(stream => ({
              codec_type: stream.codec_type || '',
              codec_name: stream.codec_name || '',
              width: stream.width,
              height: stream.height,
              duration: stream.duration?.toString()
            }))
          });
        }
      });
    });
  }
  
  // Helper method to convert time string to seconds
  private static timeToSeconds(timeString: string): number {
    const parts = timeString.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const seconds = parseFloat(parts[2]);
      return hours * 3600 + minutes * 60 + seconds;
    } else if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseFloat(parts[1]);
      return minutes * 60 + seconds;
    } else {
      return parseFloat(timeString);
    }
  }
}