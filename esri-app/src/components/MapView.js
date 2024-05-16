
import React, { useRef, useEffect, useState } from 'react';
import { loadModules } from 'esri-loader';
import '../App.css'
const MapView = () => {
  const mapRef = useRef(null);
  const [intersectingFeatures, setIntersectingFeatures] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);

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
        zoom: 7,
      });

      const featureLayer = new FeatureLayer({
        url: 'https://services2.arcgis.com/M7TEANoOZzgrO5AX/arcgis/rest/services/FeederPatternKindergarten_24_25_69ef0/FeatureServer', // Replace with your feature layer URL
        outFields: ['*'], // Ensure all fields are returned
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
          if (results.features.length > 0) {
            setSelectedFeature(results.features[0]);
          } else {
            setSelectedFeature(null);
          }
        });
      };

    }).catch(err => {
      console.error(err);
    });
  }, []);

  const renderFeatureDetails = (feature) => {
    return (
      <div>
        <h4>Feature Details</h4>
        <ul>
          {Object.keys(feature.attributes).map((key, index) => (
            <li key={index}>
              <strong>{key}:</strong> {feature.attributes[key]}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      <div ref={mapRef} style={{ flex: 1 }}></div>
      <div style={{ width: '300px', padding: '10px', overflowY: 'auto' }}>
        <h3>Intersecting Features</h3>
        <ul>
          {intersectingFeatures.map((feature, index) => (
            <li key={index} onClick={() => setSelectedFeature(feature)}>
              {feature.attributes.NAME || `Feature ${index + 1}`}
            </li>
          ))}
        </ul>
        {selectedFeature && renderFeatureDetails(selectedFeature)}
      </div>
    </div>
  );
};

export default MapView;
