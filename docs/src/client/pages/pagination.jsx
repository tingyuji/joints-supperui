'use strict';

import React, { Component } from 'react';
import Code from '../Code';
import Example from '../Example';
const {Pagination, Input, Checkbox} = global.uiRequire();

module.exports = class extends Component {
  constructor (props) {
    super(props);
    this.state = {
      index: 2,
      size: 20,
      total: 1000,
      pages: 10,
      mini: false,
      jumper: false
    };
  }

  onChange (index) {
    this.setState({ index });
  }

  render () {
    return (
      <div>
        <div className="header">
          <h1>Pagination</h1>
          <h2>分页</h2>
        </div>

        <div className="content">
          <Code>
{`<Pagination
  index={int}         // 当前页码，默认为 1
  size={int}          // 每页显示条数，默认为 20
  pages={int}         // 显示的页码数， 默认为 10
  total={int}         // 总条目数，默认为 0
  jumper={bool}       // 是否可以输入页码，默认为 false
  mini={bool}         // 是否简化版本
  onChange={function} // 页码点击时触发事件，参数为页码
/>`}
          </Code>

          <h2 className="subhead">Example</h2>
          <Example>
<Pagination
  index={this.state.index}
  size={this.state.size}
  total={this.state.total}
  pages={this.state.pages}
  mini={this.state.mini}
  onChange={this.onChange.bind(this)}
  jumper={this.state.jumper} />

<p>index: <Input value={this.state.index} onChange={v => this.setState({index: parseInt(v) || 1})} /></p>
<p>size: <Input value={this.state.size} onChange={v => this.setState({size: parseInt(v) || 0})} /></p>
<p>total: <Input value={this.state.total} onChange={v => this.setState({total: parseInt(v) || 0})} /></p>
<p>pages: <Input value={this.state.pages} onChange={v => this.setState({pages: parseInt(v) || 0})} /></p>
<p><Checkbox text="mini" onChange={mini => this.setState({mini})} value={this.state.mini} /></p>
<p><Checkbox text="jumper" onChange={jumper => this.setState({jumper})} value={this.state.jumper} /></p>
          </Example>
        </div>
      </div>
    );
  }
}
