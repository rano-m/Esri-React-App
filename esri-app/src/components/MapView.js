// import React, { useRef, useEffect, useState } from 'react';
// import Map from '@arcgis/core/Map';
// import MapView from '@arcgis/core/views/MapView';
// import Search from '@arcgis/core/widgets/Search';
// import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
// import Graphic from '@arcgis/core/Graphic';
// import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';

// const MyMap = () => {
//   const mapRef = useRef(null);
//   const [intersectingFeatures, setIntersectingFeatures] = useState({});
//   const [selectedFeature, setSelectedFeature] = useState(null);

//   useEffect(() => {
//     const map = new Map({
//       basemap: 'streets-navigation-vector',
//     });

//     const view = new MapView({
//       container: mapRef.current,
//       map: map,
//       center: [-75.5644, 39.2096], // Longitude, latitude
//       zoom: 7,
//     });

//     // Load CSS for a specific theme
//     const cssUrl = 'https://js.arcgis.com/4.20/esri/themes/light/main.css';
//     const link = document.createElement('link');
//     link.href = cssUrl;
//     link.rel = 'stylesheet';
//     document.head.appendChild(link);

//     // Boundary Layer (non-interactive)
//     const boundaryLayer = new FeatureLayer({
//       url: 'https://services2.arcgis.com/utBig56dGaw25bwu/arcgis/rest/services/DelawareBoundary/FeatureServer',
//       popupEnabled: false,
//     });
//     map.add(boundaryLayer);

//     // School Points Layer
//     const schoolSymbol = {
//       type: "simple",
//       symbol: {
//         type: "simple-marker",
//         style: "circle",
//         color: "blue",
//         size: 5 // Initial size of the marker
//       }
//     };
//     const schoolPointsLayer = new FeatureLayer({
//       url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/DDOE_School_List_SY2025/FeatureServer',
//       outFields: ['*'],
//       renderer: schoolSymbol
//     });
//     map.add(schoolPointsLayer);

//     // Add mouse hover effect
//     view.on("pointer-move", (event) => {
//       view.hitTest(event).then((response) => {
//         if (response.results.length) {
//           const graphic = response.results[0].graphic;
//           if (graphic && graphic.layer === schoolPointsLayer) {
//             const attributes = graphic.attributes;
//             const schoolName = attributes.SchoolName;
//             view.popup.open({
//               location: event.mapPoint,
//               title: "School Name",
//               content: schoolName
//             });
//           } else {
//             view.popup.close();
//           }
//         } else {
//           view.popup.close();
//         }
//       });
//     });

//     const layerConfigs = [
//             { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternKindergarten_24_25_69ef0/FeatureServer', name: 'Kindergarten' },
//             { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeOne_24_25/FeatureServer', name: '1st Grade' },
//             { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeTwo_24_25_10bfe/FeatureServer', name: '2nd Grade' },
//             { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeThree_24_25/FeatureServer', name: '3rd Grade' },
//             { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeFour_24_25/FeatureServer', name: '4th Grade' },
//             { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeFive_24_25/FeatureServer', name: '5th Grade' },
//             { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeSix_24_25/FeatureServer', name: '6th Grade' },
//             { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeSeven_24_25/FeatureServer', name: '7th Grade' },
//             { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeEight_24_25/FeatureServer', name: '8th Grade' },
//             { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeNine_24_25/FeatureServer', name: '9th Grade' },
//             { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/DE_SchoolsFeederPatternGradeTen2425_ExportFeatures/FeatureServer', name: '10th Grade' },
//             { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeEleven_24_25/FeatureServer', name: '11th Grade' },
//             { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/Feeder_Pattern_Grade_Twelve_24_25_2209f/FeatureServer', name: '12th Grade' },
//           ];

//     const featureLayers = layerConfigs.map(config => {
//       const layer = new FeatureLayer({
//         url: config.url,
//         outFields: ['*'],
//         opacity: 0,
//       });
//       layer.customName = config.name;
//       map.add(layer);
//       return layer;
//     });

