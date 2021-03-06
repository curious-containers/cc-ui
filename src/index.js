import 'tawian-frontend';
import 'typeface-cousine';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, IndexRedirect, Route, hashHistory } from 'react-router';
import App from './App';
import TaskGroups from './TaskGroups';
import TaskGroup from './TaskGroup';
import Tasks from './Tasks';
import Task from './Task';
import ApplicationContainers from './ApplicationContainers';
import ApplicationContainer from './ApplicationContainer';
import DataContainers from './DataContainers';
import DataContainer from './DataContainer';
import Cluster from './Cluster';
import './index.css';


const router = (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="task-groups" />

      <Route path="task-groups" component={TaskGroups} />
      <Route path="task-groups/:id" component={TaskGroup} />

      <Route path="tasks" component={Tasks} />
      <Route path="tasks/:id" component={Task} />

      <Route path="application-containers" component={ApplicationContainers} />
      <Route path="application-containers/:id" component={ApplicationContainer} />

      <Route path="data-containers" component={DataContainers} />
      <Route path="data-containers/:id" component={DataContainer} />

      <Route path="cluster" component={Cluster} />
    </Route>
  </Router>
);

ReactDOM.render(router, document.getElementById('root'));
