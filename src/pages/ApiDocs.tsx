import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, Copy, CheckCircle, Book, Zap, Shield, Globe } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';

const ApiDocs: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock: React.FC<{ code: string; language: string; id: string }> = ({ code, language, id }) => (
    <div className="relative">
      <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2 rounded-t-lg">
        <span className="text-sm font-medium">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center text-sm text-gray-300 hover:text-white transition-colors"
        >
          {copiedCode === id ? (
            <CheckCircle className="w-4 h-4 mr-1" />
          ) : (
            <Copy className="w-4 h-4 mr-1" />
          )}
          {copiedCode === id ? '已复制' : '复制'}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );

  const endpoints = [
    {
      method: 'POST',
      path: '/api/pdf/convert',
      description: 'PDF格式转换',
      params: [
        { name: 'file', type: 'File', required: true, description: '要转换的PDF文件' },
        { name: 'format', type: 'string', required: true, description: '目标格式 (word, excel, ppt, image)' },
        { name: 'quality', type: 'string', required: false, description: '输出质量 (low, medium, high)' }
      ]
    },
    {
      method: 'POST',
      path: '/api/image/compress',
      description: '图像压缩',
      params: [
        { name: 'file', type: 'File', required: true, description: '要压缩的图像文件' },
        { name: 'quality', type: 'number', required: false, description: '压缩质量 (1-100)' },
        { name: 'maxWidth', type: 'number', required: false, description: '最大宽度' },
        { name: 'maxHeight', type: 'number', required: false, description: '最大高度' }
      ]
    },
    {
      method: 'POST',
      path: '/api/video/compress',
      description: '视频压缩',
      params: [
        { name: 'file', type: 'File', required: true, description: '要压缩的视频文件' },
        { name: 'quality', type: 'string', required: false, description: '压缩质量 (low, medium, high)' },
        { name: 'resolution', type: 'string', required: false, description: '分辨率 (480p, 720p, 1080p)' }
      ]
    },
    {
      method: 'POST',
      path: '/api/ocr/extract',
      description: 'OCR文字识别',
      params: [
        { name: 'file', type: 'File', required: true, description: '要识别的图像或PDF文件' },
        { name: 'language', type: 'string', required: false, description: '识别语言 (zh, en, auto)' },
        { name: 'format', type: 'string', required: false, description: '输出格式 (text, json)' }
      ]
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "TinyWow API 文档",
    "description": "集成我们的API到您的应用程序中，享受强大的文件处理能力",
    "author": {
      "@type": "Organization",
      "name": "TinyWow"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TinyWow"
    },
    "datePublished": "2024-01-01",
    "dateModified": "2024-01-01",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "TinyWow API",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "description": "强大的文件处理API服务",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead seoKey="apiDocs" />
      <StructuredData data={structuredData} />
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Code className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            API 文档
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            集成我们的API到您的应用程序中，享受强大的文件处理能力
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">高性能</h3>
            <p className="text-sm text-gray-600">快速处理，低延迟响应</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">安全可靠</h3>
            <p className="text-sm text-gray-600">SSL加密，数据安全</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">全球可用</h3>
            <p className="text-sm text-gray-600">CDN加速，全球访问</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Book className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">易于集成</h3>
            <p className="text-sm text-gray-600">RESTful API，简单易用</p>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            快速开始
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1. 获取API密钥</h3>
              <p className="text-gray-600 mb-4">
                目前我们的API处于公测阶段，暂时无需API密钥。正式版本将提供API密钥管理功能。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2. 基础URL</h3>
              <CodeBlock
                code="https://api.tinywow.com"
                language="URL"
                id="base-url"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">3. 发送请求</h3>
              <p className="text-gray-600 mb-4">
                所有API请求都使用POST方法，并使用multipart/form-data格式上传文件。
              </p>
              <CodeBlock
                code={`curl -X POST \\
  https://api.tinywow.com/api/pdf/convert \\
  -F "file=@document.pdf" \\
  -F "format=word"`}
                language="cURL"
                id="curl-example"
              />
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            API 端点
          </h2>
          
          <div className="space-y-8">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <span className={`px-3 py-1 rounded text-sm font-medium mr-3 ${
                    endpoint.method === 'POST' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-lg font-mono text-gray-900">{endpoint.path}</code>
                </div>
                
                <p className="text-gray-600 mb-4">{endpoint.description}</p>
                
                <h4 className="font-semibold text-gray-900 mb-3">参数</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-medium text-gray-900">参数名</th>
                        <th className="text-left py-2 font-medium text-gray-900">类型</th>
                        <th className="text-left py-2 font-medium text-gray-900">必需</th>
                        <th className="text-left py-2 font-medium text-gray-900">说明</th>
                      </tr>
                    </thead>
                    <tbody>
                      {endpoint.params.map((param, paramIndex) => (
                        <tr key={paramIndex} className="border-b border-gray-100">
                          <td className="py-2 font-mono text-blue-600">{param.name}</td>
                          <td className="py-2 text-gray-600">{param.type}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              param.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {param.required ? '必需' : '可选'}
                            </span>
                          </td>
                          <td className="py-2 text-gray-600">{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Response Format */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            响应格式
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">成功响应</h3>
              <CodeBlock
                code={`{
  "success": true,
  "data": {
    "downloadUrl": "https://api.tinywow.com/download/abc123",
    "filename": "converted_document.docx",
    "fileSize": 1024000,
    "expiresAt": "2024-01-01T12:00:00Z"
  },
  "message": "处理成功"
}`}
                language="JSON"
                id="success-response"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">错误响应</h3>
              <CodeBlock
                code={`{
  "success": false,
  "error": {
    "code": "INVALID_FILE_FORMAT",
    "message": "不支持的文件格式"
  }
}`}
                language="JSON"
                id="error-response"
              />
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            代码示例
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">JavaScript (Node.js)</h3>
              <CodeBlock
                code={`const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

const form = new FormData();
form.append('file', fs.createReadStream('document.pdf'));
form.append('format', 'word');

axios.post('https://api.tinywow.com/api/pdf/convert', form, {
  headers: {
    ...form.getHeaders()
  }
})
.then(response => {
  console.log('转换成功:', response.data);
  // 下载文件
  const downloadUrl = response.data.data.downloadUrl;
  // 处理下载逻辑
})
.catch(error => {
  console.error('转换失败:', error.response.data);
});`}
                language="JavaScript"
                id="js-example"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Python</h3>
              <CodeBlock
                code={`import requests

url = 'https://api.tinywow.com/api/pdf/convert'
files = {'file': open('document.pdf', 'rb')}
data = {'format': 'word'}

response = requests.post(url, files=files, data=data)

if response.status_code == 200:
    result = response.json()
    if result['success']:
        download_url = result['data']['downloadUrl']
        print(f'转换成功，下载链接: {download_url}')
    else:
        print(f'转换失败: {result["error"]["message"]}')
else:
    print(f'请求失败: {response.status_code}')`}
                language="Python"
                id="python-example"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">PHP</h3>
              <CodeBlock
                code={`<?php
$url = 'https://api.tinywow.com/api/pdf/convert';
$file = new CURLFile('document.pdf', 'application/pdf', 'document.pdf');

$data = [
    'file' => $file,
    'format' => 'word'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode == 200) {
    $result = json_decode($response, true);
    if ($result['success']) {
        echo '转换成功，下载链接: ' . $result['data']['downloadUrl'];
    } else {
        echo '转换失败: ' . $result['error']['message'];
    }
} else {
    echo '请求失败: ' . $httpCode;
}
?>`}
                language="PHP"
                id="php-example"
              />
            </div>
          </div>
        </div>

        {/* Rate Limits */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            使用限制
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">请求限制</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 每分钟最多60次请求</li>
                <li>• 每小时最多1000次请求</li>
                <li>• 每天最多10000次请求</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">文件限制</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 单文件最大100MB</li>
                <li>• 支持常见文件格式</li>
                <li>• 处理结果保存1小时</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error Codes */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            错误代码
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-medium text-gray-900">错误代码</th>
                  <th className="text-left py-3 font-medium text-gray-900">HTTP状态码</th>
                  <th className="text-left py-3 font-medium text-gray-900">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 font-mono text-red-600">INVALID_FILE_FORMAT</td>
                  <td className="py-3">400</td>
                  <td className="py-3 text-gray-600">不支持的文件格式</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 font-mono text-red-600">FILE_TOO_LARGE</td>
                  <td className="py-3">413</td>
                  <td className="py-3 text-gray-600">文件大小超过限制</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 font-mono text-red-600">PROCESSING_FAILED</td>
                  <td className="py-3">500</td>
                  <td className="py-3 text-gray-600">文件处理失败</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 font-mono text-red-600">RATE_LIMIT_EXCEEDED</td>
                  <td className="py-3">429</td>
                  <td className="py-3 text-gray-600">请求频率超过限制</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Support */}
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            需要帮助？
          </h2>
          <p className="text-gray-600 mb-6">
            如果您在集成API时遇到问题，请联系我们的技术支持团队。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              联系技术支持
            </Link>
            <Link
              to="/help"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              查看帮助文档
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;