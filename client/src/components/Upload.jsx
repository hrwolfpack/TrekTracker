import React from 'react';
import { updateImage, submitImage } from '../helpers/helpers.js';
import gps from '../helpers/gps.js';
import {Paper, RaisedButton} from 'material-ui';

const buttonStyle = {
  position: 'relative',
  margin: '10px 0px 10px 10px'
};

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: null,
      trailId: window.location.href.split('id=')[1],
      lat: null,
      lng: null,
    }
    this.submitImage = submitImage.bind(this);
    this.updateImage = updateImage.bind(this);
  }

  componentWillMount() {
    gps.getLocation()
    .then(value => {
      this.setState({lat: value.coords.latitude, lng: value.coords.longitude})
    })
    .catch(err => console.log('location access denied: ', err));
  }

  componentDidMount() {
    this.input = document.querySelector('.input');
    this.preview = document.querySelector('.preview');
  }

  render() {
    return(
      <Paper>
        <form>
          <h2 style={{margin: '5px'}}>Upload your trek photo!</h2>
          <input style={{margin: '10px'}} className='input' onChange={(e) => this.updateImage(e)} type='file' accept='image/*' capture='camera' />
          <RaisedButton onClick={this.submitImage} label="Submit" primary={true} style={buttonStyle} />
        </form>
        <div className='preview'>
          <p style={{margin: '5px'}}>No files currently selected for upload</p>
        </div>
      </Paper>
    );
  }
};

export default Upload;
