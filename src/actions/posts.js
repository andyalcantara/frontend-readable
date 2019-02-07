export const GET_POSTS = 'GET_POSTS';
export const ADD_POST = 'ADD_POST';
export const UP_VOTE = 'UP_VOTE';
export const DOWN_VOTE = 'DOWN_VOTE';
export const EDIT_POST = 'EDIT_POST';
export const DELETE_POST = 'DELETE_POST';

export function getPosts(posts) {
    return {
        type: GET_POSTS,
        posts
    }
}

export function addPost(post) {
    return {
        type: ADD_POST,
        post
    }
}

export function editPost(id, title, body) {
    return {
        type: EDIT_POST,
        id,
        title,
        body
    }
}

export function deletePost(id) {
    return {
        type: DELETE_POST,
        id
    }
}

export function upVote(id) {
    return {
        type: UP_VOTE,
        id
    }
}

export function downVote(id) {
    return {
        type: DOWN_VOTE,
        id
    }
}