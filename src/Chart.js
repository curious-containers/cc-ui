import React from 'react';
import Chartist from 'chartist';
import 'chartist-plugin-tooltips';
import './chartist.css';


export default React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired,
    options: React.PropTypes.object,
    type: React.PropTypes.string,
    style: React.PropTypes.object,
    className: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      options: {},
      type: 'Pie',
      style: {},
      className: '',
    };
  },

  componentDidMount() {
    this.updateChart(this.props.data);
  },

  componentWillUnmount() {
    if (this.chartist) {
      try {
        this.chartist.detach();
      }
      catch (err) {
        throw new Error('Internal chartist error', err);
      }
    }
  },

  updateChart(data) {
    const options = {
      plugins: [Chartist.plugins.tooltip({ anchorToPoint: true })],
      ...this.props.options,
    };

    if (this.chartist) {
      this.chartist.update(data, options);
    }
    else {
      this.chartist = new Chartist[this.props.type](this.refs.chart, data, options);
    }

    return this.chartist;
  },

  render() {
    return <div className={`chartist ${this.props.className}`} ref="chart" style={this.props.style} />;
  },

});
