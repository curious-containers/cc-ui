import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import { Table, Header, Row, Item } from './FlexTable';
import { fromMongoDate } from './utils';
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
      return (<h1 className="loading">Loading Application Container</h1>);
    }

    if (_.isEmpty(this.state.application_container)) {
      return (<div className="alert alert-error">Data not available</div>);
    }

    return (
      <div>
        <h2>Data Containers</h2>

        <Table striped wide>

          <Header>
            <Item>ID</Item>
            <Item>Username</Item>
            <Item>State</Item>
            <Item>Created at</Item>
          </Header>

          {this.state.data_containers.map((container, i) =>
            <Row key={i}>
              <Item><Link to={`/data-containers/${container._id}`}>{container._id}</Link></Item>
              <Item>{container.username}</Item>
              <Item><span className={stateToClass[container.state]}>{stateIDs[container.state]}</span></Item>
              <Item>{fromMongoDate(container.created_at)}</Item>
            </Row>
          )}

        </Table>

        <h2>Application Container</h2>

        <pre className="scroll">
          {JSON.stringify(this.state.application_container, undefined, 4)}
        </pre>
      </div>
    );
  },

});
