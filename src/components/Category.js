import React from 'react';

const Category = (props) => {

    let postCount = props.posts.filter(post => post.category === props.categoryName).length;

    return (
        <div className="category-item">
            {postCount === 1 
                ? <p style={{marginRight: 15, color: 'lightgray'}}>{postCount} post</p>
                : <p style={{marginRight: 15, color: 'lightgray'}}>{postCount} posts</p>
            }
        </div>
    )
}

export default Category;