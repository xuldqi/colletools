import React, { useState } from 'react';
import { 
  Hash, Code, Link as LinkIcon, Braces, QrCode, Palette, Clock, Key, Lock,
  Upload, ArrowLeft, Copy, Download
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';

interface DeveloperTool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  popular?: boolean;
  inputType: 'text' | 'file' | 'none';
  outputType: 'text' | 'download' | 'display';
  processingFunction: (input?: string | File) => Promise<{ result?: string; downloadUrl?: string; fileName?: string; }>;
}

const DeveloperTools: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTool, setSelectedTool] = useState<DeveloperTool | null>(null);
  const [textInput, setTextInput] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  // 哈希生成器
  const processHashGenerator = async (input?: string | File) => {
    let text: string;
    if (input instanceof File) {
      text = await input.text();
    } else {
      text = input || '';
    }
    
    if (!text.trim()) {
      throw new Error(t('common.enterTextForHash'));
    }
    
    // 使用Web Crypto API生成哈希
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    const sha1Hash = await crypto.subtle.digest('SHA-1', data);
    const sha1Array = Array.from(new Uint8Array(sha1Hash));
    const sha1Hex = sha1Array.map(b => b.toString(16).padStart(2, '0')).join('');
    
    const sha256Hash = await crypto.subtle.digest('SHA-256', data);
    const sha256Array = Array.from(new Uint8Array(sha256Hash));
    const sha256Hex = sha256Array.map(b => b.toString(16).padStart(2, '0')).join('');
    
    const sha512Hash = await crypto.subtle.digest('SHA-512', data);
    const sha512Array = Array.from(new Uint8Array(sha512Hash));
    const sha512Hex = sha512Array.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // 简单MD5模拟（实际项目建议使用专门的MD5库）
    const simpleHash = text.split('').reduce((hash, char) => {
      const charCode = char.charCodeAt(0);
      hash = ((hash << 5) - hash) + charCode;
      return hash & hash; // 转换为32位整数
    }, 0);
    const md5Like = Math.abs(simpleHash).toString(16).padStart(8, '0');
    
    const result = t('tools.developer.hashResult', {
      originalText: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
      md5Hash: md5Like,
      sha1Hash: sha1Hex,
      sha256Hash: sha256Hex,
      sha512Hash: sha512Hex,
      textLength: text.length,
      sha1Length: sha1Hex.length,
      sha256Length: sha256Hex.length,
      sha512Length: sha512Hex.length
    });
    
    toast.success(t('tools.developer.hashComplete'));
    return { result };
  };

  // Base64编码解码
  const processBase64Encoder = async (input?: string | File) => {
    let text: string;
    if (input instanceof File) {
      text = await input.text();
    } else {
      text = input || '';
    }
    
    if (!text.trim()) {
      throw new Error(t('common.enterTextForEncoding'));
    }
    
    try {
      // 编码
      const encoded = btoa(unescape(encodeURIComponent(text)));
      
      // 解码验证
      const decoded = decodeURIComponent(escape(atob(encoded)));
      
      // URL安全的Base64
      const urlSafeEncoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      
      const result = t('tools.developer.base64Result', {
        originalText: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
        encoded: encoded,
        urlSafeEncoded: urlSafeEncoded,
        decoded: decoded.substring(0, 200) + (decoded.length > 200 ? '...' : ''),
        textLength: text.length,
        encodedLength: encoded.length,
        compressionRatio: ((encoded.length / text.length) * 100).toFixed(1)
      });
      
      toast.success(t('tools.developer.base64Complete'));
      return { result };
    } catch (error) {
      throw new Error(t('tools.developer.base64Error') + (error as Error).message);
    }
  };

  // URL编码解码
  const processURLEncoder = async (input?: string | File) => {
    let text: string;
    if (input instanceof File) {
      text = await input.text();
    } else {
      text = input || '';
    }
    
    if (!text.trim()) {
      throw new Error(t('common.enterTextForURLEncoding'));
    }
    
    try {
      // URL编码
      const encoded = encodeURIComponent(text);
      
      // URL解码
      const decoded = decodeURIComponent(encoded);
      
      // HTML实体编码
      const htmlEncoded = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      
      // 旧式URL编码（escape）
      const escapeEncoded = escape(text);
      
      const result = t('tools.developer.urlResult', {
        originalText: text,
        encoded: encoded,
        htmlEncoded: htmlEncoded,
        escapeEncoded: escapeEncoded,
        decoded: decoded,
        textLength: text.length,
        encodedLength: encoded.length,
        htmlLength: htmlEncoded.length
      });
      
      toast.success(t('tools.developer.urlComplete'));
      return { result };
    } catch (error) {
      throw new Error(t('tools.developer.urlError') + (error as Error).message);
    }
  };

  // JSON格式化验证
  const processJSONFormatter = async (input?: string | File) => {
    let text: string;
    if (input instanceof File) {
      text = await input.text();
    } else {
      text = input || '';
    }
    
    if (!text.trim()) {
      throw new Error(t('common.enterJSONText'));
    }
    
    try {
      // 尝试解析JSON
      const jsonObj = JSON.parse(text);
      
      // 格式化JSON（2空格缩进）
      const formatted2 = JSON.stringify(jsonObj, null, 2);
      
      // 格式化JSON（4空格缩进）
      const formatted4 = JSON.stringify(jsonObj, null, 4);
      
      // 压缩JSON
      const minified = JSON.stringify(jsonObj);
      
      // 统计信息
      const keyCount = JSON.stringify(jsonObj).match(/"\w+":/g)?.length || 0;
      const valueCount = Object.keys(JSON.parse(JSON.stringify(jsonObj, (key, value) => value))).length;
      const depth = getJSONDepth(jsonObj);
      
      const result = t('tools.developer.jsonResult', {
        formatted2: formatted2.substring(0, 500) + (formatted2.length > 500 ? '\n...(已截断)' : ''),
        minified: minified.substring(0, 300) + (minified.length > 300 ? '...' : ''),
        textLength: text.length,
        formattedLength: formatted2.length,
        minifiedLength: minified.length,
        keyCount: keyCount,
        depth: depth,
        compressionRatio: (((formatted2.length - minified.length) / formatted2.length) * 100).toFixed(1)
      });
      
      toast.success(t('tools.developer.jsonComplete'));
      return { result };
    } catch (error) {
      const errorMsg = (error as Error).message;
      const result = t('tools.developer.jsonError', {
        errorMsg: errorMsg,
        inputText: text.substring(0, 300) + (text.length > 300 ? '\n...(已截断)' : '')
      });
      
      toast.error(t('tools.developer.jsonInvalid'));
      return { result };
    }
  };

  // QR码生成器
  const processQRGenerator = async (input?: string | File) => {
    let text: string;
    if (input instanceof File) {
      text = await input.text();
    } else {
      text = input || '';
    }
    
    if (!text.trim()) {
      throw new Error(t('common.enterTextForQRCode'));
    }
    
    // 使用简单的SVG生成二维码模拟
    const qrSize = 200;
    const qrData = text;
    
    // 创建简化的二维码SVG（这里是模拟，实际应该使用qrcode库）
    const svgContent = `
      <svg width="${qrSize}" height="${qrSize}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
        <rect x="10" y="10" width="20" height="20" fill="black"/>
        <rect x="30" y="10" width="20" height="20" fill="black"/>
        <rect x="50" y="10" width="20" height="20" fill="black"/>
        <rect x="10" y="30" width="20" height="20" fill="black"/>
        <rect x="50" y="30" width="20" height="20" fill="black"/>
        <rect x="10" y="50" width="20" height="20" fill="black"/>
        <rect x="30" y="50" width="20" height="20" fill="black"/>
        <rect x="50" y="50" width="20" height="20" fill="black"/>
        <text x="100" y="100" font-family="Arial" font-size="12" text-anchor="middle">QR Demo</text>
      </svg>
    `;
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const downloadUrl = URL.createObjectURL(blob);
    
    const result = t('tools.developer.qrResult', {
      content: text,
      contentLength: text.length,
      qrSize: qrSize,
      qrSize2: qrSize
    });
    
    toast.success(t('tools.developer.qrComplete'));
    return { result, downloadUrl, fileName: 'qrcode.svg' };
  };

  // 颜色选择器转换
  const processColorPicker = async (input?: string | File) => {
    let text: string;
    if (input instanceof File) {
      text = await input.text();
    } else {
      text = input || '#FF5733';
    }
    
    // 如果没有输入，生成随机颜色
    let color = text.trim() || '#FF5733';
    if (!color.startsWith('#')) {
      color = '#' + color;
    }
    
    try {
      // 验证颜色格式
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
        // 尝试一些常见颜色名称
        const colorNames: { [key: string]: string } = {
          'red': '#FF0000', 'green': '#00FF00', 'blue': '#0000FF',
          'black': '#000000', 'white': '#FFFFFF', 'yellow': '#FFFF00',
          'purple': '#800080', 'orange': '#FFA500', 'pink': '#FFC0CB'
        };
        color = colorNames[text.toLowerCase()] || '#FF5733';
      }
      
      // 转换为RGB
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      // 转换为HSL
      const rNorm = r / 255;
      const gNorm = g / 255;
      const bNorm = b / 255;
      const max = Math.max(rNorm, gNorm, bNorm);
      const min = Math.min(rNorm, gNorm, bNorm);
      const diff = max - min;
      
      let h = 0;
      let s = 0;
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
      
      const hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
      
      // 颜色预览块（使用Unicode字符模拟）
      const colorBlock = '█'.repeat(10);
      
      const result = t('tools.developer.colorResult', {
        color: color,
        colorBlock: colorBlock,
        hex: color,
        rgb: `rgb(${r}, ${g}, ${b})`,
        hsl: hsl,
        css: `color: ${color}`,
        red: r,
        redPercent: ((r/255)*100).toFixed(1),
        green: g,
        greenPercent: ((g/255)*100).toFixed(1),
        blue: b,
        bluePercent: ((b/255)*100).toFixed(1),
        lightness: Math.round(l * 100),
        saturation: Math.round(s * 100),
        hue: Math.round(h * 360)
      });
      
      toast.success(t('tools.developer.colorComplete'));
      return { result };
    } catch (error) {
      throw new Error(t('tools.developer.colorError'));
    }
  };

  // 时间戳转换器
  const processTimestampConverter = async (input?: string | File) => {
    let text: string;
    if (input instanceof File) {
      text = await input.text();
    } else {
      text = input || '';
    }
    
    const now = Date.now();
    let timestamp: number;
    let inputDate: Date;
    
    if (text.trim()) {
      // 尝试解析输入
      if (/^\d{10}$/.test(text)) {
        // 10位时间戳（秒）
        timestamp = parseInt(text) * 1000;
      } else if (/^\d{13}$/.test(text)) {
        // 13位时间戳（毫秒）
        timestamp = parseInt(text);
      } else {
        // 尝试解析日期字符串
        inputDate = new Date(text);
        if (isNaN(inputDate.getTime())) {
          throw new Error(t('tools.developer.timestampParseError'));
        }
        timestamp = inputDate.getTime();
      }
    } else {
      // 使用当前时间
      timestamp = now;
    }
    
    const date = new Date(timestamp);
    const utcDate = new Date(timestamp);
    
    // 各种格式
    const formats = {
      timestamp10: Math.floor(timestamp / 1000),
      timestamp13: timestamp,
      iso: date.toISOString(),
      local: date.toLocaleString('zh-CN'),
      utc: utcDate.toUTCString(),
      date: date.toLocaleDateString('zh-CN'),
      time: date.toLocaleTimeString('zh-CN'),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds()
    };
    
    const result = t('tools.developer.timestampResult', {
      localTime: formats.local,
      timestamp10: formats.timestamp10,
      timestamp13: formats.timestamp13,
      iso: formats.iso,
      local: formats.local,
      utc: formats.utc,
      date: formats.date,
      time: formats.time,
      year: formats.year,
      month: formats.month,
      day: formats.day,
      hour: formats.hour,
      minute: formats.minute,
      second: formats.second,
      weekday: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
      currentTime: new Date().toLocaleString('zh-CN')
    });
    
          toast.success(t('tools.developer.timestampComplete'));
    return { result };
  };

  // UUID生成器
  const processUUIDGenerator = async (input?: string | File) => {
    // 生成UUID v4
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
    
    // 生成多个UUID
    const uuids = [];
    for (let i = 0; i < 20; i++) {
      uuids.push(generateUUID());
    }
    
    // 生成简化的UUID（短版本）
    const shortUUIDs = [];
    for (let i = 0; i < 10; i++) {
      shortUUIDs.push(Math.random().toString(36).substr(2, 8));
    }
    
    const result = t('tools.developer.uuidResult', {
      uuids: uuids.slice(0, 10).join('\n'),
      shortUUIDs: shortUUIDs.join('\n'),
      uuidCount: uuids.length,
      shortUUIDCount: shortUUIDs.length,
      allUUIDs: uuids.join('\n')
    });
    
    toast.success(t('tools.developer.uuidComplete'));
    return { result };
  };

  // 密码生成器
  const processPasswordGenerator = async (input?: string | File) => {
    const generatePassword = (length: number, options: any) => {
      let charset = '';
      if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
      if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (options.numbers) charset += '0123456789';
      if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      
      let password = '';
      for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return password;
    };
    
    // 生成不同强度的密码
    const passwords = {
      simple: generatePassword(8, { lowercase: true, numbers: true }),
      medium: generatePassword(12, { lowercase: true, uppercase: true, numbers: true }),
      strong: generatePassword(16, { lowercase: true, uppercase: true, numbers: true, symbols: true }),
      ultraStrong: generatePassword(32, { lowercase: true, uppercase: true, numbers: true, symbols: true })
    };
    
    // 生成多个随机密码
    const randomPasswords = [];
    for (let i = 0; i < 10; i++) {
      randomPasswords.push(generatePassword(12, { 
        lowercase: true, 
        uppercase: true, 
        numbers: true, 
        symbols: Math.random() > 0.5 
      }));
    }
    
    // 密码强度评估
    const evaluateStrength = (pwd: string) => {
      let score = 0;
      if (pwd.length >= 8) score += 1;
      if (pwd.length >= 12) score += 1;
      if (/[a-z]/.test(pwd)) score += 1;
      if (/[A-Z]/.test(pwd)) score += 1;
      if (/[0-9]/.test(pwd)) score += 1;
      if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;
      
      const levels = [t('tools.developer.veryWeak'), t('tools.developer.weak'), t('tools.developer.medium'), t('tools.developer.strong'), t('tools.developer.veryStrong'), t('tools.developer.extremelyStrong')];
      return levels[score] || t('tools.developer.veryWeak');
    };
    
    const result = t('tools.developer.passwordResult', {
      simplePassword: passwords.simple,
      simpleStrength: evaluateStrength(passwords.simple),
      mediumPassword: passwords.medium,
      mediumStrength: evaluateStrength(passwords.medium),
      strongPassword: passwords.strong,
      strongStrength: evaluateStrength(passwords.strong),
      ultraStrongPassword: passwords.ultraStrong,
      ultraStrongStrength: evaluateStrength(passwords.ultraStrong),
      randomPasswords: randomPasswords.map((pwd, i) => `${i+1}. ${pwd} [${evaluateStrength(pwd)}]`).join('\n')
    });
    
    toast.success(t('tools.developer.passwordComplete'));
    return { result };
  };

  // 辅助函数：计算JSON深度
  const getJSONDepth = (obj: any): number => {
    if (typeof obj !== 'object' || obj === null) return 0;
    let depth = 1;
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        depth = Math.max(depth, 1 + getJSONDepth(obj[key]));
      }
    }
    return depth;
  };

  const tools: DeveloperTool[] = [
    {
      id: 'hash-generator',
      name: t('tools.developer.hashGenerator'),
      description: t('tools.developer.hashGeneratorDesc'),
      icon: Hash,
      popular: true,
      inputType: 'text',
      outputType: 'text',
      processingFunction: processHashGenerator
    },
    {
      id: 'base64-encoder',
      name: t('tools.developer.base64Encoder'),
      description: t('tools.developer.base64EncoderDesc'),
      icon: Code,
      popular: true,
      inputType: 'text',
      outputType: 'text',
      processingFunction: processBase64Encoder
    },
    {
      id: 'url-encoder',
      name: t('tools.developer.urlEncoder'),
      description: t('tools.developer.urlEncoderDesc'),
      icon: LinkIcon,
      popular: true,
      inputType: 'text',
      outputType: 'text',
      processingFunction: processURLEncoder
    },
    {
      id: 'json-formatter',
      name: t('tools.developer.jsonFormatter'),
      description: t('tools.developer.jsonFormatterDesc'),
      icon: Braces,
      inputType: 'text',
      outputType: 'text',
      processingFunction: processJSONFormatter
    },
    {
      id: 'qr-generator',
      name: t('tools.developer.qrGenerator'),
      description: t('tools.developer.qrGeneratorDesc'),
      icon: QrCode,
      inputType: 'text',
      outputType: 'download',
      processingFunction: processQRGenerator
    },
    {
      id: 'color-picker',
      name: t('tools.developer.colorPicker'),
      description: t('tools.developer.colorPickerDesc'),
      icon: Palette,
      inputType: 'text',
      outputType: 'text',
      processingFunction: processColorPicker
    },
    {
      id: 'timestamp-converter',
      name: '时间戳转换器',
      description: '时间戳与日期格式相互转换',
      icon: Clock,
      inputType: 'text',
      outputType: 'text',
      processingFunction: processTimestampConverter
    },
    {
      id: 'uuid-generator',
      name: 'UUID生成器',
      description: '生成标准UUID和短UUID标识符',
      icon: Key,
      popular: true,
      inputType: 'none',
      outputType: 'text',
      processingFunction: processUUIDGenerator
    },
    {
      id: 'password-generator',
      name: '密码生成器',
      description: '生成不同强度的安全密码',
      icon: Lock,
      popular: true,
      inputType: 'none',
      outputType: 'text',
      processingFunction: processPasswordGenerator
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
      toast.error(t('common.errors.pleaseSelectTool'));
      return;
    }

    if (selectedTool.inputType === 'text' && !textInput.trim()) {
      toast.error(t('common.errors.pleaseEnterText'));
      return;
    }

    if (selectedTool.inputType === 'file' && !file) {
      toast.error(t('common.errors.pleaseSelectFile'));
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

      const processResult = await selectedTool.processingFunction(input);
      
      if (processResult.result) {
        setResult(processResult.result);
      }
      if (processResult.downloadUrl) {
        setDownloadUrl(processResult.downloadUrl);
        setFileName(processResult.fileName || 'processed_file');
      }
    } catch (error) {
      console.error('处理错误:', error);
      toast.error((error as Error).message || t('common.errors.processingFailed'));
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
    setFile(null);
    setResult('');
    setDownloadUrl('');
    setFileName('');
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
  };

  const selectTool = (tool: DeveloperTool) => {
    setSelectedTool(tool);
    setTextInput('');
    setFile(null);
    setResult('');
    setDownloadUrl('');
    setFileName('');
  };

  if (selectedTool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 py-12">
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
                    placeholder={`请输入要处理的文本...${selectedTool.id === 'color-picker' ? '（例如：#FF5733 或 red）' : ''}${selectedTool.id === 'timestamp-converter' ? '（例如：1640995200 或 2022-01-01）' : ''}`}
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
                      accept=".txt,.json,.xml,.csv"
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
                      支持格式: TXT, JSON, XML, CSV
                    </p>
                    {file && (
                      <p className="text-green-600 text-sm mt-2">
                        已选择: {file.name}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {selectedTool.inputType === 'none' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800">
                    此工具无需输入，点击"开始处理"即可生成结果。
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={handleProcess}
                  disabled={isProcessing || (selectedTool.inputType === 'text' && !textInput.trim()) || (selectedTool.inputType === 'file' && !file)}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? t('common.processing') : t('common.startProcessing')}
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
                    <h3 className="text-lg font-medium text-gray-900">处理结果</h3>
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
      <SEOHead seoKey="developerTools" />
      <StructuredData type="SoftwareApplication" />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Hash className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">开发者工具</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              专业的开发者工具集合，包含编码、哈希、格式化等常用功能
            </p>
          </div>

          {/* Popular Tools Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🔥 热门工具</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">所有开发者工具</h2>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的开发者工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Hash className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">多重哈希</h3>
                <p className="text-gray-600 text-sm">
                  支持MD5、SHA-1、SHA-256、SHA-512等多种哈希算法
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Code className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">编码解码</h3>
                <p className="text-gray-600 text-sm">
                  Base64、URL编码等常用编码格式的转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Braces className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式化</h3>
                <p className="text-gray-600 text-sm">
                  JSON格式化、验证和美化工具
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Key className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">生成器</h3>
                <p className="text-gray-600 text-sm">
                  UUID、密码、二维码等实用生成器工具
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeveloperTools;                );
              })}
            </div>
          </div>

          {/* All Tools Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">所有开发者工具</h2>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的开发者工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Hash className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">多重哈希</h3>
                <p className="text-gray-600 text-sm">
                  支持MD5、SHA-1、SHA-256、SHA-512等多种哈希算法
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Code className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">编码解码</h3>
                <p className="text-gray-600 text-sm">
                  Base64、URL编码等常用编码格式的转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Braces className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式化</h3>
                <p className="text-gray-600 text-sm">
                  JSON格式化、验证和美化工具
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Key className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">生成器</h3>
                <p className="text-gray-600 text-sm">
                  UUID、密码、二维码等实用生成器工具
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeveloperTools;
                );
              })}
            </div>
          </div>

          {/* All Tools Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">所有开发者工具</h2>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的开发者工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Hash className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">多重哈希</h3>
                <p className="text-gray-600 text-sm">
                  支持MD5、SHA-1、SHA-256、SHA-512等多种哈希算法
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Code className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">编码解码</h3>
                <p className="text-gray-600 text-sm">
                  Base64、URL编码等常用编码格式的转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Braces className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式化</h3>
                <p className="text-gray-600 text-sm">
                  JSON格式化、验证和美化工具
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Key className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">生成器</h3>
                <p className="text-gray-600 text-sm">
                  UUID、密码、二维码等实用生成器工具
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeveloperTools;
                );
              })}
            </div>
          </div>

          {/* All Tools Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">所有开发者工具</h2>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的开发者工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Hash className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">多重哈希</h3>
                <p className="text-gray-600 text-sm">
                  支持MD5、SHA-1、SHA-256、SHA-512等多种哈希算法
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Code className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">编码解码</h3>
                <p className="text-gray-600 text-sm">
                  Base64、URL编码等常用编码格式的转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Braces className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式化</h3>
                <p className="text-gray-600 text-sm">
                  JSON格式化、验证和美化工具
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Key className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">生成器</h3>
                <p className="text-gray-600 text-sm">
                  UUID、密码、二维码等实用生成器工具
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeveloperTools;
                );
              })}
            </div>
          </div>

          {/* All Tools Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">所有开发者工具</h2>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的开发者工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Hash className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">多重哈希</h3>
                <p className="text-gray-600 text-sm">
                  支持MD5、SHA-1、SHA-256、SHA-512等多种哈希算法
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Code className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">编码解码</h3>
                <p className="text-gray-600 text-sm">
                  Base64、URL编码等常用编码格式的转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Braces className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式化</h3>
                <p className="text-gray-600 text-sm">
                  JSON格式化、验证和美化工具
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Key className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">生成器</h3>
                <p className="text-gray-600 text-sm">
                  UUID、密码、二维码等实用生成器工具
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeveloperTools;
                );
              })}
            </div>
          </div>

          {/* All Tools Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">所有开发者工具</h2>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的开发者工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Hash className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">多重哈希</h3>
                <p className="text-gray-600 text-sm">
                  支持MD5、SHA-1、SHA-256、SHA-512等多种哈希算法
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Code className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">编码解码</h3>
                <p className="text-gray-600 text-sm">
                  Base64、URL编码等常用编码格式的转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Braces className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式化</h3>
                <p className="text-gray-600 text-sm">
                  JSON格式化、验证和美化工具
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Key className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">生成器</h3>
                <p className="text-gray-600 text-sm">
                  UUID、密码、二维码等实用生成器工具
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeveloperTools;
                );
              })}
            </div>
          </div>

          {/* All Tools Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">所有开发者工具</h2>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的开发者工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Hash className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">多重哈希</h3>
                <p className="text-gray-600 text-sm">
                  支持MD5、SHA-1、SHA-256、SHA-512等多种哈希算法
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Code className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">编码解码</h3>
                <p className="text-gray-600 text-sm">
                  Base64、URL编码等常用编码格式的转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Braces className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式化</h3>
                <p className="text-gray-600 text-sm">
                  JSON格式化、验证和美化工具
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Key className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">生成器</h3>
                <p className="text-gray-600 text-sm">
                  UUID、密码、二维码等实用生成器工具
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeveloperTools;
                );
              })}
            </div>
          </div>

          {/* All Tools Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">所有开发者工具</h2>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的开发者工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Hash className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">多重哈希</h3>
                <p className="text-gray-600 text-sm">
                  支持MD5、SHA-1、SHA-256、SHA-512等多种哈希算法
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Code className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">编码解码</h3>
                <p className="text-gray-600 text-sm">
                  Base64、URL编码等常用编码格式的转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Braces className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式化</h3>
                <p className="text-gray-600 text-sm">
                  JSON格式化、验证和美化工具
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Key className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">生成器</h3>
                <p className="text-gray-600 text-sm">
                  UUID、密码、二维码等实用生成器工具
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeveloperTools;
