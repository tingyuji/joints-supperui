/**
 * 卡片组件
 * 
 * Created by Ray on 2016-03-30
 */

import React from 'react';
import ReactDom from 'react-dom';
import classNames from 'classnames';

export class CardMedia extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const {className, children} = this.props;

    const cls = classNames({
      "cmpt-card-media": true,
      [className]: className
    });

    return (
      <div className={cls}>
        {children}
        <div className="overlay-container">
          <div className="overlay">
            {(this.props.overlay) ?
              <div className="overlay-content">
                {this.props.overlay}
              </div> : ''}
          </div>
        </div>
      </div>
    );
  }
};

export default CardMedia;
