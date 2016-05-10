'use strict';

import React from 'react';
import Datetime from './Datetime';
import { shallowEqual } from '../../utils/obj';
import { register } from '../Form/enhance';

class Datepicker extends React.Component {
  constructor (props) {
    super(props);
  }

  shouldComponentUpdate (nextProps) {
    return !shallowEqual(this.props, nextProps);
  }

  render () {
    return (
      <Datetime { ...this.props } />
    );
  }
}

module.exports = register(Datepicker, ['datetime', 'time', 'date'], {valueType: 'datetime'});
