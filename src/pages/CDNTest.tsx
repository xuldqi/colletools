import React, { useState } from 'react';

const CDNTest: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testDirectCDN = async (name: string, url: string, globalVar: string) => {
    addLog(`🔄 Testing ${name} from ${url}`);
    
    try {
      // Check if already loaded
      if ((window as any)[globalVar]) {
        addLog(`✅ ${name} already available at window.${globalVar}`);
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = url;
      script.async = true;

      // Promise wrapper
      await new Promise((resolve, reject) => {
        script.onload = () => {
          addLog(`📦 ${name} script loaded successfully`);
          
          // Check multiple possible locations
          const locations = [globalVar, globalVar.toLowerCase(), globalVar.toUpperCase()];
          let found = false;
          
          for (const loc of locations) {
            if ((window as any)[loc]) {
              addLog(`✅ ${name} found at window.${loc}`);
              addLog(`📝 Type: ${typeof (window as any)[loc]}`);
              addLog(`📋 Keys: ${Object.keys((window as any)[loc]).slice(0, 5).join(', ')}`);
              found = true;
              break;
            }
          }

          if (!found) {
            addLog(`❌ ${name} not found in expected locations: ${locations.join(', ')}`);
            addLog(`🔍 Window keys containing '${globalVar.substring(0, 3)}': ${Object.keys(window).filter(k => k.toLowerCase().includes(globalVar.substring(0, 3).toLowerCase())).join(', ')}`);
          }
          
          resolve(null);
        };

        script.onerror = () => {
          addLog(`❌ Failed to load ${name} from ${url}`);
          reject(new Error(`Failed to load ${name}`));
        };

        document.head.appendChild(script);
      });

    } catch (error) {
      addLog(`💥 Error testing ${name}: ${error.message}`);
    }
  };

  const cdnTests = [
    {
      name: 'Tesseract.js',
      url: 'https://unpkg.com/tesseract.js@4.1.4/dist/tesseract.min.js',
      globalVar: 'Tesseract'
    },
    {
      name: 'OpenCV.js',
      url: 'https://docs.opencv.org/4.8.0/opencv.js',
      globalVar: 'cv'
    },
    {
      name: 'FFmpeg.js',
      url: 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.7/dist/umd/ffmpeg.js',
      globalVar: 'FFmpegWASM'
    },
    {
      name: 'PDF.js',
      url: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',
      globalVar: 'pdfjsLib'
    }
  ];

  const clearLogs = () => setLogs([]);

  const checkWindowGlobals = () => {
    addLog('🔍 Checking current window globals:');
    cdnTests.forEach(test => {
      const exists = !!(window as any)[test.globalVar];
      addLog(`  ${test.globalVar}: ${exists ? '✅ Available' : '❌ Not found'}`);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Direct CDN Loading Test</h1>
        
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Individual CDNs</h2>
            <div className="grid grid-cols-2 gap-4">
              {cdnTests.map(test => (
                <button
                  key={test.name}
                  onClick={() => testDirectCDN(test.name, test.url, test.globalVar)}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Test {test.name}
                </button>
              ))}
            </div>
            
            <div className="mt-4 flex gap-2">
              <button onClick={checkWindowGlobals} className="bg-gray-600 text-white py-2 px-4 rounded">
                Check All Globals
              </button>
              <button onClick={clearLogs} className="bg-yellow-600 text-white py-2 px-4 rounded">
                Clear Logs
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Logs</h2>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-400">No logs yet. Click a test button to start.</div>
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

export default CDNTest;