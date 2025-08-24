import { logEvent } from 'firebase/analytics'
import { analytics } from './config'

// Custom event types for better type safety
export interface CustomEventParams {
  [key: string]: string | number | boolean
}

export interface PageViewParams {
  page_title?: string
  page_location?: string
  page_path?: string
}

export interface ToolUsageParams {
  tool_id: string
  tool_name: string
  tool_category: string
  file_type?: string
}

// Analytics helper functions
export const trackPageView = (params: PageViewParams) => {
  if (analytics) {
    logEvent(analytics, 'page_view', params)
  }
}

export const trackToolUsage = (params: ToolUsageParams) => {
  if (analytics) {
    logEvent(analytics, 'tool_usage', params)
  }
}

export const trackFileUpload = (fileType: string, toolId: string) => {
  if (analytics) {
    logEvent(analytics, 'file_upload', {
      file_type: fileType,
      tool_id: toolId
    })
  }
}

export const trackFileDownload = (fileType: string, toolId: string) => {
  if (analytics) {
    logEvent(analytics, 'file_download', {
      file_type: fileType,
      tool_id: toolId
    })
  }
}

export const trackCustomEvent = (eventName: string, params?: CustomEventParams) => {
  if (analytics) {
    logEvent(analytics, eventName, params)
  }
}

// Export analytics instance for direct use if needed
export { analytics }