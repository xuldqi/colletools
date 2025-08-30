import React, { useState } from 'react';
import {
  Ruler, DollarSign, Binary, Palette, Globe, Image, Music, FileText, Type,
  Upload, ArrowLeft, Copy, Download, Calculator
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';

interface ConverterTool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  popular?: boolean;
  inputType: 'text' | 'file' | 'dual';
  processingFunction: (input?: string | File, input2?: string) => Promise<{ result?: string; downloadUrl?: string; fileName?: string; }>;
}

const ConverterTools: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTool, setSelectedTool] = useState<ConverterTool | null>(null);
  const [textInput, setTextInput] = useState<string>('');
  const [textInput2, setTextInput2] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  // 单位转换器
  const processUnitConverter = async (input?: string | File) => {
    let text: string;
    if (input instanceof File) {
      text = await input.text();
    } else {
      text = input || '';
    }

    if (!text.trim()) {
      throw new Error(t('common.unitConverter.enterValueAndUnit'));
    }

    // 解析输入（例如："100 米" 或 "100m"）
    const match = text.match(/^([\d.]+)\s*(\w+)$/);
    if (!match) {
      throw new Error(t('common.unitConverter.enterCorrectFormat'));
    }

    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();

    // 长度单位转换
    const lengthUnits: { [key: string]: number } = {
      'm': 1, 'meter': 1,
      'km': 1000, 'kilometer': 1000,
      'cm': 0.01, 'centimeter': 0.01,
      'mm': 0.001, 'millimeter': 0.001,
      'ft': 0.3048, 'feet': 0.3048, 'foot': 0.3048,
      'in': 0.0254, 'inch': 0.0254
    };

    // 重量单位转换
    const weightUnits: { [key: string]: number } = {
      'kg': 1, 'kilogram': 1,
      'g': 0.001, 'gram': 0.001,
      'lb': 0.453592, 'pound': 0.453592,
      'oz': 0.0283495, 'ounce': 0.0283495
    };

    let conversions: string[] = [];
    let baseValue = 0;
    let unitType = '';

    if (lengthUnits[unit]) {
      baseValue = value * lengthUnits[unit]; // 转换为米
      unitType = t('common.unitConverter.length');
      conversions = [
        `${(baseValue / lengthUnits['m']).toFixed(6)} ${t('common.unitConverter.meters')}`,
        `${(baseValue / lengthUnits['km']).toFixed(6)} ${t('common.unitConverter.kilometers')}`,
        `${(baseValue / lengthUnits['cm']).toFixed(2)} ${t('common.unitConverter.centimeters')}`,
        `${(baseValue / lengthUnits['mm']).toFixed(2)} ${t('common.unitConverter.millimeters')}`,
        `${(baseValue / lengthUnits['ft']).toFixed(6)} ${t('common.unitConverter.feet')}`,
        `${(baseValue / lengthUnits['in']).toFixed(6)} ${t('common.unitConverter.inches')}`
      ];
    } else if (weightUnits[unit]) {
      baseValue = value * weightUnits[unit]; // 转换为千克
      unitType = t('common.unitConverter.weight');
      conversions = [
        `${(baseValue / weightUnits['kg']).toFixed(6)} ${t('common.unitConverter.kilograms')}`,
        `${(baseValue / weightUnits['g']).toFixed(2)} ${t('common.unitConverter.grams')}`,
        `${(baseValue / weightUnits['lb']).toFixed(6)} ${t('common.unitConverter.pounds')}`,
        `${(baseValue / weightUnits['oz']).toFixed(6)} ${t('common.unitConverter.ounces')}`
      ];
    } else {
      throw new Error(t('common.unitConverter.unsupportedUnit', { unit }));
    }

    const result = t('common.unitConverter.conversionResult', { 
      unitType, 
      value, 
      unit, 
      conversions: conversions.join('\n') 
    });

    toast.success(t('common.unitConverterComplete'));
    return { result };
  };

  // 货币转换器（模拟汇率）
  const processCurrencyConverter = async (input?: string | File) => {
    let text: string;
    if (input instanceof File) {
      text = await input.text();
    } else {
      text = input || '';
    }

    if (!text.trim()) {
      throw new Error(t('common.enterAmountAndCurrency'));
    }

    const match = text.match(/^([\d.]+)\s*(\w+)$/);
    if (!match) {
      throw new Error(t('common.enterCorrectCurrencyFormat'));
    }

    const amount = parseFloat(match[1]);
    const currency = match[2].toUpperCase();

    // 模拟汇率（以USD为基准）
    const exchangeRates: { [key: string]: { rate: number, name: string } } = {
      'USD': { rate: 1, name: t('common.currencies.usd') },
      'EUR': { rate: 0.85, name: t('common.currencies.eur') },
      'GBP': { rate: 0.73, name: t('common.currencies.gbp') },
      'JPY': { rate: 110, name: t('common.currencies.jpy') },
      'CNY': { rate: 6.45, name: t('common.currencies.cny') },
      'KRW': { rate: 1180, name: t('common.currencies.krw') },
      'CAD': { rate: 1.25, name: t('common.currencies.cad') },
      'AUD': { rate: 1.35, name: t('common.currencies.aud') }
    };

    if (!exchangeRates[currency]) {
      throw new Error(t('common.unsupportedCurrency', { currency, supported: 'USD, EUR, GBP, JPY, CNY, KRW, CAD, AUD' }));
    }

    // 转换为USD基准
    const usdAmount = amount / exchangeRates[currency].rate;

    const conversions = Object.entries(exchangeRates).map(([code, info]) => {
      const convertedAmount = usdAmount * info.rate;
      return `${convertedAmount.toFixed(2)} ${code} (${info.name})`;
    });

    const result = t('common.currencyConversionResult', { 
      amount, 
      currency, 
      currencyName: exchangeRates[currency].name,
      conversions: conversions.join('\n')
    });

    toast.success(t('common.currencyConversionComplete'));
    return { result };
  };

  // 进制转换器
  const processNumberBaseConverter = async (input?: string | File) => {
    let text: string;
    if (input instanceof File) {
      text = await input.text();
    } else {
      text = input || '';
    }

    if (!text.trim()) {
      throw new Error(t('common.enterNumberToConvert'));
    }

    const numbers = text.trim().split(/\s+/);
    const conversions: string[] = [];

    for (const numStr of numbers.slice(0, 10)) {
      let num: number;
      let inputBase = 10;
      let cleanNum = numStr;

      // 检测输入进制
      if (numStr.startsWith('0x') || numStr.startsWith('0X')) {
        inputBase = 16;
        cleanNum = numStr.slice(2);
        num = parseInt(cleanNum, 16);
      } else if (numStr.startsWith('0b') || numStr.startsWith('0B')) {
        inputBase = 2;
        cleanNum = numStr.slice(2);
        num = parseInt(cleanNum, 2);
      } else if (numStr.startsWith('0o') || numStr.startsWith('0O')) {
        inputBase = 8;
        cleanNum = numStr.slice(2);
        num = parseInt(cleanNum, 8);
      } else {
        num = parseInt(numStr, 10);
      }

      if (isNaN(num)) {
        conversions.push(t('common.cannotParse', { value: numStr }));
        continue;
      }

      conversions.push(`📊 ${numStr} (${inputBase}进制) = ${num} (10进制)：`);
      conversions.push(`  • 二进制 (Binary): ${num.toString(2)}`);
      conversions.push(`  • 八进制 (Octal): ${num.toString(8)}`);
      conversions.push(`  • 十进制 (Decimal): ${num.toString(10)}`);
      conversions.push(`  • 十六进制 (Hex): ${num.toString(16).toUpperCase()}`);
      conversions.push('');
    }

    const result = t('common.numberBaseConversionResult', { 
      conversions: conversions.join('\n')
    });

    toast.success(t('common.numberBaseConversionComplete'));
    return { result };
  };

  // 颜色格式转换器
  const processColorConverter = async (input?: string | File) => {
    let text: string;
    if (input instanceof File) {
      text = await input.text();
    } else {
      text = input || '#FF5733';
    }

    let color = text.trim() || '#FF5733';
    if (!color.startsWith('#') && !/^rgb\(/.test(color) && !/^hsl\(/.test(color)) {
      // 常见颜色名称转换
      const colorNames: { [key: string]: string } = {
        'red': '#FF0000', 'green': '#00FF00', 'blue': '#0000FF',
        'black': '#000000', 'white': '#FFFFFF', 'yellow': '#FFFF00',
        'purple': '#800080', 'orange': '#FFA500', 'pink': '#FFC0CB',
        'cyan': '#00FFFF', 'magenta': '#FF00FF', 'lime': '#00FF00'
      };
      color = colorNames[color.toLowerCase()] || '#FF5733';
    }

    let r: number, g: number, b: number;

    // 解析不同格式的颜色
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      }
    } else if (color.startsWith('rgb')) {
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        r = parseInt(match[1]);
        g = parseInt(match[2]);
        b = parseInt(match[3]);
      } else {
        r = 255; g = 87; b = 51; // 默认颜色
      }
    } else {
      r = 255; g = 87; b = 51; // 默认颜色
    }

    // RGB转HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const diff = max - min;

    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (diff !== 0) {
      s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
      switch (max) {
        case rNorm: h = (gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0); break;
        case gNorm: h = (bNorm - rNorm) / diff + 2; break;
        case bNorm: h = (rNorm - gNorm) / diff + 4; break;
      }
      h /= 6;
    }

    // RGB转CMYK
    const k = 1 - max;
    const c = k === 1 ? 0 : (1 - rNorm - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - gNorm - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - bNorm - k) / (1 - k);

    const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
    const hslColor = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    const rgbColor = `rgb(${r}, ${g}, ${b})`;
    const cmykColor = `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;

    const result = t('common.colorConversionResult', {
      input: text,
      hex: hexColor,
      rgb: rgbColor,
      hsl: hslColor,
      cmyk: cmykColor,
      r: r,
      rPercent: ((r/255)*100).toFixed(1),
      g: g,
      gPercent: ((g/255)*100).toFixed(1),
      b: b,
      bPercent: ((b/255)*100).toFixed(1),
      hue: Math.round(h * 360),
      saturation: Math.round(s * 100),
      lightness: Math.round(l * 100)
    });

    toast.success(t('common.colorConversionComplete'));
    return { result };
  };

  // 时区转换器
  const processTimezoneConverter = async (input?: string | File) => {
    let text: string;
    if (input instanceof File) {
      text = await input.text();
    } else {
      text = input || '';
    }

    const now = new Date();
    let targetDate = now;

    if (text.trim()) {
      // 尝试解析输入的时间
      const parsed = new Date(text.trim());
      if (!isNaN(parsed.getTime())) {
        targetDate = parsed;
      }
    }

    // 主要时区转换
    const timezones = [
      { name: 'UTC', offset: 0, code: 'UTC' },
          { name: t('common.timezones.beijing'), offset: 8, code: 'CST' },
    { name: t('common.timezones.tokyo'), offset: 9, code: 'JST' },
    { name: t('common.timezones.newyork'), offset: -5, code: 'EST' }, // Winter time
    { name: t('common.timezones.losangeles'), offset: -8, code: 'PST' }, // Winter time
    { name: t('common.timezones.london'), offset: 0, code: 'GMT' }, // Winter time
    { name: t('common.timezones.paris'), offset: 1, code: 'CET' }, // Winter time
    { name: t('common.timezones.moscow'), offset: 3, code: 'MSK' },
    { name: t('common.timezones.sydney'), offset: 11, code: 'AEDT' }, // Summer time
    { name: t('common.timezones.india'), offset: 5.5, code: 'IST' }
    ];

    const conversions = timezones.map(tz => {
      const offsetHours = Math.floor(Math.abs(tz.offset));
      const offsetMinutes = Math.round((Math.abs(tz.offset) - offsetHours) * 60);
      const offsetMs = tz.offset * 60 * 60 * 1000;
      const convertedTime = new Date(targetDate.getTime() + offsetMs - (targetDate.getTimezoneOffset() * 60 * 1000));
      
      const timeStr = convertedTime.toISOString().slice(0, 19).replace('T', ' ');
      const offsetStr = tz.offset >= 0 ? `+${tz.offset}` : `${tz.offset}`;
      
      return `${tz.name} (${tz.code}): ${timeStr} (UTC${offsetStr})`;
    });

    const result = t('common.timezoneConversionResult', {
      inputTime: targetDate.toISOString().slice(0, 19).replace('T', ' '),
      conversions: conversions.join('\n')
    });

    toast.success(t('common.timezoneConversionComplete'));
    return { result };
  };

  // 图片格式转换器（使用Canvas API）
  const processImageConverter = async (input?: string | File) => {
    if (!(input instanceof File)) {
      throw new Error(t('common.pleaseSelectImageFile'));
    }

    if (!input.type.startsWith('image/')) {
      throw new Error(t('common.errors.pleaseSelectValidImageFile'));
    }

    toast.info('正在处理图片转换...');

    return new Promise<{ result?: string; downloadUrl?: string; fileName?: string }>((resolve, reject) => {
      const img = document.createElement('img') as HTMLImageElement;
      img.onload = () => {
        // 创建Canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法创建Canvas上下文'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // 转换为不同格式
        const formats = ['image/png', 'image/jpeg', 'image/webp'];
        const conversions: string[] = [];
        let downloadUrl = '';
        let fileName = '';

        formats.forEach(format => {
          try {
            const dataUrl = canvas.toDataURL(format, 0.9);
            const size = Math.round((dataUrl.length * 3/4) / 1024); // 估算KB大小
            const ext = format.split('/')[1];
            conversions.push(`• ${ext.toUpperCase()}: ${size} KB`);
            
            if (format === 'image/png') {
              // 默认提供PNG下载
              downloadUrl = dataUrl;
              fileName = input.name.replace(/\.[^.]+$/, '.png');
            }
          } catch (error) {
            conversions.push(`• ${format.split('/')[1].toUpperCase()}: 不支持`);
          }
        });

        const result = t('common.imageConversionResult', {
          fileName: input.name,
          width: img.width,
          height: img.height,
          size: (input.size / 1024).toFixed(2),
          conversions: conversions.join('\n')
        });

        toast.success(t('common.imageConversionComplete'));
        resolve({ result, downloadUrl, fileName });
      };

      img.onerror = () => {
        reject(new Error('图片加载失败'));
      };

      img.src = URL.createObjectURL(input);
    });
  };

  // 音频格式转换器（模拟FFmpeg.js）
  const processAudioConverter = async (input?: string | File) => {
    if (!(input instanceof File)) {
      throw new Error(t('common.errors.pleaseSelectAudioFile'));
    }

    if (!input.type.startsWith('audio/')) {
      throw new Error(t('common.errors.pleaseSelectValidAudioFile'));
    }

    toast.info('正在分析音频文件...');
    
    // 模拟音频处理（实际需要FFmpeg.js）
    await new Promise(resolve => setTimeout(resolve, 2000));

    const formats = {
      'mp3': { quality: '高', size: '中等', compatibility: '优秀' },
      'wav': { quality: '无损', size: '大', compatibility: '良好' },
      'aac': { quality: '高', size: '小', compatibility: '优秀' },
      'ogg': { quality: '高', size: '小', compatibility: '一般' },
      'flac': { quality: '无损', size: '大', compatibility: '一般' }
    };

    const conversions = Object.entries(formats).map(([format, info]) => 
      `• ${format.toUpperCase()}: 质量${info.quality}, 大小${info.size}, 兼容性${info.compatibility}`
    );

    // 创建模拟的转换文件（这里创建一个示例文件）
    const blob = new Blob(['Audio conversion demo'], { type: 'text/plain' });
    const downloadUrl = URL.createObjectURL(blob);
    const fileName = input.name.replace(/\.[^.]+$/, '_converted.txt');

    const result = t('common.audioConversionResult', {
      fileName: input.name,
      size: (input.size / 1024 / 1024).toFixed(2),
      conversions: conversions.join('\n')
    });

    toast.success(t('common.audioAnalysisComplete'));
    return { result, downloadUrl, fileName };
  };

  // 文档格式转换器（模拟各种文档库）
  const processDocumentConverter = async (input?: string | File) => {
    if (!(input instanceof File)) {
      throw new Error('请选择文档文件');
    }

    const supportedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'text/csv',
      'application/json',
      'text/xml',
      'text/plain'
    ];

    if (!supportedTypes.includes(input.type) && !input.name.match(/\.(pdf|docx?|xlsx?|csv|json|xml|txt)$/i)) {
      throw new Error(t('common.errors.unsupportedDocumentFormat'));
    }

    toast.info('正在分析文档格式...');
    
    // 模拟文档处理
    await new Promise(resolve => setTimeout(resolve, 1500));

    const conversions = {
      'PDF': { library: 'PDF-lib', features: '合并、拆分、添加水印' },
      'Word': { library: 'Mammoth.js', features: '转HTML、提取文本' },
      'Excel': { library: 'SheetJS', features: 'CSV转换、数据处理' },
      'JSON': { library: '原生JSON', features: '格式化、验证' },
      'XML': { library: 'DOMParser', features: '解析、转JSON' },
      'CSV': { library: 'Papa Parse', features: '解析、转JSON' }
    };

    const conversionList = Object.entries(conversions).map(([format, info]) =>
      `• ${format}: 使用 ${info.library} - ${info.features}`
    );

    // 创建示例输出
    const content = `文档转换演示\n原文件: ${input.name}\n大小: ${(input.size / 1024).toFixed(2)} KB\n\n转换完成时间: ${new Date().toLocaleString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const downloadUrl = URL.createObjectURL(blob);
    const fileName = input.name.replace(/\.[^.]+$/, '_converted.txt');

    const result = t('common.documentAnalysisResult', {
      fileName: input.name,
      size: (input.size / 1024).toFixed(2),
      type: input.type || '未知',
      conversions: conversionList.join('\n')
    });

    toast.success(t('common.documentAnalysisComplete'));
    return { result, downloadUrl, fileName };
  };

  // 编码转换器
  const processEncodingConverter = async (input?: string | File) => {
    let text: string;
    if (input instanceof File) {
      text = await input.text();
    } else {
      text = input || '';
    }

    if (!text.trim()) {
      throw new Error(t('common.enterTextForEncoding'));
    }

    // URL编码/解码
    const urlEncoded = encodeURIComponent(text);
    const urlDecoded = decodeURIComponent(urlEncoded);

    // Base64编码/解码
    const base64Encoded = btoa(unescape(encodeURIComponent(text)));
    const base64Decoded = decodeURIComponent(escape(atob(base64Encoded)));

    // HTML实体编码
    const htmlEncoded = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    // Unicode编码
    const unicodeEncoded = text.split('').map(char => {
      const code = char.charCodeAt(0);
      return code > 127 ? `\\u${code.toString(16).padStart(4, '0')}` : char;
    }).join('');

    // 十六进制编码
    const hexEncoded = text.split('').map(char => 
      char.charCodeAt(0).toString(16).padStart(2, '0')
    ).join(' ');

    const result = t('common.encodingConversionResult', {
      originalText: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      urlEncoded: urlEncoded.substring(0, 200) + (urlEncoded.length > 200 ? '...' : ''),
      base64Encoded: base64Encoded.substring(0, 200) + (base64Encoded.length > 200 ? '...' : ''),
      htmlEncoded: htmlEncoded.substring(0, 200) + (htmlEncoded.length > 200 ? '...' : ''),
      originalLength: text.length,
      urlLength: urlEncoded.length,
      base64Length: base64Encoded.length,
      urlDecoded: urlDecoded === text ? t('common.correct') : t('common.error'),
      base64Decoded: base64Decoded === text ? t('common.correct') : t('common.error')
    });

    toast.success(t('common.encodingConversionComplete'));
    return { result };
  };

  const tools: ConverterTool[] = [
    {
      id: 'unit-converter',
      name: t('common.unitConverter'),
      description: t('common.unitConverterDesc'),
      icon: Ruler,
      popular: true,
      inputType: 'text',
      processingFunction: processUnitConverter
    },
    {
      id: 'currency-converter',
      name: t('common.currencyConverter'),
      description: t('common.currencyConverterDesc'),
      icon: DollarSign,
      popular: true,
      inputType: 'text',
      processingFunction: processCurrencyConverter
    },
    {
      id: 'number-base-converter',
      name: t('common.numberBaseConverter'),
      description: t('common.numberBaseConverterDesc'),
      icon: Binary,
      popular: true,
      inputType: 'text',
      processingFunction: processNumberBaseConverter
    },
    {
      id: 'color-converter',
      name: '颜色格式转换',
      description: 'RGB、HEX、HSL、CMYK等颜色格式转换',
      icon: Palette,
      inputType: 'text',
      processingFunction: processColorConverter
    },
    {
      id: 'timezone-converter',
      name: t('common.timezoneConverter'),
      description: t('common.timezoneConverterDesc'),
      icon: Globe,
      inputType: 'text',
      processingFunction: processTimezoneConverter
    },
    {
      id: 'image-format-converter',
      name: t('common.imageConverter'),
      description: t('common.imageConverterDesc'),
      icon: Image,
      inputType: 'file',
      processingFunction: processImageConverter
    },
    {
      id: 'audio-format-converter',
      name: t('common.audioConverter'),
      description: t('common.audioConverterDesc'),
      icon: Music,
      inputType: 'file',
      processingFunction: processAudioConverter
    },
    {
      id: 'document-format-converter',
      name: t('common.documentConverter'),
      description: t('common.documentConverterDesc'),
      icon: FileText,
      inputType: 'file',
      processingFunction: processDocumentConverter
    },
    {
      id: 'encoding-converter',
      name: t('common.encodingConverter'),
      description: t('common.encodingConverterDesc'),
      icon: Type,
      inputType: 'text',
      processingFunction: processEncodingConverter
    }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult('');
      setDownloadUrl('');
    }
  };

  const handleProcess = async () => {
    if (!selectedTool) {
      toast.error(t('common.selectTool'));
      return;
    }

    if (selectedTool.inputType === 'text' && !textInput.trim()) {
      toast.error(t('common.enterText'));
      return;
    }

    if (selectedTool.inputType === 'file' && !file) {
      toast.error(t('common.selectFile'));
      return;
    }

    setIsProcessing(true);

    try {
      let input: string | File | undefined;
      if (selectedTool.inputType === 'text') {
        input = textInput;
      } else if (selectedTool.inputType === 'file') {
        input = file!;
      }

      const processResult = await selectedTool.processingFunction(input, textInput2);
      
      if (processResult.result) {
        setResult(processResult.result);
      }
      if (processResult.downloadUrl) {
        setDownloadUrl(processResult.downloadUrl);
        setFileName(processResult.fileName || 'converted_file');
      }
    } catch (error) {
      console.error(t('common.processingError'), error);
      toast.error((error as Error).message || t('common.processingFailed'));
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.click();
    }
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast.success('结果已复制到剪贴板');
    }
  };

  const resetTool = () => {
    setSelectedTool(null);
    setTextInput('');
    setTextInput2('');
    setFile(null);
    setResult('');
    setDownloadUrl('');
    setFileName('');
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
  };

  const selectTool = (tool: ConverterTool) => {
    setSelectedTool(tool);
    setTextInput('');
    setTextInput2('');
    setFile(null);
    setResult('');
    setDownloadUrl('');
    setFileName('');
  };

  if (selectedTool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                  <selectedTool.icon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTool.name}
                  </h2>
                  <p className="text-gray-600">{selectedTool.description}</p>
                </div>
              </div>
              <button
                onClick={resetTool}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回</span>
              </button>
            </div>

            <div className="space-y-6">
              {selectedTool.inputType === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    输入文本
                  </label>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                          placeholder={
                        selectedTool.id === 'unit-converter' ? t('common.unitConverter.enterValueAndUnit') :
                        selectedTool.id === 'currency-converter' ? t('common.enterAmountAndCurrency') :
                        selectedTool.id === 'number-base-converter' ? t('common.enterNumber') :
                        selectedTool.id === 'color-converter' ? t('common.enterColorValue') :
                        selectedTool.id === 'timezone-converter' ? t('common.enterDateTime') :
                        t('common.enterTextToProcess')
                      }
                  />
                </div>
              )}

              {selectedTool.inputType === 'file' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选择文件
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <input
                      type="file"
                      accept={
                        selectedTool.id === 'image-format-converter' ? 'image/*' :
                        selectedTool.id === 'audio-format-converter' ? 'audio/*' :
                        selectedTool.id === 'document-format-converter' ? '.pdf,.docx,.doc,.xlsx,.xls,.csv,.json,.xml,.txt' :
                        '*'
                      }
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-green-600 hover:text-green-700 font-medium"
                    >
                      点击选择文件
                    </label>
                    <p className="text-gray-500 text-sm mt-2">
                      {selectedTool.id === 'image-format-converter' && '支持格式: JPG, PNG, GIF, WebP'}
                      {selectedTool.id === 'audio-format-converter' && '支持格式: MP3, WAV, AAC, OGG, FLAC'}
                      {selectedTool.id === 'document-format-converter' && '支持格式: PDF, Word, Excel, CSV, JSON, XML'}
                    </p>
                    {file && (
                      <p className="text-green-600 text-sm mt-2">
                        已选择: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={handleProcess}
                  disabled={isProcessing || (selectedTool.inputType === 'text' && !textInput.trim()) || (selectedTool.inputType === 'file' && !file)}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? t('common.processing') : t('common.startConverting')}
                </button>
                {downloadUrl && (
                  <button
                    onClick={downloadFile}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>下载文件</span>
                  </button>
                )}
              </div>

              {result && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">转换结果</h3>
                    <button
                      onClick={copyResult}
                      className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>复制</span>
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border max-h-80 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800">
                      {result}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead seoKey="converterTools" />
      <StructuredData type="SoftwareApplication" />
    <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">转换工具</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              全面的格式转换工具集合，支持单位、货币、进制、颜色等各种数据格式转换
            </p>
          </div>

          {/* Popular Tools Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🔥 热门工具</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.filter(tool => tool.popular).map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={() => selectTool(tool)}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer group"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <IconComponent className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                          {tool.name}
                        </h3>
                        <span className="text-sm text-green-600">热门</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                    <button className="w-full bg-green-600 text-white hover:bg-green-700 py-2 rounded-md font-medium transition-colors">
                      使用工具
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* All Tools Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">所有转换工具</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={() => selectTool(tool)}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <IconComponent className="w-6 h-6 text-green-600 group-hover:text-green-700 transition-colors" />
                      {tool.popular && (
                        <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          热门
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                      {tool.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {tool.description}
                    </p>
                    
                    <div className="flex items-center text-green-600 text-sm font-medium">
                      <span>使用工具</span>
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的转换工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">精确转换</h3>
                <p className="text-gray-600 text-sm">
                  高精度的数学计算，确保转换结果准确可靠
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">多格式支持</h3>
                <p className="text-gray-600 text-sm">
                  支持单位、颜色、编码等多种格式相互转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">实时处理</h3>
                <p className="text-gray-600 text-sm">
                  即时转换，本地处理，保护数据隐私
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Binary className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">专业算法</h3>
                <p className="text-gray-600 text-sm">
                  基于标准算法实现，支持复杂的格式转换
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConverterTools;
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的转换工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">精确转换</h3>
                <p className="text-gray-600 text-sm">
                  高精度的数学计算，确保转换结果准确可靠
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">多格式支持</h3>
                <p className="text-gray-600 text-sm">
                  支持单位、颜色、编码等多种格式相互转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">实时处理</h3>
                <p className="text-gray-600 text-sm">
                  即时转换，本地处理，保护数据隐私
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Binary className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">专业算法</h3>
                <p className="text-gray-600 text-sm">
                  基于标准算法实现，支持复杂的格式转换
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConverterTools;
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的转换工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">精确转换</h3>
                <p className="text-gray-600 text-sm">
                  高精度的数学计算，确保转换结果准确可靠
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">多格式支持</h3>
                <p className="text-gray-600 text-sm">
                  支持单位、颜色、编码等多种格式相互转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">实时处理</h3>
                <p className="text-gray-600 text-sm">
                  即时转换，本地处理，保护数据隐私
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Binary className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">专业算法</h3>
                <p className="text-gray-600 text-sm">
                  基于标准算法实现，支持复杂的格式转换
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConverterTools;
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的转换工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">精确转换</h3>
                <p className="text-gray-600 text-sm">
                  高精度的数学计算，确保转换结果准确可靠
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">多格式支持</h3>
                <p className="text-gray-600 text-sm">
                  支持单位、颜色、编码等多种格式相互转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">实时处理</h3>
                <p className="text-gray-600 text-sm">
                  即时转换，本地处理，保护数据隐私
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Binary className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">专业算法</h3>
                <p className="text-gray-600 text-sm">
                  基于标准算法实现，支持复杂的格式转换
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConverterTools;
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的转换工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">精确转换</h3>
                <p className="text-gray-600 text-sm">
                  高精度的数学计算，确保转换结果准确可靠
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">多格式支持</h3>
                <p className="text-gray-600 text-sm">
                  支持单位、颜色、编码等多种格式相互转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">实时处理</h3>
                <p className="text-gray-600 text-sm">
                  即时转换，本地处理，保护数据隐私
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Binary className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">专业算法</h3>
                <p className="text-gray-600 text-sm">
                  基于标准算法实现，支持复杂的格式转换
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConverterTools;
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的转换工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">精确转换</h3>
                <p className="text-gray-600 text-sm">
                  高精度的数学计算，确保转换结果准确可靠
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">多格式支持</h3>
                <p className="text-gray-600 text-sm">
                  支持单位、颜色、编码等多种格式相互转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">实时处理</h3>
                <p className="text-gray-600 text-sm">
                  即时转换，本地处理，保护数据隐私
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Binary className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">专业算法</h3>
                <p className="text-gray-600 text-sm">
                  基于标准算法实现，支持复杂的格式转换
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConverterTools;
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的转换工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">精确转换</h3>
                <p className="text-gray-600 text-sm">
                  高精度的数学计算，确保转换结果准确可靠
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">多格式支持</h3>
                <p className="text-gray-600 text-sm">
                  支持单位、颜色、编码等多种格式相互转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">实时处理</h3>
                <p className="text-gray-600 text-sm">
                  即时转换，本地处理，保护数据隐私
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Binary className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">专业算法</h3>
                <p className="text-gray-600 text-sm">
                  基于标准算法实现，支持复杂的格式转换
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConverterTools;
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的转换工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">精确转换</h3>
                <p className="text-gray-600 text-sm">
                  高精度的数学计算，确保转换结果准确可靠
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">多格式支持</h3>
                <p className="text-gray-600 text-sm">
                  支持单位、颜色、编码等多种格式相互转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">实时处理</h3>
                <p className="text-gray-600 text-sm">
                  即时转换，本地处理，保护数据隐私
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Binary className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">专业算法</h3>
                <p className="text-gray-600 text-sm">
                  基于标准算法实现，支持复杂的格式转换
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConverterTools;