// import React, { useRef, useEffect, useState } from 'react';
// import { loadModules } from 'esri-loader';
// import '../App.css'

// const MapView = () => {
//   const mapRef = useRef(null);
//   const [intersectingFeatures, setIntersectingFeatures] = useState([]);
//   const [selectedFeature, setSelectedFeature] = useState(null);

//   useEffect(() => {
//     loadModules([
//       'esri/Map',
//       'esri/views/MapView',
//       'esri/widgets/Search',
//       'esri/layers/FeatureLayer',
//       'esri/Graphic',
//       'esri/symbols/PictureMarkerSymbol'
//     ], { css: true }).then(([Map, MapView, Search, FeatureLayer, Graphic, PictureMarkerSymbol]) => {
//       const map = new Map({
//         basemap: 'streets-navigation-vector',
//       });

//       const view = new MapView({
//         container: mapRef.current,
//         map: map,
//         center: [-75.5644, 39.2096], // Longitude, latitude
//         zoom: 7,
//       });

//       const featureLayers = [
//         new FeatureLayer({
//           url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternKindergarten_24_25_69ef0/FeatureServer',
//           outFields: ['*'],
//         }),
//         new FeatureLayer({
//           url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeEight_24_25/FeatureServer',
//           outFields: ['*'],
//         }),

//         // Add more feature layers here as needed
//       ];

//       featureLayers.forEach(layer => map.add(layer));

//       const searchWidget = new Search({
//         view: view,
//       });

//       view.ui.add(searchWidget, {
//         position: 'top-right',
//       });

//       searchWidget.on('search-complete', (event) => {
//         const point = event.results[0].results[0].feature.geometry;
//         view.goTo({
//           center: point,
//           zoom: 12,
//         });
//         addPinpoint(point);
//         queryFeatures(point);
//       });

//       view.on('click', (event) => {
//         view.goTo({
//           center: event.mapPoint,
//           zoom: 12,
//         });
//         addPinpoint(event.mapPoint);
//         queryFeatures(event.mapPoint);
//       });

//       const queryFeatures = (point) => {
//         let allIntersectingFeatures = [];
//         let allQueries = featureLayers.map((layer) => {
//           const query = layer.createQuery();
//           query.geometry = point;
//           query.spatialRelationship = 'intersects';
//           query.returnGeometry = true;
//           query.outFields = ['*'];
//           return layer.queryFeatures(query).then((results) => {
//             if (results.features.length > 0) {
//               allIntersectingFeatures = [...allIntersectingFeatures, ...results.features];
//             }
//           });
//         });

//         Promise.all(allQueries).then(() => {
//           setIntersectingFeatures(allIntersectingFeatures);
//           if (allIntersectingFeatures.length > 0) {
//             setSelectedFeature(allIntersectingFeatures[0]);
//           } else {
//             setSelectedFeature(null);
//           }
//         });
//       };

//       const addPinpoint = (point) => {
//         const symbol = new PictureMarkerSymbol({
//           url: 'https://static.arcgis.com/images/Symbols/Shapes/BluePin1LargeB.png',
//           width: '24px',
//           height: '24px'
//         });

//         const graphic = new Graphic({
//           geometry: point,
//           symbol: symbol
//         });

//         view.graphics.removeAll();
//         view.graphics.add(graphic);
//       };

//     }).catch(err => {
//       console.error(err);
//     });
//   }, []);

//   const renderFeatureDetails = (feature) => {
//     const fieldsToDisplay = ["SchoolName", "ReportCard", "Phone"];
//     return (
//       <div>
//         <h4>Feature Details</h4>
//         <ul>
//           {fieldsToDisplay.map((key, index) => (
//             <li key={index}>
//               <strong>{key}:</strong> {feature.attributes[key]}
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   };

//   return (
//     <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
//       <div ref={mapRef} style={{ flex: 1 }}></div>
//       <div style={{ width: '300px', padding: '10px', overflowY: 'auto' }}>
//         <h3>Intersecting Features</h3>
//         <ul>
//           {intersectingFeatures.map((feature, index) => (
//             <li key={index} onClick={() => setSelectedFeature(feature)}>
//               {feature.attributes.SchoolName || `Feature ${index + 1}`}
//             </li>
//           ))}
//         </ul>
//         {selectedFeature && renderFeatureDetails(selectedFeature)}
//       </div>
//     </div>
//   );
// };

