import React from 'react';
import _ from 'lodash';
import { api } from './Api';


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
      aggregate: [{ $match: { _id: this.props.params.id } }],
    };

    api.getTaskGroups(payload)
      .then(groups => this.setState({ group: _.get(groups, 'task_groups[0]', {}) }));
  },

  render() {
    if (this.state.group == null) {
      return (<p>Loading Group Transitions<span className="loading" /></p>);
    }

    if (_.isEmpty(this.state.group)) {
      return (<div className="alert alert-error">Data not available</div>);
    }

    return (
      <pre className="scroll">
        {JSON.stringify(this.state.group, undefined, 4)}
      </pre>
    );
  },

});
