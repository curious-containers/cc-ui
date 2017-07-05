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
    const cluster_node = this.props.location.query.cluster_node;
    const aggregate = [
      {
        $match: {
          cluster_node,
          state: cluster_node ? { $nin: [-1, 3, 4, 5] } : { $ne: -1 },
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
      data_containers: null,
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
    api.getDataContainers(payload)
      .then(({ data_containers }) => this.setState({ data_containers }));
  },

  render() {
    if (this.state.data_containers == null) {
      return (<h1>Loading Data Containers<span className="loading" /></h1>);
    }

    return (
      <div>
        <h1>List of Data Containers</h1>

        <ToggleInput onChange={this.setAggregate} heading="Custom Query" value={this.state.aggregate} />

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
            {_.map(this.state.data_containers, (container, i) =>
              <tr key={i}>
                <td><Link to={`/data-containers/${container._id}`}>{container._id}</Link></td>
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
