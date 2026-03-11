import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { trackPageView } from './firebase/analytics'

// 首页保持同步加载，其他页面懒加载
import Home from './pages/Home'

// 懒加载其他页面
const PDFTools = lazy(() => import('./pages/PDFTools'))
const ImageTools = lazy(() => import('./pages/ImageTools'))
const AIWriting = lazy(() => import('./pages/AIWriting'))
const VideoTools = lazy(() => import('./pages/VideoTools'))
const OCRTools = lazy(() => import('./pages/OCRTools'))
const DocumentDataTools = lazy(() => import('./pages/DocumentDataTools'))
const GradeCalc = lazy(() => import('./pages/GradeCalc'))
const EmailGen = lazy(() => import('./pages/EmailGen'))
const Deadlines = lazy(() => import('./pages/Deadlines'))
const Citation = lazy(() => import('./pages/Citation'))
const Pomodoro = lazy(() => import('./pages/Pomodoro'))
const Decision = lazy(() => import('./pages/Decision'))
const ToolDetail = lazy(() => import('./pages/ToolDetail'))
const About = lazy(() => import('./pages/About'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const Contact = lazy(() => import('./pages/Contact'))
const Help = lazy(() => import('./pages/Help'))
const ApiDocs = lazy(() => import('./pages/ApiDocs'))
const Cookies = lazy(() => import('./pages/Cookies'))
const Sitemap = lazy(() => import('./pages/Sitemap'))
const AllToolsHub = lazy(() => import('./pages/AllToolsHub'))
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })))

function App() {
  const location = useLocation()

  useEffect(() => {
    trackPageView({
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname
    })
  }, [location])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/grade-calc" element={<GradeCalc />} />
          <Route path="/email-gen" element={<EmailGen />} />
          <Route path="/deadlines" element={<Deadlines />} />
          <Route path="/citation" element={<Citation />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/decision" element={<Decision />} />
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
          <Route path="/all-tools" element={<AllToolsHub />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
