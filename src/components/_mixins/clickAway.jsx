'use strict';

import ReactDOM from 'react-dom';
import { Dom } from 'supperutils';

const { isDescendant } = Dom;

module.exports = (Component) => class extends Component {
  constructor (props) {
    super(props);
  }

  componentWillUnmount () {
    this.unbindClickAway();
  }

  bindClickAway () {
    const fn = this.getClickAwayEvent();
    Dom.onEvent(document, 'click', fn);
    Dom.onEvent(document, 'touchstart', fn);
  }

  unbindClickAway () {
    const fn = this.getClickAwayEvent();
    Dom.offEvent(document, 'click', fn);
    Dom.offEvent(document, 'touchstart', fn);
  }

  registerClickAway (onClickAway, target) {
    this.clickAwayTarget = target;
    this.onClickAway = onClickAway;
  }

  getClickAwayEvent () {
    let fn = this._clickAwayEvent;
    if (!fn) {
      fn = (event) => {
        let el = this.clickAwayTarget || ReactDOM.findDOMNode(this);

        // Check if the target is inside the current component
        if (event.target !== el && !isDescendant(el, event.target)) {
          if (this.onClickAway) {
            this.onClickAway();
          }
        }
      }
      this._clickAwayEvent = fn;
    }
    return fn;
  }
};

