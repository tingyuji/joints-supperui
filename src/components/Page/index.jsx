/**
 * 图标组件
 * 
 * Created by Ray on 2016-03-30
 */

import React from 'react';
import Title from 'react-title-component';
import classnames from 'classnames';

const PageTitle = Title;

export {PageTitle};

export class PagePanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {title} = this.props;

    return (
      <div className="page-panel">
        <PageTitle render={"joints app"} />
        <div {...this.props}>
          { this.props.children }
        </div>
      </div>
    );
  }
};

export default {
  PageTitle,
  PagePanel
}