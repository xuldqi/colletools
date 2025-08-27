import React, { useState } from 'react';
import { pluginManager } from '../utils/pluginLoader';

const PluginTest: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState<Record<string, any>>({});

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testPlugin = async (pluginName: string) => {
    addLog(`Testing plugin: ${pluginName}`);
    try {
      await pluginManager.loadPlugin(pluginName);
      addLog(`✅ Plugin ${pluginName} loaded successfully`);
      addLog(`Is loaded: ${pluginManager.isPluginLoaded(pluginName)}`);
    } catch (error) {
      addLog(`❌ Plugin ${pluginName} failed: ${error.message}`);
    }
  };

  const checkStatus = (pluginName: string) => {
    const isLoaded = pluginManager.isPluginLoaded(pluginName);
    const state = pluginManager.getLoadingState(pluginName);
    addLog(`${pluginName} status: loaded=${isLoaded}, state=${JSON.stringify(state)}`);
  };

  React.useEffect(() => {
    // 监听加载状态变化
    const unsubscribe = pluginManager.onLoadingStateChange((pluginName, state) => {
      addLog(`State change for ${pluginName}: ${JSON.stringify(state)}`);
      setLoadingStates(prev => ({ ...prev, [pluginName]: state }));
    });

    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Plugin Loading Test</h1>
        
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            <div className="space-y-2">
              <button onClick={() => testPlugin('tesseract')} className="block w-full bg-blue-600 text-white py-2 px-4 rounded">
                Load Tesseract
              </button>
              <button onClick={() => testPlugin('opencv')} className="block w-full bg-green-600 text-white py-2 px-4 rounded">
                Load OpenCV
              </button>
              <button onClick={() => testPlugin('ffmpeg')} className="block w-full bg-red-600 text-white py-2 px-4 rounded">
                Load FFmpeg
              </button>
              <button onClick={() => checkStatus('tesseract')} className="block w-full bg-gray-600 text-white py-2 px-4 rounded">
                Check Tesseract Status
              </button>
              <button onClick={() => setLogs([])} className="block w-full bg-yellow-600 text-white py-2 px-4 rounded">
                Clear Logs
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Loading States</h2>
            <pre className="text-sm bg-gray-100 p-4 rounded">
              {JSON.stringify(loadingStates, null, 2)}
            </pre>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Console Logs</h2>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PluginTest;