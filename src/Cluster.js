import React from 'react';
import _ from 'lodash';
import { api } from './Api';
import Chart from './Chart';


export default React.createClass({

  propTypes: {
    location: React.PropTypes.object,
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
      .then(nodes => this.setState({ nodes }));
  },

  renderNode(node) {
    console.log('healthy node', node);

    const options = {
      total: node.total_ram,
      showLabel: false,
    };
    const group = groupName => (value, i) => ({ value, className: `${groupName}-${i}` });
    const series = [
      ...node.active_application_containers.map(group('chart-group-red')),
      ...node.active_data_containers.map(group('chart-group-blue')),
    ];

    return (
      <div className="cell cell-3" key={node.name}>
        <Chart data={{ series }} options={options} />
        <strong>{node.name}</strong><br />
        RAM: {node.reserved_ram} / {node.total_ram} MB<br />
        CPUs: {node.total_cpus}
      </div>
    );
  },

  render() {
    const nodes = this.state.nodes;

    if (nodes == null) {
      return (<h1>Loading Nodes<span className="loading" /></h1>);
    }

    return (
      <div>
        <h1>Healthy Nodes</h1>

        <div className="grid">
          {_.map(nodes.healthy_nodes, this.renderNode)}
        </div>

        <h1>Dead Nodes</h1>

        {_.map(nodes.dead_nodes, node =>
          <details key={node.name}>
            <summary>{node.name || 'No name given'}</summary>
            <pre className="scroll">{node.description || 'No description given'}</pre>
          </details>
        )}
      </div>
    );
  },

});
