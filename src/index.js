import 'tawian-frontend';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, IndexRoute, Route, hashHistory } from 'react-router';
import App from './App';
import TaskGroups from './TaskGroups';
import TaskGroup from './TaskGroup';
import Tasks from './Tasks';
import Task from './Task';
import './index.css';


const router = (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={TaskGroups} />
      <Route path="task-groups/:id" component={TaskGroup} />
      <Route path="tasks" component={Tasks} />
      <Route path="tasks/:id" component={Task} />
    </Route>
  </Router>
);

ReactDOM.render(router, document.getElementById('root'));
