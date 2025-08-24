import * as crypto from 'crypto';
import * as path from 'path';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

export class DeveloperService {
  /**
   * Generate hash (MD5, SHA1, SHA256, SHA512)
   */
  static generateHash(text: string, algorithm: string): string {
    const hash = crypto.createHash(algorithm);
    hash.update(text);
    return hash.digest('hex');
  }

  /**
   * Encode text to Base64
   */
  static encodeBase64(text: string): string {
    return Buffer.from(text, 'utf8').toString('base64');
  }

  /**
   * Decode Base64 to text
   */
  static decodeBase64(base64: string): string {
    try {
      return Buffer.from(base64, 'base64').toString('utf8');
    } catch (error) {
      throw new Error('Invalid Base64 string');
    }
  }

  /**
   * Encode URL
   */
  static encodeURL(text: string): string {
    return encodeURIComponent(text);
  }

  /**
   * Decode URL
   */
  static decodeURL(encodedText: string): string {
    try {
      return decodeURIComponent(encodedText);
    } catch (error) {
      throw new Error('Invalid URL encoded string');
    }
  }

  /**
   * Format and validate JSON
   */
  static formatJSON(jsonString: string, indent: number = 2): { formatted: string; valid: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, indent);
      return { formatted, valid: true };
    } catch (error) {
      return {
        formatted: jsonString,
        valid: false,
        error: error instanceof Error ? error.message : 'Invalid JSON'
      };
    }
  }

  /**
   * Validate JSON
   */
  static validateJSON(jsonString: string): { valid: boolean; error?: string; parsed?: unknown } {
    try {
      const parsed = JSON.parse(jsonString);
      return { valid: true, parsed };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Invalid JSON'
      };
    }
  }

  /**
   * Generate QR Code
   */
  static async generateQRCode(text: string, options: {
    size?: number;
    format?: 'png' | 'svg';
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  } = {}): Promise<string> {
    const {
      size = 256,
      format = 'png',
      errorCorrectionLevel = 'M'
    } = options;

    const qrOptions: QRCode.QRCodeToFileOptions = {
      width: size,
      height: size,
      errorCorrectionLevel,
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    };

    try {
      if (format === 'svg') {
        return await QRCode.toString(text, { ...qrOptions, type: 'svg' });
      } else {
        const outputPath = path.join(process.cwd(), 'uploads', `qr-${Date.now()}.png`);
        await QRCode.toFile(outputPath, text, qrOptions);
        return outputPath;
      }
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert colors between formats
   */
  static convertColor(color: string, targetFormat: 'hex' | 'rgb' | 'hsl' | 'hsv'): string {
    // Parse input color
    let r: number, g: number, b: number;

    if (color.startsWith('#')) {
      // Hex input
      const hex = color.slice(1);
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      } else {
        throw new Error('Invalid hex color format');
      }
    } else if (color.startsWith('rgb')) {
      // RGB input
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (!match) throw new Error('Invalid RGB color format');
      r = parseInt(match[1]);
      g = parseInt(match[2]);
      b = parseInt(match[3]);
    } else {
      throw new Error('Unsupported color format');
    }

    // Convert to target format
    switch (targetFormat) {
      case 'hex':
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      
      case 'rgb':
        return `rgb(${r}, ${g}, ${b})`;
      
      case 'hsl': {
        const [h, s, l] = this.rgbToHsl(r, g, b);
        return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
      }
      
      case 'hsv': {
        const [h, s, v] = this.rgbToHsv(r, g, b);
        return `hsv(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(v)}%)`;
      }
      
      default:
        throw new Error('Unsupported target format');
    }
  }

  /**
   * Convert RGB to HSL
   */
  private static rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number, s: number;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }

  /**
   * Convert RGB to HSV
   */
  private static rgbToHsv(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number;
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return [h * 360, s * 100, v * 100];
  }

  /**
   * Convert timestamp between formats
   */
  static convertTimestamp(input: string | number, inputFormat: 'unix' | 'iso' | 'date', outputFormat: 'unix' | 'iso' | 'date' | 'readable'): string {
    let date: Date;

    // Parse input
    switch (inputFormat) {
      case 'unix': {
        const timestamp = typeof input === 'string' ? parseInt(input) : input;
        date = new Date(timestamp * 1000);
        break;
      }
      case 'iso':
        date = new Date(input.toString());
        break;
      case 'date':
        date = new Date(input.toString());
        break;
      default:
        throw new Error('Unsupported input format');
    }

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date/timestamp');
    }

    // Convert to output format
    switch (outputFormat) {
      case 'unix':
        return Math.floor(date.getTime() / 1000).toString();
      case 'iso':
        return date.toISOString();
      case 'date':
        return date.toDateString();
      case 'readable':
        return date.toLocaleString();
      default:
        throw new Error('Unsupported output format');
    }
  }

  /**
   * Generate UUID
   */
  static generateUUID(version: 'v4' = 'v4'): string {
    switch (version) {
      case 'v4':
        return uuidv4();
      default:
        throw new Error('Unsupported UUID version');
    }
  }

  /**
   * Generate password
   */
  static generatePassword(options: {
    length?: number;
    includeUppercase?: boolean;
    includeLowercase?: boolean;
    includeNumbers?: boolean;
    includeSymbols?: boolean;
    excludeSimilar?: boolean;
  } = {}): string {
    const {
      length = 12,
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = false,
      excludeSimilar = false
    } = options;

    let charset = '';
    
    if (includeUppercase) {
      charset += excludeSimilar ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    
    if (includeLowercase) {
      charset += excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    }
    
    if (includeNumbers) {
      charset += excludeSimilar ? '23456789' : '0123456789';
    }
    
    if (includeSymbols) {
      charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }

    if (charset === '') {
      throw new Error('At least one character type must be selected');
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

  /**
   * Analyze password strength
   */
  static analyzePasswordStrength(password: string): {
    score: number;
    strength: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
    feedback: string[];
  } {
    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('Use at least 8 characters');

    if (password.length >= 12) score += 1;
    else if (password.length >= 8) feedback.push('Consider using 12+ characters for better security');

    // Character variety
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include uppercase letters');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Include numbers');

    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    else feedback.push('Include special characters');

    // Common patterns
    if (!/(..).*\1/.test(password)) score += 1;
    else feedback.push('Avoid repeating patterns');

    const strength = [
      'Very Weak',
      'Weak', 
      'Fair',
      'Good',
      'Strong'
    ][Math.min(Math.floor(score / 1.4), 4)] as 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';

    return { score, strength, feedback };
  }
}

export default DeveloperService;