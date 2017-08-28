import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Posts from '../components/Posts.jsx';
import Upload from '../components/Upload.jsx';
import SimpleMap from '../components/SimpleMap.jsx';
import TrailDetail from '../components/TrailDetail.jsx';
import PhotoGrid from '../components/PhotoGrid.jsx';
import { handlePlacesChanged, trailClick, onDragEnd, onMarkerClose, handleSearchBoxMounted, onMarkerClick, handleMapMounted } from '../helpers/helpers.js';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class Trail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trailId: window.location.href.split('id=')[1],
      marker: '',
      posts: [],
      currentUser: null
    }
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

  render() {
    if (this.state.marker) {
      console.log(this.state.marker)
      return (
        <div class='container'>
          <Grid>
            <Row>
              <Col md={5}>
                <div className='Gmap'>
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
              </Col>
              <Col md={5}>
                <div className='detail'>
                  <TrailDetail trail={this.state.marker}/>
                  <div>
                    {this.state.currentUser ? <Upload /> : <div/>}
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={10}>
                <PhotoGrid posts={this.state.posts} />
              </Col>
            </Row>
          </Grid>
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
