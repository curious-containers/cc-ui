import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import { fromMongoDate } from './utils';
import { api, stateIDs, stateToClass } from './Api';
import ToggleInput from './ToggleInput';


export default React.createClass({

  propTypes: {
    location: React.PropTypes.object,
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
          created_at: 1,
        },
      },
      { $sort: { created_at: -1 } },
    ];

    return {
      application_containers: null,
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
    api.getApplicationContainers(payload)
      .then(({ application_containers }) => this.setState({ application_containers }));
  },

  render() {
    if (this.state.application_containers == null) {
      return (<h1>Loading Application Containers<span className="loading" /></h1>);
    }

    return (
      <div>
        <ToggleInput onChange={this.setAggregate} heading="`aggregate` bearbeiten" value={this.state.aggregate} className="pull-right" />

        <h1>List of Application Containers</h1>

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
            {_.map(this.state.application_containers, (container, i) =>
              <tr key={i}>
                <td><Link to={`/application-containers/${container._id}`}>{container._id}</Link></td>
                <td>{container.username}</td>
                <td className={stateToClass[container.state]}>{stateIDs[container.state]}</td>
                <td>{fromMongoDate(container.created_at)}</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    );
  },

});
