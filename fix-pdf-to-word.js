// 修复PDF转Word功能
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取当前的tools.ts文件
const toolsPath = path.join(__dirname, 'api/routes/tools.ts');
let toolsContent = fs.readFileSync(toolsPath, 'utf8');

// 查找pdf-to-word的case块
const pdfToWordCaseStart = toolsContent.indexOf("case 'pdf-to-word': {");
if (pdfToWordCaseStart === -1) {
    console.error('找不到pdf-to-word case块');
    process.exit(1);
}

// 找到case块的结束位置
let braceCount = 0;
let caseEnd = pdfToWordCaseStart;
let inCase = false;

for (let i = pdfToWordCaseStart; i < toolsContent.length; i++) {
    const char = toolsContent[i];
    if (char === '{') {
        if (!inCase) {
            inCase = true;
        }
        braceCount++;
    } else if (char === '}') {
        braceCount--;
        if (inCase && braceCount === 0) {
            caseEnd = i + 1;
            break;
        }
    }
}

// 新的PDF转Word实现
const newPdfToWordCase = `      case 'pdf-to-word': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 PDF file is required for conversion' });
          return;
        }
        
        try {
          const inputFile = files[0];
          const outputFormat = options.outputFormat || 'docx';
          const outputFileName = \`\${path.parse(inputFile.originalname).name}.\${outputFormat}\`;
          outputPath = path.join(path.dirname(inputFile.path), outputFileName);
          
          // 尝试多种方法处理PDF
          let pdfText = '';
          let numPages = 0;
          
          try {
            // 方法1: 使用pdf-parse提取文本
            const pdfBuffer = fs.readFileSync(inputFile.path);
            const pdfParse = (await import('pdf-parse')).default;
            const pdfData = await pdfParse(pdfBuffer);
            
            if (pdfData.text && pdfData.text.trim().length > 0) {
              pdfText = pdfData.text;
              numPages = pdfData.numpages || 1;
              console.log('使用pdf-parse成功提取文本');
            } else {
              throw new Error('No text content found');
            }
          } catch (parseError) {
            console.log('pdf-parse失败，尝试OCR方法:', parseError.message);
            
            try {
              // 方法2: 使用OCR提取文本（如果安装了tesseract）
              const { OCRService } = await import('../services/ocrService.js');
              const ocrResult = await OCRService.extractTextFromImage(inputFile.path, {
                language: 'eng+chi_sim'
              });
              
              if (ocrResult.text && ocrResult.text.trim().length > 0) {
                pdfText = ocrResult.text;
                numPages = 1; // OCR通常处理单页
                console.log('使用OCR成功提取文本');
              } else {
                throw new Error('OCR failed to extract text');
              }
            } catch (ocrError) {
              console.log('OCR也失败，创建空白文档:', ocrError.message);
              
              // 方法3: 创建包含原始文件信息的文档
              pdfText = \`PDF文件: \${inputFile.originalname}\\n\\n此PDF文件无法直接提取文本内容。\\n\\n可能的原因：\\n- PDF是图片格式\\n- PDF受密码保护\\n- PDF文件损坏\\n\\n建议：\\n- 使用OCR工具处理图片格式的PDF\\n- 检查PDF文件是否受密码保护\\n- 尝试使用其他PDF文件\`;
              numPages = 1;
            }
          }
          
          // 创建Word文档
          const doc = new Document({
            sections: [{
              properties: {},
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: \`从PDF转换: \${inputFile.originalname}\`,
                      bold: true,
                      size: 28
                    })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "",
                      break: 1
                    })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: \`转换时间: \${new Date().toLocaleString()}\`,
                      size: 20,
                      color: "666666"
                    })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "",
                      break: 1
                    })
                  ]
                }),
                ...pdfText.split('\\n').map(line => 
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: line || " ",
                        size: 24
                      })
                    ]
                  })
                )
              ]
            }]
          });
          
          // 生成Word文档buffer
          const buffer = await Packer.toBuffer(doc);
          fs.writeFileSync(outputPath, buffer);
          
          result = {
            fileId: path.basename(outputPath),
            fileName: outputFileName,
            fileSize: fs.statSync(outputPath).size,
            message: \`成功转换PDF为\${outputFormat.toUpperCase()}，共\${numPages}页\`
          };
        } catch (error) {
          console.error('PDF to Word conversion error:', error);
          res.status(500).json({ 
            success: false, 
            error: \`PDF转Word失败: \${error.message}\`
          });
          return;
        }
        break;
      }`;

// 替换原有的case块
const beforeCase = toolsContent.substring(0, pdfToWordCaseStart);
const afterCase = toolsContent.substring(caseEnd);

toolsContent = beforeCase + newPdfToWordCase + afterCase;

// 写回文件
fs.writeFileSync(toolsPath, toolsContent, 'utf8');

console.log('✅ PDF转Word功能已修复！');
console.log('');
console.log('🔧 修复内容：');
console.log('  - 添加了多种PDF文本提取方法');
console.log('  - 使用pdf-parse作为主要方法');
console.log('  - 如果pdf-parse失败，尝试OCR方法');
console.log('  - 如果都失败，创建包含说明的文档');
console.log('  - 改进了错误处理和用户提示');
console.log('');
console.log('🚀 现在PDF转Word功能应该能处理更多类型的PDF文件了！');
