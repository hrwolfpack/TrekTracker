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
          <div key={i}>
            <Card className='post'>
              <CardHeader
                title={post.poster.firstname + ' ' + post.poster.lastname}
                subtitle={post.poster.email}
              />
              <CardMedia overlay={<CardTitle title={post.text} subtitle={time.parse(post.createdAt, true)} />}>
                <img src={post['image_url']}/>
              </CardMedia>
              <div>
                <FlatButton 
                label='Like' 
                primary={true} 
                secondary={true}
                onClick={() => {this.handleLike(post.id)}}/>
                <FlatButton 
                label='Unlike' 
                primary={false} 
                secondary={true}
                onClick={() => {this.handleUnlike(post.id)}}/>
                <FlatButton 
                label='See More Posts About This Trail' 
                primary={true}
                onClick={() => {window.location.href = '/trail?id=' + post.trail_id}}/>
              </div>
            </Card>
          </div>
        ))}
      </div>
    );
  }
}


// const Posts = (props) => (
//   <div>
//     {props.posts.map((post, i) => (
//       <div key={i}>
//         <Card className='post'>
//           <CardHeader
//             title={post.poster.firstname + ' ' + post.poster.lastname}
//             subtitle={post.poster.email}
//           />
//           <CardMedia overlay={<CardTitle title={post.text} subtitle={time.parse(post.createdAt, true)} />}>
//             <img src={post['image_url']}/>
//           </CardMedia>
//           <div>
//             <FlatButton label='Like' primary={true}/>
//             <FlatButton 
//             label='See More Posts About This Trail' 
//             primary={true}
//             onClick={() => {window.location.href = '/trail?id=' + post.trail_id}}/>
//           </div>
//         </Card>
//       </div>
//     ))}
//   </div>
// );

export default Posts;