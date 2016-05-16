'use strict';

import React, { Component, PropTypes } from 'react';

const Example = class extends Component {
  render () {
    return (
      <div className="docs-example">{this.props.children}</div>
    );
  }
};

Example.propTypes = {
  children: PropTypes.any
};

module.exports = Example;
