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

      // Disabling Pop-ups
      view.popupEnabled = false;

      // Boundary Layer (non-interactive) 
      const boundaryLayer = new FeatureLayer({ 
        url: 'https://services2.arcgis.com/utBig56dGaw25bwu/arcgis/rest/services/DelawareBoundary/FeatureServer', 
        popupEnabled: false 
      }); 
      map.add(boundaryLayer); 
      // School Points Layer 
      const schoolPointsLayer = new FeatureLayer({ 
        url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/DDOE_School_List_SY2025/FeatureServer', 
        outFields: ['*'] 
      }); 
      map.add(schoolPointsLayer); 

      // Configuration for feature layers
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

      const featureLayers = layerConfigs.map(config => {
        const layer = new FeatureLayer({
          url: config.url,
          outFields: ['*'],
          opacity: 0,
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

      // Function to add a pinpoint on the map
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

      // Handle search completion event
      searchWidget.on('search-complete', (event) => {
        const point = event.results[0].results[0].feature.geometry;
        view.goTo({
          center: point,
          zoom: 10,
        });
        addPinpoint(point);
        queryFeatures(point);
      });

      // Handle map click event
      view.on('click', (event) => {
        view.goTo({
          center: event.mapPoint,
          zoom: 10,
        });
        addPinpoint(event.mapPoint);
        queryFeatures(event.mapPoint);
      });

      // Function to query features intersecting with the given point
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
        }).catch(err => {
          console.error("Error querying features: ", err);
        });
      };

    }).catch(err => {
      console.error("Error loading modules: ", err);
    });
  }, []);

  // Sort intersecting features by grade
  const sortedIntersectingFeatures = Object.keys(intersectingFeatures)
    .sort((a, b) => {
      const layerOrder = [
        'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade',
        '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade',
        '10th Grade', '11th Grade', '12th Grade'
      ];
      return layerOrder.indexOf(a) - layerOrder.indexOf(b);
    });

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      <div ref={mapRef} style={{ flex: 1 }}></div>
      <div className='panel'>
        <h3>Locate your School</h3>
        <p>Click your address on the map or use the search bar</p>
        {sortedIntersectingFeatures.map((layerName, index) => (
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
                        <strong>Report Card:</strong> <a href={feature.attributes.Report_Card} target="_blank" rel="noopener noreferrer" title="View Report Card">Click to view</a>
                      </div>
                      <div>
                        <strong>Phone:</strong> {feature.attributes.Phone || 'N/A'}
                      </div>
                      <div>
                        <strong>Website:</strong> <a href={feature.attributes.WebAddress} target="_blank" rel="noopener noreferrer" title="View Website">Click to view</a>
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