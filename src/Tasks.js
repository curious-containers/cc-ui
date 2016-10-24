import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import { Table, Header, Row, Item } from './FlexTable';
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
      return (<h1 className="loading">Loading Tasks</h1>);
    }

    if (_.isEmpty(this.state.tasks)) {
      return (<div className="alert alert-error">Data not available</div>);
    }

    return (
      <Table striped wide>

        <Header>
          <Item>ID</Item>
          <Item>Username</Item>
          <Item>State</Item>
          <Item>Created at</Item>
        </Header>

        {this.state.tasks.map((task, i) =>
          <Row key={i}>
            <Item><Link to={`/tasks/${task._id}`}>{task._id}</Link></Item>
            <Item>{task.username}</Item>
            <Item><span className={stateToClass[task.state]}>{stateIDs[task.state]}</span></Item>
            <Item>{fromMongoDate(task.created_at)}</Item>
          </Row>
        )}

      </Table>
    );
  },

});
