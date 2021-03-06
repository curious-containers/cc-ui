import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import _ from 'lodash';
import { Link } from 'react-router';
import { api } from './Api';
import Chart from './Chart';


export default createReactClass({

  propTypes: {
    location: PropTypes.object,
  },

  getInitialState() {
    return {
      nodes: null,
    };
  },

  componentDidMount() {
    this.loadData();
  },

  loadData() {
    api.getNodes()
      .then(({ nodes }) => this.setState({ nodes }));
  },

  renderNode(node) {
    const options = { showLabel: false };
    const group = groupName => (value, i) => ({ value, className: `${groupName}-${i % 4}` }); // repeat after 4
    const sum = _.sum(node.active_application_containers) + _.sum(node.active_data_containers);
    const diff = node.total_ram - sum;
    const series = [
      ...node.active_application_containers.map(group('chart-group-red')),
      ...node.active_data_containers.map(group('chart-group-blue')),
      { value: (diff < 0 ? 0 : diff), className: 'chart-group-gray-0' },
    ];

    return (
      <div className="cell cell-3" key={node.cluster_node}>
        <Chart data={{ series }} options={options} />
        <strong>{node.cluster_node}</strong><br />
        RAM: {sum > node.total_ram ? <strong className="text-error">{sum}</strong> : sum} / {node.total_ram} MB<br />
        CPUs: {node.total_cpus}<br />
        Containers: <Link to={`/application-containers?cluster_node=${node.cluster_node}`}>App</Link> | <Link to={`/data-containers?cluster_node=${node.cluster_node}`}>Data</Link>
      </div>
    );
  },

  render() {
    const nodes = this.state.nodes;

    if (nodes == null) {
      return (<h1>Loading Nodes<span className="loading" /></h1>);
    }

    const [onlineNodes, offlineNodes] = _.partition(nodes, 'is_online');

    return (
      <div>
        <h1>Online Nodes</h1>

        <div className="grid m-b-2">
          {_.sortBy(onlineNodes, 'name').map(this.renderNode)}
        </div>

        <h1>Offline Nodes</h1>

        {_.sortBy(offlineNodes, 'name').map(node =>
          <details key={node.cluster_node}>
            <summary>{node.cluster_node || 'No name given'}</summary>
            <pre className="scroll">{node.debug_info || 'No description given'}</pre>
          </details>
        )}
      </div>
    );
  },

});
