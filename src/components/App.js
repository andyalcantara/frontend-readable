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
    const { onReceiveCategories, onReceivePosts } = this.props;

    onReceiveCategories();
    onReceivePosts();
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

const mapDispatchToProps = (dispatch) => {
  return {
    onReceiveCategories: () => {
      dispatch(handleInitialCategories());
    },
    onReceivePosts: () => {
      dispatch(handleInitialPosts());
    }
  }
}

export default connect(null, mapDispatchToProps)(App);
