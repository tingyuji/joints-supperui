'use strict';

import classnames from 'classnames';
import React, { Component, PropTypes, DOM } from 'react';
import ReactDOM from 'react-dom';
import PubSub from 'pubsub-js';
import { Str } from 'supperutils';
import {Button} from '../button';
import {Overlay} from '../overlay';
import objectAssign from 'object-assign';

import {getLang} from '../../locals';

const { nextUid } = Str;

const ADD_MODAL = 'id39hxqm';
const REMOVE_MODAL = 'id39i40m';
const CLICKAWAY = 'id5bok7e';
const ZINDEX = 1100;
let modals = [];
let modalContainer = null;

class ModalContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      increase: false,
      modals
    };
    this.close = this.close.bind(this);
    this.clickaway = this.clickaway.bind(this);
    this.elements = {};
  }

  componentDidMount () {
    PubSub.subscribe(ADD_MODAL, this.addModal.bind(this));

    PubSub.subscribe(REMOVE_MODAL, this.removeModal.bind(this));

    PubSub.subscribe(CLICKAWAY, () => {
      let props = modals[modals.length - 1];
      if (props.clickaway) {
        PubSub.publish(REMOVE_MODAL);
      }
    });
  }

  addModal (topic, props) {
    let isReplace = false;
    modals = modals.map((m) => {
      if (m.id === props.id) {
        isReplace = true;
        m = props;
      }
      return m;
    });
    if (!isReplace) {
      modals.push(props);
    }

    this.setState({ modals, increase: true });
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';
  }

  removeModal (topic, id) {
    let props;
    if (!id) {
      props = modals.pop();
    } else {
      modals.forEach((m, i) => {
        if (m.id === id) {
          props = modals.splice(i, 1);
        }
      });
    }

    if (!props) {
      return;
    }

    if (props.onClose) {
      props.onClose();
    }
    this.setState({ modals, increase: false });

    if (modals.length === 0) {
      document.body.style.height = '';
      document.body.style.overflow = '';
    }
  }

  close () {
    PubSub.publish(REMOVE_MODAL);
  }

  clickaway (event) {
    if (event.target.className === 'cmpt-modal-inner') {
      event.stopPropagation();
      PubSub.publish(CLICKAWAY);
    }
  }

  renderModals () {
    let modalLength = this.state.modals.length;
    return this.state.modals.map((options, i) => {
      let style = {
        width: options.width || 500
      };

      let header, buttons = [];
      if (options.header) {
        header = <div className="cmpt-modal-header">{options.header}</div>;
      }

      if (options.buttons) {
        buttons = Object.keys(options.buttons).map((btn, j) => {
          let func = options.buttons[btn],
              status = j === 0 ? 'primary' : '',
              handle = () => {
                if (func === true) {
                  this.close();
                } else if (func === 'submit') {
                  let form = this.elements[options.id].querySelector('form');
                  if (form) {
                    let event = document.createEvent('HTMLEvents');
                    event.initEvent('submit');
                    form.dispatchEvent(event);
                  }
                } else {
                  if (func()) {
                    this.close();
                  }
                }
              };
          return <Button status={status} key={btn} onClick={handle}>{btn}</Button>;
        });
      }

      let className = classnames(
        'cmpt-modal',
        {
          fadein: this.state.increase && modalLength - 1 === i,
          noPadding: options.noPadding
        }
      );

      const clickaway = options.clickaway ? this.clickaway : undefined;

      return (
        <div ref={(el) => this.elements[options.id] = el} className="cmpt-modal-inner" onClick={clickaway} style={{ zIndex: ZINDEX + i }} key={options.id}>
          <div style={style} className={className}>
            <a className="cmpt-modal-close" onClick={this.close.bind(this, true)}><span></span></a>
            {header}
            <div className="cmpt-modal-content">
              {options.content}
            </div>
            {
              buttons.length > 0 &&
              <div className="cmpt-modal-footer">
                {buttons}
              </div>
            }
          </div>
        </div>
      );
    });
  }

  render () {
    let mlen = this.state.modals.length;
    let className = classnames(
      'cmpt-modal-container',
      { active: mlen > 0 }
    );

    return (
      <div className={className}>
        <Overlay
          className={classnames({active: mlen > 0})}
          style={{zIndex: ZINDEX + mlen - 1}} />
        { this.renderModals() }
      </div>
    );
  }
}

// static method ===============================================================

function close (id) {
  PubSub.publish(REMOVE_MODAL, id);
};

function open (options) {
  if (!modalContainer) {
    createContainer();
  }
  if (!options.id) {
    options.id = nextUid();
  }
  PubSub.publishSync(ADD_MODAL, options);
  return options.id;
};

function alert (content, header=<span>&nbsp;</span>) {
  let buttons = {};
  buttons[getLang('buttons.ok')] = true;

  return open({
    clickaway: false,
    content,
    header,
    buttons
  });
};

function confirm (content, callback, header=<span>&nbsp;</span>) {
  let buttons = {};

  buttons[getLang('buttons.ok')] = () => {
    callback();
    return true;
  };
  buttons[getLang('buttons.cancel')] = true;

  return open({
    clickaway: false,
    content,
    header,
    buttons
  });
};

function createContainer () {
  modalContainer = document.createElement('div');
  document.body.appendChild(modalContainer);
  ReactDOM.render(<ModalContainer />, modalContainer);
}

// modal ===================================================================

class Modal extends Component {
  constructor (props) {
    super(props);
    this.id = nextUid();
  }

  componentDidMount () {
    if (this.props.isOpen) {
      this.renderModal(this.props);
    }
  }

  componentWillReceiveProps (newProps) {
    if (!newProps.isOpen && !this.props.isOpen) {
      return;
    }

    if (newProps.isOpen) {
      this.renderModal(newProps);
    } else {
      close();
    }
  }

  renderModal (props) {
    open(objectAssign({}, props, {
        id: this.id,
        content: props.children
      })
    );
  }

  render () {
    return DOM.noscript();
  }
}

Modal.propTypes = {
  buttons: PropTypes.object,
  children: PropTypes.any,
  isOpen: PropTypes.bool,
  noPadding: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  width: PropTypes.number
};

Modal.open = open;
Modal.alert = alert;
Modal.confirm = confirm;
Modal.close = close;

module.exports = Modal;
