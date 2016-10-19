import React from 'react';
import _ from 'lodash';
import api from './Api';


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
    const group = this.props.location.query.group;
    const match = group ? { task_group_id: group } : {};

    api.getTasks({ match })
      .then(tasks => this.setState({ tasks }));
  },

  render() {
    if (this.state.tasks == null) {
      return (<h1 className="loading">Loading Tasks</h1>);
    }

    if (_.isEmpty(this.state.tasks)) {
      return (<h1>Keine Daten gefunden</h1>);
    }

    return (
      <pre className="scroll">
        {JSON.stringify(this.state.tasks, undefined, 4)}
      </pre>
    );
  },

});
