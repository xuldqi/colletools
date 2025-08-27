import React, { useState } from 'react';
import { pluginManager } from '../utils/pluginLoader';

const PDFDebug: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testPDFPlugin = async () => {
    addLog('🔄 Testing PDF.js plugin loading...');
    
    try {
      // Check if already loaded
      const isAlreadyLoaded = pluginManager.isPluginLoaded('pdfjs-lib');
      addLog(`📋 PDF.js already loaded: ${isAlreadyLoaded}`);

      if (!isAlreadyLoaded) {
        addLog('📦 Loading PDF.js plugin...');
        await pluginManager.loadPlugin('pdfjs-lib');
        addLog('✅ PDF.js plugin loaded successfully');
      }

      // Check final state
      const isNowLoaded = pluginManager.isPluginLoaded('pdfjs-lib');
      addLog(`📊 Final state - PDF.js loaded: ${isNowLoaded}`);

      // Check window object
      addLog(`🔍 window.pdfjsLib: ${typeof (window as any).pdfjsLib}`);
      addLog(`🔍 window.pdfjs: ${typeof (window as any).pdfjs}`);
      addLog(`🔍 window.PDFJS: ${typeof (window as any).PDFJS}`);

      // Check all PDF-related window properties
      const pdfKeys = Object.keys(window).filter(k => 
        k.toLowerCase().includes('pdf') || k.toLowerCase().includes('pdfjs')
      );
      addLog(`🔑 PDF-related window keys: ${pdfKeys.join(', ') || 'none'}`);

    } catch (error) {
      addLog(`❌ Error: ${error.message}`);
    }
  };

  const clearLogs = () => setLogs([]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">PDF Plugin Debug</h1>
        
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="flex gap-4">
            <button 
              onClick={testPDFPlugin}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Test PDF.js Loading
            </button>
            <button 
              onClick={clearLogs}
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
            >
              Clear Logs
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-400">No logs yet. Click "Test PDF.js Loading" to start.</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFDebug;