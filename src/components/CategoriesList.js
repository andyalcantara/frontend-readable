import React, { Component } from 'react';
import { connect } from 'react-redux';
import Category from './Category';

import { Link } from 'react-router-dom';

class CategoriesList extends Component {
    render() {

        const { categories, posts } = this.props;

        return (
            <div>
                <div>
                    <h2>Categories</h2>

                </div>

                {
                    categories.map((category) => (
                        <Link key={category.name} to={`/${category.path}`} style={{textDecoration: 'none', color: 'darkorange'}}>
                            <div className="category">
                                <h3 style={{marginLeft: 20}}>{category.name}</h3>
                                <Category posts={posts} categoryName={category.name} />
                            </div>
                        </Link>
                    ))
                }

                <h2>All Posts</h2>
                {
                    posts.map((post) => (
                        <div key={post.id} className="post">
                            <p style={{marginLeft: 15, padding: 5}}>{post.author} wrote: {post.body}</p>
                        </div>
                    ))
                }
            </div>
        )
    }
}

function mapStateToProps({ categories, posts }) {
    return {
        categories: Object.keys(categories).map(key => categories[key]),
        posts: Object.keys(posts).map(key => posts[key])
    }
}

export default connect(mapStateToProps)(CategoriesList);