//     const searchWidget = new Search({
//       view: view,
//       includeDefaultSources: false,
//       sources: [{
//         locator: 'https://enterprise.firstmap.delaware.gov/arcgis/rest/services/Location/Delaware_FirstMap_Locator/GeocodeServer',
//         name: "Delaware Composite Locator",
//         placeholder: 'Enter address or location',
//         outFields: ["Addr_type"],
//         searchAllEnabled: false,
//         autoSuggest: true,
//         locationEnabled: true,
//         suggest: true,
//       }],
//     });

//     view.ui.add(searchWidget, {
//       position: 'top-right',
//     });

//     const addPinpoint = (point) => {
//       const symbol = new PictureMarkerSymbol({
//         url: 'https://static.arcgis.com/images/Symbols/Shapes/BluePin1LargeB.png',
//         width: '24px',
//         height: '24px'
//       });

//       const graphic = new Graphic({
//         geometry: point,
//         symbol: symbol
//       });

//       view.graphics.removeAll();
//       view.graphics.add(graphic);
//     };

//     searchWidget.on('search-complete', (event) => {
//       const point = event.results[0].results[0].feature.geometry;
//       addPinpoint(point);
//       queryFeatures(point);
//     });

//     view.on('click', (event) => {
//       view.goTo({
//         center: event.mapPoint,
//         zoom: 10,
//       });
//       addPinpoint(event.mapPoint);
//       queryFeatures(event.mapPoint);
//     });

//     // const queryFeatures = (point) => {
//     //   const allFeatures = {};
//     //   const queryPromises = featureLayers.map(layer => {
//     //     const query = layer.createQuery();
//     //     query.geometry = point;
//     //     query.spatialRelationship = 'intersects';
//     //     query.returnGeometry = true;
//     //     query.outFields = ['*'];
//     //     return layer.queryFeatures(query).then(response => {
//     //       if (response.features.length > 0) {
//     //         allFeatures[layer.customName] = response.features.map(feature => ({
//     //           geometry: feature.geometry,
//     //           attributes: feature.attributes,
//     //         }));
//     //       }
//     //     });
//     //   });

//     const queryFeatures = (point) => {
//       const allFeatures = {};
//       const queryPromises = featureLayers.map(layer => {
//         const query = layer.createQuery();
//         query.geometry = point;
//         query.spatialRelationship = 'intersects';
//         query.returnGeometry = true;
//         query.outFields = ['*'];
//         return layer.queryFeatures(query).then(response => {
//           if (response.features.length > 0) {
//             response.features.forEach(feature => {
//               const schoolId = feature.attributes.SchoolName;
//               if (!allFeatures.hasOwnProperty(schoolId)) {
//                 allFeatures[schoolId] = [];
//               }
//               allFeatures[schoolId].push({
//                 layerName: layer.customName,
//                 geometry: feature.geometry,
//                 attributes: feature.attributes,
//               });
//             });
//           }
//         });
//       });
    

//       Promise.all(queryPromises).then(() => {
//         setIntersectingFeatures(allFeatures);
//       }).catch(err => {
//         console.error('Query error: ', err);
//       });
//     };

//     return () => {
//       view.container = null;
//     };
//   }, []);

//   const sortedIntersectingFeatures = Object.keys(intersectingFeatures)
//     .sort((a, b) => {
//       const layerOrder = [
//         'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade',
//         '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade',
//         '10th Grade', '11th Grade', '12th Grade'
//       ];
//       return layerOrder.indexOf(a) - layerOrder.indexOf(b);
//     });

