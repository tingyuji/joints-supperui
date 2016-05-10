/**
 * Created by jf on 15/10/27.
 */

import React from 'react';
import classNames from 'classnames';

class Mask extends React.Component {
  render() {
    const {transparent, ...others} = this.props;
    const className = classNames({
      'cmpt-mask': !transparent,
      'cmpt-mask-transparent': transparent
    });

    return (
      <div className={className} {...others}></div>
    );
  }
}

Mask.propTypes = {
  transparent: React.PropTypes.bool
}

Mask.defaultProps = {
  transparent: false
}

export default Mask;