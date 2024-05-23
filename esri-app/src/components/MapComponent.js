// // src/components/MapComponent.js
// import React, { useEffect, useRef } from 'react';
// import { loadModules } from 'esri-loader';

// const MapComponent = () => {
//   const mapRef = useRef(null);

//   useEffect(() => {
//     let view;

//     loadModules([
//       'esri/Map',
//       'esri/views/MapView',
//       'esri/widgets/Search',
//       'esri/layers/FeatureLayer',
//       'esri/Graphic',
//       'esri/layers/GraphicsLayer'
//     ], { css: true })
//     .then(([Map, MapView, Search, Graphic, GraphicsLayer]) => {
//       const map = new Map({
//         basemap: 'streets-navigation-vector'
//       });

//       view = new MapView({
//         container: mapRef.current,
//         map: map,
//         center: [-75.5644, 39.2096], // Longitude, latitude
//         zoom: 8
//       });

//       const searchWidget = new Search({
//         view: view
//       });

//       // Add the search widget to the top right corner of the view
//       view.ui.add(searchWidget, {
//         position: 'top-right'
//       });

//       const graphicsLayer = new GraphicsLayer();
//       map.add(graphicsLayer);

//       searchWidget.on('select-result', function(event) {
//         // Clear existing graphics
//         graphicsLayer.removeAll();

//         // Get the result's geometry
//         const result = event.result.feature;
//         const point = result.geometry;

//         // Create a symbol for the result
//         const symbol = {
//           type: 'simple-marker',
//           style: 'square',
//           color: 'blue',
//           size: '12px',
//           outline: {
//             color: [255, 255, 255],
//             width: 2
//           }
//         };

//         // Create a graphic using the geometry and symbol
//         const graphic = new Graphic({
//           geometry: point,
//           symbol: symbol,
//           attributes: result.attributes,
//           popupTemplate: null // Explicitly set to null to disable pop-up
//         });

//         // Add the graphic to the layer
//         graphicsLayer.add(graphic);

//         // Zoom to the graphic
//         view.goTo({
//           target: graphic,
//           zoom: 15
//         });

//         // Explicitly close any open popups
//         view.popup.close();
//       });
//     });

//     return () => {
//       if (view) {
//         view.destroy();
//       }
//     };
//   }, []);

//   return <div className="webmap" ref={mapRef} style={{ height: '100vh' }} />;
// };

// export default MapComponent;


// src/components/MapComponent.js
import React, { useEffect, useRef, useState } from 'react';
import { loadModules } from 'esri-loader';

