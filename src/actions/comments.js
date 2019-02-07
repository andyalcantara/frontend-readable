export const GET_COMMENTS = 'GET_COMMENTS';
export const ADD_COMMENT = 'ADD_COMMENT';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const EDIT_COMMENT = 'EDIT_COMMENT';
export const VOTE_UP = 'VOTE_UP';
export const VOTE_DOWN = 'VOTE_DOWN';

export function getComments(comments) {
    return {
        type: GET_COMMENTS,
        comments
    }
}

export function addComment(comment) {
    return {
        type: ADD_COMMENT,
        comment
    }
}

export function deleteComment(id, parentId) {
    return {
        type: DELETE_COMMENT,
        id,
        parentId
    }
}

export function editComment(id, comment) {
    return {
        type: EDIT_COMMENT,
        id,
        comment
    }
}

export function voteCommentsUp(id) {
    return {
        type: VOTE_UP,
        id
    }
}

export function voteCommentsDown(id) {
    return {
        type: VOTE_DOWN,
        id
    }
}
