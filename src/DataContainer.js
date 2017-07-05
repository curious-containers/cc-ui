import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import _ from 'lodash';
import { api } from './Api';
import { formatJSON } from './utils';


export default createReactClass({

  propTypes: {
    params: PropTypes.object,
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
        <h1>Data Container</h1>

        <pre className="scroll">
          {formatJSON(this.state.data_container)}
        </pre>
      </div>
    );
  },

});
