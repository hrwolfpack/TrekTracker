import React from 'react'
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Chip from 'material-ui/Chip'
import FlatButton from 'material-ui/FlatButton';
import time from '../helpers/time.js';
import axios from 'axios';

const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: []
    }
    this.handleLike = this.handleLike.bind(this);
    this.handleUnlike = this.handleUnlike.bind(this);
  }

  componentDidMount() {
    //get all the liked posts from user

    //get all labels for this post
    axios.get(`/api/labels/${this.props.post.id}`)
    .then(results => {
      this.setState({
        labels: results.data
      });
    });
  }

  handleLike() {
    axios.post('/api/posts/like', {postId: this.props.post.id})
    .then(result => {
      console.log('Liked this post!');
    });
  }

  handleUnlike() {
    axios.post('/api/posts/unlike', {postId: this.props.post.id})
    .then(result => {
      console.log('Unliked this post!');
    });
  }

  render() {
    return (
      <div>
        <Card className='post'>
          <CardHeader
            title={this.props.post.poster.firstname + ' ' + this.props.post.poster.lastname}
            subtitle={this.props.post.poster.email}
          />
          <CardMedia 
          overlay={<CardTitle title={this.props.post.text} 
          subtitle={time.parse(this.props.post.createdAt, true)} />}>
            <img src={this.props.post['image_url']}/>
          </CardMedia>
          <div style={styles.wrapper}>
            {this.state.labels.map((label, i) => {
              return (<Chip style={styles.chip} key={i} onClick={() => this.props.handleSearch(label.label)}>{label.label}</Chip>);
            })}
          </div>
          <div>
            <FlatButton 
            label='Like' 
            primary={true} 
            secondary={true}
            onClick={this.handleLike}/>
            <FlatButton 
            label='Unlike' 
            primary={false} 
            secondary={true}
            onClick={this.handleUnlike}/>
            <FlatButton 
            label='See More Posts About This Trail' 
            primary={true}
            onClick={() => {window.location.href = '/trail?id=' + this.props.post.trail_id}}/>
          </div>
        </Card>
      </div>
    );
  }
}

export default Post;