// export default MapView;

import React, { useRef, useEffect, useState } from 'react';
import { loadModules } from 'esri-loader';
import '../App.css';

const MapView = () => {
  const mapRef = useRef(null);
  const [intersectingFeatures, setIntersectingFeatures] = useState({});
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/widgets/Search',
      'esri/layers/FeatureLayer',
      'esri/Graphic',
      'esri/symbols/PictureMarkerSymbol'
    ], { css: true }).then(([Map, MapView, Search, FeatureLayer, Graphic, PictureMarkerSymbol]) => {
      const map = new Map({
        basemap: 'streets-navigation-vector',
      });

      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [-75.5644, 39.2096], // Longitude, latitude
        zoom: 7,
      });

      const layerConfigs = [
        {
          url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternKindergarten_24_25_69ef0/FeatureServer',
          name: 'Kindergarten'
        },
        {
          url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeEight_24_25/FeatureServer',
          name: '8th Grade'
        },

        // Add more layer configs here as needed
      ];

      const featureLayers = layerConfigs.map(config => {
        const layer = new FeatureLayer({
          url: config.url,
          outFields: ['*'],
        });
        layer.customName = config.name;
        map.add(layer);
        return layer;
      });

      const searchWidget = new Search({
        view: view,
      });

      view.ui.add(searchWidget, {
        position: 'top-right',
      });

      const addPinpoint = (point) => {
        const symbol = new PictureMarkerSymbol({
          url: 'https://static.arcgis.com/images/Symbols/Shapes/BluePin1LargeB.png',
          width: '24px',
          height: '24px'
        });

        const graphic = new Graphic({
          geometry: point,
          symbol: symbol
        });

        view.graphics.removeAll();
        view.graphics.add(graphic);
      };

      searchWidget.on('search-complete', (event) => {
        const point = event.results[0].results[0].feature.geometry;
        view.goTo({
          center: point,
          zoom: 10,
        });
        addPinpoint(point);
        queryFeatures(point);
      });

      view.on('click', (event) => {
        view.goTo({
          center: event.mapPoint,
          zoom: 10,
        });
        addPinpoint(event.mapPoint);
        queryFeatures(event.mapPoint);
      });

      const queryFeatures = (point) => {
        let allIntersectingFeatures = {};
        let allQueries = featureLayers.map((layer) => {
          const query = layer.createQuery();
          query.geometry = point;
          query.spatialRelationship = 'intersects';
          query.returnGeometry = true;
          query.outFields = ['*'];
          return layer.queryFeatures(query).then((results) => {
            if (results.features.length > 0) {
              allIntersectingFeatures[layer.customName] = results.features;
            }
          });
        });

        Promise.all(allQueries).then(() => {
          setIntersectingFeatures(allIntersectingFeatures);
          if (Object.values(allIntersectingFeatures).flat().length > 0) {
            setSelectedFeature(Object.values(allIntersectingFeatures).flat()[0]);
          } else {
            setSelectedFeature(null);
          }
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
        <h3>Map Application</h3>
        <h3>Intersecting Features</h3>
        {Object.keys(intersectingFeatures).map((layerName, index) => (
          <div key={index}>
            <table className="feature-list">
              <thead>
                <tr>
                  <th>{layerName}</th>
                </tr>
              </thead>
              <tbody>
                {intersectingFeatures[layerName].map((feature, featureIndex) => (
                  <tr key={featureIndex} onClick={() => setSelectedFeature(feature)}>
                    <td>
                      <div>
                        <strong>School Name:</strong> {feature.attributes.SchoolName || `Feature ${featureIndex + 1}`}
                      </div>
                      <div>
                        <strong>Report Card:</strong> <a href={feature.attributes.Report_Card}>{'Click to view'}</a>
                      </div>
                      <div>
                        <strong>Phone:</strong> {feature.attributes.Phone}
                      </div>
                      <div>
                        <strong>Website:</strong> <a href={feature.attributes.WebAddress}>{'Click to view'}</a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapView;
