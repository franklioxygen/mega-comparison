import React, { useState, useRef, useEffect } from 'react';

interface FocalLengthProps {
  selectedPixels: number[];
}

// Function to calculate field of view based on focal length
function focalLengthToFOV(focalLength: number, sensorWidth = 36) {
  // Calculate field of view in degrees
  const radians = 2 * Math.atan(sensorWidth / (2 * focalLength));
  const degrees = radians * (180 / Math.PI);
  return degrees;
}

const FocalLength: React.FC<FocalLengthProps> = ({ selectedPixels }) => {
  const [focalLength, setFocalLength] = useState(50); // Default 50mm focal length
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate FOV
  const fov = focalLengthToFOV(focalLength);
  
  // Calculate view rectangle size based on FOV
  const calculateViewRect = () => {
    if (!imageSize.width) return { width: 0, height: 0, left: 0, top: 0 };
    
    // Assume full image width represents a 10mm focal length view (widest view)
    const widestFocalLength = 10; // mm
    const widestFOV = focalLengthToFOV(widestFocalLength);
    
    // Calculate scale based on the ratio of current FOV to the widest FOV
    // At 10mm, this will be 1.0 (full width)
    // At larger focal lengths, this will be smaller (e.g., at 50mm, around 0.2)
    const scale = fov / widestFOV;
    
    // Maintain aspect ratio based on FOV calculation
    // Standard 3:2 aspect ratio for most cameras
    const aspectRatio = 3/2;
    
    // Calculate width and height
    const width = imageSize.width * scale;
    const height = width / aspectRatio;
    
    // Center the rectangle
    const left = (imageSize.width - width) / 2;
    const top = (imageSize.height - height) / 2;
    
    return { width, height, left, top };
  };
  
  const viewRect = calculateViewRect();
  
  // Update image dimensions when it loads
  useEffect(() => {
    const updateImageSize = () => {
      if (imageRef.current && containerRef.current) {
        const { width, height } = imageRef.current.getBoundingClientRect();
        setImageSize({ width, height });
      }
    };
    
    // Update size on load
    if (imageRef.current) {
      imageRef.current.onload = updateImageSize;
      
      // If already loaded, update size immediately
      if (imageRef.current.complete) {
        updateImageSize();
      }
    }
    
    // Update on window resize
    window.addEventListener('resize', updateImageSize);
    return () => window.removeEventListener('resize', updateImageSize);
  }, []);
  
  // Focal length presets
  const focalPresets = [14, 24, 35, 50, 85, 135, 200];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Focal Length Visualizer</h2>
      
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-800">Focal Length: {focalLength}mm</span>
            <span className="text-gray-600">Field of View: {fov.toFixed(1)}°</span>
          </div>
          
          <input
            type="range"
            min="10"
            max="200"
            step="1"
            value={focalLength}
            onChange={(e) => setFocalLength(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          
          <div className="flex flex-wrap gap-2 mt-3">
            {focalPresets.map(preset => (
              <button
                key={preset}
                onClick={() => setFocalLength(preset)}
                className={`px-2 py-1 text-xs rounded ${
                  focalLength === preset 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {preset}mm
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="relative mb-6 bg-gray-100 rounded-lg overflow-hidden"
      >
        <img
          ref={imageRef}
          src="/images/origin.png"
          alt="Original scene for focal length comparison"
          className="w-full h-auto"
          draggable="false"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder.svg';
          }}
        />
        
        {/* View rectangle overlay */}
        <div
          className="absolute border-4 border-red-500 pointer-events-none transition-all duration-300"
          style={{
            width: `${viewRect.width}px`,
            height: `${viewRect.height}px`,
            left: `${viewRect.left}px`,
            top: `${viewRect.top}px`,
          }}
        />
      </div>
      
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-medium text-gray-700 mb-2">About Focal Length</h3>
        <p className="text-sm text-gray-600 mb-2">
          Focal length determines the field of view (FOV) of a camera. A shorter focal length 
          (e.g., 14mm) gives a wider view, while a longer focal length (e.g., 200mm) produces a 
          narrower, zoomed-in view.
        </p>
        <p className="text-sm text-gray-600">
          The red rectangle represents what would be visible in the frame at the 
          selected focal length, assuming the full image width is visible at 10mm.
          This is a simplified visualization based on a full-frame (36mm) sensor.
        </p>
      </div>
    </div>
  );
};

export default FocalLength; 