import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText, Split, ArrowRightLeft, Database, FileSpreadsheet, Code,
  Type, Hash, Calculator, Link as LinkIcon, Braces, Upload, ArrowLeft, Copy,
  Ruler, DollarSign, Binary, QrCode, Key, Lock
} from 'lucide-react';
import { toast } from 'sonner';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';

interface DocumentTool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  popular?: boolean;
  category: string;
  inputType: 'file' | 'text';
  acceptedTypes?: string;
  processingFunction: (input: File | string) => Promise<{ result?: string; downloadUrl?: string; fileName?: string; }>;
}

const DocumentDataTools: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTool, setSelectedTool] = useState<DocumentTool | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  // CSV处理函数
  const processCSVSplit = async (input: File | string) => {
    if (!(input instanceof File)) throw new Error(t('tools.documentData.needCSVFile'));
    
    toast.info(t('tools.documentData.parsingCSVFile'));
    const text = await input.text();
    const lines = text.split('\n');
    
    if (lines.length < 2) {
      throw new Error(t('tools.documentData.csvNeedAtLeast2Rows'));
    }
    
    // 按行数拆分（每1000行一个文件）
    const chunkSize = 1000;
    const header = lines[0];
    const dataLines = lines.slice(1);
    const chunks = [];
    
    for (let i = 0; i < dataLines.length; i += chunkSize) {
      const chunk = [header, ...dataLines.slice(i, i + chunkSize)].join('\n');
      chunks.push(chunk);
    }
    
    // 创建第一个分片作为示例
    const firstChunk = chunks[0];
    const blob = new Blob([firstChunk], { type: 'text/csv' });
    
    toast.success(t('tools.documentData.csvSplitComplete', { count: chunks.length }));
    return {
      result: t('tools.documentData.csvSplitResult', { 
        originalRows: dataLines.length, 
        fileCount: chunks.length, 
        maxRows: chunkSize,
        preview: firstChunk.split('\n').slice(0, 5).join('\n') + (firstChunk.split('\n').length > 5 ? '\n...' : '')
      }),
      downloadUrl: URL.createObjectURL(blob),
      fileName: `split_1_of_${chunks.length}.csv`
    };
  };

  const processCSVToJSON = async (input: File | string) => {
    if (!(input instanceof File)) throw new Error(t('common.needCSVFile'));
    
    toast.info('正在转换CSV为JSON...');
    const text = await input.text();
    const lines = text.trim().split('\n');
    
    if (lines.length < 2) {
      throw new Error(t('common.errors.csvFormatIncorrect'));
    }
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const jsonArray = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      jsonArray.push(obj);
    }
    
    const jsonString = JSON.stringify(jsonArray, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    toast.success(`✅ 转换完成！${jsonArray.length}条记录`);
    return {
      result: `CSV转JSON完成\n\n记录数：${jsonArray.length}\n字段数：${headers.length}\n\nJSON预览：\n${JSON.stringify(jsonArray.slice(0, 3), null, 2)}${jsonArray.length > 3 ? '\n...' : ''}`,
      downloadUrl: URL.createObjectURL(blob),
      fileName: 'converted.json'
    };
  };

  const processXMLToJSON = async (input: File | string) => {
    if (!(input instanceof File)) throw new Error(t('common.errors.xmlFileRequired'));
    
    toast.info('正在转换XML为JSON...');
    const text = await input.text();
    
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error(t('common.errors.xmlFormatError'));
      }
      
      // 简单XML到JSON转换
      const xmlToJson = (node: Element): any => {
        const obj: any = {};
        
        // 处理属性
        if (node.attributes) {
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            obj[`@${attr.name}`] = attr.value;
          }
        }
        
        // 处理子节点
        if (node.childNodes) {
          for (let i = 0; i < node.childNodes.length; i++) {
            const child = node.childNodes[i];
            
            if (child.nodeType === 1) { // Element node
              const childElement = child as Element;
              const childName = childElement.tagName;
              const childObj = xmlToJson(childElement);
              
              if (obj[childName]) {
                if (!Array.isArray(obj[childName])) {
                  obj[childName] = [obj[childName]];
                }
                obj[childName].push(childObj);
              } else {
                obj[childName] = childObj;
              }
            } else if (child.nodeType === 3) { // Text node
              const text = child.textContent?.trim();
              if (text) {
                obj['#text'] = text;
              }
            }
          }
        }
        
        return obj;
      };
      
      const jsonObj = xmlToJson(xmlDoc.documentElement);
      const jsonString = JSON.stringify({ [xmlDoc.documentElement.tagName]: jsonObj }, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      toast.success('✅ XML转JSON完成！');
      return {
        result: `XML转JSON完成\n\n根元素：${xmlDoc.documentElement.tagName}\n\nJSON预览：\n${jsonString.substring(0, 500)}${jsonString.length > 500 ? '\n...' : ''}`,
        downloadUrl: URL.createObjectURL(blob),
        fileName: 'converted.json'
      };
    } catch (error) {
      throw new Error(t('common.errors.xmlParseFailed') + (error as Error).message);
    }
  };

  // 文本处理函数
  const processWordCounter = async (input: File | string) => {
    let text: string;
    if (input instanceof File) {
      text = await input.text();
    } else {
      text = input;
    }
    
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const lines = text.split('\n').length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    
    const result = `📊 文字统计结果\n\n字数：${words.length}\n字符数（含空格）：${characters}\n字符数（不含空格）：${charactersNoSpaces}\n行数：${lines}\n段落数：${paragraphs}\n\n平均每行字数：${Math.round(words.length / lines)}\n平均每段字数：${Math.round(words.length / paragraphs)}`;
    
    toast.success('✅ 文字统计完成！');
    return { result };
  };

  const processCaseConverter = async (input: File | string) => {
    let text: string;
    if (input instanceof File) {
      text = await input.text();
    } else {
      text = input;
    }
    
    const conversions = {
      uppercase: text.toUpperCase(),
      lowercase: text.toLowerCase(),
      titlecase: text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
      sentencecase: text.toLowerCase().replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => 
        p1 + p2.toUpperCase()
      )
    };
    
    const result = `🔄 大小写转换结果\n\n全部大写：\n${conversions.uppercase.substring(0, 100)}${conversions.uppercase.length > 100 ? '...' : ''}\n\n全部小写：\n${conversions.lowercase.substring(0, 100)}${conversions.lowercase.length > 100 ? '...' : ''}\n\n标题格式：\n${conversions.titlecase.substring(0, 100)}${conversions.titlecase.length > 100 ? '...' : ''}\n\n句子格式：\n${conversions.sentencecase.substring(0, 100)}${conversions.sentencecase.length > 100 ? '...' : ''}`;
    
    toast.success('✅ 大小写转换完成！');
    return { result };
  };

  // 编码处理函数
  const processBase64Encoder = async (input: File | string) => {
    let text: string;
    if (input instanceof File) {
      text = await input.text();
    } else {
      text = input;
    }
    
    try {
      const encoded = btoa(unescape(encodeURIComponent(text)));
      const decoded = decodeURIComponent(escape(atob(encoded)));
      
      const result = `🔐 Base64 编码结果\n\n原始文本：\n${text.substring(0, 100)}${text.length > 100 ? '...' : ''}\n\nBase64编码：\n${encoded.substring(0, 200)}${encoded.length > 200 ? '...' : ''}\n\n解码验证：\n${decoded.substring(0, 100)}${decoded.length > 100 ? '...' : ''}\n\n✅ 编码长度：${encoded.length}字符`;
      
      toast.success('✅ Base64编码完成！');
      return { result };
    } catch (error) {
      throw new Error('Base64编码失败：' + (error as Error).message);
    }
  };

  const processHashGenerator = async (input: File | string) => {
    let text: string;
    if (input instanceof File) {
      text = await input.text();
    } else {
      text = input;
    }
    
    // 使用Web Crypto API生成哈希
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    const sha256Hash = await crypto.subtle.digest('SHA-256', data);
    const sha256Array = Array.from(new Uint8Array(sha256Hash));
    const sha256Hex = sha256Array.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // 简单MD5模拟（实际项目中应使用专门的MD5库）
    const simpleHash = text.split('').reduce((hash, char) => {
      const charCode = char.charCodeAt(0);
      hash = ((hash << 5) - hash) + charCode;
      return hash & hash; // 转换为32位整数
    }, 0);
    const md5Like = Math.abs(simpleHash).toString(16).padStart(8, '0');
    
    const result = `🔑 哈希生成结果\n\n原始文本：\n${text.substring(0, 100)}${text.length > 100 ? '...' : ''}\n\nSHA-256：\n${sha256Hex}\n\n简单哈希：\n${md5Like}\n\n文本长度：${text.length}字符\n哈希长度：SHA-256(64), Simple(8)`;
    
    toast.success('✅ 哈希生成完成！');
    return { result };
  };

  const processNumberBaseConverter = async (input: File | string) => {
    let text: string;
    if (input instanceof File) {
      text = await input.text();
    } else {
      text = input;
    }
    
    const numbers = text.trim().split(/\s+/);
    const conversions: string[] = [];
    
    for (const numStr of numbers.slice(0, 10)) { // 限制处理前10个数字
      const num = parseInt(numStr, 10);
      if (isNaN(num)) continue;
      
      conversions.push(`数字 ${num}：`);
      conversions.push(`  十进制: ${num}`);
      conversions.push(`  二进制: ${num.toString(2)}`);
      conversions.push(`  八进制: ${num.toString(8)}`);
      conversions.push(`  十六进制: ${num.toString(16).toUpperCase()}`);
      conversions.push('');
    }
    
    const result = `🔢 进制转换结果\n\n${conversions.join('\n')}`;
    
    toast.success('✅ 进制转换完成！');
    return { result };
  };

  const processUUIDGenerator = async (input: File | string) => {
    // 生成UUID v4
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
    
    const uuids = [];
    for (let i = 0; i < 10; i++) {
      uuids.push(generateUUID());
    }
    
    const result = `🆔 UUID生成结果\n\n${uuids.join('\n')}\n\n✅ 已生成10个UUID v4格式`;
    
    toast.success('✅ UUID生成完成！');
    return { result };
  };

  const processURLEncoder = async (input: File | string) => {
    let text: string;
    if (input instanceof File) {
      text = await input.text();
    } else {
      text = input;
    }
    
    const encoded = encodeURIComponent(text);
    const decoded = decodeURIComponent(encoded);
    
    const result = `🔗 URL编码结果\n\n原始文本：\n${text.substring(0, 100)}${text.length > 100 ? '...' : ''}\n\nURL编码：\n${encoded.substring(0, 200)}${encoded.length > 200 ? '...' : ''}\n\n解码验证：\n${decoded.substring(0, 100)}${decoded.length > 100 ? '...' : ''}\n\n✅ 编码长度：${encoded.length}字符`;
    
    toast.success('✅ URL编码完成！');
    return { result };
  };

  const tools: DocumentTool[] = [
    // 文件处理工具
    {
      id: 'csv-split',
      name: t('tools.documentData.csvSplit'),
      description: t('tools.documentData.csvSplitDesc'),
      icon: Split,
      popular: true,
      category: t('tools.documentData.fileProcessing'),
      inputType: 'file',
      acceptedTypes: '.csv',
      processingFunction: processCSVSplit
    },
    {
      id: 'csv-to-json',
      name: t('tools.documentData.csvToJson'),
      description: t('tools.documentData.csvToJsonDesc'),
      icon: ArrowRightLeft,
      popular: true,
      category: t('tools.documentData.fileProcessing'),
      inputType: 'file',
      acceptedTypes: '.csv',
      processingFunction: processCSVToJSON
    },
    {
      id: 'xml-to-json',
      name: t('tools.documentData.xmlToJson'),
      description: t('tools.documentData.xmlToJsonDesc'),
      icon: Code,
      popular: true,
      category: t('tools.documentData.fileProcessing'),
      inputType: 'file',
      acceptedTypes: '.xml',
      processingFunction: processXMLToJSON
    },

    // 文本处理工具
    {
      id: 'word-counter',
      name: t('tools.documentData.wordCounter'),
      description: t('tools.documentData.wordCounterDesc'),
      icon: Calculator,
      popular: true,
      category: t('tools.documentData.textProcessing'),
      inputType: 'text',
      processingFunction: processWordCounter
    },
    {
      id: 'case-converter',
      name: t('tools.documentData.caseConverter'),
      description: t('tools.documentData.caseConverterDesc'),
      icon: Type,
      popular: true,
      category: t('tools.documentData.textProcessing'),
      inputType: 'text',
      processingFunction: processCaseConverter
    },

    // 编码工具
    {
      id: 'base64-encoder',
      name: t('tools.documentData.base64Encoder'),
      description: t('tools.documentData.base64EncoderDesc'),
      icon: Code,
      popular: true,
      category: t('tools.documentData.encodingTools'),
      inputType: 'text',
      processingFunction: processBase64Encoder
    },
    {
      id: 'url-encoder',
      name: t('tools.documentData.urlEncoder'),
      description: t('tools.documentData.urlEncoderDesc'),
      icon: LinkIcon,
      popular: true,
      category: t('tools.documentData.encodingTools'),
      inputType: 'text',
      processingFunction: processURLEncoder
    },
    {
      id: 'hash-generator',
      name: t('tools.documentData.hashGenerator'),
      description: t('tools.documentData.hashGeneratorDesc'),
      icon: Hash,
      popular: true,
      category: t('tools.documentData.encodingTools'),
      inputType: 'text',
      processingFunction: processHashGenerator
    },

    // 生成器工具
    {
      id: 'uuid-generator',
      name: t('tools.documentData.uuidGenerator'),
      description: t('tools.documentData.uuidGeneratorDesc'),
      icon: Key,
      popular: true,
      category: t('tools.documentData.generators'),
      inputType: 'text',
      processingFunction: processUUIDGenerator
    },
    {
      id: 'number-base-converter',
      name: t('tools.documentData.numberBaseConverter'),
      description: t('tools.documentData.numberBaseConverterDesc'),
      icon: Binary,
      popular: true,
      category: t('tools.documentData.converters'),
      inputType: 'text',
      processingFunction: processNumberBaseConverter
    }
  ];

  const categories = [
    t('tools.documentData.fileProcessing'),
    t('tools.documentData.textProcessing'),
    t('tools.documentData.encodingTools'),
    t('tools.documentData.generators'),
    t('tools.documentData.converters')
  ];
  const popularTools = tools.filter(tool => tool.popular);

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

    if (selectedTool.inputType === 'file' && !file) {
      toast.error(t('common.selectFile'));
      return;
    }

    if (selectedTool.inputType === 'text' && !textInput.trim()) {
      toast.error(t('common.enterText'));
      return;
    }

    setIsProcessing(true);

    try {
      const input = selectedTool.inputType === 'file' ? file! : textInput;
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
      toast.success(t('common.resultCopied'));
    }
  };

  const resetTool = () => {
    setSelectedTool(null);
    setFile(null);
    setTextInput('');
    setResult('');
    setDownloadUrl('');
    setFileName('');
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
  };

  const selectTool = (tool: DocumentTool) => {
    setSelectedTool(tool);
    setFile(null);
    setTextInput('');
    setResult('');
    setDownloadUrl('');
    setFileName('');
  };

  if (selectedTool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                  <selectedTool.icon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTool.name}
                  </h2>
                  <p className="text-gray-600">{selectedTool.description}</p>
                  <p className="text-sm text-purple-600">{selectedTool.category}</p>
                </div>
              </div>
              <button
                onClick={resetTool}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('common.back')}</span>
              </button>
            </div>

            <div className="space-y-6">
              {selectedTool.inputType === 'file' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('common.selectFile')}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <input
                      type="file"
                      accept={selectedTool.acceptedTypes}
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium"
                    >
                      {t('common.clickToSelectFile')}
                    </label>
                    <p className="text-gray-500 text-sm mt-2">
                      {t('common.supportedFormats')}: {selectedTool.acceptedTypes}
                    </p>
                    {file && (
                      <p className="text-green-600 text-sm mt-2">
                        {t('common.selected')}: {file.name}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('common.enterText')}
                  </label>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={t('common.enterTextToProcess')}
                  />
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={handleProcess}
                  disabled={isProcessing || (selectedTool.inputType === 'file' ? !file : !textInput.trim())}
                  className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? t('common.processing') : t('common.startProcessing')}
                </button>
                {downloadUrl && (
                  <button
                    onClick={downloadFile}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    {t('common.downloadFile')}
                  </button>
                )}
              </div>

              {result && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{t('common.processingResult')}</h3>
                    <button
                      onClick={copyResult}
                      className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{t('common.copy')}</span>
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
      <SEOHead seoKey="documentDataTools" />
      <StructuredData type="SoftwareApplication" />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('tools.documentData.title')}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('tools.documentData.description')}
            </p>
          </div>

          {/* Popular Tools Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🔥 {t('common.popularTools')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularTools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={() => selectTool(tool)}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer group"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <IconComponent className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-purple-600">{tool.category}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                    <button className="w-full bg-purple-600 text-white hover:bg-purple-700 py-2 rounded-md font-medium transition-colors">
                      {t('common.useTool')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tools by Category */}
          {categories.map((category) => {
            const categoryTools = tools.filter(tool => tool.category === category);
            if (categoryTools.length === 0) return null;
            
            return (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTools.map((tool) => {
                    const IconComponent = tool.icon;
                    return (
                      <div
                        key={tool.id}
                        onClick={() => selectTool(tool)}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100 cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <IconComponent className="w-6 h-6 text-purple-600 group-hover:text-purple-700 transition-colors" />
                          {tool.popular && (
                            <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              {t('common.popular')}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                          {tool.name}
                        </h3>
                        
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {tool.description}
                        </p>
                        
                        <div className="flex items-center text-purple-600 text-sm font-medium">
                          <span>{t('common.useTool')}</span>
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Features Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('common.whyChooseUs')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Split className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('common.smartProcessing')}</h3>
                <p className="text-gray-600 text-sm">
                  {t('common.smartProcessingDesc')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ArrowRightLeft className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('common.formatConversion')}</h3>
                <p className="text-gray-600 text-sm">
                  {t('common.formatConversionDesc')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('common.dataSecurity')}</h3>
                <p className="text-gray-600 text-sm">
                  {t('common.dataSecurityDesc')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Code className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('common.developerFriendly')}</h3>
                <p className="text-gray-600 text-sm">
                  {t('common.developerFriendlyDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentDataTools;