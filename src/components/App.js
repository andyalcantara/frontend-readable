import React, { Component } from 'react';
import '../App.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import CategoriesList from './CategoriesList';
import CategoryDetail from './CategoryDetail';
import PostDetail from './PostDetail';
import NoMatch from './NoMatch';

import { connect } from 'react-redux';
import { handleInitialCategories, handleInitialPosts } from '../actions/shared';

class App extends Component {

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(handleInitialCategories());
    dispatch(handleInitialPosts());
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" exact component={CategoriesList} />
            <Route path="/:category" exact component={CategoryDetail} />
            <Route path="/:category/:id" exact component={PostDetail} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default connect()(App);
