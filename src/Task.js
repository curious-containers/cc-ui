import React from 'react';
import _ from 'lodash';
import api from './Api';


export default React.createClass({

  propTypes: {
    params: React.PropTypes.object,
  },

  getInitialState() {
    return {
      task: null,
    };
  },

  componentDidMount() {
    const payload = {
      match: {
        // task_group_id: this.props.params.id,
      },
    };

    api.getTask(payload)
      .then(task => this.setState({ task }));
  },

  render() {
    if (this.state.task == null) {
      return (<h1 className="loading">Loading Task</h1>);
    }

    if (_.isEmpty(this.state.task)) {
      return (<h1>Keine Daten gefunden</h1>);
    }

    return (
      <pre className="scroll">
        {JSON.stringify(this.state.task, undefined, 4)}
      </pre>
    );
  },

});
