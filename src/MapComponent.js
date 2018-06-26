/**
 * Reusable Google Map component, with markers and clustering support
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import loadJS from 'utils/loadJS';

const mapStyle = { height: '400px' };
const mapContainerId = 'google-map';

const mapURL = {
  map: 'https://maps.googleapis.com/maps/api/js',
  cluster:
    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js',
  clusterIcon:
    'http://tour.itcanwait.com/wp-content/themes/icw-map-theme/assets/images/custom-marker-cluster-icon.svg'
};
/** TODO: Make this component completely reusable and more configurable */
class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.map = {};
    this.clusterOptions = [];
    this.markers = [];
    this.config = props.mapData.config;
  }

  componentDidMount() {
    window.initMap = this.initMap;
    // Asynchronously load the Google Maps script, passing in the callback reference
    loadJS(`${mapURL.map}?key=${this.config.apiKey}&callback=initMap`);
    loadJS(mapURL.cluster);
  }

  initMap = () => {
    let center = this.config.center;
    this.map = new window.google.maps.Map(
      document.getElementById(mapContainerId),
      {
        zoom: this.config.zoom,
        center: new window.google.maps.LatLng(center.lat, center.long),
        mapTypeId: this.config.mapTypeId
      }
    );
    if (this.props.mapData.markers.length > 0) {
      this.addMarkers();
    }
    if (this.config.isCluster) {
      this.clusterMarkers();
    }
  };

  addMarkers = () => {
    this.markers = this.props.mapData.markers.map(location => {
      return new window.google.maps.Marker({
        map: this.map,
        position: location
      });
    });
  };

  /**TODO: Move the styling to the config props */
  customizeClusters(pos) {
    const size = Math.min(this.cluster_.getMarkers().length + 40, 100);
    const style = [
      'border-radius: 50%',
      'background-color: #9C27B0',
      'line-height: ' + size + 'px',
      'cursor: pointer',
      'position: absolute',
      'top:' + pos.y + 'px',
      'left:' + pos.x + 'px',
      'width:' + size + 'px',
      'height:' + size + 'px',
      'font-size: 14px',
      'color: #ffffff'
    ];
    return style.join(';') + ';';
  }

  clusterMarkers = () => {
    if (this.props.mapData && this.props.mapData.clusterOptions) {
      this.clusterOptions = this.props.mapData.clusterOptions;
    } else {
      throw new Error('Cluster options are not passed');
    }
    window.ClusterIcon.prototype.createCss = this.customizeClusters;

    try {
      if (!window.MarkerClusterer) {
        throw new Error('Marker Clusterer is not loaded');
      }
      new window.MarkerClusterer(this.map, this.markers, this.clusterOptions);
    } catch (e) {
      throw new Error(e);
    }
  };

  render() {
    return <div style={mapStyle} id={mapContainerId} />;
  }
}

MapContainer.propTypes = {
  config: PropTypes.shape({
    apiKey: PropTypes.string.isRequired,
    zoom: PropTypes.number
  }),
  markers: PropTypes.arrayOf(PropTypes.any)
};

export default MapContainer;
