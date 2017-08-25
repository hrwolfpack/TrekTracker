import React from 'react';
import axios from 'axios';
import Posts from '../components/Posts.jsx';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';

class PostsContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			posts: [],
			labels: [],
			query: ''
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
	}

	componentDidMount() {
		this.getAllPosts();
		this.getAllLabels();
	}

	getAllPosts() {
		axios.get('/api/posts')
		.then(res => {
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

	handleSearch() {
		axios.post('/api/labels/search', {
			query: this.state.query
		})
		.then(posts => {
			console.log(posts);
			// this.setState({
			// 	posts: posts
			// });
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
				onClick={this.handleSearch}/>
				<Posts posts={this.state.posts} />
			</div>
		);
	}
}

export default PostsContainer;
