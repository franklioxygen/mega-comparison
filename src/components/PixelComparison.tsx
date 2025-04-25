import React, { useState } from 'react';

interface PixelComparisonProps {
  selectedPixels: number[];
}

// Real dimensions for each megapixel option
const pixelDimensions: Record<number, { width: number; height: number }> = {
  10: { width: 3888, height: 2592 },
  20: { width: 5472, height: 3648 },
  30: { width: 6720, height: 4480 },
  40: { width: 7744, height: 5163 },
  60: { width: 9504, height: 6336 },
  100: { width: 11648, height: 8736 }
};

// Function to calculate scaled dimensions for display
const calculateDimensions = (megapixels: number): { width: number; height: number } => {
  const dimensions = pixelDimensions[megapixels];
  
  // Use a fixed scale factor for all resolutions to maintain the exact relative sizes
  const scaleFactor = 0.05; // Adjust this to make blocks fit on screen
  
  // Apply the same scale factor to all resolutions to maintain exact relative sizes
  const width = dimensions.width * scaleFactor;
  const height = dimensions.height * scaleFactor;
  
  return { width, height };
};

const PixelComparison: React.FC<PixelComparisonProps> = ({ selectedPixels }) => {
  const [isStacked, setIsStacked] = useState(false);
  
  // Always sort pixels by size for consistent ordering
  // In stacked view, we'll render them in this order (large to small)
  // For non-stacked view, we'll reverse when displaying
  const sortedPixels = [...selectedPixels].sort((a, b) => b - a); // Largest to smallest
  
  // Find dimensions of largest selected resolution for container sizing
  let maxWidth = 0;
  let maxHeight = 0;
  
  selectedPixels.forEach(pixels => {
    const { width, height } = calculateDimensions(pixels);
    maxWidth = Math.max(maxWidth, width);
    maxHeight = Math.max(maxHeight, height);
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Size Comparison</h2>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">Stack Blocks</span>
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={isStacked}
              onChange={() => setIsStacked(!isStacked)}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>
      </div>
      
      {isStacked ? (
        // Stacked view - blocks overlay each other with centers aligned
        <div 
          className="relative mx-auto my-10" 
          style={{
            width: `${maxWidth}px`,
            height: `${maxHeight}px`,
            minHeight: '400px'
          }}
        >
          {/* Render largest to smallest so smaller ones are placed later in DOM (higher z-index) */}
          {sortedPixels.map((pixels, index) => {
            const { width, height } = calculateDimensions(pixels);
            const actualDimensions = pixelDimensions[pixels];
            
            // Calculate positioning to center this block relative to container
            const leftOffset = (maxWidth - width) / 2;
            const topOffset = (maxHeight - height) / 2;
            
            // Higher z-index for smaller resolutions to ensure they're on top
            // First items in sortedPixels are largest (lowest z-index)
            // Last items are smallest (highest z-index)
            const zIndex = index + 1; // Smaller pixels (later items) get higher z-index
            
            return (
              <div 
                key={pixels} 
                className="absolute"
                style={{
                  left: `${leftOffset}px`,
                  top: `${topOffset}px`,
                  zIndex,
                }}
              >
                <div
                  className="pixel-block bg-blue-50 hover:bg-blue-100 relative border-2 border-gray-400"
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    minWidth: '40px',
                    minHeight: '30px',
                  }}
                >
                  <div className="absolute bottom-0 left-0 right-0 bg-opacity-60 text-grey text-xs py-1">
                    {pixels} MP ({actualDimensions.width} × {actualDimensions.height})
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Regular view - blocks are stacked vertically with smaller on top
        <div className="flex flex-col items-center justify-center space-y-8 py-4">
          {/* For non-stacked view, we want smallest on top, so reverse the order */}
          {[...sortedPixels].reverse().map(pixels => {
            const { width, height } = calculateDimensions(pixels);
            const actualDimensions = pixelDimensions[pixels];
            
            return (
              <div key={pixels} className="flex flex-col items-center mb-8">
                <div
                  className="pixel-block bg-blue-50 hover:bg-blue-100 mb-2 relative"
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    minWidth: '40px',
                    minHeight: '30px',
                  }}
                >
                  <div className="text-xs md:text-sm font-medium">
                    {pixels} MP
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {actualDimensions.width} × {actualDimensions.height} pixels
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  ({(actualDimensions.width * actualDimensions.height).toLocaleString()} total pixels)
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-medium text-gray-700 mb-2">About This Comparison</h3>
        <p className="text-sm text-gray-600">
          This visual representation shows the exact relative sizes of different camera resolutions. 
          All blocks are scaled by the same factor, maintaining the precise proportional differences between 
          resolutions. {isStacked 
            ? "In stack mode, all blocks are perfectly centered and layered with smaller resolutions on top of larger ones."
            : "Toggle the stack option to view blocks stacked on top of each other with their centers aligned."}
        </p>
      </div>
    </div>
  );
};

export default PixelComparison; 