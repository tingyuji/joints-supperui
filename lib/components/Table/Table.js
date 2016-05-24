'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _supperutils = require('supperutils');

var _TableHeader = require('./TableHeader');

var _TableHeader2 = _interopRequireDefault(_TableHeader);

var _Fetch = require('../_mixins/Fetch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var substitute = _supperutils.Str.substitute;
var deepEqual = _supperutils.Obj.deepEqual;
var hashcode = _supperutils.Obj.hashcode;

var Table = function (_Component) {
  _inherits(Table, _Component);

  function Table(props) {
    _classCallCheck(this, Table);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Table).call(this, props));

    _this.state = {
      index: props.pagination ? props.pagination.props.index : 1,
      data: props.data,
      sort: {},
      total: null
    };

    _this.getSelected = _this.getSelected.bind(_this);
    _this.getData = _this.getData.bind(_this);
    _this.sortData = _this.sortData.bind(_this);

    _this.onBodyScroll = _this.onBodyScroll.bind(_this);
    return _this;
  }

  _createClass(Table, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setHeaderWidth();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!deepEqual(nextProps.data, this.props.data)) {
        this.setState({ data: nextProps.data });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.setHeaderWidth();
    }
  }, {
    key: 'checkHeadFixed',
    value: function checkHeadFixed() {
      var height = this.props.height;

      return !!height && height !== 'auto';
    }
  }, {
    key: 'setHeaderWidth',
    value: function setHeaderWidth() {
      if (!this.checkHeadFixed()) {
        return;
      }
      var tr = this.refs.body.querySelector('tr');
      if (!tr) {
        return;
      }

      var ths = this.refs.header.querySelectorAll('th');

      var tds = tr.querySelectorAll('td');
      if (tds.length <= 1) {
        return;
      }
      for (var i = 0, count = tds.length; i < count; i++) {
        if (ths[i]) {
          ths[i].style.width = tds[i].offsetWidth + 'px';
        }
      }
    }
  }, {
    key: 'sortData',
    value: function sortData(key, asc) {
      var data = this.state.data;
      data = data.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        if (asc) {
          return x < y ? -1 : x > y ? 1 : 0;
        } else {
          return x > y ? -1 : x < y ? 1 : 0;
        }
      });
      this.setState({ data: data });
    }
  }, {
    key: 'onSelect',
    value: function onSelect(i, e) {
      var checked = typeof e === 'boolean' ? e : e.target.checked,
          data = this.state.data,
          index = this.state.index,
          size = this.props.pagination ? this.props.pagination.props.size : data.length,
          start = 0,
          end = 0;
      if (i === 'all') {
        start = (index - 1) * size;
        end = index * size;
      } else {
        start = (index - 1) * size + i;
        end = start + 1;
      }
      for (; start < end; start++) {
        data[start].$checked = checked;
      }
      this.setState({ data: data });
    }
  }, {
    key: 'getSelected',
    value: function getSelected(name) {
      var values = [];
      this.state.data.forEach(function (d) {
        if (d.$checked) {
          values.push(name ? d[name] : d);
        }
      });
      return values;
    }
  }, {
    key: 'onBodyScroll',
    value: function onBodyScroll(e) {
      var hc = this.refs.headerContainer;
      hc.style.marginLeft = 0 - e.target.scrollLeft + 'px';
    }
  }, {
    key: 'getData',
    value: function getData() {
      var _this2 = this;

      var page = this.props.pagination,
          filters = this.props.filters,
          data = [];

      if (filters) {
        (function () {
          var filterCount = filters.length;
          _this2.state.data.forEach(function (d) {
            var checked = true;
            for (var i = 0; i < filterCount; i++) {
              var f = filters[i].func;
              checked = f(d);
              if (!checked) {
                break;
              }
            }
            if (checked) {
              data.push(d);
            }
          });
        })();
      } else {
        data = this.state.data;
      }

      var total = data.length;

      if (!page) {
        return { total: total, data: data };
      }
      var size = page.props.size;
      if (data.length <= size) {
        return { total: total, data: data };
      }
      var index = this.state.index;
      data = data.slice((index - 1) * size, index * size);
      return { total: total, data: data };
    }
  }, {
    key: 'renderBody',
    value: function renderBody(data) {
      var _this3 = this;

      var _props = this.props;
      var selectAble = _props.selectAble;
      var headers = _props.headers;


      if (!Array.isArray(data)) {
        return _react2.default.createElement(
          'tbody',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement(
              'td',
              { colSpan: headers.length },
              data
            )
          )
        );
      }

      var headerKeys = headers.map(function (h) {
        return h.name || hashcode(h);
      });

      var trs = data.map(function (d, i) {
        var tds = [];
        if (selectAble) {
          tds.push(_react2.default.createElement(
            'td',
            { className: 'td-checkbox', key: 'checkbox' },
            _react2.default.createElement('input', { checked: d.$checked, onChange: _this3.onSelect.bind(_this3, i), type: 'checkbox' })
          ));
        }
        var rowKey = d.id ? d.id : hashcode(d);
        headers.map(function (h, j) {
          if (h.hidden) {
            return;
          }
          var content = h.content,
              tdStyle = {};
          if (typeof content === 'string') {
            content = substitute(content, d);
          } else if (typeof content === 'function') {
            content = content(d);
          } else {
            content = d[h.name];
          }
          if (h.width) {
            tdStyle.width = h.width;
          }
          tds.push(_react2.default.createElement(
            'td',
            { style: tdStyle, key: headerKeys[j] },
            content
          ));
        });
        return _react2.default.createElement(
          'tr',
          { key: rowKey },
          tds
        );
      });

      return _react2.default.createElement(
        'tbody',
        null,
        trs
      );
    }
  }, {
    key: 'renderHeader',
    value: function renderHeader() {
      var _this4 = this;

      var headers = [];
      if (this.props.selectAble) {
        headers.push(_react2.default.createElement(_TableHeader2.default, { key: 'checkbox', name: '$checkbox', header: _react2.default.createElement('input', { onClick: this.onSelect.bind(this, 'all'), type: 'checkbox' }) }));
      }
      this.props.headers.map(function (header, i) {
        if (header.hidden) {
          return;
        }

        var props = {
          key: header.name || i,
          onSort: function onSort(name, asc) {
            _this4.setState({ sort: { name: name, asc: asc } });
            if (_this4.props.onSort) {
              _this4.props.onSort(name, asc);
            } else {
              _this4.sortData(name, asc);
            }
          },
          sort: _this4.state.sort
        };

        headers.push(_react2.default.createElement(_TableHeader2.default, _extends({}, header, props)));
      });
      return _react2.default.createElement(
        'tr',
        null,
        headers
      );
    }
  }, {
    key: 'renderPagination',
    value: function renderPagination(total) {
      var _this5 = this;

      if (!this.props.pagination) {
        return null;
      }

      var props = {
        total: total,
        onChange: function onChange(index) {
          var data = _this5.state.data;
          data.forEach(function (d) {
            d.$checked = false;
          });
          _this5.setState({ index: index, data: data });
        }
      };
      return (0, _react.cloneElement)(this.props.pagination, props);
    }
  }, {
    key: 'render',
    value: function render() {
      var bodyStyle = {};
      var headerStyle = {};
      var tableStyle = {};
      var onBodyScroll = null;

      var _getData = this.getData();

      var total = _getData.total;
      var data = _getData.data;
      var _props2 = this.props;
      var height = _props2.height;
      var width = _props2.width;
      var bordered = _props2.bordered;
      var striped = _props2.striped;

      var fixedHead = this.checkHeadFixed();

      if (height) {
        bodyStyle.height = height;
        bodyStyle.overflow = 'auto';
      }
      if (width) {
        headerStyle.width = width;
        if (typeof headerStyle.width === 'number') {
          headerStyle.width += 20;
        }
        tableStyle.width = width;
        bodyStyle.overflow = 'auto';
        onBodyScroll = this.onBodyScroll;
      }

      var className = (0, _classnames2.default)(this.props.className, 'cmpt-table', {
        'cmpt-bordered': bordered,
        'cmpt-scrolled': height,
        'cmpt-striped': striped
      });

      return _react2.default.createElement(
        'div',
        { style: this.props.style, className: className },
        fixedHead && _react2.default.createElement(
          'div',
          { className: 'header-container' },
          _react2.default.createElement(
            'div',
            { ref: 'headerContainer', style: headerStyle },
            _react2.default.createElement(
              'table',
              { ref: 'header' },
              _react2.default.createElement(
                'thead',
                null,
                this.renderHeader()
              )
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { onScroll: onBodyScroll, style: bodyStyle, className: 'body-container' },
          _react2.default.createElement(
            'table',
            { style: tableStyle, className: 'cmpt-table-body', ref: 'body' },
            !fixedHead && _react2.default.createElement(
              'thead',
              null,
              this.renderHeader()
            ),
            this.renderBody(data)
          )
        ),
        this.renderPagination(total)
      );
    }
  }]);

  return Table;
}(_react.Component);

Table.propTypes = {
  bordered: _react.PropTypes.bool,
  children: _react.PropTypes.array,
  className: _react.PropTypes.string,
  data: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.element]),
  filters: _react.PropTypes.array,
  headers: _react.PropTypes.array,
  height: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
  onSort: _react.PropTypes.func,
  pagination: _react.PropTypes.object,
  selectAble: _react.PropTypes.bool,
  striped: _react.PropTypes.bool,
  style: _react.PropTypes.object,
  width: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string])
};

Table.defaultProps = {
  data: []
};

module.exports = (0, _Fetch.fetchEnhance)(Table);