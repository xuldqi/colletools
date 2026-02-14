// Converter service for various conversion operations

export class ConverterService {
  /**
   * Convert between different units
   */
  static convertUnit(value: number, fromUnit: string, toUnit: string, unitType: string): number {
    const conversions = {
      length: {
        // Base unit: meter
        mm: 0.001,
        cm: 0.01,
        m: 1,
        km: 1000,
        inch: 0.0254,
        ft: 0.3048,
        yard: 0.9144,
        mile: 1609.34
      },
      weight: {
        // Base unit: gram
        mg: 0.001,
        g: 1,
        kg: 1000,
        oz: 28.3495,
        lb: 453.592,
        ton: 1000000
      },
      temperature: {
        // Special handling for temperature
        celsius: (val: number, to: string) => {
          if (to === 'fahrenheit') return (val * 9/5) + 32;
          if (to === 'kelvin') return val + 273.15;
          return val;
        },
        fahrenheit: (val: number, to: string) => {
          if (to === 'celsius') return (val - 32) * 5/9;
          if (to === 'kelvin') return (val - 32) * 5/9 + 273.15;
          return val;
        },
        kelvin: (val: number, to: string) => {
          if (to === 'celsius') return val - 273.15;
          if (to === 'fahrenheit') return (val - 273.15) * 9/5 + 32;
          return val;
        }
      },
      volume: {
        // Base unit: liter
        ml: 0.001,
        l: 1,
        gallon: 3.78541,
        quart: 0.946353,
        pint: 0.473176,
        cup: 0.236588,
        floz: 0.0295735
      },
      area: {
        // Base unit: square meter
        sqmm: 0.000001,
        sqcm: 0.0001,
        sqm: 1,
        sqkm: 1000000,
        sqin: 0.00064516,
        sqft: 0.092903,
        sqyard: 0.836127,
        acre: 4046.86,
        hectare: 10000
      }
    };

    if (unitType === 'temperature') {
      const tempConversions = conversions.temperature as Record<string, (val: number, to: string) => number>;
      if (tempConversions[fromUnit]) {
        return tempConversions[fromUnit](value, toUnit);
      }
      throw new Error(`Unsupported temperature unit: ${fromUnit}`);
    }

    const unitMap = conversions[unitType as keyof typeof conversions] as Record<string, number>;
    if (!unitMap) {
      throw new Error(`Unsupported unit type: ${unitType}`);
    }

    if (!unitMap[fromUnit] || !unitMap[toUnit]) {
      throw new Error(`Unsupported unit conversion: ${fromUnit} to ${toUnit}`);
    }

    // Convert to base unit, then to target unit
    const baseValue = value * unitMap[fromUnit];
    return baseValue / unitMap[toUnit];
  }

