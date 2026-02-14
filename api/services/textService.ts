export class TextService {
  // 字数统计
  static countWords(text: string) {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const lines = text.split('\n').length;
    
    return {
      words: words.length,
      characters,
      charactersNoSpaces,
      paragraphs,
      lines
    };
  }

  // 字符计数
  static countCharacters(text: string) {
    return {
      withSpaces: text.length,
      withoutSpaces: text.replace(/\s/g, '').length,
      letters: text.replace(/[^a-zA-Z\u4e00-\u9fa5]/g, '').length,
      numbers: text.replace(/[^0-9]/g, '').length,
      punctuation: text.replace(/[a-zA-Z0-9\s\u4e00-\u9fa5]/g, '').length
    };
  }

  // 大小写转换
  static convertCase(text: string, caseType: string) {
    switch (caseType) {
      case 'uppercase':
        return text.toUpperCase();
      case 'lowercase':
        return text.toLowerCase();
      case 'title':
        return text.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
      case 'sentence':
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      case 'camel':
        return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        ).replace(/\s+/g, '');
      case 'pascal':
        return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => 
          word.toUpperCase()
        ).replace(/\s+/g, '');
      case 'snake':
        return text.toLowerCase().replace(/\s+/g, '_');
      case 'kebab':
        return text.toLowerCase().replace(/\s+/g, '-');
      default:
        return text;
    }
  }

  // 文本格式化
  static formatText(text: string, options: { removeExtraSpaces?: boolean; removeExtraLines?: boolean; trimLines?: boolean; removeEmptyLines?: boolean } = {}) {
    let formatted = text;
    
    if (options.removeExtraSpaces) {
      formatted = formatted.replace(/\s+/g, ' ');
    }
    
    if (options.removeExtraLines) {
      formatted = formatted.replace(/\n\s*\n/g, '\n');
    }
    
    if (options.trimLines) {
      formatted = formatted.split('\n').map(line => line.trim()).join('\n');
    }
    
    if (options.removeEmptyLines) {
      formatted = formatted.split('\n').filter(line => line.trim().length > 0).join('\n');
    }
    
    return formatted.trim();
  }

  // 行数统计
  static countLines(text: string) {
    const allLines = text.split('\n');
    const nonEmptyLines = allLines.filter(line => line.trim().length > 0);
    
    return {
      total: allLines.length,
      nonEmpty: nonEmptyLines.length,
      empty: allLines.length - nonEmptyLines.length
    };
  }

  // 文本反转
  static reverseText(text: string, type: string = 'characters') {
    switch (type) {
      case 'characters':
        return text.split('').reverse().join('');
      case 'words':
        return text.split(/\s+/).reverse().join(' ');
      case 'lines':
        return text.split('\n').reverse().join('\n');
      default:
        return text.split('').reverse().join('');
    }
  }

  // 文本排序
  static sortText(text: string, options: { sortBy?: string; order?: 'asc' | 'desc'; caseSensitive?: boolean } = {}) {
    const lines = text.split('\n');
    const { sortBy = 'alphabetical', order = 'asc', caseSensitive = false } = options;
    
    const sortedLines = [...lines];
    
    if (sortBy === 'alphabetical') {
      sortedLines.sort((a, b) => {
        const aText = caseSensitive ? a : a.toLowerCase();
        const bText = caseSensitive ? b : b.toLowerCase();
        return order === 'asc' ? aText.localeCompare(bText) : bText.localeCompare(aText);
      });
    } else if (sortBy === 'length') {
      sortedLines.sort((a, b) => {
        return order === 'asc' ? a.length - b.length : b.length - a.length;
      });
    } else if (sortBy === 'numerical') {
      sortedLines.sort((a, b) => {
        const aNum = parseFloat(a) || 0;
        const bNum = parseFloat(b) || 0;
        return order === 'asc' ? aNum - bNum : bNum - aNum;
      });
    }
    
    return sortedLines.join('\n');
  }

  // 删除重复行
  static removeDuplicateLines(text: string, options: { caseSensitive?: boolean; keepFirst?: boolean } = {}) {
    const lines = text.split('\n');
    const { caseSensitive = false, keepFirst = true } = options;
    
    const seen = new Set();
    const result: string[] = [];
    
    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      
      if (!seen.has(key)) {
        seen.add(key);
        result.push(line);
      } else if (!keepFirst) {
        // 如果不保留第一个，则替换
        const index = result.findIndex(l => 
          caseSensitive ? l === line : l.toLowerCase() === line.toLowerCase()
        );
        if (index !== -1) {
          result[index] = line;
        }
      }
    }
    
    return result.join('\n');
  }

  // 文本差异检查
  static compareTexts(text1: string, text2: string) {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    
    const maxLines = Math.max(lines1.length, lines2.length);
    const differences: Array<{ lineNumber: number; text1: string; text2: string; type: string }> = [];
    
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 !== line2) {
        differences.push({
          lineNumber: i + 1,
          text1: line1,
          text2: line2,
          type: line1 === '' ? 'added' : line2 === '' ? 'removed' : 'modified'
        });
      }
    }
    
    return {
      identical: differences.length === 0,
      differences,
      stats: {
        totalLines1: lines1.length,
        totalLines2: lines2.length,
        changedLines: differences.length
      }
    };
  }

  // 文本统计分析
  static analyzeText(text: string) {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // 词频统计
    const wordFreq: { [key: string]: number } = {};
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-zA-Z\u4e00-\u9fa5]/g, '');
      if (cleanWord) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
      }
    });
    
    // 最常用词汇
    const topWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
    
    return {
      ...this.countWords(text),
      sentences: sentences.length,
      avgWordsPerSentence: sentences.length > 0 ? Math.round(words.length / sentences.length * 100) / 100 : 0,
      avgCharsPerWord: words.length > 0 ? Math.round(text.replace(/\s/g, '').length / words.length * 100) / 100 : 0,
      topWords,
      readingTime: Math.ceil(words.length / 200) // 假设每分钟200词
    };
  }
}