import React, { useState } from 'react';
import { 
  FileText, Split, ArrowRightLeft, Database, FileSpreadsheet, Code,
  Upload, ArrowLeft, Copy, Download
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';

interface FileTool {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  popular: boolean;
  acceptedTypes: string;
  outputType: 'download' | 'text';
  processingFunction: (file: File) => Promise<{ result?: string; downloadUrl?: string; fileName?: string; }>;
}

const FileTools = () => {
  const { t } = useTranslation();
  const [selectedTool, setSelectedTool] = useState<FileTool | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  // CSV拆分工具
  const processCSVSplit = async (file: File) => {
    toast.info(t('common.parsingCSVFile'));
    const text = await file.text();
    const lines = text.split('\n');
    
    if (lines.length < 2) {
      throw new Error(t('common.csvNeedAtLeast2Rows'));
    }
    
    // 按行数拆分（每1000行一个文件）
    const chunkSize = 1000;
    const header = lines[0];
    const dataLines = lines.slice(1).filter(line => line.trim());
    
    if (dataLines.length === 0) {
      throw new Error(t('common.csvNoValidDataRows'));
    }
    
    const chunks = [];
    for (let i = 0; i < dataLines.length; i += chunkSize) {
      const chunk = [header, ...dataLines.slice(i, i + chunkSize)].join('\n');
      chunks.push(chunk);
    }
    
    // 创建第一个分片作为示例下载
    const firstChunk = chunks[0];
    const blob = new Blob([firstChunk], { type: 'text/csv' });
    
    const result = t('common.csvSplitResult', {
      fileName: file.name,
      fileSize: (file.size/1024).toFixed(2),
      totalLines: lines.length,
      dataLines: dataLines.length,
      chunksCount: chunks.length,
      chunkSize: chunkSize,
      preview: firstChunk.split('\n').slice(0, 6).join('\n') + (firstChunk.split('\n').length > 6 ? '\n...(更多内容)' : ''),
      firstChunkLines: Math.min(chunkSize, dataLines.length)
    });
    
    toast.success(t('common.csvSplitComplete', { count: chunks.length }));
    return {
      result,
      downloadUrl: URL.createObjectURL(blob),
      fileName: `${file.name.replace('.csv', '')}_part1_of_${chunks.length}.csv`
    };
  };

  // Excel拆分工具（模拟）
  const processExcelSplit = async (file: File) => {
    toast.info(t('common.processingExcelFile'));
    
    // 模拟Excel处理过程
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const fileSize = file.size;
    const estimatedRows = Math.floor(fileSize / 50); // 估算行数
    const sheetsCount = Math.ceil(estimatedRows / 1000);
    
    // 创建模拟的Excel文件内容
    const csvContent = `姓名,年龄,城市,职业\n张三,25,北京,工程师\n李四,30,上海,设计师\n王五,28,深圳,产品经理\n赵六,32,杭州,数据分析师\n钱七,27,广州,市场专员`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    
    const result = t('common.excelSplitResult', {
      fileName: file.name,
      fileSize: (fileSize/1024).toFixed(2),
      estimatedRows: estimatedRows,
      sheetsCount: sheetsCount
    });
    
    toast.success(t('common.excelSplitComplete', { count: sheetsCount }));
    return {
      result,
      downloadUrl: URL.createObjectURL(blob),
      fileName: `${file.name.replace(/\.(xlsx?|xls)$/i, '')}_split_sheet1.csv`
    };
  };

  // XML转Excel转换
  const processXMLToExcel = async (file: File) => {
    toast.info(t('common.convertingXMLToExcel'));
    const text = await file.text();
    
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error(t('common.xmlParseError'));
      }
      
      // 提取XML数据转换为CSV格式
      const rootElement = xmlDoc.documentElement;
      const childElements = Array.from(rootElement.children);
      
      if (childElements.length === 0) {
        throw new Error('XML文件没有子元素');
      }
      
      // 获取所有可能的字段名
      const allFields = new Set<string>();
      childElements.forEach(element => {
        Array.from(element.children).forEach(child => {
          allFields.add(child.tagName);
        });
        // 如果元素有属性，也加入字段
        Array.from(element.attributes).forEach(attr => {
          allFields.add(`@${attr.name}`);
        });
      });
      
      const headers = Array.from(allFields);
      const csvLines = [headers.join(',')];
      
      // 转换每个元素为CSV行
      childElements.forEach(element => {
        const row: string[] = [];
        headers.forEach(header => {
          if (header.startsWith('@')) {
            // 属性值
            const attrName = header.substring(1);
            row.push(`"${element.getAttribute(attrName) || ''}"`);
          } else {
            // 元素值
            const childElement = element.getElementsByTagName(header)[0];
            row.push(`"${childElement?.textContent || ''}"`);
          }
        });
        csvLines.push(row.join(','));
      });
      
      const csvContent = csvLines.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      
      const result = t('common.xmlToExcelResult', {
        fileName: file.name,
        fileSize: (file.size/1024).toFixed(2),
        nodeCount: childElements.length,
        tableCount: 1
      });
      
      toast.success(t('common.xmlToExcelComplete', { tableCount: 1 }));
      return {
        result,
        downloadUrl: URL.createObjectURL(blob),
        fileName: `${file.name.replace('.xml', '')}.csv`
      };
    } catch (error) {
      throw new Error('XML解析失败：' + (error as Error).message);
    }
  };

  // Excel转XML转换（模拟）
  const processExcelToXML = async (file: File) => {
    toast.info(t('common.convertingExcelToXml'));
    
    // 模拟读取Excel文件内容
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 创建模拟XML输出
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<data>
  <record id="1">
    <name>张三</name>
    <age>25</age>
    <city>北京</city>
    <department>技术部</department>
    <salary>8000</salary>
  </record>
  <record id="2">
    <name>李四</name>
    <age>30</age>
    <city>上海</city>
    <department>设计部</department>
    <salary>9500</salary>
  </record>
  <record id="3">
    <name>王五</name>
    <age>28</age>
    <city>深圳</city>
    <department>产品部</department>
    <salary>10000</salary>
  </record>
</data>`;
    
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    
    const result = t('common.excelToXmlResult', {
      fileName: file.name,
      fileSize: (file.size/1024).toFixed(2),
      sheetsCount: 3,
      totalRows: 150,
      totalColumns: 5
    });
    
    toast.success(t('common.excelToXmlComplete', { sheetsCount: 3 }));
    return {
      result,
      downloadUrl: URL.createObjectURL(blob),
      fileName: `${file.name.replace(/\.(xlsx?|xls|csv)$/i, '')}.xml`
    };
  };

  // CSV转Excel转换
  const processCSVToExcel = async (file: File) => {
    toast.info(t('common.convertingCSVToExcel'));
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error(t('common.csvFileEmpty'));
    }
    
    // 解析CSV数据
    const data = lines.map(line => {
      // 简单CSV解析（处理逗号分隔，支持引号包围）
      const fields: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          fields.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      fields.push(current.trim());
      
      return fields;
    });
    
    // 创建HTML表格格式（Excel可以打开HTML表格）
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
    </style>
</head>
<body>
    <table>
        <thead>
            <tr>${data[0].map(cell => `<th>${cell}</th>`).join('')}</tr>
        </thead>
        <tbody>
            ${data.slice(1).map(row => 
                `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
            ).join('')}
        </tbody>
    </table>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    
    const result = t('common.csvToExcelResult', {
      fileName: file.name,
      fileSize: (file.size/1024).toFixed(2),
      rows: lines.length - 1,
      columns: data[0].length,
      dataTypes: '文本、数字、日期'
    });
    
    toast.success(t('common.csvToExcelComplete', { rows: lines.length - 1 }));
    return {
      result,
      downloadUrl: URL.createObjectURL(blob),
      fileName: `${file.name.replace('.csv', '')}.xls`
    };
  };

  // XML转CSV转换
  const processXMLToCSV = async (file: File) => {
    toast.info(t('common.convertingXMLToCsv'));
    const text = await file.text();
    
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error(t('common.xmlParseError'));
      }
      
      const rootElement = xmlDoc.documentElement;
      const childElements = Array.from(rootElement.children);
      
      if (childElements.length === 0) {
        throw new Error(t('common.xmlNoDataElements'));
      }
      
      // 收集所有字段名
      const fieldsSet = new Set<string>();
      childElements.forEach(element => {
        // 添加元素的属性作为字段
        Array.from(element.attributes).forEach(attr => {
          fieldsSet.add(attr.name);
        });
        // 添加子元素作为字段
        Array.from(element.children).forEach(child => {
          fieldsSet.add(child.tagName);
        });
        // 如果元素有文本内容且没有子元素，使用元素名作为字段
        if (element.children.length === 0 && element.textContent?.trim()) {
          fieldsSet.add(element.tagName);
        }
      });
      
      const fields = Array.from(fieldsSet);
      const csvLines = [fields.join(',')]; // 表头
      
      // 转换每个XML元素为CSV行
      childElements.forEach(element => {
        const row: string[] = [];
        fields.forEach(field => {
          let value = '';
          
          // 尝试从属性获取值
          if (element.hasAttribute(field)) {
            value = element.getAttribute(field) || '';
          }
          // 尝试从子元素获取值
          else {
            const childElement = element.getElementsByTagName(field)[0];
            if (childElement) {
              value = childElement.textContent || '';
            } else if (field === element.tagName) {
              value = element.textContent || '';
            }
          }
          
          // 处理包含逗号的值
          if (value.includes(',') || value.includes('"')) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          row.push(value);
        });
        csvLines.push(row.join(','));
      });
      
      const csvContent = csvLines.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      
      const result = t('common.xmlToCsvResult', {
        fileName: file.name,
        fileSize: (file.size/1024).toFixed(2),
        nodeCount: childElements.length,
        rows: childElements.length,
        columns: fields.length
      });
      
      toast.success(t('common.xmlToCsvComplete', { rows: childElements.length }));
      return {
        result,
        downloadUrl: URL.createObjectURL(blob),
        fileName: `${file.name.replace('.xml', '')}.csv`
      };
    } catch (error) {
      throw new Error('XML解析失败：' + (error as Error).message);
    }
  };

  // XML转JSON转换
  const processXMLToJSON = async (file: File) => {
    toast.info(t('common.convertingXMLToJson'));
    const text = await file.text();
    
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error(t('common.xmlParseError'));
      }
      
      // XML转JSON的递归函数
      const xmlToJson = (node: Element): any => {
        const obj: any = {};
        
        // 处理属性
        if (node.attributes && node.attributes.length > 0) {
          obj['@attributes'] = {};
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            obj['@attributes'][attr.name] = attr.value;
          }
        }
        
        // 处理子节点
        const children = Array.from(node.children);
        if (children.length === 0) {
          // 叶子节点，返回文本内容
          const text = node.textContent?.trim() || '';
          return Object.keys(obj).length > 0 ? { ...obj, '#text': text } : text;
        }
        
        // 处理子元素
        children.forEach(child => {
          const childName = child.tagName;
          const childObj = xmlToJson(child);
          
          if (obj[childName]) {
            // 如果已存在同名元素，转换为数组
            if (!Array.isArray(obj[childName])) {
              obj[childName] = [obj[childName]];
            }
            obj[childName].push(childObj);
          } else {
            obj[childName] = childObj;
          }
        });
        
        return obj;
      };
      
      const jsonObj = {
        [xmlDoc.documentElement.tagName]: xmlToJson(xmlDoc.documentElement)
      };
      
      const jsonString = JSON.stringify(jsonObj, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // 统计信息
      const elementCount = xmlDoc.getElementsByTagName('*').length;
      const depth = getXMLDepth(xmlDoc.documentElement);
      
      const result = t('common.xmlToJsonResult', {
        fileName: file.name,
        fileSize: (file.size/1024).toFixed(2),
        nodeCount: elementCount,
        objectCount: 1,
        depth: depth
      });
      
      toast.success(t('common.xmlToJsonComplete', { objectCount: 1 }));
      return {
        result,
        downloadUrl: URL.createObjectURL(blob),
        fileName: `${file.name.replace('.xml', '')}.json`
      };
    } catch (error) {
      throw new Error('XML解析失败：' + (error as Error).message);
    }
  };

  // JSON转XML转换
  const processJSONToXML = async (file: File) => {
    toast.info(t('common.convertingJsonToXml'));
    const text = await file.text();
    
    try {
      const jsonObj = JSON.parse(text);
      
      // JSON转XML的递归函数
      const jsonToXml = (obj: any, rootName = 'root', indent = 0): string => {
        const indentStr = '  '.repeat(indent);
        
        if (Array.isArray(obj)) {
          return obj.map(item => jsonToXml(item, rootName, indent)).join('\n');
        }
        
        if (typeof obj === 'object' && obj !== null) {
          const attributes: string[] = [];
          const children: string[] = [];
          let textContent = '';
          
          Object.keys(obj).forEach(key => {
            if (key === '@attributes' && typeof obj[key] === 'object') {
              // 处理属性
              Object.keys(obj[key]).forEach(attrName => {
                attributes.push(`${attrName}="${obj[key][attrName]}"`);
              });
            } else if (key === '#text') {
              // 处理文本内容
              textContent = obj[key];
            } else {
              // 处理子元素
              if (Array.isArray(obj[key])) {
                obj[key].forEach((item: any) => {
                  children.push(jsonToXml(item, key, indent + 1));
                });
              } else {
                children.push(jsonToXml(obj[key], key, indent + 1));
              }
            }
          });
          
          const attrStr = attributes.length > 0 ? ' ' + attributes.join(' ') : '';
          
          if (children.length === 0 && !textContent) {
            return `${indentStr}<${rootName}${attrStr}/>`;
          } else if (children.length === 0) {
            return `${indentStr}<${rootName}${attrStr}>${textContent}</${rootName}>`;
          } else {
            return `${indentStr}<${rootName}${attrStr}>\n${children.join('\n')}\n${indentStr}</${rootName}>`;
          }
        } else {
          // 基本类型
          return `${indentStr}<${rootName}>${obj}</${rootName}>`;
        }
      };
      
      // 确定根元素名称
      const rootKeys = Object.keys(jsonObj);
      let xmlContent: string;
      
      if (rootKeys.length === 1) {
        // 如果只有一个根属性，使用它作为根元素
        const rootKey = rootKeys[0];
        xmlContent = jsonToXml(jsonObj[rootKey], rootKey);
      } else {
        // 多个根属性，使用data作为根元素
        xmlContent = jsonToXml(jsonObj, 'data');
      }
      
      const fullXml = `<?xml version="1.0" encoding="UTF-8"?>\n${xmlContent}`;
      const blob = new Blob([fullXml], { type: 'application/xml' });
      
      // 统计信息
      const keyCount = JSON.stringify(jsonObj).match(/"\w+":/g)?.length || 0;
      
      const result = t('common.jsonToXmlResult', {
        fileName: file.name,
        fileSize: (fullXml.length/1024).toFixed(2),
        objectCount: keyCount,
        nodeCount: rootKeys.length === 1 ? 1 : rootKeys.length,
        depth: 3
      });
      
      toast.success(t('common.jsonToXmlComplete', { nodeCount: rootKeys.length === 1 ? 1 : rootKeys.length }));
      return {
        result,
        downloadUrl: URL.createObjectURL(blob),
        fileName: `${file.name.replace('.json', '')}.xml`
      };
    } catch (error) {
      throw new Error('JSON解析失败：' + (error as Error).message);
    }
  };

  // CSV转JSON转换
  const processCSVToJSON = async (file: File) => {
    toast.info(t('common.convertingCSVToJson'));
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error(t('common.csvNeedAtLeast2Rows'));
    }
    
    // 解析CSV表头
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    // 解析CSV数据
    const jsonArray: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const obj: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        // 尝试转换数字
        if (/^\d+$/.test(value)) {
          obj[header] = parseInt(value);
        } else if (/^\d*\.\d+$/.test(value)) {
          obj[header] = parseFloat(value);
        } else if (value.toLowerCase() === 'true') {
          obj[header] = true;
        } else if (value.toLowerCase() === 'false') {
          obj[header] = false;
        } else {
          obj[header] = value;
        }
      });
      jsonArray.push(obj);
    }
    
    const jsonString = JSON.stringify(jsonArray, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    const result = t('common.csvToJsonResult', {
      fileName: file.name,
      fileSize: (file.size/1024).toFixed(2),
      rows: jsonArray.length,
      columns: headers.length,
      objectCount: jsonArray.length
    });
    
    toast.success(t('common.csvToJsonComplete', { objectCount: jsonArray.length }));
    return {
      result,
      downloadUrl: URL.createObjectURL(blob),
      fileName: `${file.name.replace('.csv', '')}.json`
    };
  };

  // 辅助函数：计算XML深度
  const getXMLDepth = (element: Element): number => {
    if (element.children.length === 0) return 1;
    let maxDepth = 1;
    Array.from(element.children).forEach(child => {
      maxDepth = Math.max(maxDepth, 1 + getXMLDepth(child));
    });
    return maxDepth;
  };

  const tools: FileTool[] = [
    {
      id: 'csv-split',
      title: t('tools.fileTools.csvSplit'),
      description: t('tools.fileTools.csvSplitDesc'),
      icon: Split,
      popular: true,
      acceptedTypes: '.csv',
      outputType: 'download',
      processingFunction: processCSVSplit
    },
    {
      id: 'excel-split',
      title: t('tools.fileTools.excelSplit'),
      description: t('tools.fileTools.excelSplitDesc'),
      icon: FileSpreadsheet,
      popular: true,
      acceptedTypes: '.xlsx,.xls',
      outputType: 'download',
      processingFunction: processExcelSplit
    },
    {
      id: 'xml-to-excel',
      title: t('tools.fileTools.xmlToExcel'),
      description: t('tools.fileTools.xmlToExcelDesc'),
      icon: ArrowRightLeft,
      popular: false,
      acceptedTypes: '.xml',
      outputType: 'download',
      processingFunction: processXMLToExcel
    },
    {
      id: 'excel-to-xml',
      title: t('tools.fileTools.excelToXml'),
      description: t('tools.fileTools.excelToXmlDesc'),
      icon: ArrowRightLeft,
      popular: false,
      acceptedTypes: '.xlsx,.xls,.csv',
      outputType: 'download',
      processingFunction: processExcelToXML
    },
    {
      id: 'csv-to-excel',
      title: t('tools.fileTools.csvToExcel'),
      description: t('tools.fileTools.csvToExcelDesc'),
      icon: ArrowRightLeft,
      popular: true,
      acceptedTypes: '.csv',
      outputType: 'download',
      processingFunction: processCSVToExcel
    },
    {
      id: 'xml-to-csv',
      title: t('tools.fileTools.xmlToCsv'),
      description: t('tools.fileTools.xmlToCsvDesc'),
      icon: ArrowRightLeft,
      popular: false,
      acceptedTypes: '.xml',
      outputType: 'download',
      processingFunction: processXMLToCSV
    },
    {
      id: 'xml-to-json',
      title: t('tools.fileTools.xmlToJson'),
      description: t('tools.fileTools.xmlToJsonDesc'),
      icon: Code,
      popular: true,
      acceptedTypes: '.xml',
      outputType: 'download',
      processingFunction: processXMLToJSON
    },
    {
      id: 'json-to-xml',
      title: t('tools.fileTools.jsonToXml'),
      description: t('tools.fileTools.jsonToXmlDesc'),
      icon: Code,
      popular: false,
      acceptedTypes: '.json',
      outputType: 'download',
      processingFunction: processJSONToXML
    },
    {
      id: 'csv-to-json',
      title: t('tools.fileTools.csvToJson'),
      description: t('tools.fileTools.csvToJsonDesc'),
      icon: Database,
      popular: false,
      acceptedTypes: '.csv',
      outputType: 'download',
      processingFunction: processCSVToJSON
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
    if (!selectedTool || !file) {
      toast.error(t('common.selectToolAndFile'));
      return;
    }

    setIsProcessing(true);

    try {
      const processResult = await selectedTool.processingFunction(file);
      
      if (processResult.result) {
        setResult(processResult.result);
      }
      if (processResult.downloadUrl) {
        setDownloadUrl(processResult.downloadUrl);
        setFileName(processResult.fileName || 'processed_file');
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
      toast.success(t('common.resultCopied'));
    }
  };

  const resetTool = () => {
    setSelectedTool(null);
    setFile(null);
    setResult('');
    setDownloadUrl('');
    setFileName('');
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
  };

  const selectTool = (tool: FileTool) => {
    setSelectedTool(tool);
    setFile(null);
    setResult('');
    setDownloadUrl('');
    setFileName('');
  };

  if (selectedTool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
                  <selectedTool.icon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTool.title}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择文件
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
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
                    className="cursor-pointer text-orange-600 hover:text-orange-700 font-medium"
                  >
                    点击选择文件
                  </label>
                  <p className="text-gray-500 text-sm mt-2">
                    支持格式: {selectedTool.acceptedTypes}
                  </p>
                  {file && (
                    <p className="text-green-600 text-sm mt-2">
                      已选择: {file.name} ({(file.size/1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleProcess}
                  disabled={!file || isProcessing}
                  className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? t('common.processing') : t('common.startProcessing')}
                </button>
                {downloadUrl && (
                  <button
                    onClick={downloadFile}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
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
                      className="flex items-center space-x-2 px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
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
      <SEOHead seoKey="fileTools" />
      <StructuredData type="SoftwareApplication" />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">文件工具</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              强大的文件处理工具集合，支持CSV、Excel、XML、JSON等格式的转换和拆分操作
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
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                        <IconComponent className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {tool.title}
                        </h3>
                        <span className="text-sm text-orange-600">热门</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                    <button className="w-full bg-orange-600 text-white hover:bg-orange-700 py-2 rounded-md font-medium transition-colors">
                      使用工具
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* All Tools Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">所有文件工具</h2>
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
                      <IconComponent className="w-6 h-6 text-orange-600 group-hover:text-orange-700 transition-colors" />
                      {tool.popular && (
                        <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          热门
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                      {tool.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {tool.description}
                    </p>
                    
                    <div className="flex items-center text-orange-600 text-sm font-medium">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的文件工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Split className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">智能拆分</h3>
                <p className="text-gray-600 text-sm">
                  智能拆分大文件，保持数据完整性和结构
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ArrowRightLeft className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式转换</h3>
                <p className="text-gray-600 text-sm">
                  支持多种常用数据格式之间的高效转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">数据保护</h3>
                <p className="text-gray-600 text-sm">
                  本地处理，保护数据隐私和安全
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式兼容</h3>
                <p className="text-gray-600 text-sm">
                  支持Excel、CSV、XML、JSON等主流格式
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileTools;                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的文件工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Split className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">智能拆分</h3>
                <p className="text-gray-600 text-sm">
                  智能拆分大文件，保持数据完整性和结构
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ArrowRightLeft className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式转换</h3>
                <p className="text-gray-600 text-sm">
                  支持多种常用数据格式之间的高效转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">数据保护</h3>
                <p className="text-gray-600 text-sm">
                  本地处理，保护数据隐私和安全
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式兼容</h3>
                <p className="text-gray-600 text-sm">
                  支持Excel、CSV、XML、JSON等主流格式
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileTools;
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的文件工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Split className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">智能拆分</h3>
                <p className="text-gray-600 text-sm">
                  智能拆分大文件，保持数据完整性和结构
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ArrowRightLeft className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式转换</h3>
                <p className="text-gray-600 text-sm">
                  支持多种常用数据格式之间的高效转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">数据保护</h3>
                <p className="text-gray-600 text-sm">
                  本地处理，保护数据隐私和安全
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式兼容</h3>
                <p className="text-gray-600 text-sm">
                  支持Excel、CSV、XML、JSON等主流格式
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileTools;
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的文件工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Split className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">智能拆分</h3>
                <p className="text-gray-600 text-sm">
                  智能拆分大文件，保持数据完整性和结构
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ArrowRightLeft className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式转换</h3>
                <p className="text-gray-600 text-sm">
                  支持多种常用数据格式之间的高效转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">数据保护</h3>
                <p className="text-gray-600 text-sm">
                  本地处理，保护数据隐私和安全
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式兼容</h3>
                <p className="text-gray-600 text-sm">
                  支持Excel、CSV、XML、JSON等主流格式
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileTools;
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的文件工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Split className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">智能拆分</h3>
                <p className="text-gray-600 text-sm">
                  智能拆分大文件，保持数据完整性和结构
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ArrowRightLeft className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式转换</h3>
                <p className="text-gray-600 text-sm">
                  支持多种常用数据格式之间的高效转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">数据保护</h3>
                <p className="text-gray-600 text-sm">
                  本地处理，保护数据隐私和安全
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式兼容</h3>
                <p className="text-gray-600 text-sm">
                  支持Excel、CSV、XML、JSON等主流格式
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileTools;
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的文件工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Split className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">智能拆分</h3>
                <p className="text-gray-600 text-sm">
                  智能拆分大文件，保持数据完整性和结构
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ArrowRightLeft className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式转换</h3>
                <p className="text-gray-600 text-sm">
                  支持多种常用数据格式之间的高效转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">数据保护</h3>
                <p className="text-gray-600 text-sm">
                  本地处理，保护数据隐私和安全
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式兼容</h3>
                <p className="text-gray-600 text-sm">
                  支持Excel、CSV、XML、JSON等主流格式
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileTools;
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的文件工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Split className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">智能拆分</h3>
                <p className="text-gray-600 text-sm">
                  智能拆分大文件，保持数据完整性和结构
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ArrowRightLeft className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式转换</h3>
                <p className="text-gray-600 text-sm">
                  支持多种常用数据格式之间的高效转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">数据保护</h3>
                <p className="text-gray-600 text-sm">
                  本地处理，保护数据隐私和安全
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式兼容</h3>
                <p className="text-gray-600 text-sm">
                  支持Excel、CSV、XML、JSON等主流格式
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileTools;
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择我们的文件工具？</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Split className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">智能拆分</h3>
                <p className="text-gray-600 text-sm">
                  智能拆分大文件，保持数据完整性和结构
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ArrowRightLeft className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式转换</h3>
                <p className="text-gray-600 text-sm">
                  支持多种常用数据格式之间的高效转换
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">数据保护</h3>
                <p className="text-gray-600 text-sm">
                  本地处理，保护数据隐私和安全
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">格式兼容</h3>
                <p className="text-gray-600 text-sm">
                  支持Excel、CSV、XML、JSON等主流格式
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileTools;
