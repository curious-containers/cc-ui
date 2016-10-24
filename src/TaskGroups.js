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
      groups: null,
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
            tasks_count: 1,
            created_at: 1,
          },
        },
        { $sort: { created_at: -1 } },
      ],
    };

    api.getTaskGroups(payload)
      .then(groups => this.setState({ groups: groups.task_groups }));
  },

  render() {
    if (this.state.groups == null) {
      return (<h1 className="loading">Loading Task Groups</h1>);
    }

    if (_.isEmpty(this.state.groups)) {
      return (<div className="alert alert-error">Data not available</div>);
    }

    return (
      <Table striped wide>

        <Header>
          <Item double>ID</Item>
          <Item>Username</Item>
          <Item>State</Item>
          <Item>Number of Tasks</Item>
          <Item>Created at</Item>
        </Header>

        {this.state.groups.map((group, i) =>
          <Row key={i}>
            <Item double><Link to={`/task-groups/${group._id}`}>{group._id}</Link></Item>
            <Item>{group.username}</Item>
            <Item><span className={stateToClass[group.state]}>{stateIDs[group.state]}</span></Item>
            <Item><Link to={`/tasks?task_group_id=${group._id}`}>{group.tasks_count}</Link></Item>
            <Item>{fromMongoDate(group.created_at)}</Item>
          </Row>
        )}

      </Table>
    );
  },

});
