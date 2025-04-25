import React, { useEffect, useRef, useState } from 'react';

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

const PixelComparison: React.FC<PixelComparisonProps> = ({ selectedPixels }) => {
  const [isStacked, setIsStacked] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth - 48); // Subtract padding
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Function to calculate scaled dimensions for display
  const calculateDimensions = (megapixels: number): { width: number; height: number } => {
    const dimensions = pixelDimensions[megapixels];
    const maxImageWidth = pixelDimensions[100].width; // Width of 100MP image
    
    // Calculate scale factor based on container width
    // If container is smaller than 100MP image, use container width as reference
    const baseWidth = Math.min(containerWidth, maxImageWidth);
    const scaleFactor = baseWidth / maxImageWidth;
    
    // Apply the scale factor to maintain relative sizes
    const width = dimensions.width * scaleFactor;
    const height = dimensions.height * scaleFactor;
    
    return { width, height };
  };
  
  // Always sort pixels by size for consistent ordering
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
    <div className="p-6" ref={containerRef}>
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
        <div className="relative mx-auto my-10 overflow-hidden">
          <div 
            className="relative"
            style={{
              width: `${maxWidth}px`,
              height: `${maxHeight}px`,
              minHeight: '200px',
              maxWidth: '100%',
              margin: '0 auto'
            }}
          >
            {sortedPixels.map((pixels, index) => {
              const { width, height } = calculateDimensions(pixels);
              const actualDimensions = pixelDimensions[pixels];
              
              // Calculate positioning to center this block relative to container
              const leftOffset = (maxWidth - width) / 2;
              const topOffset = (maxHeight - height) / 2;
              const zIndex = index + 1;
              
              return (
                <div 
                  key={pixels} 
                  className="absolute transform-gpu"
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
                    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-75 text-gray-700 text-xs py-1 px-2">
                      {pixels} MP ({actualDimensions.width} × {actualDimensions.height})
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Regular view - blocks are stacked vertically with smaller on top
        <div className="flex flex-col items-center justify-center space-y-8 py-4">
          {[...sortedPixels].reverse().map(pixels => {
            const { width, height } = calculateDimensions(pixels);
            const actualDimensions = pixelDimensions[pixels];
            
            return (
              <div key={pixels} className="flex flex-col items-center mb-8 w-full">
                <div
                  className="pixel-block bg-blue-50 hover:bg-blue-100 mb-2 relative"
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    minWidth: '40px',
                    minHeight: '30px',
                    maxWidth: '100%'
                  }}
                >
                  <div className="text-xs md:text-sm font-medium absolute top-2 left-2 bg-white bg-opacity-75 px-2 py-1 rounded">
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
          All blocks are scaled proportionally to maintain the exact size relationships between 
          resolutions. {isStacked 
            ? "In stack mode, all blocks are perfectly centered and layered with smaller resolutions on top of larger ones."
            : "Toggle the stack option to view blocks stacked on top of each other with their centers aligned."}
        </p>
      </div>
    </div>
  );
};

export default PixelComparison; 