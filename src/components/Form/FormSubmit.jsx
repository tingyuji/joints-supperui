'use strict';

import React, { Component, PropTypes } from 'react';
import {Button} from '../button';

export class FormSubmit extends Component {
  render () {
    const props = this.props;
    
    let children = props.children;
    let content;
    if (Array.isArray(children)) {
      content = props.disabled ? children[1] : children[0];
    } else {
      content = children;
    }

    return (
      <div style={props.style} className="cmpt-control-group">
        <Button type="submit"
          status="primary"
          onClick={props.onClick}
          disabled={props.disabled}>
          {content}
        </Button>
      </div>
    );
  }
}

FormSubmit.propTypes = {
  children: PropTypes.any,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  style: PropTypes.object
};

module.exports = FormSubmit;
