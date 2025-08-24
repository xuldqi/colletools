import { Link } from 'react-router-dom'
import { FileText, Split, ArrowRightLeft, Database, FileSpreadsheet, Code } from 'lucide-react'

const FileTools = () => {
  const tools = [
    {
      id: 'csv-split',
      title: 'CSV Split',
      description: 'Split large CSV files into smaller chunks',
      icon: Split,
      popular: true
    },
    {
      id: 'excel-split',
      title: 'Excel Split',
      description: 'Split Excel files by rows or sheets',
      icon: FileSpreadsheet,
      popular: true
    },
    {
      id: 'xml-to-excel',
      title: 'XML to Excel',
      description: 'Convert XML files to Excel format',
      icon: ArrowRightLeft,
      popular: false
    },
    {
      id: 'excel-to-xml',
      title: 'Excel to XML',
      description: 'Convert Excel files to XML format',
      icon: ArrowRightLeft,
      popular: false
    },
    {
      id: 'csv-to-excel',
      title: 'CSV to Excel',
      description: 'Convert CSV files to Excel format',
      icon: ArrowRightLeft,
      popular: true
    },
    {
      id: 'xml-to-csv',
      title: 'XML to CSV',
      description: 'Convert XML files to CSV format',
      icon: ArrowRightLeft,
      popular: false
    },
    {
      id: 'xml-to-json',
      title: 'XML to JSON',
      description: 'Convert XML files to JSON format',
      icon: Code,
      popular: true
    },
    {
      id: 'json-to-xml',
      title: 'JSON to XML',
      description: 'Convert JSON files to XML format',
      icon: Code,
      popular: false
    },
    {
      id: 'csv-to-json',
      title: 'CSV to JSON',
      description: 'Convert CSV files to JSON format',
      icon: Database,
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">File Tools</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert, split, and manipulate various file formats including CSV, Excel, XML, and JSON.
            Perfect for data processing and file management tasks.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const IconComponent = tool.icon
            return (
              <Link
                key={tool.id}
                to={`/tool/${tool.id}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-orange-300"
              >
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <IconComponent className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {tool.title}
                      </h3>
                      {tool.popular && (
                        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {tool.description}
                    </p>
                    <div className="flex items-center text-orange-600 text-sm font-medium group-hover:text-orange-700">
                      Use Tool
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Our File Tools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Split className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Splitting</h3>
              <p className="text-gray-600 text-sm">
                Intelligently split large files while preserving data integrity and structure.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ArrowRightLeft className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Format Conversion</h3>
              <p className="text-gray-600 text-sm">
                Convert between popular data formats with high accuracy and speed.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Database className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Preservation</h3>
              <p className="text-gray-600 text-sm">
                Maintain data types, formatting, and relationships during conversion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileTools