import React, { Component } from 'react';

import { connect } from 'react-redux';
import { url, generateUID } from '../utils/helpers';
import { upVote, downVote } from '../actions/posts';
import { getComments, addComment, deleteComment, editComment, voteCommentsDown, voteCommentsUp } from '../actions/comments';
import NoMatch from './NoMatch';

class PostDetail extends Component {

    state = {
        showForm: false,
        comment: '',
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

    render() {
        const { post, comments, dispatch } = this.props;
        const { showForm } = this.state;

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
                <div className="post-detail">
                    <p>{post ? time : ''}</p>
                    <h2>{post ? post.author : ''}</h2>
                    <p>{post ? post.title : ''}</p>
                    <p>{post ? post.body : ''}</p>
                    <p style={{color: 'darkgray'}}>{post ? post.commentCount : ''} {word}</p>
                    <p> Score: {post ? post.voteScore : ''}</p>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                        <button className="comment-button" onClick={this.showForm}>Comment</button>
                        <div style={{border: '1px solid orange', borderRadius: 5}}>
                            <button onClick={() => this.handleVoteUp(post.id)}>Vote up</button>
                                <p>Score: {post ? post.voteScore : ''}</p>
                            <button onClick={() => this.handleVoteDown(post.id)}>Vote down</button>
                        </div>
                    </div>
                </div>
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

function mapStateToProps({ posts, comments }, { match }) {
    const { id } = match.params;
    let commentsArray = Object.keys(comments).map(key => comments[key]);
    let acComments = commentsArray.filter(comment => comment.parentId === id);

    console.log(comments);

    return {
        post: posts[id],
        comments: acComments,
        orComments: comments
    }
}

export default connect(mapStateToProps)(PostDetail);