  /**
   * Convert currency (mock implementation - would need real API in production)
   */
  static async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<{
    originalAmount: number;
    convertedAmount: number;
    fromCurrency: string;
    toCurrency: string;
    exchangeRate: number;
    timestamp: string;
  }> {
    // Mock exchange rates (in production, use real API like exchangerate-api.com)
    const mockRates: Record<string, number> = {
      'USD': 1.0,
      'EUR': 0.85,
      'GBP': 0.73,
      'JPY': 110.0,
      'CNY': 6.45,
      'CAD': 1.25,
      'AUD': 1.35,
      'CHF': 0.92,
      'SEK': 8.5,
      'NOK': 8.8
    };

    if (!mockRates[fromCurrency] || !mockRates[toCurrency]) {
      throw new Error(`Unsupported currency: ${fromCurrency} or ${toCurrency}`);
    }

    // Convert through USD as base
    const usdAmount = amount / mockRates[fromCurrency];
    const convertedAmount = usdAmount * mockRates[toCurrency];
    const exchangeRate = mockRates[toCurrency] / mockRates[fromCurrency];

    return {
      originalAmount: amount,
      convertedAmount: Math.round(convertedAmount * 100) / 100,
      fromCurrency,
      toCurrency,
      exchangeRate: Math.round(exchangeRate * 10000) / 10000,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Convert number between different bases
   */
  static convertNumberBase(number: string, fromBase: number, toBase: number): string {
    if (fromBase < 2 || fromBase > 36 || toBase < 2 || toBase > 36) {
      throw new Error('Base must be between 2 and 36');
    }

    try {
      // Convert from source base to decimal
      const decimalValue = parseInt(number, fromBase);
      
      if (isNaN(decimalValue)) {
        throw new Error('Invalid number for the specified base');
      }

      // Convert from decimal to target base
      return decimalValue.toString(toBase).toUpperCase();
    } catch (error) {
      throw new Error(`Failed to convert number: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert color between different formats
   */
  static convertColorFormat(color: string, targetFormat: 'hex' | 'rgb' | 'hsl' | 'hsv'): string {
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
   * Convert between timezones
   */
  static convertTimezone(dateTime: string, fromTimezone: string, toTimezone: string): {
    originalDateTime: string;
    convertedDateTime: string;
    fromTimezone: string;
    toTimezone: string;
  } {
    try {
      const date = new Date(dateTime);
      
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date/time format');
      }

      // Create formatters for different timezones
      const fromFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: fromTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      const toFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: toTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      const originalFormatted = fromFormatter.format(date);
      const convertedFormatted = toFormatter.format(date);

      return {
        originalDateTime: originalFormatted,
        convertedDateTime: convertedFormatted,
        fromTimezone,
        toTimezone
      };
    } catch (error) {
      throw new Error(`Failed to convert timezone: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert text encoding
   */
  static convertEncoding(text: string, fromEncoding: string, toEncoding: string): string {
    try {
      // For basic encoding conversions
      switch (fromEncoding.toLowerCase()) {
        case 'utf8':
        case 'utf-8':
          switch (toEncoding.toLowerCase()) {
            case 'base64':
              return Buffer.from(text, 'utf8').toString('base64');
            case 'hex':
              return Buffer.from(text, 'utf8').toString('hex');
            case 'ascii':
              return Buffer.from(text, 'utf8').toString('ascii');
            default:
              return text;
          }
        
        case 'base64':
          switch (toEncoding.toLowerCase()) {
            case 'utf8':
            case 'utf-8':
              return Buffer.from(text, 'base64').toString('utf8');
            case 'hex':
              return Buffer.from(text, 'base64').toString('hex');
            case 'ascii':
              return Buffer.from(text, 'base64').toString('ascii');
            default:
              return text;
          }
        
        case 'hex':
          switch (toEncoding.toLowerCase()) {
            case 'utf8':
            case 'utf-8':
              return Buffer.from(text, 'hex').toString('utf8');
            case 'base64':
              return Buffer.from(text, 'hex').toString('base64');
            case 'ascii':
              return Buffer.from(text, 'hex').toString('ascii');
            default:
              return text;
          }
        
        default:
          throw new Error(`Unsupported encoding: ${fromEncoding}`);
      }
    } catch (error) {
      throw new Error(`Failed to convert encoding: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Helper function to convert RGB to HSL
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
   * Helper function to convert RGB to HSV
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
   * Get supported units for each type
   */
  static getSupportedUnits(): Record<string, string[]> {
    return {
      length: ['mm', 'cm', 'm', 'km', 'inch', 'ft', 'yard', 'mile'],
      weight: ['mg', 'g', 'kg', 'oz', 'lb', 'ton'],
      temperature: ['celsius', 'fahrenheit', 'kelvin'],
      volume: ['ml', 'l', 'gallon', 'quart', 'pint', 'cup', 'floz'],
      area: ['sqmm', 'sqcm', 'sqm', 'sqkm', 'sqin', 'sqft', 'sqyard', 'acre', 'hectare']
    };
  }

  /**
   * Get supported currencies
   */
  static getSupportedCurrencies(): string[] {
    return ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'CHF', 'SEK', 'NOK'];
  }

  /**
   * Get supported number bases
   */
  static getSupportedBases(): number[] {
    return [2, 8, 10, 16]; // Binary, Octal, Decimal, Hexadecimal
  }

  /**
   * Get supported color formats
   */
  static getSupportedColorFormats(): string[] {
    return ['hex', 'rgb', 'hsl', 'hsv'];
  }

  /**
   * Get supported encodings
   */
  static getSupportedEncodings(): string[] {
    return ['utf8', 'utf-8', 'base64', 'hex', 'ascii'];
  }

  /**
   * Get common timezones
   */
  static getCommonTimezones(): string[] {
    return [
      'UTC',
      'America/New_York',
      'America/Los_Angeles',
      'America/Chicago',
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Asia/Kolkata',
      'Australia/Sydney',
      'Pacific/Auckland'
    ];
  }
}

export default ConverterService;