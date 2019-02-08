import { getCategories } from './categories';
import { getPosts, upVote, downVote, deletePost, editPost, addPost } from './posts';

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
