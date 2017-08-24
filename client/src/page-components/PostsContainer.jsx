import React from 'react';
import axios from 'axios';
import Posts from '../components/Posts.jsx';

class PostsContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			posts: []
		}
		this.getAllPosts();
	}

	getAllPosts() {
		axios.get('/api/posts')
		.then(res => {
			console.log(res.data);
			this.setState({
				posts: res.data
			});
		});
	}

	render() {
		return (
			<div>
				<div>Welcome to TrekTracker!</div>
				<Posts posts={this.state.posts} />
			</div>
		);
	}
}

export default PostsContainer;
