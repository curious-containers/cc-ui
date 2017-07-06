import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { checkJSON } from './utils';


export default createReactClass({

  propTypes: {
    onChange: PropTypes.func.isRequired,
    heading: PropTypes.string,
    value: PropTypes.string,
    className: PropTypes.string,
    open: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      onChange() {},
      heading: 'Toggle Input',
      value: '',
      className: '',
      open: false,
    };
  },

  getInitialState() {
    return {
      open: this.props.open,
      value: this.props.value,
    };
  },

  onChange(ev) {
    this.setState({ value: ev.target.value });
  },

  onSubmit(ev) {
    ev.preventDefault();
    this.props.onChange(this.state.value);
  },

  toggleInput() {
    this.setState({ open: !this.state.open });
  },

  render() {
    const borderColor = checkJSON(this.state.value) ? '#e0e0e0' : '#f44336';

    return (
      <form className={`form ${this.props.className}`}>
        <button
          type="button"
          className="btn btn-default pull-right"
          style={{ zIndex: 1 }}
          onClick={this.toggleInput}
        >{this.props.heading} {this.state.open ? '▲' : '▼'}</button>
        <textarea
          rows="10"
          className="full-width"
          style={{ border: `2px solid ${borderColor}` }}
          hidden={!this.state.open}
          onChange={this.onChange}
          value={this.state.value}
        />
        <button
          type="button"
          className="btn btn-primary full-width"
          hidden={!this.state.open}
          onClick={this.onSubmit}
        >Save</button>
      </form>
    );
  },

});
