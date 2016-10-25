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
      application_container: null,
      data_containers: [],
    };
  },

  componentDidMount() {
    const id = this.props.params.id;

    const acPayload = {
      aggregate: [
        { $match: { _id: id } },
      ],
    };

    api.getApplicationContainers(acPayload)
      .then((response) => {
        const application_container = _.get(response, 'application_containers[0]', {});
        this.setState({ application_container });

        const dcPayload = {
          aggregate: [
            {
              $match: {
                _id: { $in: application_container.data_container_ids },
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

        api.getDataContainers(dcPayload)
          .then(({ data_containers }) => this.setState({ data_containers }));
      });
  },

  render() {
    if (this.state.application_container == null) {
      return (<h1>Loading Application Container<span className="loading" /></h1>);
    }

    if (_.isEmpty(this.state.application_container)) {
      return (<div className="alert alert-error">Data not available</div>);
    }

    return (
      <div>
        <h1>Data Containers</h1>

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
                <td><Link to={`/data-containers/${container._id}`}>{container._id}</Link></td>
                <td>{container.username}</td>
                <td className={stateToClass[container.state]}>{stateIDs[container.state]}</td>
                <td>{fromMongoDate(container.created_at)}</td>
              </tr>
            )}
          </tbody>

        </table>

        <h2>Application Container</h2>

        <pre className="scroll">
          {formatJSON(this.state.application_container)}
        </pre>
      </div>
    );
  },

});
