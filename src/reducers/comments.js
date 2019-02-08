import { 
    GET_COMMENTS, 
    ADD_COMMENT, 
    DELETE_COMMENT, 
    EDIT_COMMENT,
    VOTE_DOWN,
    VOTE_UP } from '../actions/comments';

export default function commentsReducer(state = {}, action) {
    switch(action.type) {
        case GET_COMMENTS:
            return {
                ...state,
                ...action.comments
            }

        case ADD_COMMENT:
            const { comment } = action
            return {
                ...state,
                [comment.id]: comment
            }

        case DELETE_COMMENT:

            let updatedState = {...state};
            delete updatedState[action.id];

            return {
                ...updatedState,
            }

        case EDIT_COMMENT:
            const { id } = action;

            return {
                ...state,
                [id]: action.comment
            }

        case VOTE_UP:

            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    voteScore: state[action.id].voteScore + 1
                }
            }

        case VOTE_DOWN:

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