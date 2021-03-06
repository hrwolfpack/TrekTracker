import React, {Component} from 'react';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';

class SimpleMap extends Component {
  constructor (props) {
    super(props);
    this.state = {
      mapCenter: {
        lat: this.props.marker.latitude,
        lng: this.props.marker.longitude
      },
    }
  }

	render() {
		return (
			<GoogleMap
				defaultZoom={16}
        ref={this.props.handleMapMounted}
				center={this.state.mapCenter}
        >
        <Marker
          position={this.state.mapCenter}
         >
        </Marker>
			</GoogleMap>
			)
    }
  }

  export default withGoogleMap(SimpleMap);
