import React from 'react';
import { Link } from 'react-router-dom';

const Post = (props) => {
    
        return (
            <div className="post">
                <h2 style={{marginLeft: 15, width: 60}}>{props.post.author}</h2>
                
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: 400}}>
                    <p style={{fontSize: 12}}>title: {props.post.title}</p>
                    <p>{props.post.body}</p> 
                </div>

                <p style={{color: 'darkgray', fontSize: 15}}>{props.post.commentCount} comments</p>
                <Link to={`/${props.post.category}/${props.post.id}`} style={{textDecoration: 'none', color: 'orange'}}>Details</Link>

                <button onClick={() => props.handleEdit(props.post.id)}>Edit</button>
                <button onClick={() => props.handleDelete(props.post.id)}>Delete</button>

                <div>
                    <button onClick={() => props.handleVoteUp(props.post.id)}>Vote up</button>
                    <p>Score: {props.post.voteScore}</p>
                    <button onClick={() => props.handleVoteDown(props.post.id)}>Vote down</button>
                </div>
            </div>
        )
    
}

export default Post;