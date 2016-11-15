import React from 'react';


export default React.createClass({

  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    heading: React.PropTypes.string,
    value: React.PropTypes.string,
    className: React.PropTypes.string,
    open: React.PropTypes.bool,
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
          style={{ border: '2px solid #e0e0e0' }}
          hidden={!this.state.open}
          onChange={this.onChange}
          value={this.state.value}
        />
        <button
          type="button"
          className="btn btn-primary btn-block"
          hidden={!this.state.open}
          onClick={this.onSubmit}
        >Save</button>
      </form>
    );
  },

});
