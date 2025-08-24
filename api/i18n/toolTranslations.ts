/**
 * Tool translations for different languages
 */

export interface ToolTranslation {
  name: string;
  description: string;
  options: Record<string, {
    label: string;
    placeholder?: string;
    options?: string[];
  }>;
}

export interface ToolTranslations {
  [toolId: string]: {
    [language: string]: ToolTranslation;
  };
}

export const toolTranslations: ToolTranslations = {
  'pdf-merge': {
    en: {
      name: 'Merge PDF',
      description: 'Combine multiple PDF files into one document',
      options: {
        order: {
          label: 'File Order',
          options: ['original', 'alphabetical', 'custom']
        }
      }
    },
    zh: {
      name: 'PDF合并',
      description: '将多个PDF文件合并为一个文档',
      options: {
        order: {
          label: '文件顺序',
          options: ['原始顺序', '字母顺序', '自定义顺序']
        }
      }
    },
    es: {
      name: 'Combinar PDF',
      description: 'Combinar múltiples archivos PDF en un documento',
      options: {
        order: {
          label: 'Orden de archivos',
          options: ['original', 'alfabético', 'personalizado']
        }
      }
    },
    ja: {
      name: 'PDF結合',
      description: '複数のPDFファイルを1つのドキュメントに結合',
      options: {
        order: {
          label: 'ファイル順序',
          options: ['元の順序', 'アルファベット順', 'カスタム']
        }
      }
    },
    ko: {
      name: 'PDF 병합',
      description: '여러 PDF 파일을 하나의 문서로 결합',
      options: {
        order: {
          label: '파일 순서',
          options: ['원본 순서', '알파벳 순서', '사용자 정의']
        }
      }
    }
  },
  'video-convert': {
    en: {
      name: 'Video Converter',
      description: 'Convert videos between different formats',
      options: {
        format: {
          label: 'Output Format',
          options: ['mp4', 'avi', 'mov', 'webm', 'mkv']
        },
        quality: {
          label: 'Video Quality',
          options: ['low', 'medium', 'high', 'original']
        }
      }
    },
    zh: {
      name: '视频转换器',
      description: '在不同格式之间转换视频',
      options: {
        format: {
          label: '输出格式',
          options: ['mp4', 'avi', 'mov', 'webm', 'mkv']
        },
        quality: {
          label: '视频质量',
          options: ['低', '中', '高', '原始']
        }
      }
    },
    es: {
      name: 'Convertidor de Video',
      description: 'Convertir videos entre diferentes formatos',
      options: {
        format: {
          label: 'Formato de salida',
          options: ['mp4', 'avi', 'mov', 'webm', 'mkv']
        },
        quality: {
          label: 'Calidad de video',
          options: ['baja', 'media', 'alta', 'original']
        }
      }
    },
    ja: {
      name: '動画変換器',
      description: '異なる形式間で動画を変換',
      options: {
        format: {
          label: '出力形式',
          options: ['mp4', 'avi', 'mov', 'webm', 'mkv']
        },
        quality: {
          label: '動画品質',
          options: ['低', '中', '高', 'オリジナル']
        }
      }
    },
    ko: {
      name: '비디오 변환기',
      description: '다양한 형식 간 비디오 변환',
      options: {
        format: {
          label: '출력 형식',
          options: ['mp4', 'avi', 'mov', 'webm', 'mkv']
        },
        quality: {
          label: '비디오 품질',
          options: ['낮음', '보통', '높음', '원본']
        }
      }
    }
  },
  'video-compress': {
    en: {
      name: 'Video Compressor',
      description: 'Compress video files to reduce size',
      options: {
        compressionLevel: {
          label: 'Compression Level',
          options: ['light', 'medium', 'heavy']
        },
        targetSize: {
          label: 'Target Size (MB)'
        }
      }
    },
    zh: {
      name: '视频压缩器',
      description: '压缩视频文件以减小大小',
      options: {
        compressionLevel: {
          label: '压缩级别',
          options: ['轻度', '中度', '重度']
        },
        targetSize: {
          label: '目标大小 (MB)'
        }
      }
    },
    es: {
      name: 'Compresor de Video',
      description: 'Comprimir archivos de video para reducir el tamaño',
      options: {
        compressionLevel: {
          label: 'Nivel de compresión',
          options: ['ligero', 'medio', 'pesado']
        },
        targetSize: {
          label: 'Tamaño objetivo (MB)'
        }
      }
    },
    ja: {
      name: '動画圧縮器',
      description: 'ファイルサイズを縮小するために動画を圧縮',
      options: {
        compressionLevel: {
          label: '圧縮レベル',
          options: ['軽度', '中度', '重度']
        },
        targetSize: {
          label: '目標サイズ (MB)'
        }
      }
    },
    ko: {
      name: '비디오 압축기',
      description: '파일 크기를 줄이기 위해 비디오 압축',
      options: {
        compressionLevel: {
          label: '압축 수준',
          options: ['가벼움', '보통', '무거움']
        },
        targetSize: {
          label: '목표 크기 (MB)'
        }
      }
    }
  },
  'video-editor': {
    en: {
      name: 'Video Editor',
      description: 'Basic video editing and trimming',
      options: {
        startTime: {
          label: 'Start Time (seconds)'
        },
        endTime: {
          label: 'End Time (seconds)'
        },
        brightness: {
          label: 'Brightness'
        },
        contrast: {
          label: 'Contrast'
        }
      }
    },
    zh: {
      name: '视频编辑器',
      description: '基本视频编辑和剪辑',
      options: {
        startTime: {
          label: '开始时间 (秒)'
        },
        endTime: {
          label: '结束时间 (秒)'
        },
        brightness: {
          label: '亮度'
        },
        contrast: {
          label: '对比度'
        }
      }
    },
    es: {
      name: 'Editor de Video',
      description: 'Edición básica de video y recorte',
      options: {
        startTime: {
          label: 'Tiempo de inicio (segundos)'
        },
        endTime: {
          label: 'Tiempo final (segundos)'
        },
        brightness: {
          label: 'Brillo'
        },
        contrast: {
          label: 'Contraste'
        }
      }
    },
    ja: {
      name: '動画エディター',
      description: '基本的な動画編集とトリミング',
      options: {
        startTime: {
          label: '開始時間 (秒)'
        },
        endTime: {
          label: '終了時間 (秒)'
        },
        brightness: {
          label: '明度'
        },
        contrast: {
          label: 'コントラスト'
        }
      }
    },
    ko: {
      name: '비디오 편집기',
      description: '기본 비디오 편집 및 트리밍',
      options: {
        startTime: {
          label: '시작 시간 (초)'
        },
        endTime: {
          label: '종료 시간 (초)'
        },
        brightness: {
          label: '밝기'
        },
        contrast: {
          label: '대비'
        }
      }
    }
  },
  'gif-maker': {
    en: {
      name: 'GIF Maker',
      description: 'Convert videos to animated GIFs',
      options: {
        startTime: {
          label: 'Start Time (seconds)'
        },
        duration: {
          label: 'Duration (seconds)'
        },
        fps: {
          label: 'Frame Rate',
          options: ['10', '15', '20', '24', '30']
        },
        width: {
          label: 'Width (px)'
        }
      }
    },
    zh: {
      name: 'GIF制作器',
      description: '将视频转换为动画GIF',
      options: {
        startTime: {
          label: '开始时间 (秒)'
        },
        duration: {
          label: '持续时间 (秒)'
        },
        fps: {
          label: '帧率',
          options: ['10', '15', '20', '24', '30']
        },
        width: {
          label: '宽度 (像素)'
        }
      }
    },
    es: {
      name: 'Creador de GIF',
      description: 'Convertir videos a GIFs animados',
      options: {
        startTime: {
          label: 'Tiempo de inicio (segundos)'
        },
        duration: {
          label: 'Duración (segundos)'
        },
        fps: {
          label: 'Velocidad de fotogramas',
          options: ['10', '15', '20', '24', '30']
        },
        width: {
          label: 'Ancho (px)'
        }
      }
    },
    ja: {
      name: 'GIFメーカー',
      description: '動画をアニメーションGIFに変換',
      options: {
        startTime: {
          label: '開始時間 (秒)'
        },
        duration: {
          label: '継続時間 (秒)'
        },
        fps: {
          label: 'フレームレート',
          options: ['10', '15', '20', '24', '30']
        },
        width: {
          label: '幅 (px)'
        }
      }
    },
    ko: {
      name: 'GIF 제작기',
      description: '비디오를 애니메이션 GIF로 변환',
      options: {
        startTime: {
          label: '시작 시간 (초)'
        },
        duration: {
          label: '지속 시간 (초)'
        },
        fps: {
          label: '프레임 속도',
          options: ['10', '15', '20', '24', '30']
        },
        width: {
          label: '너비 (px)'
        }
      }
    }
  },
  'video-trimmer': {
    en: {
      name: 'Video Trimmer',
      description: 'Trim and cut video clips',
      options: {
        startTime: {
          label: 'Start Time (seconds)'
        },
        endTime: {
          label: 'End Time (seconds)'
        }
      }
    },
    zh: {
      name: '视频剪辑器',
      description: '修剪和剪切视频片段',
      options: {
        startTime: {
          label: '开始时间 (秒)'
        },
        endTime: {
          label: '结束时间 (秒)'
        }
      }
    },
    es: {
      name: 'Recortador de Video',
      description: 'Recortar y cortar clips de video',
      options: {
        startTime: {
          label: 'Tiempo de inicio (segundos)'
        },
        endTime: {
          label: 'Tiempo final (segundos)'
        }
      }
    },
    ja: {
      name: '動画トリマー',
      description: '動画クリップのトリミングとカット',
      options: {
        startTime: {
          label: '開始時間 (秒)'
        },
        endTime: {
          label: '終了時間 (秒)'
        }
      }
    },
    ko: {
      name: '비디오 트리머',
      description: '비디오 클립 트리밍 및 자르기',
      options: {
        startTime: {
          label: '시작 시간 (초)'
        },
        endTime: {
          label: '종료 시간 (초)'
        }
      }
    }
  }
};

/**
 * Get tool translation for a specific language
 */
export function getToolTranslation(toolId: string, language: string = 'en'): ToolTranslation | null {
  const tool = toolTranslations[toolId];
  if (!tool) return null;
  
  // Return requested language or fallback to English
  return tool[language] || tool['en'] || null;
}

/**
 * Get all supported languages for a tool
 */
export function getSupportedLanguages(toolId: string): string[] {
  const tool = toolTranslations[toolId];
  return tool ? Object.keys(tool) : [];
}