import { useState } from 'react'
import FocalLength from './components/FocalLength'
import ImageGallery from './components/ImageGallery'
import PixelComparison from './components/PixelComparison'

const App = () => {
  const [selectedPixels, setSelectedPixels] = useState<number[]>([10, 40])
  const [activeTab, setActiveTab] = useState<'size' | 'gallery' | 'focal'>('size')
  
  const megapixelOptions = [10, 20, 30, 40, 60, 100]
  
  const handleTogglePixel = (pixel: number) => {
    setSelectedPixels(prev => 
      prev.includes(pixel) 
        ? prev.filter(p => p !== pixel) 
        : [...prev, pixel].sort((a, b) => a - b)
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          MegaComparison
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Compare camera sensors from 10MP to 100MP, with visual examples of resolution differences.
        </p>
      </header>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 text-md font-medium ${
              activeTab === 'size' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('size')}
          >
            Size Comparison
          </button>
          <button
            className={`px-6 py-3 text-md font-medium ${
              activeTab === 'gallery' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('gallery')}
          >
            Image Gallery
          </button>
          <button
            className={`px-6 py-3 text-md font-medium ${
              activeTab === 'focal' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('focal')}
          >
            Focal Length
          </button>
        </div>

        {/* Controls - Only show for size and gallery tabs */}
        {(activeTab === 'size' || activeTab === 'gallery') && (
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Resolutions to Compare</h2>
            
            <div className="flex flex-wrap gap-3">
              {megapixelOptions.map(pixel => (
                <label key={pixel} className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox rounded text-blue-500 h-5 w-5"
                    checked={selectedPixels.includes(pixel)}
                    onChange={() => handleTogglePixel(pixel)}
                  />
                  <span className="ml-2 text-gray-700">{pixel} Megapixels</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'size' && selectedPixels.length > 0 && (
          <PixelComparison selectedPixels={selectedPixels} />
        )}
        
        {activeTab === 'gallery' && selectedPixels.length > 0 && (
          <ImageGallery selectedPixels={selectedPixels} />
        )}
        
        {activeTab === 'focal' && (
          <FocalLength />
        )}
        
        {(activeTab !== 'focal' && selectedPixels.length === 0) && (
          <div className="p-6 text-center text-gray-500">
            Please select at least one resolution option to compare
          </div>
        )}
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} MegaComparison - A digital camera specs comparison tool</p>
        <a 
          href="https://github.com/franklioxygen/mega-comparison"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg height="20" width="20" viewBox="0 0 16 16" className="fill-current">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <span>View on GitHub</span>
        </a>
      </footer>
    </div>
  )
}

export default App 