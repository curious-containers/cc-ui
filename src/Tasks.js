import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import { fromMongoDate } from './utils';
import { api, stateIDs, stateToClass } from './Api';


export default React.createClass({

  propTypes: {
    location: React.PropTypes.object,
  },

  getInitialState() {
    return {
      tasks: null,
    };
  },

  componentDidMount() {
    const task_group_id = this.props.location.query.task_group_id;

    const payload = {
      aggregate: [
        {
          $match: {
            'task_group_id.0': task_group_id,
            state: { $ne: -1 },
          },
        },
        {
          $project: {
            _id: 1,
            state: 1,
            username: 1,
            created_at: 1,
          },
        },
        { $sort: { created_at: -1 } },
      ],
    };

    api.getTasks(payload)
      .then(({ tasks }) => this.setState({ tasks }));
  },

  render() {
    if (this.state.tasks == null) {
      return (<h1>Loading Tasks<span className="loading" /></h1>);
    }

    if (_.isEmpty(this.state.tasks)) {
      return (<div className="alert alert-error">Data not available</div>);
    }

    return (
      <div>
        <h1>List of Tasks</h1>

        <table className="table-striped table-hover">

          <thead className="text-left">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>State</th>
              <th>Created at</th>
            </tr>
          </thead>

          <tbody>
            {this.state.tasks.map((task, i) =>
              <tr key={i}>
                <td><Link to={`/tasks/${task._id}`}>{task._id}</Link></td>
                <td>{task.username}</td>
                <td className={stateToClass[task.state]}>{stateIDs[task.state]}</td>
                <td>{fromMongoDate(task.created_at)}</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    );
  },

});
