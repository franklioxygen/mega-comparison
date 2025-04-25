import React from 'react';

interface ImageGalleryProps {
  selectedPixels: number[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ selectedPixels }) => {
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

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Image Gallery</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {selectedPixels.map(pixels => {
          const dimensions = pixelDimensions[pixels];
          
          return (
            <div key={pixels} className="flex flex-col">
              <div className="bg-gray-100 rounded-lg p-2 mb-3">
                <img 
                  src={getImagePath(pixels)} 
                  alt={`${pixels} Megapixel sample image`}
                  className="w-full rounded"
                  draggable="false"
                  style={{ 
                    width: '582px',
                    height: '437px',
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }}
                  // Fallback if image doesn't exist
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `${import.meta.env.BASE_URL}images/placeholder.svg`;
                  }}
                />
              </div>
              <div className="text-center">
                <h3 className="font-medium text-gray-800">{pixels} Megapixels</h3>
                <p className="text-sm text-gray-500">
                  Actual dimensions: {dimensions.width} × {dimensions.height}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  ({(dimensions.width * dimensions.height).toLocaleString()} total pixels)
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-medium text-gray-700 mb-2">About This Gallery</h3>
        <p className="text-sm text-gray-600">
          This gallery shows sample images for each megapixel resolution, all displayed at the same size (582×437 pixels).
          Unlike the size comparison tab, these images do not reflect the actual relative sizes, allowing you to focus on 
          detail and quality differences between different resolutions.
        </p>
      </div>
    </div>
  );
};

export default ImageGallery; 