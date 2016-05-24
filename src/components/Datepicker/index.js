'use strict';

import React from 'react';
import Datetime from './Datetime';
import {Obj}  from 'supperutils';
import { register } from '../Form/enhance';

const { shallowEqual } = Obj;

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
