import React from 'react';
import _ from 'lodash';
import { api } from './Api';
import { formatJSON } from './utils';


export default React.createClass({

  propTypes: {
    params: React.PropTypes.object,
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
      return (<h1>Loading Task Group<span className="loading" /></h1>);
    }

    if (_.isEmpty(this.state.group)) {
      return (<div className="alert alert-error">Data not available</div>);
    }

    return (
      <div>
        <h1>Task Group</h1>

        <pre className="scroll">
          {formatJSON(this.state.group)}
        </pre>
      </div>
    );
  },

});
