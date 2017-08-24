import React from 'react';
import axios from 'axios';
import Posts from '../components/Posts.jsx';
import Upload from '../components/Upload.jsx';
import SimpleMap from '../components/SimpleMap.jsx';
import { handlePlacesChanged, trailClick, onDragEnd, onMarkerClose, handleSearchBoxMounted, onMarkerClick, handleMapMounted } from '../helpers/helpers.js';

class Trail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trailId: window.location.href.split('id=')[1],
      marker: '',
      posts: [],
      currentUser: null
    }
    this.handlePhotoSubmit = this.handlePhotoSubmit.bind(this);
  }

  componentDidMount() {
    axios.get(`/api/trails/${this.state.trailId}`)
    .then(response => {
      this.setState({
        marker: response.data
      })
    });

    axios.get('/api/posts/trails/' + this.state.trailId, {params:{trailId:this.state.trailId}})
    .then((response) => {
      this.setState({posts: response.data});
    });

    axios.get('/api/currentuser')
    .then((response) => {
      if (response.data) {
        this.setState({currentUser: response.data});
      }
    });
  }

  handlePhotoSubmit() {
    axios.get('/api/posts/trails/' + this.state.trailId, {params:{trailId:this.state.trailId}})
    .then((response) => {
      this.setState({posts: response.data});
    });
  }

  render() {
    if (this.state.marker) {
      return (
        <div>
          <div className = 'Gmap col-wide'>
            <SimpleMap
              containerElement={<div style={{width:100+'%', height:100+'%'}}/>}
              mapElement={<div style={{width:100+'%', height:100+'%'}}/>}
              marker={this.state.marker}
              onDragEnd={this.onDragEnd}
              handleMapMounted={this.handleMapMounted}
              onMarkerClose={this.onMarkerClose}
              onMarkerClick={this.onMarkerClick}
              onPlacesChanged={this.onPlacesChanged}
              changeId={this.changeId}
            />
          </div>
          <div className='col-narrow'>
            {this.state.currentUser ? <Upload handlePhotoSubmit={this.handlePhotoSubmit}/> : <div/>}
            <Posts posts={this.state.posts} />
          </div>
        </div>
      );
    } else {
      return (
        <div>Loading...</div>
      )
    }
  }
}

export default Trail;
