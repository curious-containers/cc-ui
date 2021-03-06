import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import _ from 'lodash';
import { Link } from 'react-router';
import { fromMongoDate } from './utils';
import { api, stateIDs, stateToClass } from './Api';
import ToggleInput from './ToggleInput';


export default createReactClass({

  propTypes: {
    location: PropTypes.object,
  },

  getInitialState() {
    const aggregate = [
      {
        $match: {
          state: { $ne: -1 },
        },
      },
      {
        $project: {
          _id: 1,
          state: 1,
          username: 1,
          tasks_count: 1,
          created_at: 1,
        },
      },
      { $sort: { created_at: -1 } },
    ];

    return {
      groups: null,
      aggregate: JSON.stringify(aggregate, null, 4),
    };
  },

  componentDidMount() {
    this.loadData();
  },

  setAggregate(aggregate) {
    this.setState({ aggregate }, this.loadData);
  },

  loadData() {
    const payload = { aggregate: JSON.parse(this.state.aggregate) };
    api.getTaskGroups(payload)
      .then(groups => this.setState({ groups: groups.task_groups }));
  },

  render() {
    if (this.state.groups == null) {
      return (<h1>Loading Task Groups<span className="loading" /></h1>);
    }

    return (
      <div>
        <h1>List of Task Groups</h1>

        <ToggleInput onChange={this.setAggregate} heading="Custom Query" value={this.state.aggregate} />

        <table className="table-striped table-hover">

          <thead className="text-left">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>State</th>
              <th>Tasks</th>
              <th>Created at</th>
            </tr>
          </thead>

          <tbody>
            {_.map(this.state.groups, (group, i) =>
              <tr key={i}>
                <td><Link to={`/task-groups/${group._id}`}>{group._id}</Link></td>
                <td>{group.username}</td>
                <td className={stateToClass[group.state]}>{stateIDs[group.state]}</td>
                <td><Link to={`/tasks?task_group_id=${group._id}`}>{group.tasks_count}</Link></td>
                <td>{fromMongoDate(group.created_at)}</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    );
  },

});
