import React from 'react';
import _ from 'lodash';
import api from './Api';


export default React.createClass({

  propTypes: {
    params: React.PropTypes.number,
  },

  getInitialState() {
    return {
      group: null,
    };
  },

  componentDidMount() {
    const payload = {
      match: {
        _id: this.props.params.id,
      },
      project: {
        transitions: 1,
      },
    };

    api.getTaskGroups(payload)
      .then(groups => this.setState({ group: _.get(groups, 'task_groups[0]', {}) }));
  },

  render() {
    if (this.state.group == null) {
      return (<p>Loading Group Transitions<span className="loading" /></p>);
    }

    if (_.isEmpty(this.state.group)) {
      return (<p>Keine Daten gefunden</p>);
    }

    return (
      <pre className="scroll">
        {JSON.stringify(this.state.group, undefined, 4)}
      </pre>
    );
  },

});
