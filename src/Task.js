import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import { fromMongoDate, formatJSON } from './utils';
import { api, stateIDs, stateToClass } from './Api';


export default React.createClass({

  propTypes: {
    params: React.PropTypes.object,
  },

  getInitialState() {
    return {
      task: null,
      application_containers: [],
    };
  },

  componentDidMount() {
    const id = this.props.params.id;

    const taskPayload = {
      aggregate: [
        { $match: { _id: id } },
      ],
    };

    api.getTasks(taskPayload)
      .then(response => this.setState({ task: _.get(response, 'tasks[0]', {}) }));

    const acPayload = {
      aggregate: [
        {
          $match: {
            'task_id.0': id,
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

    api.getApplicationContainers(acPayload)
      .then(({ application_containers }) => this.setState({ application_containers }));
  },

  render() {
    if (this.state.task == null) {
      return (<h1>Loading Task<span className="loading" /></h1>);
    }

    if (_.isEmpty(this.state.task)) {
      return (<div className="alert alert-error">Data not available</div>);
    }

    return (
      <div>
        <h1>Task</h1>

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
            {this.state.application_containers.map((container, i) =>
              <tr key={i}>
                <td><Link to={`/application-containers/${container._id}`}>{container._id}</Link></td>
                <td>{container.username}</td>
                <td className={stateToClass[container.state]}>{stateIDs[container.state]}</td>
                <td>{fromMongoDate(container.created_at)}</td>
              </tr>
            )}
          </tbody>

        </table>

        <h2>Task</h2>

        <pre className="scroll">
          {formatJSON(this.state.task)}
        </pre>
      </div>
    );
  },

});
