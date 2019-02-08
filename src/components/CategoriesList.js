import React, { Component } from 'react';
import { connect } from 'react-redux';

import Category from './Category';
import Post from './Post';

import { Link } from 'react-router-dom';

import { 
    handleWithSharedVoteUp, 
    handleWithSharedVoteDown, 
    handleDeletePost, 
    handleEditPost } from '../actions/shared';

class CategoriesList extends Component {

    state = {
        showForm: false,
        title: '',
        body: '',
        sortByDate: true,
        isEdit: false,
        id: '',
    }

    handleForm = () => {
        this.setState((oldState) => ({
            showForm: !oldState.showForm
        }));
    } 

    handleTitle = (e) => {
        this.setState({
            title: e.target.value
        });
    }

    handleBody = (e) => {
        this.setState({
            body: e.target.value
        });
    }

    handleSubmit = (e) => {
        const { id, isEdit, title, body} = this.state;

        e.preventDefault();
        if (isEdit) {
            if (title === '' || body === '') {
                alert('Sorry but all fields are required!');
            } else {
                this.props.dispatch(handleEditPost(id, title, body));
                this.setState({
                    showForm: false,
                    title: '',
                    body: '',
                    isEdit: false,
                    id: ''
                });
            }
        }
    }

    handleVoteUp = (id) => {
        this.props.dispatch(handleWithSharedVoteUp(id));
    }

    handleVoteDown = (id) => {
        this.props.dispatch(handleWithSharedVoteDown(id))
    }

    handleEdit = (id) => {
        const { storePosts } = this.props;

        if (storePosts) {
            this.setState({
                showForm: true,
                title: storePosts[id].title,
                body: storePosts[id].body,
                id: id,
                isEdit: true
            });
        }
    }

    handleDelete = (id) => {
        this.props.dispatch(handleDeletePost(id));
    }

    render() {
        const { showForm, title, body } = this.state;
        const { categories, posts } = this.props;
        
        return (
            <div>
                <div>
                    <h2>Categories</h2>

                </div>

                {categories
                    ? categories.map((category) => (
                        <Link key={category.name} to={`/${category.path}`} style={{textDecoration: 'none', color: 'darkorange'}}>
                            <div className="category">
                                <h3 style={{marginLeft: 20}}>{category.name}</h3>
                                <Category posts={posts} categoryName={category.name} />
                            </div>
                        </Link>
                    ))
                    : <div><p>NO Categories availables</p></div>
                }

                <h2>All Posts</h2>
                {showForm 
                    ?   <div>
                            <button onClick={() => this.setState({ showForm: false, title: '', body: ''})}>Close</button>
                            <form onSubmit={this.handleSubmit}  className="post-form">
                                <label style={{marginTop: 30}}>Title:</label>
                                <input className="form-title" style={{width: '100%', fontSize: 15}} type="text" value={title} onChange={this.handleTitle} />

                                <label style={{marginTop: 30}}>Body:</label>
                                <textarea className="form-body" style={{width: '100%', fontSize: 15}} type="text" value={body} onChange={this.handleBody} ></textarea>

                                <button className="form-button" style={{marginTop: 10}} type="submit">Submit</button>
                            </form>
                        </div>
                    : <div></div>
                }
                {
                    posts.map((post) => (
                        <Post 
                            key={post.id}
                            post={post}
                            handleEdit={this.handleEdit}
                            handleDelete={this.handleDelete}
                            handleVoteDown={this.handleVoteDown}
                            handleVoteUp={this.handleVoteUp}
                        />
                    ))
                }
            </div>
        )
    }
}

function mapStateToProps({ categories, posts }) {
    
    return {
        categories: categories['categories'],
        posts: Object.keys(posts).map(key => posts[key]),
        storePosts: posts,
    }
}

export default connect(mapStateToProps)(CategoriesList);