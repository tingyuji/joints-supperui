'use strict';

import React, { Children, Component, PropTypes, cloneElement } from 'react';
import classnames from 'classnames';
import { Obj } from 'supperutils';
import { getGrid } from '../Grid/util';
import { getLang } from '../../locals';
import { fetchEnhance, FETCH_SUCCESS } from '../_mixins/Fetch';
import FormControl from './FormControl';
import FormSubmit from './FormSubmit';

const { forEach, deepEqual, hashcode, clone } = Obj;

class Form extends Component {
  constructor (props) {
    super(props);
    this.state = {
      data: props.data
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.getData = this.getData.bind(this);
    this.validateField = this.validateField.bind(this);

    this.items = {};
    this.validationPools = {};

    this.itemBind = (item) => {
      this.items[item.id] =item;

      let data = this.state.data;
      data[item.name] = item.value;
      this.setState({ data });

      // bind triger item
      if (item.valiBind) {
        item.valiBind.forEach((vb) => {
          this.validationPools[vb] = (this.validationPools[vb] || []).concat(item.validate);
        });
      }
    };

    this.itemUnbind = (id, name) => {
      let data = this.state.data;
      delete this.items[id];
      delete data[name];
      // remove valiBind
      delete this.validationPools[name];
      this.setState({ data });
    };

    this.itemChange = (id, value, err) => {
      let data = this.state.data;
      const name = this.items[id].name;

      // don't use merge or immutablejs
      //data = merge({}, data, {[name]: value});

      if (data[name] !== value) {
        data[name] = value;
        // setState only triger render, data was changed
        this.setState({ data });
      }

      let valiBind = this.validationPools[name];
      if (valiBind) {
        valiBind.forEach((validate) => {
          if (validate) {
            validate();
          }
        });
      }

      this.items[id].$validation = err;
    };

    this.validate = this.validate.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (!deepEqual(this.props.data, nextProps.data)) {
      this.setState({ data: nextProps.data });

      // if data changed, clear validation
      forEach(this.items, (item) => {
        delete item.$validation;
      });
    }
  }

  validate () {
    let success = true;
    forEach(this.items, (item) => {
      let suc = item.$validation;
      if (suc === undefined) {
        suc = item.validate();
        this.items[item.id].$validation = suc;
      }
      success = success && (suc === true);
    });
    return success;
  }

  validateField (name) {
    let success = true;

    forEach(this.items, (item) => {
      if(item.name === name){
        success = item.validate();
        return false;
      }
    });

    return success;
  }

  handleSubmit (event) {
    if (this.props.disabled) {
      return;
    }

    event.preventDefault();
    this.submit();
  }

  submit () {
    let success = this.validate();
    if (success && this.props.beforeSubmit) {
      success = this.props.beforeSubmit();
    }

    if (!success) {
      return;
    }

    if (this.props.onSubmit) {
      // send clone data
      let data = clone(this.state.data);

      // remove ignore value
      forEach(this.items, (item) => {
        if (item.ignore) {
          delete data[item.name];
        }
      });

      this.props.onSubmit(data);
    }

    return true;
  }

  getData () {
    let data = clone(this.state.data);

    return data;
  }

  reset () {
    this.setState({
      data: this.props.resetData || {}
    })
  }

  renderControls () {
    const { data } = this.state;
    const { hintType, controls, disabled, layout } = this.props;

    return clone(controls).map((control, i) => {
      if (typeof control !== 'object') {
        return control;
      } else {
        control.key = control.key || control.name || hashcode(control);
        control.hintType = control.hintType || hintType;
        control.readOnly = control.readOnly || disabled;
        control.layout = layout;
        control.itemBind = this.itemBind;
        control.itemUnbind = this.itemUnbind;
        control.itemChange = this.itemChange;
        control.formData = data;
        return <FormControl { ...control } />;
      }
    });
  }

  renderChildren (children) {
    let { data } = this.state;
    let { fetchStatus, disabled } = this.props;

    return Children.map(children, (child) => {
      if (!child) { return null; }
      if (typeof child === 'string') { return child; }
      let { hintType, readOnly } = child.props;
      let props = {
        hintType: hintType || this.props.hintType,
        readOnly: readOnly || disabled,
        layout: this.props.layout,
      };
      if (child.type === FormControl || child.type.displayName === 'FormItem') {
        props.itemBind = this.itemBind;
        props.itemUnbind = this.itemUnbind;
        props.itemChange = this.itemChange;
        props.formData = data;
      } else if (child.type === FormSubmit) {
        props.disabled = disabled;
        if (fetchStatus !== FETCH_SUCCESS) {
          props.children = getLang('fetch.status')[fetchStatus];
        }
      } else if (child.props.children) {
        props.children = this.renderChildren(child.props.children);
      }

      return cloneElement(child, props);
    });
  }

  renderButton (text) {
    return <FormSubmit disabled={this.props.disabled}>{text}</FormSubmit>;
  }

  render () {
    let { button, controls, fetchStatus, children, className, onSubmit, grid, layout, ...props } = this.props;

    className = classnames(
      className,
      getGrid(grid),
      'cmpt-form',
      {
        'cmpt-form-aligned': layout === 'aligned',
        'cmpt-form-inline': layout === 'inline',
        'cmpt-form-stacked': layout === 'stacked'
      }
    );

    return (
      <form onSubmit={this.handleSubmit} className={className} {...props}>
        {controls && this.renderControls()}
        {this.renderChildren(children)}
        {button && this.renderButton(button)}
        {fetchStatus !== FETCH_SUCCESS && <div className="cmpt-form-mask" />}
      </form>
    );
  }
}

Form.propTypes = {
  beforeSubmit: PropTypes.func,
  button: PropTypes.string,
  children: PropTypes.any,
  className: PropTypes.string,
  controls: PropTypes.array,
  data: PropTypes.object,
  disabled: PropTypes.bool,
  fetchStatus: PropTypes.string,
  grid: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object
  ]),
  hintType: PropTypes.oneOf(['block', 'none', 'pop', 'inline']),
  layout: PropTypes.oneOf(['aligned', 'stacked', 'inline']),
  onSubmit: PropTypes.func,
  style: PropTypes.object
};

Form.defaultProps = {
  data: {},
  layout: 'aligned',
  disabled: false
};

module.exports = fetchEnhance(Form);

