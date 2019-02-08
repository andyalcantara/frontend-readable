import { getCategories } from './categories';
import { getPosts, upVote, downVote, deletePost, editPost, addPost } from './posts';
import { getComments, editComment, addComment, deleteComment, voteCommentsDown, voteCommentsUp } from './comments';

import { url } from '../utils/helpers';

const getHeaders = { 'Authorization': 'readable-aag'};
const postHeader = {
    'Authorization': 'readable-aag',
    'Content-Type': 'application/json'
}

export function handleInitialCategories() {
    return (dispatch) => {
        return fetch(url + '/categories', {
            method: 'GET',
            headers: getHeaders,
          }).then((response) => response.json())
            .then(data => {
              dispatch(getCategories(data.categories));
            });
    }
}

export function handleInitialPosts() {
    return (dispatch) => {
        return fetch(url + '/posts', {
            method: 'GET',
            headers: getHeaders,
          }).then((response) => response.json())
            .then((posts) => {
              let newPosts = posts.map(post => {
                return {
                  [post.id]: post
                }
              });
              let myPosts = Object.assign({}, ...newPosts);
              dispatch(getPosts(myPosts));
            });
    }
}

export function handleWithSharedVoteUp(id) {
    return (dispatch) => {
        return fetch(url + '/posts/' + id, {
            method: 'POST',
            headers: postHeader,
            body: JSON.stringify({option: 'upVote'})
        }).then(response => response.json())
          .then(() => {
              dispatch(upVote(id));
          });
    }
}

export function handleWithSharedVoteDown(id) {
    return (dispatch) => {
        return fetch(url + '/posts/' + id, {
            method: 'POST',
            headers: postHeader,
            body: JSON.stringify({option: 'downVote'})
        }).then(response => response.json())
          .then(() => {
              dispatch(downVote(id));
          });
    }
}

export function handleDeletePost(id) {
    return (dispatch) => {
        return fetch(url + '/posts/' + id, {
            method: 'DELETE',
            headers: postHeader
        }).then(response => response.json())
          .then(data => {
              dispatch(deletePost(id));
          });
    }
}

export function handleEditPost(id, title, body) {
    return (dispatch) => {
        return fetch(url + '/posts/' + id, {
            method: 'PUT',
            headers: postHeader,
            body: JSON.stringify({ title: title, body: body})
        }).then(response => response.json())
          .then(data => {
              console.log(data);
              dispatch(editPost(id, title, body)); 
          })
    }
}

export function handleNewPost(newPost) {
    return (dispatch) => {
        return fetch(url + '/posts', {
            method: 'POST',
            headers: postHeader,
            body: JSON.stringify(newPost)
        }).then(response => response.json())
          .then(data => {
            dispatch(addPost(data));
          });
    }
}

export function receiveComments(id) {
    return (dispatch) => {
        return fetch(url + '/posts/' + id + '/comments', {
            method: 'GET',
            headers: getHeaders
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

export function handleCommentEdit(id, timestamp, body) {
    return (dispatch) => {
        return fetch(url + '/comments/' + id, {
            method: 'PUT',
            headers: postHeader,
            body: JSON.stringify({timestamp: timestamp, body: body})
        }).then(response => response.json())
          .then(data => {
              dispatch(editComment(id, data));
          });
    }
}

export function handleNewComment(newComment) {
    return (dispatch) => {
        return fetch(url + '/comments', {
            method: 'POST',
            headers: postHeader,
            body: JSON.stringify(newComment)
        }).then(response => response.json())
          .then(data => {
              dispatch(addComment(data));
          });
    }
}

export function handleDeleteComment(id) {
    return (dispatch) => {
        return fetch(url + '/comments/' + id, {
            method: 'DELETE',
            headers: postHeader
        }).then(response => response.json())
          .then(data => {
                dispatch(deleteComment(id, data.parentId))
          });
    }
}

export function handleVoteUpComment(id) {
    return (dispatch) => {
        return fetch(url + '/comments/' + id, {
            method: 'POST',
            headers: postHeader,
            body: JSON.stringify({ option: 'upVote'})
        }).then(response => response.json())
          .then(() => {
              dispatch(voteCommentsUp(id));
          });
    }
}

export function handleVoteDownComment(id) {
    return (dispatch) => {
        return fetch(url + '/comments/' + id, {
            method: 'POST',
            headers: postHeader,
            body: JSON.stringify({ option: 'downVote'})
        }).then(response => response.json())
          .then(() => {
              dispatch(voteCommentsDown(id));
          });
    }
}
