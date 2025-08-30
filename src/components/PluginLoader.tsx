import React from 'react';
import { Loader2, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createUsePluginLoader, LoadingState, pluginManager } from '../utils/pluginLoader';

// Create the hook with React
const usePluginLoader = createUsePluginLoader(React);

interface PluginLoaderProps {
  pluginName: string;
  children?: React.ReactNode;
  onLoadComplete?: () => void;
  onLoadError?: (error: string) => void;
  className?: string;
}

export const PluginLoader: React.FC<PluginLoaderProps> = ({
  pluginName,
  children,
  onLoadComplete,
  onLoadError,
  className = ''
}) => {
  const { t } = useTranslation();
  const { loadingState, loadPlugin, isLoaded } = usePluginLoader(pluginName);

  React.useEffect(() => {
    if (loadingState?.error && onLoadError) {
      onLoadError(loadingState.error);
    }
    if (isLoaded && onLoadComplete) {
      onLoadComplete();
    }
  }, [loadingState, isLoaded, onLoadComplete, onLoadError]);

  if (isLoaded) {
    return <>{children}</>;
  }

  if (!loadingState?.isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Download className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t('common.needLoadAdvancedPlugin')}
        </h3>
        <p className="text-gray-600 text-center mb-4">
          {t('common.needLoadPluginDesc')}
        </p>
        <button
          onClick={() => {
            console.log(`[PluginLoader] Button clicked for plugin: ${pluginName}`);
            loadPlugin();
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          {t('common.loadPlugin')}
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
      {loadingState.error ? (
        <>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('common.loadFailed')}</h3>
          <p className="text-red-600 text-center mb-4">{loadingState.error}</p>
          <button
            onClick={() => {
              console.log(`[PluginLoader] Retry button clicked for plugin: ${pluginName}`);
              loadPlugin();
            }}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('common.retryLoad')}
          </button>
        </>
      ) : (
        <>
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            {loadingState.progress === 100 ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {loadingState.progress === 100 ? t('common.loadComplete') : t('common.loadingPlugin')}
          </h3>
          <p className="text-gray-600 text-center mb-4">{loadingState.message}</p>
          
          {/* Progress Bar */}
          <div className="w-full max-w-xs">
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${loadingState.progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 text-center">
              {loadingState.progress}% {t('common.percentComplete')}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

// Specialized loaders for different plugin types
export const VideoPluginLoader: React.FC<Omit<PluginLoaderProps, 'pluginName'>> = (props) => (
  <PluginLoader {...props} pluginName="ffmpeg" />
);

export const ImagePluginLoader: React.FC<Omit<PluginLoaderProps, 'pluginName'>> = (props) => (
  <PluginLoader {...props} pluginName="opencv" />
);

export const OCRPluginLoader: React.FC<Omit<PluginLoaderProps, 'pluginName'>> = (props) => (
  <PluginLoader {...props} pluginName="tesseract" />
);

export const PDFPluginLoader: React.FC<Omit<PluginLoaderProps, 'pluginName'>> = (props) => (
  <PluginLoader {...props} pluginName="pdfjs-lib" />
);

// Loading overlay component for inline use
export const PluginLoadingOverlay: React.FC<{
  pluginName: string;
  children: React.ReactNode;
  className?: string;
}> = ({ pluginName, children, className = '' }) => {
  const { loadingState, isLoaded } = usePluginLoader(pluginName);

  if (isLoaded) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
        {loadingState?.isLoading ? (
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-gray-700 font-medium">{loadingState.message}</p>
            <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${loadingState.progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Download className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">{t('common.needLoadPlugin')}</p>
          </div>
        )}
      </div>
    </div>
  );
};