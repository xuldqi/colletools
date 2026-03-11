import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Search, Wrench, LayoutGrid } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SEOHead from '../components/SEOHead'
import PageHero from '../components/PageHero'
import { externalEntryLinks, platformEntryLinks, type PortalLinkItem } from '../config/allToolsPortal'

interface ApiToolItem {
  id: string
  name: string
  description: string
  category: string
}

interface ApiToolsResponse {
  success: boolean
  data: ApiToolItem[]
}

const isLinkMatched = (tool: Pick<ApiToolItem, 'id' | 'name' | 'description'>, keyword: string) => {
  const text = `${tool.id} ${tool.name} ${tool.description}`.toLowerCase()
  return text.includes(keyword)
}

const sortedByCategory = (tools: ApiToolItem[], labelMap: Record<string, string>) => {
  const groups = tools.reduce<Record<string, ApiToolItem[]>>((acc, tool) => {
    const key = tool.category || 'other'
    acc[key] = acc[key] || []
    acc[key].push(tool)
    return acc
  }, {})

  return Object.entries(groups)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([category, items]) => ({
      category,
      label: labelMap[category] || category,
      items: items.sort((a, b) => a.name.localeCompare(b.name))
    }))
}

const EntryCard = ({ item, isZh }: { item: PortalLinkItem; isZh: boolean }) => {
  const categoryMap: Record<string, string> = {
    学生工具: 'Study Tools',
    工具分组: 'Tool Group',
    外链站点: 'External Site'
  }
  const descriptionText = !isZh && /[\u4e00-\u9fff]/.test(item.description) ? 'Open this entry' : item.description
  const commonClass =
    'group block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-primary-300 hover:shadow-sm'

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={commonClass}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-slate-800">{item.name}</h3>
          <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-primary-600" />
        </div>
        <p className="mt-2 text-sm text-slate-600">{descriptionText}</p>
        <p className="mt-3 text-xs text-slate-400">{item.href}</p>
      </a>
    )
  }

  return (
    <Link to={item.href} className={commonClass}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-800">{item.name}</h3>
        <span className="text-xs rounded-full bg-primary-50 px-2 py-1 text-primary-700">
          {item.category
            ? (isZh ? item.category : (categoryMap[item.category] || item.category))
            : (isZh ? '入口' : 'Entry')}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{descriptionText}</p>
      <p className="mt-3 text-xs text-slate-400">{item.href}</p>
    </Link>
  )
}

export default function AllToolsHub() {
  const { i18n } = useTranslation()
  const isZh = i18n.language.startsWith('zh')
  const categoryLabelMap = useMemo(() => ({
    pdf: isZh ? 'PDF' : 'PDF',
    image: isZh ? '图片' : 'Image',
    video: isZh ? '视频' : 'Video',
    ocr: isZh ? 'OCR' : 'OCR',
    'ai-writing': isZh ? 'AI 写作' : 'AI Writing',
    file: isZh ? '文件' : 'Files',
    text: isZh ? '文本' : 'Text',
    converter: isZh ? '转换' : 'Converter',
    developer: isZh ? '开发者' : 'Developer',
    student: isZh ? '学生' : 'Student',
    other: isZh ? '其它' : 'Other'
  }), [isZh])
  const [apiTools, setApiTools] = useState<ApiToolItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/tools', { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const result = (await response.json()) as ApiToolsResponse
        if (!result.success || !Array.isArray(result.data)) {
          throw new Error('Invalid response data')
        }

        setApiTools(result.data)
        setError('')
      } catch (fetchError) {
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          return
        }
        setError(isZh ? '工具列表加载失败，请稍后刷新重试' : 'Failed to load tools. Please refresh and try again.')
      } finally {
        setLoading(false)
      }
    }

    load()

    return () => controller.abort()
  }, [])

  const normalizedKeyword = keyword.trim().toLowerCase()
  const filteredApiTools = useMemo(() => {
    if (!normalizedKeyword) return apiTools
    return apiTools.filter(tool => isLinkMatched(tool, normalizedKeyword))
  }, [apiTools, normalizedKeyword])

  const groupedApiTools = useMemo(() => sortedByCategory(filteredApiTools, categoryLabelMap), [filteredApiTools, categoryLabelMap])
  const totalEntries = platformEntryLinks.length + externalEntryLinks.length + apiTools.length

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={isZh ? '全站工具入口' : 'All Tools Hub'}
        description={isZh ? 'ColleTools 全站功能入口：统一跳转学生工具、站内工具和外部工具。' : 'ColleTools all tools hub for internal tools and external links.'}
        keywords={isZh ? 'all tools, tools hub, ColleTools, 外链入口' : 'all tools, tools hub, ColleTools, external links'}
      />

      <section className="px-4 pt-12 pb-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <PageHero
            title={isZh ? '全站工具入口' : 'All Tools Hub'}
            subtitle={isZh ? '一个页面查看并跳转站内工具、工具详情和外部站点入口。' : 'One page to access internal tools, tool details, and external sites.'}
            icon={LayoutGrid}
            iconBgClassName="bg-slate-100"
            iconTextClassName="text-slate-700"
            action={(
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{isZh ? '平台入口' : 'Platform'} {platformEntryLinks.length}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{isZh ? '外链入口' : 'External'} {externalEntryLinks.length}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">API {isZh ? '工具' : 'Tools'} {apiTools.length}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{isZh ? '总入口' : 'Total'} {totalEntries}</span>
              </div>
            )}
          />

          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">{isZh ? '平台主入口' : 'Platform Entry'}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {platformEntryLinks.map(item => (
                <EntryCard key={item.id} item={item} isZh={isZh} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">{isZh ? '外部站点入口' : 'External Sites'}</h2>
            <div className="mb-3 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-600">
              {isZh ? '外链维护文件：' : 'External links config: '}<code className="font-mono">src/config/allToolsPortal.ts</code>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {externalEntryLinks.map(item => (
                <EntryCard key={item.id} item={item} isZh={isZh} />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-semibold text-slate-900">{isZh ? '站内全部工具（自动同步 API）' : 'All Internal Tools (Auto-synced by API)'}</h2>
              <label className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder={isZh ? '搜索工具名、描述、ID...' : 'Search by tool name, description, ID...'}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
              </label>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500">{isZh ? '正在加载工具列表...' : 'Loading tools...'}</div>
            ) : error ? (
              <div className="py-12 text-center text-red-600">{error}</div>
            ) : groupedApiTools.length === 0 ? (
              <div className="py-12 text-center text-slate-500">{isZh ? '没有匹配的工具' : 'No matched tools'}</div>
            ) : (
              <div className="mt-6 space-y-8">
                {groupedApiTools.map(group => (
                  <div key={group.category}>
                    <div className="mb-3 flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-primary-600" />
                      <h3 className="text-base font-semibold text-slate-800">
                        {group.label} <span className="text-slate-400">({group.items.length})</span>
                      </h3>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {group.items.map(tool => (
                        <Link
                          key={tool.id}
                          to={`/tool/${tool.id}`}
                          className="group rounded-lg border border-slate-200 p-4 transition hover:border-primary-300 hover:bg-primary-50/30"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-slate-900">{tool.name}</h4>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{tool.id}</span>
                          </div>
                          <p className="mt-2 text-sm text-slate-600 line-clamp-2">{tool.description}</p>
                          <p className="mt-3 text-xs font-medium text-primary-700 group-hover:text-primary-800">
                            {isZh ? '打开工具详情页' : 'Open Tool Detail'}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
