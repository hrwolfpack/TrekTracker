import React from 'react';
import axios from 'axios';
import Posts from '../components/Posts.jsx';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import io from 'socket.io-client';

let socket = io('http://localhost:3000');

class PostsContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser: null,
			userEmail: null,
			posts: [],
			labels: [],
			query: ''
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);

		socket.on('allPosts', (data) => {
      // console.log('****allPosts*****', data)

			this.setState({
				posts: data
			});
    });

		this.getCurrentUser()
		.then(() => {
			this.getAllPosts(this.state.currentUser);
		});
	}

	componentDidMount() {
		this.getAllPosts();
		this.getAllLabels();
	}

	getCurrentUser () {
    return axios.get('/api/currentuser')
    .then((response) => {
      this.setState({
				currentUser: response.data,
				userEmail: response.data.email
			});
    });
  }

	getAllPosts(currentUser) {
		let currentUserId;
		if(!currentUser) {
			currentUserId = -1;
		} else {
		currentUserId = currentUser.id || -1;
		}
	
		axios.get(`/api/posts?userid=${currentUserId}`)
		.then(res => {
			// console.log('res.data', res.data)
			this.setState({
				posts: res.data
			});
		});
	}

	getAllLabels() {
		axios.get('/api/labels')
		.then(results => {
			this.setState({
				labels: results.data
			});
		});
	}

	handleChange(searchText) {
		this.setState({
			query: searchText
		});
	}

	handleSearch(e) {
		axios.post('/api/labels/search', {
			query: e
		})
		.then(results => {
			this.setState({
				posts: results.data
			});
		});
	}

	handleLike(evt, post, currentUser) {
	  if(!currentUser.id) {
	    console.log('YOU ARE NOT LOGGED IN!!!')
	    return;
	  }

    socket.emit('getPosts', {
      postId: post.id,
      userId: currentUser.id,
      trailId: post.trail_id
    });
  }

	render() {
		return (
			<div>
				<AutoComplete
				hintText="e.g. forest, lake, mountain, etc."
				dataSource={this.state.labels}
				filter={AutoComplete.fuzzyFilter}
				maxSearchResults={5}
				onUpdateInput={this.handleChange}/>
				<RaisedButton
				label="Search"
				primary={true}
				onClick={() => this.handleSearch(this.state.query)}/>
			<Posts posts={this.state.posts} handleSearch={this.handleSearch} handleLike={this.handleLike.bind(this)}
				currentUser={this.state.currentUser}
					getPosts={this.getAllPosts.bind(this)} />
			</div>
		);
	}
}

export default PostsContainer;
