// 简单修复PDF转Word功能
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取当前的tools.ts文件
const toolsPath = path.join(__dirname, 'api/routes/tools.ts');
let toolsContent = fs.readFileSync(toolsPath, 'utf8');

// 查找并替换pdf-to-word的case块
const oldCasePattern = /case 'pdf-to-word': \{[\s\S]*?break;\s*\}/;

const newCaseContent = `      case 'pdf-to-word': {
        if (!files || files.length !== 1) {
          res.status(400).json({ success: false, error: 'Exactly 1 PDF file is required for conversion' });
          return;
        }
        
        try {
          const inputFile = files[0];
          const outputFormat = options.outputFormat || 'docx';
          const outputFileName = \`\${path.parse(inputFile.originalname).name}.\${outputFormat}\`;
          outputPath = path.join(path.dirname(inputFile.path), outputFileName);
          
          // 读取PDF文件
          const pdfBuffer = fs.readFileSync(inputFile.path);
          const pdfParse = (await import('pdf-parse')).default;
          const pdfData = await pdfParse(pdfBuffer);
          
          if (!pdfData.text || pdfData.text.trim().length === 0) {
            // 如果无法提取文本，创建一个说明文档
            const doc = new Document({
              sections: [{
                properties: {},
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: \`PDF文件: \${inputFile.originalname}\`,
                        bold: true,
                        size: 28
                      })
                    ]
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "此PDF文件无法提取文本内容，可能是图片格式或受密码保护。",
                        size: 24
                      })
                    ]
                  })
                ]
              }]
            });
            
            const buffer = await Packer.toBuffer(doc);
            fs.writeFileSync(outputPath, buffer);
            
            result = {
              fileId: path.basename(outputPath),
              fileName: outputFileName,
              fileSize: fs.statSync(outputPath).size,
              message: "PDF文件已转换，但无法提取文本内容"
            };
          } else {
            // 成功提取文本，创建Word文档
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
                  ...pdfData.text.split('\\n').map(line => 
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
            
            const buffer = await Packer.toBuffer(doc);
            fs.writeFileSync(outputPath, buffer);
            
            result = {
              fileId: path.basename(outputPath),
              fileName: outputFileName,
              fileSize: fs.statSync(outputPath).size,
              message: \`成功转换PDF为\${outputFormat.toUpperCase()}，共\${pdfData.numpages || 1}页\`
            };
          }
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

// 替换case块
if (oldCasePattern.test(toolsContent)) {
  toolsContent = toolsContent.replace(oldCasePattern, newCaseContent);
  fs.writeFileSync(toolsPath, toolsContent, 'utf8');
  console.log('✅ PDF转Word功能已修复！');
} else {
  console.log('❌ 找不到pdf-to-word case块');
}
