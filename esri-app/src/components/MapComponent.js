// src/components/MapComponent.js
import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';

const MapComponent = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    let view;

    loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/widgets/Search',
      'esri/Graphic',
      'esri/layers/GraphicsLayer'
    ], { css: true })
    .then(([Map, MapView, Search, Graphic, GraphicsLayer]) => {
      const map = new Map({
        basemap: 'streets-navigation-vector'
      });

      view = new MapView({
        container: mapRef.current,
        map: map,
        center: [-118.80500, 34.02700], // Longitude, latitude
        zoom: 13
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

      searchWidget.on('select-result', function(event) {
        // Clear existing graphics
        graphicsLayer.removeAll();

        // Get the result's geometry
        const result = event.result.feature;
        const point = result.geometry;

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
          attributes: result.attributes,
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
      });
    });

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return <div className="webmap" ref={mapRef} style={{ height: '100vh' }} />;
};

export default MapComponent;
