import 'tawian-frontend';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, IndexRedirect, Route, hashHistory } from 'react-router';
import App from './App';
import TaskGroups from './TaskGroups';
import TaskGroup from './TaskGroup';
import Tasks from './Tasks';
import Task from './Task';
import ApplicationContainer from './ApplicationContainer';
import DataContainer from './DataContainer';
import './index.css';


const router = (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="task-groups" />
      <Route path="task-groups" component={TaskGroups} />
      <Route path="task-groups/:id" component={TaskGroup} />
      <Route path="tasks" component={Tasks} />
      <Route path="tasks/:id" component={Task} />
      <Route path="application-containers/:id" component={ApplicationContainer} />
      <Route path="data-containers/:id" component={DataContainer} />
    </Route>
  </Router>
);

ReactDOM.render(router, document.getElementById('root'));
