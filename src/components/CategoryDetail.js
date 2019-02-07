import React from 'react';

import { connect } from 'react-redux';
import { generateUID } from '../utils/helpers';

import { addPost, upVote, downVote, editPost, deletePost } from '../actions/posts';

import { url } from '../utils/helpers';

import Post from './Post';

class CategoryDetail extends React.Component {

    state = {
        showForm: false,
        title: '',
        body: '',
        sortByDate: true,
        isEdit: false,
        id: ''
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
        const { title, body, isEdit, id } = this.state;
        const { category, dispatch } = this.props;

        e.preventDefault();
        if (isEdit) {
            let newPost = {
                title: title,
                body: body,
            }
            fetch(url + '/posts/' + id, {
                method: 'PUT',
                headers: { 
                    'Authorization': 'readable-aag',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPost)
            }).then(response => response.json())
              .then(data => {
                  console.log(data);
                  dispatch(editPost(id, newPost.title, newPost.body));
                  this.setState({
                      showForm: false,
                      title: '',
                      body: '',
                      isEdit: false,
                      id: ''
                  });
              })
        } else {
            let newPost = {
                id: generateUID(),
                timestamp: Date.now(),
                title: title,
                body: body,
                author: 'me',
                category: category
            }
    
            fetch(url + '/posts', {
                method: 'POST',
                headers: { 
                    'Authorization': 'readable-aag',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPost)
            }).then(response => response.json())
              .then(data => {
                dispatch(addPost(data));
                this.setState({
                    showForm: false,
                    title: '',
                    body: '',
                    isEdit: false
                });
              });
        }
    }

    handleVoteUp = (id) => {
        const { dispatch } = this.props;

        fetch(url + '/posts/' + id, {
            method: 'POST',
            headers: { 
                'Authorization': 'readable-aag',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({option: 'upVote'})
        }).then(response => response.json())
          .then(() => {
              dispatch(upVote(id));
          });
    }

    handleVoteDown = (id) => {
        const { dispatch } = this.props;

        fetch(url + '/posts/' + id, {
            method: 'POST',
            headers: { 
                'Authorization': 'readable-aag',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({option: 'downVote'})
        }).then(response => response.json())
          .then(() => {
              dispatch(downVote(id));
          })
    }

    sortByDate = () => {
        this.setState({
            sortByDate: true,
        });
    }

    sortByScore = () => {
        this.setState({
            sortByDate: false,
        })
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
        const { dispatch } = this.props;

        fetch(url + '/posts/' + id, {
            method: 'DELETE',
            headers: { 
                'Authorization': 'readable-aag',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
          .then(data => {
              console.log(data);
              dispatch(deletePost(id));
          });
    }

    render() {
        const { showForm, title, body, sortByDate } = this.state;
        const { posts, category, postsByScore } = this.props;
        
        return (
            <div>
                <div className="post-header">
                    <h2> Category: {category}</h2>
                    <div>
                        <button className="score-button" onClick={this.sortByScore} style={sortByDate ? {} : {backgroundColor: 'orange', color: 'white'}}>By Score</button>
                        <button className="date-button" onClick={this.sortByDate} style={sortByDate ? {backgroundColor: 'orange', color: 'white'} : {}}>By Date</button>
                    </div>
                    <button className="post-button" onClick={this.handleForm}>{showForm ? 'Close' : 'Add New Post'}</button>
                </div>
                {showForm 
                    ?   <div>
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
                {sortByDate
                    ? posts.map((post) => (
                        <Post 
                            key={post.id}
                            post={post}
                            handleEdit={this.handleEdit}
                            handleDelete={this.handleDelete}
                            handleVoteDown={this.handleVoteDown}
                            handleVoteUp={this.handleVoteUp}
                        />
                    ))
                    : postsByScore.map((post) => (
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
        );
    }
}

function mapStateToProps({ posts }, { match }) {
    const { category } = match.params;
    let postsArray = Object.keys(posts).map(key => posts[key]);
    
    return {
        category,
        posts: postsArray.filter((post) => post.category === category).sort((a, b) => b.timestamp - a.timestamp),
        postsByScore: postsArray.filter((post) => post.category === category).sort((a, b) => b.voteScore - a.voteScore),
        storePosts: posts
    }
}

export default connect(mapStateToProps)(CategoryDetail);