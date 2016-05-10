/**
 * 卡片组件
 * 
 * Created by Ray on 2016-03-30
 */

import React from 'react';
import ReactDom from 'react-dom';
import classNames from 'classnames';

export class CardHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const {className, children} = this.props;

    const cls = classNames({
      "cmpt-card-header": true,

      [className]: className
    });

    return (
      <div className={cls}>
        {this.props.children}
      </div>
    );
  }
};

export default CardHeader;
