import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/languageContext';

interface FocalLengthProps {
}

// Function to calculate field of view based on focal length
function focalLengthToFOV(focalLength: number, sensorWidth = 36) {
  // Calculate field of view in degrees
  const radians = 2 * Math.atan(sensorWidth / (2 * focalLength));
  const degrees = radians * (180 / Math.PI);
  return degrees;
}

const FocalLength: React.FC<FocalLengthProps> = () => {
  const { t } = useLanguage();
  const [focalLength, setFocalLength] = useState(50); // Default 50mm focal length
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRectRef = useRef<HTMLDivElement>(null);
  const cropViewRef = useRef<HTMLDivElement>(null);

  // Calculate FOV
  const fov = focalLengthToFOV(focalLength);
  
  // Calculate view rectangle size based on FOV
  const calculateViewRect = () => {
    if (!imageSize.width) return { width: 0, height: 0 };
    
    // Assume full image width represents a 10mm focal length view (widest view)
    const widestFocalLength = 10; // mm
    const widestFOV = focalLengthToFOV(widestFocalLength);
    
    // Calculate scale based on the ratio of current FOV to the widest FOV
    const scale = fov / widestFOV;
    
    // Maintain aspect ratio based on FOV calculation
    const aspectRatio = 3/2;
    
    // Calculate width and height
    const width = imageSize.width * scale;
    const height = width / aspectRatio;
    
    return { width, height };
  };
  
  const viewRect = calculateViewRect();

  // Handle click events for positioning
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !viewRectRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Calculate click position relative to container
    const clickX = e.clientX - containerRect.left;
    const clickY = e.clientY - containerRect.top;
    
    // Calculate new position, centering the view rectangle on the click
    let newX = clickX - (viewRect.width / 2);
    let newY = clickY - (viewRect.height / 2);
    
    // Add bounds checking
    const maxX = containerRect.width - viewRect.width;
    const maxY = containerRect.height - viewRect.height;
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    setPosition({ x: newX, y: newY });
  };
  
  // Update image dimensions when it loads
  useEffect(() => {
    const updateImageSize = () => {
      if (imageRef.current && containerRef.current) {
        const { width, height } = imageRef.current.getBoundingClientRect();
        setImageSize({ width, height });
        // Reset position when image size changes
        setPosition({ x: (width - viewRect.width) / 2, y: (height - viewRect.height) / 2 });
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
  }, [viewRect.width, viewRect.height]);

  // Reset position when focal length changes
  useEffect(() => {
    if (imageSize.width && imageSize.height) {
      const rect = calculateViewRect();
      setPosition({
        x: (imageSize.width - rect.width) / 2,
        y: (imageSize.height - rect.height) / 2
      });
    }
  }, [focalLength]);
  
  // Focal length presets
  const focalPresets = [14, 24, 35, 50, 85, 135, 200];

  // Calculate styles for the crop view (zoomed in area)
  const getCropViewStyle = () => {
    if (!imageRef.current) return {};
    
    const imgSrc = imageRef.current.src;
    const imageWidth = imageSize.width;
    const imageHeight = imageSize.height;
    
    // Calculate scale factors
    const scaleFactorX = imageRef.current.naturalWidth / imageWidth;
    const scaleFactorY = imageRef.current.naturalHeight / imageHeight;
    
    // Calculate crop position in terms of the original image
    const cropX = position.x * scaleFactorX;
    const cropY = position.y * scaleFactorY;
    
    // Calculate size of crop area in terms of the original image
    const cropWidth = viewRect.width * scaleFactorX;
    const cropHeight = viewRect.height * scaleFactorY;
    
    // Calculate the size of the crop view container
    const containerWidth = 300; // fixed width for the crop view
    const containerHeight = (containerWidth / viewRect.width) * viewRect.height;
    
    return {
      backgroundImage: `url(${imgSrc})`,
      backgroundSize: `${imageRef.current.naturalWidth * (containerWidth / cropWidth)}px ${imageRef.current.naturalHeight * (containerHeight / cropHeight)}px`,
      backgroundPosition: `-${cropX * (containerWidth / cropWidth)}px -${cropY * (containerHeight / cropHeight)}px`,
      width: `${containerWidth}px`,
      height: `${containerHeight}px`,
    };
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('focal.title')}</h2>
      
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-800">{t('focal.length')} {focalLength}{t('focal.mm')}</span>
            <span className="text-gray-600">{t('focal.fov')} {fov.toFixed(1)}{t('focal.degrees')}</span>
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
                {preset}{t('focal.mm')}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="flex flex-col justify-start items-center">
          <div className="mb-2 text-sm font-medium text-gray-700">{t('focal.selected')} ({focalLength}{t('focal.mm')})</div>
          <div
            ref={cropViewRef}
            className="bg-gray-100 rounded-lg overflow-hidden shadow-md"
            style={getCropViewStyle()}
          />
          <div className="mt-2 text-xs text-gray-500 italic text-center">
            {t('focal.appears')} {focalLength}{t('focal.mm')}
          </div>
        </div>
        <div className="md:col-span-2">
          <div 
            ref={containerRef}
            className="relative bg-gray-100 rounded-lg overflow-hidden cursor-crosshair"
            onClick={handleContainerClick}
          >
            <img
              ref={imageRef}
              src={`${import.meta.env.BASE_URL}images/origin.png`}
              alt="Original scene for focal length comparison"
              className="w-full h-auto select-none"
              draggable="false"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `${import.meta.env.BASE_URL}images/placeholder.svg`;
              }}
            />
            
            {/* View rectangle overlay */}
            <div
              ref={viewRectRef}
              className="absolute border-4 border-red-500 pointer-events-none transition-all duration-300"
              style={{
                width: `${viewRect.width}px`,
                height: `${viewRect.height}px`,
                left: `${position.x}px`,
                top: `${position.y}px`,
              }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-2 italic">
            {t('focal.click')}
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-medium text-gray-700 mb-2">{t('focal.about.title')}</h3>
        <p className="text-sm text-gray-600">
          {t('focal.about.description')}
        </p>
      </div>
    </div>
  );
};

export default FocalLength; 