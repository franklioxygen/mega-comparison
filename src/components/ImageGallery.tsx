import React, { useEffect, useRef, useState } from 'react';

interface ImageGalleryProps {
  selectedPixels: number[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ selectedPixels }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width;
        // Account for grid gap and padding
        setContainerWidth((width - 24) / 2); // 24px is the gap between columns
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Create sample image paths based on megapixel values
  const getImagePath = (megapixels: number) => {
    // Using the full path from the public directory
    return `${import.meta.env.BASE_URL}images/${megapixels}.jpg`;
  };

  // Real dimensions for each megapixel option
  const pixelDimensions: Record<number, { width: number; height: number }> = {
    10: { width: 3888, height: 2592 },
    20: { width: 5472, height: 3648 },
    30: { width: 6720, height: 4480 },
    40: { width: 7744, height: 5163 },
    60: { width: 9504, height: 6336 },
    100: { width: 11648, height: 8736 }
  };

  // Calculate display dimensions maintaining aspect ratio
  const calculateDisplayDimensions = (pixels: number) => {
    const dimensions = pixelDimensions[pixels];
    const aspectRatio = dimensions.height / dimensions.width;
    
    // On mobile (when containerWidth is less than 400px), use full width
    const width = containerWidth < 400 ? containerWidth * 2 : containerWidth;
    const height = width * aspectRatio;

    return { width, height };
  };

  return (
    <div className="p-6" ref={containerRef}>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Image Gallery</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {selectedPixels.map(pixels => {
          const dimensions = pixelDimensions[pixels];
          const displayDimensions = calculateDisplayDimensions(pixels);
          
          return (
            <div key={pixels} className="flex flex-col">
              <div className="bg-gray-100 rounded-lg p-2 mb-3 relative">
                <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded px-2 py-1 z-10">
                  <h3 className="font-medium text-gray-800">{pixels} MP</h3>
                  <p className="text-xs text-gray-500">
                    {dimensions.width} × {dimensions.height}
                  </p>
                </div>
                <img 
                  src={getImagePath(pixels)} 
                  alt={`${pixels} Megapixel sample image`}
                  className="w-full h-full rounded object-contain"
                  draggable="false"
                  style={{ 
                    width: `${displayDimensions.width}px`,
                    height: `${displayDimensions.height}px`,
                    maxWidth: '100%'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `${import.meta.env.BASE_URL}images/placeholder.svg`;
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-medium text-gray-700 mb-2">About This Gallery</h3>
        <p className="text-sm text-gray-600">
          This gallery shows sample images for each megapixel resolution, maintaining their original aspect ratios.
          Each image is displayed at a size that fits your screen while preserving the relative proportions of the original resolution.
          The dimensions shown represent the actual pixel dimensions of the camera sensor at each megapixel setting.
        </p>
      </div>
    </div>
  );
};

export default ImageGallery; 