const MapComponent = () => {
  const mapRef = useRef(null);
  const [selectedPolygonInfo, setSelectedPolygonInfo] = useState([]);

  const layerConfigs = [
    { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternKindergarten_24_25_69ef0/FeatureServer', name: 'Kindergarten' },
    { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeOne_24_25/FeatureServer', name: '1st Grade' },
    { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeTwo_24_25_10bfe/FeatureServer', name: '2nd Grade' },
    { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeThree_24_25/FeatureServer', name: '3rd Grade' },
    { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeFour_24_25/FeatureServer', name: '4th Grade' },
    { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeFive_24_25/FeatureServer', name: '5th Grade' },
    { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeSix_24_25/FeatureServer', name: '6th Grade' },
    { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeSeven_24_25/FeatureServer', name: '7th Grade' },
    { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeEight_24_25/FeatureServer', name: '8th Grade' },
    { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeNine_24_25/FeatureServer', name: '9th Grade' },
    { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/DE_SchoolsFeederPatternGradeTen2425_ExportFeatures/FeatureServer', name: '10th Grade' },
    { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternGradeEleven_24_25/FeatureServer', name: '11th Grade' },
    { url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/Feeder_Pattern_Grade_Twelve_24_25_2209f/FeatureServer', name: '12th Grade' },
  ];

  useEffect(() => {
    let view;

    loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/widgets/Search',
      'esri/layers/FeatureLayer',
      'esri/Graphic',
      'esri/layers/GraphicsLayer',
      'esri/geometry/geometryEngine'
    ], { css: true })
    .then(([Map, MapView, Search, FeatureLayer, Graphic, GraphicsLayer, geometryEngine]) => {
      const map = new Map({
        basemap: 'streets-navigation-vector'
      });

      view = new MapView({
        container: mapRef.current,
        map: map,
        center: [-75.5644, 39.2096], // Longitude, latitude
        zoom: 8
      });

      const searchWidget = new Search({
        view: view
      });

      // Add the search widget to the top right corner of the view
      view.ui.add(searchWidget, {
        position: 'top-right'
      });

      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      // Delaware layer (visible but non-clickable)
      const delawareLayer = new FeatureLayer({
        url: 'YOUR_DELAWARE_LAYER_URL',
        popupEnabled: false
      });
      map.add(delawareLayer);

      // Add district layers
      const districtLayers = layerConfigs.map(config => {
        const layer = new FeatureLayer({
          url: config.url,
          outFields: ["*"],
          popupTemplate: {
            title: "District Information",
            content: "{*}"
          }
        });
        map.add(layer);
        return layer;
      });

      // Add point layer with interactive features
      const pointLayer = new GraphicsLayer({
        title: "Points of Interest"
      });
      map.add(pointLayer);

      // Handle search result selection
      searchWidget.on('select-result', function(event) {
        handleSearchResult(event.result.feature);
      });

      // Handle map click event
      view.on('click', function(event) {
        view.hitTest(event).then(function(response) {
          if (response.results.length) {
            const graphic = response.results.filter(function (result) {
              return result.graphic.layer === pointLayer;
            })[0]?.graphic;

            if (graphic) {
              handleSearchResult(graphic);
            }
          }
        });
      });

      function handleSearchResult(feature) {
        // Clear existing graphics
        graphicsLayer.removeAll();

        // Get the result's geometry
        const point = feature.geometry;

        // Create a symbol for the result
        const symbol = {
          type: 'simple-marker',
          style: 'square',
          color: 'blue',
          size: '12px',
          outline: {
            color: [255, 255, 255],
            width: 2
          }
        };

        // Create a graphic using the geometry and symbol
        const graphic = new Graphic({
          geometry: point,
          symbol: symbol,
          attributes: feature.attributes,
          popupTemplate: null // Explicitly set to null to disable pop-up
        });

        // Add the graphic to the layer
        graphicsLayer.add(graphic);

        // Zoom to the graphic
        view.goTo({
          target: graphic,
          zoom: 15
        });

        // Explicitly close any open popups
        view.popup.close();

        // Check intersections with district layers
        checkIntersections(point);
      }

      function checkIntersections(point) {
        let intersectedPolygons = [];

        const promises = districtLayers.map(layer => 
          layer.queryFeatures({
            geometry: point,
            spatialRelationship: 'intersects',
            outFields: ['*'],
            returnGeometry: true
          })
        );

        Promise.all(promises).then(results => {
          results.forEach(result => {
            if (result.features.length > 0) {
              intersectedPolygons.push(...result.features);
            }
          });
          setSelectedPolygonInfo(intersectedPolygons);
        });
      }
    });

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div className="webmap" ref={mapRef} style={{ height: '100vh', width: '75%' }}></div>
      <div style={{ height: '100vh', width: '25%', overflow: 'auto', padding: '10px', background: '#f7f7f7' }}>
        {selectedPolygonInfo.length > 0 ? (
          <div>
            <h3>Intersected Polygons</h3>
            {selectedPolygonInfo.map((info, index) => (
              <div key={index}>
                <h4>Polygon {index + 1}</h4>
                <pre>{JSON.stringify(info.attributes, null, 2)}</pre>
              </div>
            ))}
          </div>
        ) : (
          <p>No intersected polygons found.</p>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
