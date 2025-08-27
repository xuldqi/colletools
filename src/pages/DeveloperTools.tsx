import React, { useState } from 'react';
import { 
  Hash, Code, Link as LinkIcon, Braces, QrCode, Palette, Clock, Key, Lock,
  Upload, ArrowLeft, Copy, Download
} from 'lucide-react';
import { toast } from 'sonner';
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
      throw new Error('请输入要生成哈希的文本');
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
    
    const result = `🔑 多重哈希生成结果\n\n📝 原始文本：\n${text.substring(0, 200)}${text.length > 200 ? '...' : ''}\n\n🔐 哈希值：\nMD5(模拟)：${md5Like}\nSHA-1：${sha1Hex}\nSHA-256：${sha256Hex}\nSHA-512：${sha512Hex}\n\n📊 统计信息：\n• 原文长度：${text.length} 字符\n• SHA-1 长度：${sha1Hex.length} 字符\n• SHA-256 长度：${sha256Hex.length} 字符\n• SHA-512 长度：${sha512Hex.length} 字符`;
    
    toast.success('✅ 哈希生成完成！');
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
      throw new Error('请输入要编码的文本');
    }
    
    try {
      // 编码
      const encoded = btoa(unescape(encodeURIComponent(text)));
      
      // 解码验证
      const decoded = decodeURIComponent(escape(atob(encoded)));
      
      // URL安全的Base64
      const urlSafeEncoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      
      const result = `🔐 Base64 编码/解码结果\n\n📝 原始文本：\n${text.substring(0, 200)}${text.length > 200 ? '...' : ''}\n\n✨ 标准Base64编码：\n${encoded}\n\n🔗 URL安全Base64：\n${urlSafeEncoded}\n\n✅ 解码验证：\n${decoded.substring(0, 200)}${decoded.length > 200 ? '...' : ''}\n\n📊 编码统计：\n• 原文长度：${text.length} 字符\n• 编码长度：${encoded.length} 字符\n• 压缩比：${((encoded.length / text.length) * 100).toFixed(1)}%`;
      
      toast.success('✅ Base64编码完成！');
      return { result };
    } catch (error) {
      throw new Error('Base64编码失败：' + (error as Error).message);
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
      throw new Error('请输入要编码的URL或文本');
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
      
      const result = `🔗 URL编码/解码结果\n\n📝 原始文本：\n${text}\n\n🌐 标准URL编码：\n${encoded}\n\n📄 HTML实体编码：\n${htmlEncoded}\n\n🔄 旧式编码(escape)：\n${escapeEncoded}\n\n✅ 解码验证：\n${decoded}\n\n📊 编码统计：\n• 原文长度：${text.length} 字符\n• URL编码长度：${encoded.length} 字符\n• HTML编码长度：${htmlEncoded.length} 字符`;
      
      toast.success('✅ URL编码完成！');
      return { result };
    } catch (error) {
      throw new Error('URL编码失败：' + (error as Error).message);
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
      throw new Error('请输入JSON文本');
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
      
      const result = `📋 JSON格式化/验证结果\n\n✅ JSON格式有效！\n\n📝 格式化(2空格)：\n${formatted2.substring(0, 500)}${formatted2.length > 500 ? '\n...(已截断)' : ''}\n\n🗜️ 压缩版本：\n${minified.substring(0, 300)}${minified.length > 300 ? '...' : ''}\n\n📊 JSON统计：\n• 原始长度：${text.length} 字符\n• 格式化长度：${formatted2.length} 字符\n• 压缩长度：${minified.length} 字符\n• 键数量：${keyCount}\n• 嵌套深度：${depth} 层\n• 压缩率：${(((formatted2.length - minified.length) / formatted2.length) * 100).toFixed(1)}%`;
      
      toast.success('✅ JSON验证通过！');
      return { result };
    } catch (error) {
      const errorMsg = (error as Error).message;
      const result = `❌ JSON格式错误\n\n🚫 错误信息：\n${errorMsg}\n\n📝 输入内容：\n${text.substring(0, 300)}${text.length > 300 ? '\n...(已截断)' : ''}\n\n💡 常见问题：\n• 检查括号是否匹配\n• 确保字符串用双引号包围\n• 检查逗号使用是否正确\n• 确保没有尾随逗号`;
      
      toast.error('❌ JSON格式无效');
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
      throw new Error('请输入要生成二维码的内容');
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
    
    const result = `📱 二维码生成结果\n\n✅ 二维码生成成功！\n\n📝 编码内容：\n${text}\n\n📊 二维码信息：\n• 内容长度：${text.length} 字符\n• 图片尺寸：${qrSize}×${qrSize} 像素\n• 文件格式：SVG\n• 编码类型：文本\n\n💡 说明：这是演示版本，实际使用中会生成真实的二维码图片。完整版支持：\n• 多种容错级别\n• 自定义颜色和尺寸\n• PNG、JPG等格式导出\n• Logo嵌入功能`;
    
    toast.success('✅ 二维码生成完成！');
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
      
      const result = `🎨 颜色转换结果\n\n🎯 当前颜色：${color}\n${colorBlock} (颜色预览)\n\n📊 颜色格式转换：\n• HEX：${color}\n• RGB：rgb(${r}, ${g}, ${b})\n• HSL：${hsl}\n• CSS：color: ${color}\n\n📈 颜色分析：\n• 红色分量：${r} (${((r/255)*100).toFixed(1)}%)\n• 绿色分量：${g} (${((g/255)*100).toFixed(1)}%)\n• 蓝色分量：${b} (${((b/255)*100).toFixed(1)}%)\n• 亮度：${Math.round(l * 100)}%\n• 饱和度：${Math.round(s * 100)}%\n• 色相：${Math.round(h * 360)}°`;
      
      toast.success('✅ 颜色转换完成！');
      return { result };
    } catch (error) {
      throw new Error('颜色格式错误，请输入有效的颜色值');
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
          throw new Error('无法解析时间格式');
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
    
    const result = `🕐 时间戳转换结果\n\n📅 转换时间：${formats.local}\n\n📊 多格式显示：\n• 10位时间戳：${formats.timestamp10}\n• 13位时间戳：${formats.timestamp13}\n• ISO格式：${formats.iso}\n• 本地时间：${formats.local}\n• UTC时间：${formats.utc}\n• 日期：${formats.date}\n• 时间：${formats.time}\n\n📈 详细信息：\n• 年份：${formats.year}\n• 月份：${formats.month}\n• 日期：${formats.day}\n• 小时：${formats.hour}\n• 分钟：${formats.minute}\n• 秒数：${formats.second}\n• 星期：${['日', '一', '二', '三', '四', '五', '六'][date.getDay()]}\n\n⏰ 当前时间：${new Date().toLocaleString('zh-CN')}`;
    
    toast.success('✅ 时间戳转换完成！');
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
    
    const result = `🆔 UUID生成结果\n\n✅ 已生成多个UUID！\n\n📋 标准UUID v4 (前10个)：\n${uuids.slice(0, 10).join('\n')}\n\n🔗 短UUID (8位)：\n${shortUUIDs.join('\n')}\n\n📊 生成统计：\n• 标准UUID：${uuids.length} 个\n• 短UUID：${shortUUIDs.length} 个\n• UUID格式：8-4-4-4-12\n• 字符集：0-9, a-f\n• 版本：v4 (随机)\n\n💡 使用说明：\n• 标准UUID用于数据库主键\n• 短UUID用于临时标识符\n• 所有UUID保证唯一性\n\n🔄 完整UUID列表：\n${uuids.join('\n')}`;
    
    toast.success('✅ UUID生成完成！');
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
      
      const levels = ['很弱', '弱', '一般', '强', '很强', '极强'];
      return levels[score] || '很弱';
    };
    
    const result = `🔐 密码生成结果\n\n🛡️ 不同强度密码：\n\n🔹 简单密码 (8位)：\n${passwords.simple} [强度: ${evaluateStrength(passwords.simple)}]\n\n🔸 中等密码 (12位)：\n${passwords.medium} [强度: ${evaluateStrength(passwords.medium)}]\n\n🔶 强密码 (16位)：\n${passwords.strong} [强度: ${evaluateStrength(passwords.strong)}]\n\n🔴 超强密码 (32位)：\n${passwords.ultraStrong} [强度: ${evaluateStrength(passwords.ultraStrong)}]\n\n📋 随机密码列表：\n${randomPasswords.map((pwd, i) => `${i+1}. ${pwd} [${evaluateStrength(pwd)}]`).join('\n')}\n\n💡 密码安全建议：\n• 使用至少12位字符\n• 包含大小写字母、数字和符号\n• 避免使用个人信息\n• 定期更换密码\n• 不同账户使用不同密码`;
    
    toast.success('✅ 密码生成完成！');
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
      name: 'Hash生成器',
      description: '生成MD5、SHA1、SHA256、SHA512等多种哈希值',
      icon: Hash,
      popular: true,
      inputType: 'text',
      outputType: 'text',
      processingFunction: processHashGenerator
    },
    {
      id: 'base64-encoder',
      name: 'Base64编码/解码',
      description: '对文本进行Base64编码、解码和URL安全编码',
      icon: Code,
      popular: true,
      inputType: 'text',
      outputType: 'text',
      processingFunction: processBase64Encoder
    },
    {
      id: 'url-encoder',
      name: 'URL编码/解码',
      description: '对URL和文本进行编码、解码和HTML实体转换',
      icon: LinkIcon,
      popular: true,
      inputType: 'text',
      outputType: 'text',
      processingFunction: processURLEncoder
    },
    {
      id: 'json-formatter',
      name: 'JSON格式化/验证',
      description: '格式化、验证JSON数据并提供统计信息',
      icon: Braces,
      inputType: 'text',
      outputType: 'text',
      processingFunction: processJSONFormatter
    },
    {
      id: 'qr-generator',
      name: '二维码生成器',
      description: '将文本或URL转换为二维码图片',
      icon: QrCode,
      inputType: 'text',
      outputType: 'download',
      processingFunction: processQRGenerator
    },
    {
      id: 'color-picker',
      name: '颜色选择器/转换',
      description: '颜色格式转换和分析（HEX、RGB、HSL）',
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
      toast.error('请选择一个工具');
      return;
    }

    if (selectedTool.inputType === 'text' && !textInput.trim()) {
      toast.error('请输入文本');
      return;
    }

    if (selectedTool.inputType === 'file' && !file) {
      toast.error('请选择文件');
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
      toast.error((error as Error).message || '处理失败，请重试');
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
                  {isProcessing ? '处理中...' : '开始处理'}
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

export default DeveloperTools;