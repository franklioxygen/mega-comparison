import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/languageContext';

interface SensorComparisonProps {
  selectedSensors: string[];
}

// Sensor dimensions data
const sensorDimensions: Record<string, { width: number; height: number; name: string }> = {
  'medium-format': { width: 53, height: 40, name: 'Medium Format' },
  'full-frame': { width: 36, height: 24, name: 'Full Frame (35mm)' },
  'aps-c': { width: 23.6, height: 15.6, name: 'APS-C' },
  'm43': { width: 17.3, height: 13, name: 'M43' },
  '1-inch': { width: 13.2, height: 8.8, name: '1 inch' },
  '2-3-inch': { width: 8.8, height: 6.6, name: '2/3 inch' },
  '1-1.7-inch': { width: 7.6, height: 5.7, name: '1/1.7 inch' },
  '1-2.3-inch': { width: 6.3, height: 4.7, name: '1/2.3 inch' },
  '1-3-inch': { width: 4.8, height: 3.6, name: '1/3 inch' }
};

const SensorComparison: React.FC<SensorComparisonProps> = ({ selectedSensors }) => {
  const { t, language } = useLanguage();
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
  const calculateDimensions = (sensorKey: string): { width: number; height: number } => {
    const dimensions = sensorDimensions[sensorKey];
    const maxSensorWidth = sensorDimensions['medium-format'].width; // Width of medium format sensor
    
    // Calculate scale factor based on container width
    // If container is smaller than medium format sensor, use container width as reference
    const baseWidth = Math.min(containerWidth, 600); // Limit max width to 600px
    const scaleFactor = baseWidth / maxSensorWidth;
    
    // Apply the scale factor to maintain relative sizes
    const width = dimensions.width * scaleFactor;
    const height = dimensions.height * scaleFactor;
    
    return { width, height };
  };
  
  // Always sort sensors by size for consistent ordering
  const sortedSensors = [...selectedSensors].sort((a, b) => 
    (sensorDimensions[b].width * sensorDimensions[b].height) - 
    (sensorDimensions[a].width * sensorDimensions[a].height)
  );
  
  // Find dimensions of largest selected sensor for container sizing
  let maxWidth = 0;
  let maxHeight = 0;
  
  selectedSensors.forEach(sensor => {
    const { width, height } = calculateDimensions(sensor);
    maxWidth = Math.max(maxWidth, width);
    maxHeight = Math.max(maxHeight, height);
  });

  return (
    <div className="p-6" ref={containerRef}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{t('sensor.title')}</h2>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">{t('sensor.stack')}</span>
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
        // Stacked view - sensors overlay each other with centers aligned
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
            {sortedSensors.map((sensor, index) => {
              const { width, height } = calculateDimensions(sensor);
              const actualDimensions = sensorDimensions[sensor];
              
              // Calculate positioning to center this block relative to container
              const leftOffset = (maxWidth - width) / 2;
              const topOffset = (maxHeight - height) / 2;
              const zIndex = index + 1;
              
              return (
                <div 
                  key={sensor} 
                  className="absolute transform-gpu"
                  style={{
                    left: `${leftOffset}px`,
                    top: `${topOffset}px`,
                    zIndex,
                  }}
                >
                  <div
                    className="sensor-block bg-blue-50 hover:bg-blue-100 relative border-2 border-gray-400"
                    style={{
                      width: `${width}px`,
                      height: `${height}px`,
                      minWidth: '40px',
                      minHeight: '30px',
                    }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-75 text-gray-700 text-xs py-1 px-2">
                      {actualDimensions.name} ({actualDimensions.width}×{actualDimensions.height}mm)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Regular view - sensors are stacked vertically with smaller on top
        <div className="flex flex-col items-center justify-center space-y-8 py-4">
          {[...sortedSensors].reverse().map(sensor => {
            const { width, height } = calculateDimensions(sensor);
            const actualDimensions = sensorDimensions[sensor];
            
            return (
              <div key={sensor} className="flex flex-col items-center mb-8 w-full">
                <div
                  className="sensor-block bg-blue-50 hover:bg-blue-100 mb-2 relative"
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    minWidth: '40px',
                    minHeight: '30px',
                    maxWidth: '100%'
                  }}
                >
                  <div className="text-xs md:text-sm font-medium absolute top-2 left-2 bg-white bg-opacity-75 px-2 py-1 rounded">
                    {actualDimensions.name}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {actualDimensions.width}×{actualDimensions.height}mm
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  ({(actualDimensions.width * actualDimensions.height).toFixed(1)} mm²)
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-medium text-gray-700 mb-2">{t('sensor.about.title')}</h3>
        <p className="text-sm text-gray-600">
          {t('sensor.about.description')}
        </p>
      </div>
    </div>
  );
};

export default SensorComparison; 