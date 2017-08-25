import React from 'react'
import Post from './Post.jsx';

var Posts = (props) => (
  <div>
    {props.posts.map((post, i) => (
      <Post post={post} key={i} />
    ))}
  </div>
);

export default Posts;