//   return (
//     <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
//       <div ref={mapRef} style={{ flex: 1 }}></div>
//       <div className='panel'>
//         <h3>Locate your School</h3>
//         <p>Click your address on the map or use the search bar</p>
//         {sortedIntersectingFeatures.map((layerName, index) => (
//           <div key={index}>
//             <table className="feature-list">
//               <thead>
//                 <tr>
//                   <th>{layerName}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {intersectingFeatures[layerName].map((feature, featureIndex) => (
//                   <tr key={featureIndex} onClick={() => setSelectedFeature(feature)}>
//                     <td>
//                       <div>
//                         <strong>School Name:</strong> {feature.attributes.SchoolName || `Feature ${featureIndex + 1}`}
//                       </div>
//                       <div>
//                         <strong>Report Card:</strong> <a href={feature.attributes.Report_Card} target="_blank" rel="noopener noreferrer" title="View Report Card">Click to view</a>
//                       </div>
//                       <div>
//                         <strong>Phone:</strong> {feature.attributes.Phone || 'N/A'}
//                       </div>
//                       <div>
//                         <strong>Website:</strong> <a href={feature.attributes.WebAddress} target="_blank" rel="noopener noreferrer" title="View Website">Click to view</a>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MyMap;



import React, { useRef, useEffect, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Search from '@arcgis/core/widgets/Search';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Graphic from '@arcgis/core/Graphic';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';

const MyMap = () => {
  const mapRef = useRef(null);
  const [intersectingFeatures, setIntersectingFeatures] = useState({});
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    const map = new Map({
      basemap: 'streets-navigation-vector',
    });

    const view = new MapView({
      container: mapRef.current,
      map: map,
      center: [-75.5644, 39.2096], // Longitude, latitude
      zoom: 7,
    });

    // Load CSS for a specific theme
    const cssUrl = 'https://js.arcgis.com/4.20/esri/themes/light/main.css';
    const link = document.createElement('link');
    link.href = cssUrl;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Boundary Layer (non-interactive)
    const boundaryLayer = new FeatureLayer({
      url: 'https://services2.arcgis.com/utBig56dGaw25bwu/arcgis/rest/services/DelawareBoundary/FeatureServer',
      popupEnabled: false,
    });
    map.add(boundaryLayer);

    // School Points Layer
    const schoolSymbol = {
      type: "simple",
      symbol: {
        type: "simple-marker",
        style: "circle",
        color: "blue",
        size: 5 // Initial size of the marker
      }
    };
    const schoolPointsLayer = new FeatureLayer({
      url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/DDOE_School_List_SY2025/FeatureServer',
      outFields: ['*'],
      renderer: schoolSymbol
    });
    map.add(schoolPointsLayer);

    // Add mouse hover effect
    view.on("pointer-move", (event) => {
      view.hitTest(event).then((response) => {
        if (response.results.length) {
          const graphic = response.results[0].graphic;
          if (graphic && graphic.layer === schoolPointsLayer) {
            const attributes = graphic.attributes;
            const schoolName = attributes.SchoolName;
            view.popup.open({
              location: event.mapPoint,
              title: "School Name",
              content: schoolName
            });
          } else {
            view.popup.close();
          }
        } else {
          view.popup.close();
        }
      });
    });

    const layerConfigs = [
            { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternKindergarten_24_25_69ef0/FeatureServer', name: 'Kindergarten' , grade: 0},
            { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeOne_24_25/FeatureServer', name: '1st Grade', grade: 1},
            { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeTwo_24_25_10bfe/FeatureServer', name: '2nd Grade', grade: 2},
            { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeThree_24_25/FeatureServer', name: '3rd Grade', grade: 3 },
            { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeFour_24_25/FeatureServer', name: '4th Grade', grade:4 },
            { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeFive_24_25/FeatureServer', name: '5th Grade', grade: 5 },
            { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeSix_24_25/FeatureServer', name: '6th Grade', grade: 6 },
            { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeSeven_24_25/FeatureServer', name: '7th Grade', grade: 7 },
            { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeEight_24_25/FeatureServer', name: '8th Grade', grade:8 },
            { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeNine_24_25/FeatureServer', name: '9th Grade', grade:9 },
            { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/DE_SchoolsFeederPatternGradeTen2425_ExportFeatures/FeatureServer', name: '10th Grade', grade:10 },
            { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeEleven_24_25/FeatureServer', name: '11th Grade', grade:11 },
            { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/Feeder_Pattern_Grade_Twelve_24_25_2209f/FeatureServer', name: '12th Grade', grade:12 },
          ];

    const featureLayers = layerConfigs.map(config => {
      const layer = new FeatureLayer({
        url: config.url,
        outFields: ['*'],
        opacity: 0,
      });
      layer.customName = config.name;
      layer.grade = config.grade;
      map.add(layer);
      return layer;
    });

    const searchWidget = new Search({
      view: view,
      includeDefaultSources: false,
      sources: [{
        locator: 'https://enterprise.firstmap.delaware.gov/arcgis/rest/services/Location/Delaware_FirstMap_Locator/GeocodeServer',
        name: "Delaware Composite Locator",
        placeholder: 'Enter address or location',
        outFields: ["Addr_type"],
        searchAllEnabled: false,
        autoSuggest: true,
        locationEnabled: true,
        suggest: true,
      }],
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

    // const queryFeatures = (point) => {
    //   const allFeatures = {};
    //   const queryPromises = featureLayers.map(layer => {
    //     const query = layer.createQuery();
    //     query.geometry = point;
    //     query.spatialRelationship = 'intersects';
    //     query.returnGeometry = true;
    //     query.outFields = ['*'];
    //     return layer.queryFeatures(query).then(response => {
    //       if (response.features.length > 0) {
    //         allFeatures[layer.customName] = response.features.map(feature => ({
    //           geometry: feature.geometry,
    //           attributes: feature.attributes,
    //         }));
    //       }
    //     });
    //   });

    const queryFeatures = (point) => {
      const allFeatures = {};
      const queryPromises = featureLayers.map(layer => {
        const query = layer.createQuery();
        query.geometry = point;
        query.spatialRelationship = 'intersects';
        query.returnGeometry = true;
        query.outFields = ['*'];
        return layer.queryFeatures(query).then(response => {
          if (response.features.length > 0) {
            response.features.forEach(feature => {
              const schoolId = feature.attributes.SchoolName;
              if (!allFeatures.hasOwnProperty(schoolId)) {
                allFeatures[schoolId] = [];
              }
              allFeatures[schoolId].push({
                layer: layer, // Include the layer
                geometry: feature.geometry,
                attributes: feature.attributes,
              });
            });
          }
        });
      });
    
      Promise.all(queryPromises).then(() => {
        setIntersectingFeatures(allFeatures);
      }).catch(err => {
        console.error('Query error: ', err);
      });
    };
  
    return () => {
      view.container = null;
    };
  }, []);

  const sortedIntersectingFeatures = Object.keys(intersectingFeatures)
  .sort((a, b) => a.localeCompare(b));

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      <div ref={mapRef} style={{ flex: 1 }}></div>
      <div className='panel'>
        <h3>Locate your School</h3>
        <p>Click your address on the map or use the search bar</p>
        {sortedIntersectingFeatures.map((schoolName, index) => {
          // Find the minimum and maximum grade for this school
          const grades = intersectingFeatures[schoolName].map(feature => feature.layer.grade);
          const minGrade = Math.min(...grades);
          const maxGrade = Math.max(...grades);
          return (
            <div key={index}>
              <table className="feature-list">
                <thead>
                  <tr>
                    <th>{`Grade Range: ${minGrade} - ${maxGrade}`}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr onClick={() => setSelectedFeature(intersectingFeatures[schoolName][0])}>
                    <td>
                      <div>
                        <strong>School Name:</strong> {intersectingFeatures[schoolName][0].attributes.SchoolName}
                      </div>
                      <div>
                        <strong>Report Card:</strong> <a href={intersectingFeatures[schoolName][0].attributes.Report_Card} target="_blank" rel="noopener noreferrer" title="View Report Card">Click to view</a>
                      </div>
                      <div>
                        <strong>Phone:</strong> {intersectingFeatures[schoolName][0].attributes.Phone || 'N/A'}
                      </div>
                      <div>
                        <strong>Website:</strong> <a href={intersectingFeatures[schoolName][0].attributes.WebAddress} target="_blank" rel="noopener noreferrer" title="View Website">Click to view</a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
  
  
};

export default MyMap;