/**
 * 头像组件
 * 
 * Created by Ray on 2016-03-30
 */

import React from 'react';
import ReactDom from 'react-dom';
import classNames from 'classnames';

export class Avatar extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    
  }

  render() {
    const {
      icon,
      src,
      className
    } = this.props;

    const cls = classNames({
      "cmpt-avatar": true,
      [className]: className
    });

    if (src) {
      return (
        <img src={src} className={cls} />
      );
    } else {
      return (
        <div className={cls}>
          {this.props.children}
        </div>
      );
    }
  }
};

export default Avatar;
