/**
 * 分隔线组件
 * 
 * Created by Ray on 2016-03-30
 */

import React from 'react';
import classNames from 'classnames';

export class Divider extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    
  }

  render() {
    const {className, children} = this.props;

    const cls = classNames({
      "cmpt-divider": true,
      [className]: className
    });

    return (
      <hr className={cls} />
    );
  }
};

export default Divider;
