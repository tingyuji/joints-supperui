"use strict";

import React, {Component} from 'react';
import Code from '../Code';
import Example from '../Example';
import exampleData from '../data/text-value';
const {CheckboxGroup, Checkbox, Icon} = global.uiRequire();

module.exports = class extends Component {
  render () {
    return (
      <div>
        <div className="header">
          <h1>Checkbox Group</h1>
          <h2>一组复选框</h2>
        </div>

        <div className="content">

          <Code>
{`<CheckboxGroup
  className={string}
  data={array|object} // 数据，默认值为[]
  fetch={object}
  inline={bool}       // 为 true 时，各选项横向排列。默认为 true 
  onChange={function} // 当选项改变时回调方法，参数为 value
  readOnly={bool}     // 为 true 时，只读。默认为 false
  sep={string|null}   // 返回值分隔字符，默认值为 ","。为 "" 或 null 时，返回值类型为 array
  textTpl="string"    // 显示文字模板，默认为 "{text}"
  value={string|array}
  valueTpl="string"   // 返回数据模板，默认为 "{id}"
/>`}
          </Code>
          <div><a href="#/fetch">fetch 参见这里</a></div>

          <h2 className="subhead">数据结构</h2>
          <div>标准结构为 <em>text</em>, <em>id</em> key组成的数组</div>
          <div>可以使用自定义数组，指定 <em>textTpl</em>, <em>valueTpl</em></div>
          <div>可以使用一维数组，这种情况下，显示文字与值相同</div>

          <h2 className="subhead">默认结构数据</h2>
          <Example>
<CheckboxGroup value="shenzhen,chongqing" data={[
  { "id": "nanjing", "text": "南京" },
  { "id": "beijing", "text": "北京" },
  { "id": "guangzhou", "text": "广州" },
  { "id": "shenzhen", "text": "深圳" },
  { "id": "chengdu", "text": "成都" },
  { "id": "chongqing", "text": "重庆" },
  { "id": "shanghai", "text": "上海" }
]} />
          </Example>

          <h2 className="subhead">key value 结构数据</h2>
          <div>0.6 后可以使用key value结构的object作为数据</div>
          <Example>
<CheckboxGroup value="beijing" data={{
  "nanjing": "南京",
  "beijing": "北京",
  "guangzhou": "广州",
  "shenzhen": "深圳",
  "chengdu": "成都",
  "chongqing": "重庆",
  "shanghai": "上海"
}} />
          </Example>
          
          <h2 className="subhead">定义模版</h2>
          <Example>
<CheckboxGroup
  value='beijing'
  textTpl='{cn}({en})'
  valueTpl='{en}' 
  data={[
    { "en": "nanjing",   "cn": "南京" },
    { "en": "beijing",   "cn": "北京" },
    { "en": "guangzhou", "cn": "广州" },
    { "en": "shenzhen",  "cn": "深圳" },
    { "en": "chengdu",   "cn": "成都" },
    { "en": "chongqing", "cn": "重庆" },
    { "en": "shanghai",  "cn": "上海" }
  ]}
/>
          </Example>

          <h2 className="subhead">简单数组</h2>
          <div>显示文本和选中值一样时，可以使用简单数组</div>
          <Example>
<CheckboxGroup sep=""
  onChange={(value)=>console.log(value)}
  value={["北京", "广州"]}
  data={["南京", "北京", "上海", "广州", "深圳", "成都", "重庆", "西安"]}
/>
          </Example>

          <h2 className="subhead">只读</h2>
          <Example>
<CheckboxGroup readOnly={true} inline={true}
  value={["北京", "广州"]}
  data={["南京", "北京", "上海", "广州", "深圳", "成都", "重庆", "西安"]}
/>
          </Example>

          <h2 className="subhead">服务端数据</h2>
          <div>支持<a href="#/fetch">fetch</a>从服务端获取数据</div>
          <Example>
<CheckboxGroup 
  onChange={(value)=>console.log(value)}
  value="shanghai,chengdu"
  fetch={{url: "json/text-value.json", cache: 3600}}
/>
          </Example>

          <h2 className="subhead">单行数据</h2>
          <Example>
<CheckboxGroup 
  onChange={(value)=>console.log(value)}
  inline={false}
  value="shanghai,chengdu"
  fetch={{url: "json/text-value.json", cache: 3600}}
/>
          </Example>

          <h2 className="subhead">Data Sep</h2>
          <div>使用自定义数据分隔符</div>
          <Example>
<CheckboxGroup
  onChange={(value)=>console.log(value)}
  sep="|"
  value="shanghai|chengdu"
  fetch={{url: "json/text-value.json", cache: 3600}}
/>
          </Example>

          <h2 className="subhead">data && children</h2>
          <div>0.6 支持数据和Checkbox元素混合传入，position为插入位置，正整数</div>
          <Example>
<CheckboxGroup sep=""
  onChange={(value)=>console.log(value)}
  value={["北京", "香港"]}
  data={["南京", "北京", "上海", "广州", "深圳", "成都", "重庆", "西安"]}
  >
  <Checkbox position={3} checkValue="香港"><Icon icon="cloud-outline" />香港</Checkbox>
</CheckboxGroup>
          </Example>
        </div>
      </div>
    );
  }
}
