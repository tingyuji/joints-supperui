/**
 * 卡片面板
 * 
 * Created by Ray on 2016-03-30
 */

import React from 'react';
import ReactDom from 'react-dom';
import classNames from 'classnames';

export class CardPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const {className, children} = this.props;

    const cls = classNames({
      "cmpt-card-panel": true,
      [className]: className
    });

    return (
      <div {...this.props} className={cls}>
        {children}
      </div>
    );
  }
};

export default CardPanel;
