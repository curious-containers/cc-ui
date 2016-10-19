/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import './flextable.css';


const md = { width: '65px' };


function getClassNames(props) {
  const classes = [];
  const remainingProps = {};

  _.each(props, (value, key) => {
    if (value === true) { classes.push(key); }
    else { remainingProps[key] = value; }
  });

  return {
    remainingProps,
    classes: classes.join(' '),
  };
}

export function Table(props) {
  const { classes, remainingProps } = getClassNames(props);
  return (
    <div className={`flextable ${classes}`} {...remainingProps}>
      {props.children}
    </div>
  );
}

export function Header(props) {
  const { classes, remainingProps } = getClassNames(props);
  return (
    <div className={`flexrow flexheader ${classes}`} {...remainingProps}>
      {props.children}
    </div>
  );
}

export function Row(props) {
  const { classes, remainingProps } = getClassNames(props);
  return (
    <div className={`flexrow ${classes}`} {...remainingProps}>
      {props.children}
    </div>
  );
}

export const FormRow = React.createClass({
  getInitialState() {
    return { switch: true };
  },

  reset() {
    this.setState({ switch: !this.state.switch }); // force re-render
  },

  render() {
    const { classes, remainingProps } = getClassNames(this.props);
    return (
      <div className={`flexrow ${classes}`} {...remainingProps} key={this.state.switch}>
        {this.props.children}
        <button className="btn btn-default" onClick={this.reset} style={md}>Reset</button>
      </div>
    );
  },
});

export function Item(props) {
  const baseClass = props.style && props.style.width ? 'item' : 'flexitem';
  const { classes, remainingProps } = getClassNames(props);

  return (
    <div className={`${baseClass} ${classes}`} {...remainingProps}>
      {props.children}
    </div>
  );
}
