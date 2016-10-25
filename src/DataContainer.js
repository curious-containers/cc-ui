import React from 'react';
import _ from 'lodash';
import { api } from './Api';


export default React.createClass({

  propTypes: {
    params: React.PropTypes.object,
  },

  getInitialState() {
    return {
      data_container: null,
    };
  },

  componentDidMount() {
    const id = this.props.params.id;

    const payload = {
      aggregate: [
        { $match: { _id: id } },
      ],
    };

    api.getDataContainers(payload)
      .then(response => this.setState({ data_container: _.get(response, 'data_containers[0]', {}) }));
  },

  render() {
    if (this.state.data_container == null) {
      return (<h1>Loading Data Container<span className="loading" /></h1>);
    }

    if (_.isEmpty(this.state.data_container)) {
      return (<div className="alert alert-error">Data not available</div>);
    }

    return (
      <div>
        <h1>Task Group</h1>

        <pre className="scroll">
          {JSON.stringify(this.state.data_container, undefined, 4)}
        </pre>
      </div>
    );
  },

});
