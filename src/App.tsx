import { useState } from 'react'
import FocalLength from './components/FocalLength'
import ImageGallery from './components/ImageGallery'
import PixelComparison from './components/PixelComparison'

const App = () => {
  const [selectedPixels, setSelectedPixels] = useState<number[]>([])
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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          MegaComparison
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A visual comparison tool for digital camera resolutions. Select different megapixel options to compare their relative sizes.
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
        <p>© {new Date().getFullYear()} MegaComparison - A digital camera pixel comparison tool</p>
      </footer>
    </div>
  )
}

export default App 