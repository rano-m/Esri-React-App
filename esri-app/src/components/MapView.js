// import React, { useEffect, useRef } from 'react';
// import * as Loaders from 'esri-loader'; // Using esri-loader

// const Map = () => {
//   const mapDiv = useRef(null);

//   useEffect(() => {
//     const loadModules = [
//       'esri/Map',
//       'esri/views/MapView',
//       // Add other necessary modules for your map (basemap, basemap, layers, etc.)
//     ];

//     Loaders.loadModules(loadModules)
//       .then(([Map, MapView, ...rest]) => {
//         console.log('Esri modules loaded successfully'); // Log successful loading
//         const map = new Map({
//           basemap: 'a52a26e90c5747339abdf2e80ae2aad6', // Replace with your hosted map ID or basemap URL
//         });
//         const view = new MapView({
//           container: mapDiv.current,
//           map: map,
//         });

//         // Add custom logic for interacting with the map (optional)

//         return () => {
//           if (view) {
//             // Cleanup logic for the map and view (if needed)
//             view.destroy();
//           }
//         };
//       })
//       .catch((err) => console.error('Error loading Esri modules:', err));
//   }, []);

//   return <div ref={mapDiv} style={{ width: '100vw', height: '400px' }} />;
// };

// export default Map;

// import React, { useRef, useEffect } from 'react';
// import { loadModules } from 'esri-loader';

// const MapView = () => {
//   const mapRef = useRef(null);

//   useEffect(() => {
//     // Lazy load the required ArcGIS API for JavaScript modules and CSS
//     loadModules([
//       'esri/Map',
//       'esri/views/MapView',
//       'esri/widgets/Search',
//     ], {
//       css: true,
//     }).then(([Map, MapView, Search]) => {
//       const map = new Map({
//         basemap: 'streets-navigation-vector',
//       });

//       const view = new MapView({
//         container: mapRef.current,
//         map: map,
//         center: [-118.805, 34.027], // Longitude, latitude
//         zoom: 13,
//       });

//       // Create a Search widget and add it to the view
//       const searchWidget = new Search({
//         view: view,
//       });

//       // Add the search widget to the top right corner of the view
//       view.ui.add(searchWidget, {
//         position: 'top-right',
//       });

//       // Clean up the view and search widget when the component unmounts
//       return () => {
//         if (view) {
//           view.destroy();
//         }
//       };
//     }).catch(err => {
//       console.error(err);
//     });
//   }, []);

//   return (
//     <div
//       className="webmap"
//       style={{ height: 800, width: '100%' }}
//       ref={mapRef}
//     ></div>
//   );
// };

// export default MapView;

import React, { useRef, useEffect, useState } from 'react';
import { loadModules } from 'esri-loader';

const MapView = () => {
  const mapRef = useRef(null);
  const [intersectingFeatures, setIntersectingFeatures] = useState([]);

  useEffect(() => {
    loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/widgets/Search',
      'esri/layers/FeatureLayer',
      'esri/Graphic',
    ], { css: true }).then(([Map, MapView, Search, FeatureLayer, Graphic]) => {
      const map = new Map({
        basemap: 'streets-navigation-vector',
      });

      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [ -75.5644, 39.2096], // Longitude, latitude
        zoom: 8,
      });

      const featureLayer = new FeatureLayer({
        url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternKindergarten_24_25_69ef0/FeatureServer' // Replace with your feature layer URL
      });

      map.add(featureLayer);

      const searchWidget = new Search({
        view: view,
      });

      view.ui.add(searchWidget, {
        position: 'top-right',
      });

      searchWidget.on('search-complete', (event) => {
        const point = event.results[0].results[0].feature.geometry;
        queryFeatures(point);
      });

      view.on('click', (event) => {
        queryFeatures(event.mapPoint);
      });

      const queryFeatures = (point) => {
        const query = featureLayer.createQuery();
        query.geometry = point;
        query.spatialRelationship = 'intersects';
        query.returnGeometry = true;
        query.outFields = ['*'];

        featureLayer.queryFeatures(query).then((results) => {
          setIntersectingFeatures(results.features);
        });
      };

    }).catch(err => {
      console.error(err);
    });
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      <div ref={mapRef} style={{ flex: 1 }}></div>
      <div style={{ width: '300px', padding: '10px', overflowY: 'auto' }}>
        <h3>Intersecting Features</h3>
        <ul>
          {intersectingFeatures.map((feature, index) => (
            <li key={index}>
              {feature.attributes.NAME || `Feature ${index + 1}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MapView;
