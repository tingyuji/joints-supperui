'use strict';

import React, { Component, PropTypes } from 'react';

export class Radio extends Component {
  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick () {
    if (this.props.onClick) {
      this.props.onClick(this.props.value, this.props.index);
    }
  }

  render () {
    return (
      <label style={this.props.style} className="cmpt-radio">
        <input ref="input"
          type="radio"
          disabled={this.props.readOnly}
          onChange={() => {}}
          onClick={this.handleClick}
          checked={this.props.checked}
          value={this.props.value}
        />
        <span>{this.props.text}</span>
      </label>
    );
  }
}

Radio.propTypes = {
  checked: PropTypes.bool,
  index: PropTypes.number,
  onClick: PropTypes.func,
  readOnly: PropTypes.bool,
  style: PropTypes.object,
  text: PropTypes.any,
  value: PropTypes.any
};

export default Radio;
