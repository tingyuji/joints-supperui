'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _supperutils = require('supperutils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var forEach = _supperutils.Obj.forEach;

var Pagination = function (_Component) {
  _inherits(Pagination, _Component);

  function Pagination(props) {
    _classCallCheck(this, Pagination);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Pagination).call(this, props));

    _this.state = {
      index: props.index
    };
    _this.setInput = _this.setInput.bind(_this);
    return _this;
  }

  _createClass(Pagination, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.index !== this.props.index) {
        this.setState({ index: nextProps.index });
      }
    }
  }, {
    key: 'getIndex',
    value: function getIndex() {
      return this.state.index;
    }
  }, {
    key: 'setIndex',
    value: function setIndex(index) {
      index = parseInt(index);
      this.setState({ index: index });
    }
  }, {
    key: 'setInput',
    value: function setInput(event) {
      event.preventDefault();

      var value = this.refs.input.value;
      value = parseInt(value);
      if (isNaN(value)) {
        return;
      }
      if (value < 1) {
        this.handleChange(1);
        return;
      }

      this.setIndex(value);
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  }, {
    key: 'handleChange',
    value: function handleChange(index) {
      this.setIndex(index);
      if (this.refs.input) {
        this.refs.input.value = index;
      }
      if (this.props.onChange) {
        this.props.onChange(index);
      }
    }
  }, {
    key: 'getPages',
    value: function getPages() {
      var _props = this.props;
      var total = _props.total;
      var size = _props.size;
      var index = _props.index;
      var pages = _props.pages;

      var max = Math.ceil(total / size),
          left = void 0,
          right = void 0,
          span = pages || 10;

      // bad thing...
      pages = [];

      if (index > max) {
        index = max;
      }

      left = index - Math.floor(span / 2) + 1;
      if (left < 1) {
        left = 1;
      }
      right = left + span - 2;
      if (right >= max) {
        right = max;
        left = right - span + 2;
        if (left < 1) {
          left = 1;
        }
      } else {
        right -= left > 1 ? 1 : 0;
      }

      // push first
      if (left > 1) {
        pages.push(1);
      }
      if (left > 2) {
        pages.push('<..');
      }
      for (var i = left; i < right + 1; i++) {
        pages.push(i);
      }
      if (right < max - 1) {
        pages.push('..>');
      }
      // push last
      if (right < max) {
        pages.push(max);
      }

      return { pages: pages, max: max };
    }
  }, {
    key: 'render',
    value: function render() {
      var index = this.state.index;
      var mini = this.props.mini;

      var _getPages = this.getPages();

      var pages = _getPages.pages;
      var max = _getPages.max;
      var items = [];

      // Previous
      items.push(_react2.default.createElement(
        'li',
        { key: 'previous', onClick: index <= 1 ? null : this.handleChange.bind(this, index - 1), className: (0, _classnames2.default)('previous', { disabled: index <= 1 }) },
        _react2.default.createElement(
          'a',
          null,
          _react2.default.createElement(
            'span',
            null,
            ' '
          )
        )
      ));

      if (mini) {
        items.push(_react2.default.createElement(
          'form',
          { key: 'i', onSubmit: this.setInput },
          _react2.default.createElement('input', { ref: 'input', defaultValue: this.state.index, type: 'text', className: 'cmpt-form-control' })
        ));
        items.push(_react2.default.createElement(
          'span',
          { key: 's' },
          ' / ',
          max
        ));
      } else {
        forEach(pages, function (i) {
          if (i === '<..' || i === '..>') {
            items.push(_react2.default.createElement(
              'li',
              { key: i, className: 'sep' },
              _react2.default.createElement(
                'span',
                null,
                '...'
              )
            ));
          } else {
            items.push(_react2.default.createElement(
              'li',
              { onClick: this.handleChange.bind(this, i), className: (0, _classnames2.default)({ active: i === index }), key: i },
              _react2.default.createElement(
                'a',
                null,
                i
              )
            ));
          }
        }, this);
      }

      // Next
      items.push(_react2.default.createElement(
        'li',
        { key: 'next', onClick: index >= max ? null : this.handleChange.bind(this, index + 1), className: (0, _classnames2.default)('next', { disabled: index >= max }) },
        _react2.default.createElement(
          'a',
          null,
          _react2.default.createElement(
            'span',
            null,
            ' '
          )
        )
      ));

      var className = (0, _classnames2.default)(this.props.className, 'cmpt-pagination-wrap', { 'cmpt-pagination-mini': mini });
      return _react2.default.createElement(
        'div',
        { style: this.props.style, className: className },
        _react2.default.createElement(
          'ul',
          { className: 'cmpt-pagination' },
          items
        ),
        this.props.jumper && !mini && _react2.default.createElement(
          'form',
          { onSubmit: this.setInput },
          _react2.default.createElement(
            'div',
            { className: 'cmpt-input-group' },
            _react2.default.createElement('input', { ref: 'input', defaultValue: this.state.index, type: 'text', className: 'cmpt-form-control' }),
            _react2.default.createElement(
              'span',
              { onClick: this.setInput, className: 'addon' },
              'go'
            )
          )
        )
      );
    }
  }]);

  return Pagination;
}(_react.Component);

Pagination.propTypes = {
  className: _react.PropTypes.string,
  index: _react.PropTypes.number,
  jumper: _react.PropTypes.bool,
  mini: _react.PropTypes.bool,
  onChange: _react.PropTypes.func,
  pages: _react.PropTypes.number,
  size: _react.PropTypes.number,
  style: _react.PropTypes.object,
  total: _react.PropTypes.number
};

Pagination.defaultProps = {
  index: 1,
  pages: 10,
  size: 20,
  total: 0
};

module.exports = Pagination;