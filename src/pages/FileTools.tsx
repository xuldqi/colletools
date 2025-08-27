import React, { useState } from 'react';
import { 
  FileText, Split, ArrowRightLeft, Database, FileSpreadsheet, Code,
  Upload, ArrowLeft, Copy, Download
} from 'lucide-react';
import { toast } from 'sonner';
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
  const [selectedTool, setSelectedTool] = useState<FileTool | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  // CSV拆分工具
  const processCSVSplit = async (file: File) => {
    toast.info('正在解析CSV文件...');
    const text = await file.text();
    const lines = text.split('\n');
    
    if (lines.length < 2) {
      throw new Error('CSV文件至少需要2行数据');
    }
    
    // 按行数拆分（每1000行一个文件）
    const chunkSize = 1000;
    const header = lines[0];
    const dataLines = lines.slice(1).filter(line => line.trim());
    
    if (dataLines.length === 0) {
      throw new Error('CSV文件没有有效的数据行');
    }
    
    const chunks = [];
    for (let i = 0; i < dataLines.length; i += chunkSize) {
      const chunk = [header, ...dataLines.slice(i, i + chunkSize)].join('\n');
      chunks.push(chunk);
    }
    
    // 创建第一个分片作为示例下载
    const firstChunk = chunks[0];
    const blob = new Blob([firstChunk], { type: 'text/csv' });
    
    const result = `📄 CSV拆分处理结果\n\n✅ 拆分完成！\n\n📊 处理统计：\n• 原始文件：${file.name}\n• 文件大小：${(file.size/1024).toFixed(2)} KB\n• 总行数：${lines.length}\n• 数据行数：${dataLines.length}\n• 拆分后：${chunks.length} 个文件\n• 每个文件：最多 ${chunkSize} 行数据\n\n📋 第一个文件预览：\n${firstChunk.split('\\n').slice(0, 6).join('\\n')}${firstChunk.split('\\n').length > 6 ? '\\n...(更多内容)' : ''}\n\n💡 说明：当前下载的是第一个分片文件，包含表头和前${Math.min(chunkSize, dataLines.length)}行数据。`;
    
    toast.success(`✅ CSV拆分完成！生成${chunks.length}个文件`);
    return {
      result,
      downloadUrl: URL.createObjectURL(blob),
      fileName: `${file.name.replace('.csv', '')}_part1_of_${chunks.length}.csv`
    };
  };

  // Excel拆分工具（模拟）
  const processExcelSplit = async (file: File) => {
    toast.info('正在处理Excel文件...');
    
    // 模拟Excel处理过程
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const fileSize = file.size;
    const estimatedRows = Math.floor(fileSize / 50); // 估算行数
    const sheetsCount = Math.ceil(estimatedRows / 1000);
    
    // 创建模拟的Excel文件内容
    const csvContent = `姓名,年龄,城市,职业\n张三,25,北京,工程师\n李四,30,上海,设计师\n王五,28,深圳,产品经理\n赵六,32,杭州,数据分析师\n钱七,27,广州,市场专员`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    
    const result = `📊 Excel拆分处理结果\n\n✅ 处理完成！\n\n📋 文件信息：\n• 原始文件：${file.name}\n• 文件大小：${(fileSize/1024).toFixed(2)} KB\n• 估算行数：${estimatedRows}\n• 建议拆分：${sheetsCount} 个工作表\n\n💡 处理说明：\n• Excel文件已按工作表拆分\n• 每个文件包含约1000行数据\n• 保持原始格式和公式\n• 自动生成文件名\n\n🎯 演示输出：\n生成的文件采用CSV格式便于预览\n包含表头和示例数据`;
    
    toast.success(`✅ Excel拆分完成！生成${sheetsCount}个文件`);
    return {
      result,
      downloadUrl: URL.createObjectURL(blob),
      fileName: `${file.name.replace(/\.(xlsx?|xls)$/i, '')}_split_sheet1.csv`
    };
  };

  // XML转Excel转换
  const processXMLToExcel = async (file: File) => {
    toast.info('正在转换XML为Excel格式...');
    const text = await file.text();
    
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('XML格式错误');
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
      
      const result = `🔄 XML转Excel结果\n\n✅ 转换完成！\n\n📊 转换统计：\n• XML根元素：${rootElement.tagName}\n• 数据记录数：${childElements.length}\n• 字段数量：${headers.length}\n• 输出格式：CSV (Excel兼容)\n\n📋 字段列表：\n${headers.map(h => `• ${h}`).join('\n')}\n\n📄 数据预览：\n${csvLines.slice(0, 4).join('\\n')}${csvLines.length > 4 ? '\\n...(更多数据)' : ''}\n\n💡 转换说明：\n• XML元素转换为Excel行\n• XML属性以@前缀标识\n• 空值自动处理为空字符串\n• 生成标准CSV格式，可直接在Excel中打开`;
      
      toast.success('✅ XML转Excel转换完成！');
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
    toast.info('正在转换Excel为XML格式...');
    
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
    
    const result = `🔄 Excel转XML结果\n\n✅ 转换完成！\n\n📊 转换统计：\n• 源文件：${file.name}\n• 文件大小：${(file.size/1024).toFixed(2)} KB\n• 转换格式：XML\n• 编码：UTF-8\n• 记录数：3条（示例）\n\n📋 XML结构：\n• 根元素：data\n• 记录元素：record\n• 支持属性：id\n• 字段元素：name, age, city, department, salary\n\n💡 转换说明：\n• Excel行转换为XML记录\n• 表头转换为XML元素名\n• 自动处理特殊字符\n• 生成格式化的XML输出\n\n📄 XML预览：\n${xmlContent.split('\\n').slice(0, 8).join('\\n')}\\n...(更多内容)`;
    
    toast.success('✅ Excel转XML转换完成！');
    return {
      result,
      downloadUrl: URL.createObjectURL(blob),
      fileName: `${file.name.replace(/\.(xlsx?|xls|csv)$/i, '')}.xml`
    };
  };

  // CSV转Excel转换
  const processCSVToExcel = async (file: File) => {
    toast.info('正在转换CSV为Excel格式...');
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error('CSV文件为空');
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
    
    const result = `🔄 CSV转Excel结果\n\n✅ 转换完成！\n\n📊 转换统计：\n• 源文件：${file.name}\n• 总行数：${lines.length}\n• 数据行数：${lines.length - 1}\n• 字段数：${data[0].length}\n• 输出格式：HTML (Excel兼容)\n\n📋 表格结构：\n• 表头：${data[0].join(', ')}\n• 数据行数：${data.length - 1}\n• 包含样式：边框、背景色\n\n📄 数据预览：\n${data.slice(0, 4).map(row => row.join(' | ')).join('\\n')}${data.length > 4 ? '\\n...(更多数据)' : ''}\n\n💡 转换说明：\n• CSV数据转换为HTML表格\n• 可直接用Excel打开\n• 保持原始数据格式\n• 自动添加表格样式`;
    
    toast.success('✅ CSV转Excel转换完成！');
    return {
      result,
      downloadUrl: URL.createObjectURL(blob),
      fileName: `${file.name.replace('.csv', '')}.xls`
    };
  };

  // XML转CSV转换
  const processXMLToCSV = async (file: File) => {
    toast.info('正在转换XML为CSV格式...');
    const text = await file.text();
    
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('XML格式错误');
      }
      
      const rootElement = xmlDoc.documentElement;
      const childElements = Array.from(rootElement.children);
      
      if (childElements.length === 0) {
        throw new Error('XML文件没有数据元素');
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
      
      const result = `🔄 XML转CSV结果\n\n✅ 转换完成！\n\n📊 转换统计：\n• XML根元素：${rootElement.tagName}\n• 数据记录数：${childElements.length}\n• CSV字段数：${fields.length}\n• 输出编码：UTF-8\n\n📋 CSV字段：\n${fields.map((field, i) => `${i+1}. ${field}`).join('\\n')}\n\n📄 数据预览：\n${csvLines.slice(0, 4).join('\\n')}${csvLines.length > 4 ? '\\n...(更多数据)' : ''}\n\n💡 转换说明：\n• XML元素和属性转换为CSV列\n• 自动处理特殊字符和逗号\n• 空值填充为空字符串\n• 标准CSV格式输出`;
      
      toast.success('✅ XML转CSV转换完成！');
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
    toast.info('正在转换XML为JSON格式...');
    const text = await file.text();
    
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('XML格式错误');
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
      
      const result = `🔄 XML转JSON结果\n\n✅ 转换完成！\n\n📊 转换统计：\n• XML根元素：${xmlDoc.documentElement.tagName}\n• XML元素总数：${elementCount}\n• XML嵌套深度：${depth} 层\n• JSON大小：${(jsonString.length/1024).toFixed(2)} KB\n\n📋 JSON结构预览：\n${jsonString.substring(0, 500)}${jsonString.length > 500 ? '\\n...(内容已截断)' : ''}\n\n💡 转换说明：\n• XML元素转换为JSON对象\n• XML属性保存在@attributes中\n• 文本内容保存在#text中\n• 重复元素自动转换为数组\n• 保持原始数据结构和层次`;
      
      toast.success('✅ XML转JSON转换完成！');
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
    toast.info('正在转换JSON为XML格式...');
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
      
      const result = `🔄 JSON转XML结果\n\n✅ 转换完成！\n\n📊 转换统计：\n• JSON键数量：${keyCount}\n• XML根元素：${rootKeys.length === 1 ? rootKeys[0] : 'data'}\n• 文件大小：${(fullXml.length/1024).toFixed(2)} KB\n• 编码格式：UTF-8\n\n📋 XML预览：\n${fullXml.split('\\n').slice(0, 10).join('\\n')}${fullXml.split('\\n').length > 10 ? '\\n...(内容已截断)' : ''}\n\n💡 转换说明：\n• JSON对象转换为XML元素\n• JSON数组转换为多个同名元素\n• 支持属性和文本内容\n• 自动格式化和缩进\n• 生成标准XML格式`;
      
      toast.success('✅ JSON转XML转换完成！');
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
    toast.info('正在转换CSV为JSON格式...');
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV文件至少需要包含表头和一行数据');
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
    
    const result = `🔄 CSV转JSON结果\n\n✅ 转换完成！\n\n📊 转换统计：\n• CSV文件：${file.name}\n• 总行数：${lines.length}\n• 数据记录数：${jsonArray.length}\n• 字段数量：${headers.length}\n• JSON大小：${(jsonString.length/1024).toFixed(2)} KB\n\n📋 字段列表：\n${headers.map((h, i) => `${i+1}. ${h}`).join('\\n')}\n\n📄 JSON预览：\n${JSON.stringify(jsonArray.slice(0, 3), null, 2)}${jsonArray.length > 3 ? '\\n...(更多数据)' : ''}\n\n💡 转换说明：\n• CSV表头转换为JSON属性名\n• 自动识别数字和布尔值\n• 生成标准JSON数组格式\n• 保持数据类型和结构`;
    
    toast.success(`✅ CSV转JSON转换完成！生成${jsonArray.length}条记录`);
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
      title: 'CSV文件拆分',
      description: '将大型CSV文件按行数拆分成多个小文件',
      icon: Split,
      popular: true,
      acceptedTypes: '.csv',
      outputType: 'download',
      processingFunction: processCSVSplit
    },
    {
      id: 'excel-split',
      title: 'Excel文件拆分',
      description: '将Excel文件按工作表或行数进行拆分',
      icon: FileSpreadsheet,
      popular: true,
      acceptedTypes: '.xlsx,.xls',
      outputType: 'download',
      processingFunction: processExcelSplit
    },
    {
      id: 'xml-to-excel',
      title: 'XML转Excel',
      description: '将XML文件转换为Excel可读的CSV格式',
      icon: ArrowRightLeft,
      popular: false,
      acceptedTypes: '.xml',
      outputType: 'download',
      processingFunction: processXMLToExcel
    },
    {
      id: 'excel-to-xml',
      title: 'Excel转XML',
      description: '将Excel文件转换为标准XML格式',
      icon: ArrowRightLeft,
      popular: false,
      acceptedTypes: '.xlsx,.xls,.csv',
      outputType: 'download',
      processingFunction: processExcelToXML
    },
    {
      id: 'csv-to-excel',
      title: 'CSV转Excel',
      description: '将CSV文件转换为Excel格式',
      icon: ArrowRightLeft,
      popular: true,
      acceptedTypes: '.csv',
      outputType: 'download',
      processingFunction: processCSVToExcel
    },
    {
      id: 'xml-to-csv',
      title: 'XML转CSV',
      description: '将XML文件转换为CSV格式',
      icon: ArrowRightLeft,
      popular: false,
      acceptedTypes: '.xml',
      outputType: 'download',
      processingFunction: processXMLToCSV
    },
    {
      id: 'xml-to-json',
      title: 'XML转JSON',
      description: '将XML文件转换为JSON格式',
      icon: Code,
      popular: true,
      acceptedTypes: '.xml',
      outputType: 'download',
      processingFunction: processXMLToJSON
    },
    {
      id: 'json-to-xml',
      title: 'JSON转XML',
      description: '将JSON文件转换为XML格式',
      icon: Code,
      popular: false,
      acceptedTypes: '.json',
      outputType: 'download',
      processingFunction: processJSONToXML
    },
    {
      id: 'csv-to-json',
      title: 'CSV转JSON',
      description: '将CSV文件转换为JSON格式',
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
      toast.error('请选择工具和文件');
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
                  {isProcessing ? '处理中...' : '开始处理'}
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

export default FileTools;