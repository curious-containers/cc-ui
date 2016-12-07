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
      <div className="cell cell-3" key={node.name}>
        <Chart data={{ series }} options={options} />
        <strong>{node.name}</strong><br />
        RAM: {sum > node.total_ram ? <strong className="text-error">{sum}</strong> : sum} / {node.total_ram} MB<br />
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
