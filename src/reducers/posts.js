import { GET_POSTS, ADD_POST, UP_VOTE, DOWN_VOTE, EDIT_POST, DELETE_POST } from '../actions/posts';
import { ADD_COMMENT, DELETE_COMMENT } from '../actions/comments';

export default function postsReducer(state = {}, action) {
    switch(action.type) {
        case GET_POSTS:
            const { posts } = action;
            return {
                ...state,
                ...posts
            }

        case ADD_POST:
            const { post } = action;
            
            return {
                ...state,
                [post.id]: post
            }

        case EDIT_POST:
            
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    title: action.title,
                    body: action.body
                }
            }

        case DELETE_POST:

            let updatedState = {...state};
            delete updatedState[action.id]

            return {
                ...updatedState
            }

        case ADD_COMMENT:

            return {
                ...state,
                [action.comment.parentId]: {
                    ...state[action.comment.parentId],
                    commentCount: state[action.comment.parentId].commentCount + 1
                }
            }

        case DELETE_COMMENT:

            return {
                ...state,
                [action.parentId]: {
                    ...state[action.parentId],
                    commentCount: state[action.parentId].commentCount - 1
                }
            }

        case UP_VOTE:
            
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    voteScore: state[action.id].voteScore + 1
                }
            }

        case DOWN_VOTE:

            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    voteScore: state[action.id].voteScore - 1
                }
            }

        default: 
            return state;
    }
}
