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
      data_containers: null,
    };
  },

  componentDidMount() {
    const payload = {
      aggregate: [
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
      ],
    };

    api.getDataContainers(payload)
      .then(({ data_containers }) => this.setState({ data_containers }));
  },

  render() {
    if (this.state.data_containers == null) {
      return (<h1>Loading Data Containers<span className="loading" /></h1>);
    }

    if (_.isEmpty(this.state.data_containers)) {
      return (<div className="alert alert-error">Data not available</div>);
    }

    return (
      <div>
        <h1>List of Data Containers</h1>

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
            {this.state.data_containers.map((container, i) =>
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
