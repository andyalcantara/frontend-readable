import React, { Component } from 'react';

import { connect } from 'react-redux';

import { url, generateUID } from '../utils/helpers';

import { upVote, downVote } from '../actions/posts';
import { deletePost, editPost } from '../actions/posts';
import { getComments, addComment, deleteComment, editComment, voteCommentsDown, voteCommentsUp } from '../actions/comments';

import { Link, withRouter } from 'react-router-dom';

import NoMatch from './NoMatch';

class PostDetail extends Component {

    state = {
        showForm: false,
        showPostForm: false,
        comment: '',
        title: '',
        body: '',
        isPostEdit: false,
        isEdit: false,
        id: ''
    }

    componentDidMount() {
        const { post, dispatch } = this.props;

        if (post) {
            fetch(url + '/posts/' + post.id + '/comments', {
                method: 'GET',
                headers: { 'Authorization': 'readable-aag'}
            }).then(response => response.json())
              .then(comments => {
                  let newComments = comments.map((comment) => {
                      return {
                          [comment.id]: comment
                      }
                  });
                  let acComments = Object.assign({}, ...newComments);
                  dispatch(getComments(acComments));
              });
        }
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

    showForm = () => {
        this.setState({
            showForm: true
        });
    }

    handleComment = (e) => {
        this.setState({
            comment: e.target.value
        });
    }

    handleSubmit = (e) => {
        const { post, dispatch } = this.props;
        const { comment, isEdit, id } = this.state;

        e.preventDefault();

        if (isEdit) {

            let editedComment = {
                timestamp: Date.now(),
                body: comment,
            }

            fetch(url + '/comments/' + id, {
                method: 'PUT',
                headers: { 
                    'Authorization': 'readable-aag',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editedComment)
            }).then(response => response.json())
              .then(data => {
                  dispatch(editComment(id, data));
                  this.setState({
                      showForm: false,
                      isEdit: false,
                      comment: '',
                      id: ''
                  });
              })
        } else {
            let newComment = {
                id: generateUID(),
                parentId: post.id,
                timestamp: Date.now(),
                body: comment,
                author: 'me'
            }
    
            fetch(url + '/comments', {
                method: 'POST',
                headers: { 
                    'Authorization': 'readable-aag',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newComment)
            }).then(response => response.json())
              .then(data => {
                  console.log(data);
                  dispatch(addComment(data));
                  this.setState({
                    showForm: false,
                    isEdit: false,
                    comment: '',
                    id: ''
                });
              });
        }
    }

    handlePostEdit = (id) => {
        const { storePosts } = this.props;

        if (storePosts) {
            this.setState({
                showPostForm: true,
                title: storePosts[id].title,
                body: storePosts[id].body,
                id: id,
                isEdit: true
            });
        }
    }

    handlePostDelete = (id) => {
        const { dispatch, lastCategory } = this.props;

        fetch(url + '/posts/' + id, {
            method: 'DELETE',
            headers: { 
                'Authorization': 'readable-aag',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
          .then(data => {
              dispatch(deletePost(id));
              this.props.history.push(`/${lastCategory}`);
          });
    }

    handleEdit = (id) => {
        const { orComments } = this.props;
                
        this.setState({
            showForm: true,
            comment: orComments[id].body,
            id: id,
            isEdit: true
        });
    }

    handleDelete = (id) => {
        const { dispatch } = this.props;

        fetch(url + '/comments/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': 'readable-aag',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
          .then(data => {
              console.log(data, 'After deleting');
                dispatch(deleteComment(id, data.parentId))
          });
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

    voteCommentUp = (id) => {
        const { dispatch } = this.props;

        fetch(url + '/comments/' + id, {
            method: 'POST',
            headers: {
                'Authorization': 'readable-aag',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ option: 'upVote'})
        }).then(response => response.json())
          .then(() => {
              dispatch(voteCommentsUp(id));
          });
    }

    voteCommentDown = (id) => {
        const { dispatch } = this.props;

        fetch(url + '/comments/' + id, {
            method: 'POST',
            headers: {
                'Authorization': 'readable-aag',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ option: 'downVote'})
        }).then(response => response.json())
          .then(() => {
              dispatch(voteCommentsDown(id));
          });
    }

    handlePostSubmit = (e) => {
        const { title, body, isEdit, id } = this.state;
        const { dispatch } = this.props;

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
                      showPostForm: false,
                      title: '',
                      body: '',
                      isEdit: false,
                      id: ''
                  });
              })
        } 
    }

    closeForm = () => {
        this.setState({
            showPostForm: false,
            title: '',
            body: ''
        });
    }

    render() {
        const { post, comments, dispatch, links } = this.props;
        const { showForm, showPostForm, title, body } = this.state;

        let time = '';
        let word = '';

        if (post) {
            time = new Date(post.timestamp).toDateString();

            if (post.commentCount > 0 && comments.length === 0) {
                fetch(url + '/posts/' + post.id + '/comments', {
                    method: 'GET',
                    headers: { 'Authorization': 'readable-aag'}
                }).then(response => response.json())
                  .then(comments => {
                      let newComments = comments.map((comment) => {
                          return {
                              [comment.id]: comment
                          }
                      });
                      let acComments = Object.assign({}, ...newComments);
                      dispatch(getComments(acComments));
                  });
            }

            if (post.commentCount > 1) {
                word = 'comments';
            } else {
                word = 'comment';
            }
        } else {
            return <NoMatch />
        }

        return (
            <div className="post-detail-container">
                <div style={{display: 'flex', flexDirection: 'row', width: '40%', justifyContent: 'space-around', marginTop: 30, marginBottom: 30}}>
                    <Link style={{textDecoration: 'none', color: 'orange'}} to="/">HOME</Link>
                    {
                        links.map(category => (
                            <Link key={category.name} style={{textDecoration: 'none', color: 'orange'}} to={`/${category.path}`}>{category.name.toUpperCase()}</Link>
                        ))
                    }
                </div>
                <div className="post-detail">
                    <p>{post ? time : ''}</p>
                    <h2>{post ? post.author : ''}</h2>
                    <p>{post ? post.title : ''}</p>
                    <p>{post ? post.body : ''}</p>
                    <p style={{color: 'darkgray'}}>{post ? post.commentCount : ''} {word}</p>
                    <p> Score: {post ? post.voteScore : ''}</p>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                        <button className="comment-button" onClick={this.showForm}>Comment</button>
                        <button className="comment-button" onClick={() => this.handlePostEdit(post.id)}>Edit Post</button>
                        <button className="comment-button" onClick={() => this.handlePostDelete(post.id)}>Delete Post</button>
                        <div style={{border: '1px solid orange', borderRadius: 5}}>
                            <button onClick={() => this.handleVoteUp(post.id)}>Vote up</button>
                                <p>Score: {post ? post.voteScore : ''}</p>
                            <button onClick={() => this.handleVoteDown(post.id)}>Vote down</button>
                        </div>
                    </div>
                </div>
                {showPostForm
                    ? <div>
                            <button type="button" onClick={this.closeForm}>Cancel</button>
                            <form onSubmit={this.handlePostSubmit}  className="post-form">
                                <label style={{marginTop: 30}}>Title:</label>
                                <input className="form-title" style={{width: '100%', fontSize: 15}} type="text" value={title} onChange={this.handleTitle} />

                                <label style={{marginTop: 30}}>Body:</label>
                                <textarea className="form-body" style={{width: '100%', fontSize: 15}} type="text" value={body} onChange={this.handleBody} ></textarea>

                                <button className="form-button" style={{marginTop: 10}} type="submit">Submit</button>
                            </form>
                        </div>
                    : <div></div>
                }
                {showForm
                    ? <div className="comment-form">
                        <form onSubmit={this.handleSubmit}>
                            <label>Comment below:</label>
                            <input type="text" value={this.state.comment} className="comment-comment" onChange={this.handleComment} />
                            <button type="submit">Submit</button>
                        </form>
                      </div>
                    : <div></div>
                }

                <div className="comments-container">
                    <h2>Comments: </h2>
                    {comments.length > 0 
                        ? comments.map(comment => (
                            <div key={comment.id} className="comment-container">
                                <p style={{marginLeft: 15, padding: 5}}>{comment.author} says: {comment.body}</p>
                                <div>
                                    <button className="comment-button" style={{marginLeft: 40}} onClick={() => this.handleEdit(comment.id)}>Edit</button>
                                    <button className="comment-button" style={{marginRight: 10}} onClick={() => this.handleDelete(comment.id)}>Delete</button>
                                </div>
                                <div style={{border: '1px solid orange', borderRadius: 5, margin: 5}}>
                                    <button onClick={() => this.voteCommentUp(comment.id)}>Vote up</button>
                                        <p>Score: {comment.voteScore}</p>
                                    <button onClick={() => this.voteCommentDown(comment.id)}>Vote down</button>
                                </div>
                            </div>
                        ))
                        : <p>Sorry you have no comments</p>
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps({ posts, comments, categories }, { match }) {

    const { id } = match.params;
    let commentsArray = Object.keys(comments).map(key => comments[key]);
    let acComments = commentsArray.filter(comment => comment.parentId === id);

    let links = [];
    let lastCategory = '';

    if (categories['categories'] && posts[id]) {
        links = categories['categories'].filter(cat => cat.name !== posts[id].category);
    }

    if (posts[id]) {
        lastCategory = posts[id].category
    }

    return {
        post: posts[id],
        comments: acComments,
        orComments: comments,
        storePosts: posts,
        links,
        lastCategory: lastCategory
    }
}

export default withRouter(connect(mapStateToProps)(PostDetail));