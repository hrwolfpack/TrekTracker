import React from 'react'
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton';
import time from '../helpers/time.js';
import axios from 'axios';

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.handleLike = this.handleLike.bind(this);
  }

  componentDidMount() {
    //get all the liked posts from user
  }

  handleLike(postId) {
    axios.post('/api/posts/like', {postId})
    .then(result => {
      console.log('Liked this post!');
    });
  }

  handleUnlike(postId) {
    axios.post('/api/posts/unlike', {postId})
    .then(result => {
      console.log('Unliked this post!');
    });
  }

  render() {
    return (
      <div>
        {this.props.posts.map((post, i) => (
          <Post post={post} key={i} />
        ))}
      </div>
    );
  }
}

export default Posts;
