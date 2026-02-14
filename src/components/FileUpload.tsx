import React, { useCallback, useState } from 'react'
import { Upload, X, FileText, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  acceptedTypes?: string
  maxSize?: number // in MB
  className?: string
  disabled?: boolean
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = "*/*",
  maxSize = 50,
  className = "",
  disabled = false
}) => {
  const { t } = useTranslation()
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const validateFile = (file: File): boolean => {
    setError('')
    
    // 检查文件大小
    if (file.size > maxSize * 1024 * 1024) {
      setError(t('common.fileTooLarge', { size: maxSize }))
      return false
    }
    
    // 检查文件类型
    if (acceptedTypes !== "*/*") {
      const allowedTypes = acceptedTypes.split(',').map(type => type.trim().toLowerCase())
      const fileType = file.type.toLowerCase()
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`
      
      const isTypeAllowed = allowedTypes.some(type => 
        type === fileType || 
        type === fileExtension ||
        (type.endsWith('/*') && fileType.startsWith(type.replace('/*', '')))
      )
      
      if (!isTypeAllowed) {
        setError(t('common.unsupportedFileType'))
        return false
      }
    }
    
    return true
  }

  const handleFile = useCallback((file: File) => {
    if (!validateFile(file)) return
    
    setSelectedFile(file)
    onFileSelect(file)
  }, [onFileSelect, maxSize, acceptedTypes, t])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }, [handleFile, disabled])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setDragActive(true)
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }, [handleFile])

  const clearFile = () => {
    setSelectedFile(null)
    setError('')
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`w-full ${className}`}>
      {/* 文件上传区域 */}
      <div
        className={`
          mobile-upload-zone cursor-pointer
          ${dragActive ? 'drag-over' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept={acceptedTypes}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
        
        {selectedFile ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                clearFile()
              }}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
              <span>{t('common.removeFile')}</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full">
              <Upload className="w-8 h-8 text-primary-600" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900 mb-2">
                {t('common.uploadFile')}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {t('common.dragDropOrClick')}
              </p>
              <div className="text-xs text-gray-400">
                <p>{t('common.maxFileSize', { size: maxSize })}</p>
                {acceptedTypes !== "*/*" && (
                  <p>{t('common.supportedFormats')}: {acceptedTypes}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 错误信息 */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* 移动端提示 */}
      <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-md sm:hidden">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-primary-600 rounded-full flex-shrink-0"></div>
          <p className="text-sm text-primary-700">
            {t('common.mobileUploadTip')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default FileUpload