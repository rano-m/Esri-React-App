import React, { useEffect, useRef } from 'react';
import * as Loaders from 'esri-loader'; // Using esri-loader

const Map = () => {
  const mapDiv = useRef(null);

  useEffect(() => {
    const loadModules = [
      'esri/Map',
      'esri/views/MapView',
      // Add other necessary modules for your map (basemap, layers, etc.)
    ];

    Loaders.loadModules(loadModules)
      .then(([Map, MapView, ...rest]) => {
        const map = new Map({
          basemap: 'streets-vector' // Replace with your hosted map ID or basemap URL
        });
        const view = new MapView({
          container: mapDiv.current,
          map: map
        });

        // Add custom logic for interacting with the map (optional)

        return () => {
          if (view) {
            // Cleanup logic for the map and view (if needed)
            view.destroy();
          }
        };
      })
      .catch((err) => console.error('Error loading Esri modules:', err));
  }, []);

  return <div ref={mapDiv} style={{ width: '100vw', height: '400px' }} />;
};

export default Map;
