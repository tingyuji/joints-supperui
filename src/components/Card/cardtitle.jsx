/**
 * 卡片组件
 * 
 * Created by Ray on 2016-03-30
 */

import React from 'react';
import classNames from 'classnames';

export class CardTitle extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const {className, title, subtitle} = this.props;

    const cls = classNames({
      "cmpt-card-title": true,
      [className]: className
    });

    return (
      <div className={cls}>
        {(title) ? <div className="title">{title}</div> : ''}
        {(subtitle) ? <div className="subtitle">{subtitle}</div> : ''}
      </div>
    );
  }
};

export default CardTitle;
