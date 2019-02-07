import React, { Component } from 'react';
import '../App.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import CategoriesList from './CategoriesList';
import CategoryDetail from './CategoryDetail';
import PostDetail from './PostDetail';

import { connect } from 'react-redux';
import { getCategories } from '../actions/categories';
import { getPosts } from '../actions/posts';

import { url } from '../utils/helpers';

class App extends Component {

  componentDidMount() {
    const { dispatch } = this.props;

    fetch(url + '/categories', {
      method: 'GET',
      headers: { 'Authorization': 'readable-aag'},
      mode: 'cors',
      cache: 'default'
    }).then((response) => response.json())
      .then(data => {
        dispatch(getCategories(data.categories));
      });

    fetch(url + '/posts', {
      method: 'GET',
      headers: { 'Authorization': 'readable-aag'},
      mode: 'cors',
      cache: 'default'
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

  render() {
    return (
      <Router>
        <div className="App">
          <Route path="/" exact component={CategoriesList} />
          <Route path="/:category" exact component={CategoryDetail} />
          <Route path="/:category/:id" exact component={PostDetail} />
        </div>
      </Router>
    );
  }
}

export default connect()(App);
