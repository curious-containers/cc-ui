import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import { Table, Header, Row, Item } from './FlexTable';
import api from './Api';


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
      match: {},
      project: {
        _id: 1,
        state: 1,
        username: 1,
        tasks_count: 1,
      },
    };

    api.getTaskGroups(payload)
      .then(groups => this.setState({ groups: groups.task_groups }));
  },

  render() {
    if (this.state.groups == null) {
      return (<h1 className="loading">Loading Task Groups</h1>);
    }

    if (_.isEmpty(this.state.groups)) {
      return (<h1>Keine Gruppen gefunden</h1>);
    }

    return (
      <Table striped wide>

        <Header>
          <Item>ID</Item>
          <Item>Username</Item>
          <Item>State</Item>
          <Item>Number of Tasks</Item>
        </Header>

        {this.state.groups.map((group, i) =>
          <Row key={i}>
            <Item><Link to={`/task-groups/${group._id}`}>{group._id}</Link></Item>
            <Item>{group.username}</Item>
            <Item>{group.state}</Item>
            <Item><Link to={`/tasks?group=${group._id}`}>{group.tasks_count}</Link></Item>
          </Row>
        )}

      </Table>
    );
  },

});
