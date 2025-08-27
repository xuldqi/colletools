import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { trackPageView } from './firebase/analytics'
import Home from './pages/Home'
import PDFTools from './pages/PDFTools'
import ImageTools from './pages/ImageTools'
import AIWriting from './pages/AIWriting'
import VideoTools from './pages/VideoTools'
import OCRTools from './pages/OCRTools'
import DocumentDataTools from './pages/DocumentDataTools'
import ToolDetail from './pages/ToolDetail'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
import Help from './pages/Help'
import ApiDocs from './pages/ApiDocs'
import Cookies from './pages/Cookies'
import Sitemap from './pages/Sitemap'
import { NotFound } from './pages/NotFound'
import PluginDemo from './pages/PluginDemo'
import PluginTest from './pages/PluginTest'
import CDNTest from './pages/CDNTest'
import PDFDebug from './pages/PDFDebug'
import PerformanceMonitor from './components/PerformanceMonitor'

function App() {
  const location = useLocation()

  useEffect(() => {
    // Track page views with Firebase Analytics
    trackPageView({
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname
    })
  }, [location])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PerformanceMonitor />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pdf" element={<PDFTools />} />
          <Route path="/pdf-tools" element={<PDFTools />} />
          <Route path="/image" element={<ImageTools />} />
          <Route path="/image-tools" element={<ImageTools />} />
          <Route path="/ai-writing" element={<AIWriting />} />
          <Route path="/video" element={<VideoTools />} />
          <Route path="/video-tools" element={<VideoTools />} />
          <Route path="/ocr" element={<OCRTools />} />
          <Route path="/ocr-tools" element={<OCRTools />} />
          <Route path="/document-data" element={<DocumentDataTools />} />
          <Route path="/document-data-tools" element={<DocumentDataTools />} />
          <Route path="/tool/:toolId" element={<ToolDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/api-docs" element={<ApiDocs />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/plugin-demo" element={<PluginDemo />} />
          <Route path="/plugin-test" element={<PluginTest />} />
          <Route path="/cdn-test" element={<CDNTest />} />
          <Route path="/pdf-debug" element={<PDFDebug />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App