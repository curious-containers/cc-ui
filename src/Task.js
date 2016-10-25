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
      return (<h1 className="loading">Loading Task</h1>);
    }

    if (_.isEmpty(this.state.task)) {
      return (<div className="alert alert-error">Data not available</div>);
    }

    return (
      <div>
        <h2>Application Containers</h2>

        <Table striped wide>

          <Header>
            <Item>ID</Item>
            <Item>Username</Item>
            <Item>State</Item>
            <Item>Created at</Item>
          </Header>

          {this.state.application_containers.map((container, i) =>
            <Row key={i}>
              <Item><Link to={`/application-containers/${container._id}`}>{container._id}</Link></Item>
              <Item>{container.username}</Item>
              <Item><span className={stateToClass[container.state]}>{stateIDs[container.state]}</span></Item>
              <Item>{fromMongoDate(container.created_at)}</Item>
            </Row>
          )}

        </Table>

        <h2>Task</h2>

        <pre className="scroll">
          {JSON.stringify(this.state.task, undefined, 4)}
        </pre>
      </div>
    );
  },

});
