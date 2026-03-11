export interface PortalLinkItem {
  id: string
  name: string
  description: string
  href: string
  external?: boolean
  category?: string
}

export const platformEntryLinks: PortalLinkItem[] = [
  {
    id: 'grade-calc',
    name: 'GPA Calculator',
    description: '课程成绩与GPA快速计算',
    href: '/grade-calc',
    category: '学生工具'
  },
  {
    id: 'email-gen',
    name: 'Email Generator',
    description: '老师邮件、请假邮件模板生成',
    href: '/email-gen',
    category: '学生工具'
  },
  {
    id: 'deadlines',
    name: 'Deadlines',
    description: '作业和DDL统一提醒',
    href: '/deadlines',
    category: '学生工具'
  },
  {
    id: 'citation',
    name: 'Citation Assistant',
    description: '论文引用格式辅助',
    href: '/citation',
    category: '学生工具'
  },
  {
    id: 'pomodoro',
    name: 'Pomodoro',
    description: '番茄钟专注计时器',
    href: '/pomodoro',
    category: '学生工具'
  },
  {
    id: 'decision',
    name: 'Decision Maker',
    description: '随机决策与分组工具',
    href: '/decision',
    category: '学生工具'
  },
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    description: 'PDF 工具聚合入口',
    href: '/pdf-tools',
    category: '工具分组'
  },
  {
    id: 'image-tools',
    name: 'Image Tools',
    description: '图片工具聚合入口',
    href: '/image-tools',
    category: '工具分组'
  },
  {
    id: 'video-tools',
    name: 'Video Tools',
    description: '视频工具聚合入口',
    href: '/video-tools',
    category: '工具分组'
  },
  {
    id: 'ocr-tools',
    name: 'OCR Tools',
    description: 'OCR 识别工具聚合入口',
    href: '/ocr-tools',
    category: '工具分组'
  },
  {
    id: 'document-data-tools',
    name: 'Document & Data Tools',
    description: '文档和数据处理工具聚合入口',
    href: '/document-data-tools',
    category: '工具分组'
  },
  {
    id: 'ai-writing',
    name: 'AI Writing',
    description: 'AI 写作与文本工具入口',
    href: '/ai-writing',
    category: '工具分组'
  }
]

// 把你已有的外部站点工具填到这里，入口页会自动展示
export const externalEntryLinks: PortalLinkItem[] = [
  {
    id: 'mycolletools',
    name: 'My ColleTools (Portfolio)',
    description: '个人作品与独立工具站点',
    href: 'https://i.colletools.com',
    external: true,
    category: '外链站点'
  },
  {
    id: 'aitoolrecs-vercel',
    name: 'AI Tool Recs',
    description: 'AI 工具推荐项目入口',
    href: 'https://vercel.com/novcats-projects/aitoolrecs',
    external: true,
    category: '外链站点'
  },
  {
    id: 'healthcal-vercel',
    name: 'HealthCal',
    description: '健康计算项目入口',
    href: 'https://healthcal.colletools.com',
    external: true,
    category: '外链站点'
  },
  {
    id: 'yaso-vercel',
    name: 'Yaso',
    description: 'Yaso 项目入口',
    href: 'https://vercel.com/novcats-projects/yaso',
    external: true,
    category: '外链站点'
  },
  {
    id: 'cesr-vercel',
    name: '测算大师',
    description: '测算大师项目入口',
    href: 'https://cesuan.colletools.com',
    external: true,
    category: '外链站点'
  },
  {
    id: 'fullcalweb-vercel',
    name: 'FullCalWeb',
    description: 'FullCalWeb 项目入口',
    href: 'https://fullcal.colletools.com',
    external: true,
    category: '外链站点'
  },
  {
    id: 'seai-vercel',
    name: 'SEAI',
    description: 'SEAI 项目入口',
    href: 'https://seai.site',
    external: true,
    category: '外链站点'
  },
  {
    id: 'zipic-site',
    name: 'Zipic',
    description: 'Zipic 项目入口',
    href: 'https://zipic.online',
    external: true,
    category: '外链站点'
  },
  {
    id: 'filmpic-vercel',
    name: 'FilmPic',
    description: 'FilmPic 项目入口',
    href: 'https://filmpic.colletools.com',
    external: true,
    category: '外链站点'
  },
  {
    id: 'firstime-vercel',
    name: 'Firstime',
    description: 'Firstime 项目入口',
    href: 'https://firstime-six.vercel.app/',
    external: true,
    category: '外链站点'
  },
  {
    id: 'gncd-app',
    name: 'GNCD',
    description: 'GNCD 在线工具入口',
    href: 'https://gncd.vercel.app/',
    external: true,
    category: '外链站点'
  },
  {
    id: 'xiaohongshu-college',
    name: 'Xiaohongshu College',
    description: '小红书学院入口',
    href: 'https://www.xiaohongshu.college/',
    external: true,
    category: '外链站点'
  },
  {
    id: 'dropshare-tech',
    name: 'DropShare',
    description: 'DropShare 工具入口',
    href: 'https://dropshare.tech/',
    external: true,
    category: '外链站点'
  },
  {
    id: 'readio-cc',
    name: 'Readio',
    description: 'Readio 工具入口',
    href: 'https://readio.cc/',
    external: true,
    category: '外链站点'
  }
]

export const categoryLabelMap: Record<string, string> = {
  pdf: 'PDF',
  image: '图片',
  video: '视频',
  ocr: 'OCR',
  'ai-writing': 'AI 写作',
  file: '文件',
  text: '文本',
  converter: '转换',
  developer: '开发者',
  student: '学生',
  other: '其它'
}
