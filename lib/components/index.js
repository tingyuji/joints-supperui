'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tip = exports.Divider = exports.Avatar = exports.Pagination = exports.TableHeader = exports.Table = exports.FormSubmit = exports.FormControl = exports.FormItem = exports.Form = exports.RadioGroup = exports.Radio = exports.CheckboxGroup = exports.Checkbox = exports.DatepickerPair = exports.Datetime = exports.Datepicker = exports.Rating = exports.Upload = exports.Textarea = exports.Input = exports.Select = exports.Button = exports.Message = exports.Modal = exports.Overlay = exports.CardPanel = exports.CardText = exports.CardMedia = exports.CardTitle = exports.CardHeader = exports.Card = exports.GridUtil = exports.Grid = exports.Icon = undefined;

var _Icon = require('./Icon');

var _Grid = require('./Grid');

var _Card = require('./Card');

var _Overlay = require('./Overlay');

var _Modal = require('./Modal');

var _Message = require('./Message');

var _Button = require('./Button');

var _Select = require('./Select');

var _Input = require('./Input');

var _Textarea = require('./Textarea');

var _Upload = require('./Upload');

var _Rating = require('./Rating');

var _Datepicker = require('./Datepicker');

var _Datepicker2 = _interopRequireDefault(_Datepicker);

var _Pair = require('./Datepicker/Pair');

var _Pair2 = _interopRequireDefault(_Pair);

var _Checkbox = require('./Checkbox');

var _Form = require('./Form');

var _Table = require('./Table');

var _Widgets = require('./Widgets');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 控件整合
 * 
 * Created by Ray on 2016-03-30
 */

exports.Icon = _Icon.Icon;
exports.Grid = _Grid.Grid;
exports.GridUtil = _Grid.GridUtil;
exports.Card = _Card.Card;
exports.CardHeader = _Card.CardHeader;
exports.CardTitle = _Card.CardTitle;
exports.CardMedia = _Card.CardMedia;
exports.CardText = _Card.CardText;
exports.CardPanel = _Card.CardPanel;
exports.Overlay = _Overlay.Overlay;
exports.Modal = _Modal.Modal;
exports.Message = _Message.Message;
exports.Button = _Button.Button;
exports.Select = _Select.Select;
exports.Input = _Input.Input;
exports.Textarea = _Textarea.Textarea;
exports.Upload = _Upload.Upload;
exports.Rating = _Rating.Rating;
exports.Datepicker = _Datepicker2.default;
var Datetime = exports.Datetime = _Datepicker2.default;
exports.DatepickerPair = _Pair2.default;
exports.Checkbox = _Checkbox.Checkbox;
exports.CheckboxGroup = _Checkbox.CheckboxGroup;
exports.Radio = _Checkbox.Radio;
exports.RadioGroup = _Checkbox.RadioGroup;
exports.Form = _Form.Form;
exports.FormItem = _Form.FormItem;
exports.FormControl = _Form.FormControl;
exports.FormSubmit = _Form.FormSubmit;
exports.Table = _Table.Table;
exports.TableHeader = _Table.TableHeader;
exports.Pagination = _Table.Pagination;
exports.Avatar = _Widgets.Avatar;
exports.Divider = _Widgets.Divider;
exports.Tip = _Widgets.Tip;
exports.default = {
  Icon: _Icon.Icon,

  Grid: _Grid.Grid,
  GridUtil: _Grid.GridUtil,

  Card: _Card.Card,
  CardHeader: _Card.CardHeader,
  CardTitle: _Card.CardTitle,
  CardMedia: _Card.CardMedia,
  CardText: _Card.CardText,
  CardPanel: _Card.CardPanel,

  Overlay: _Overlay.Overlay,
  Modal: _Modal.Modal,
  Message: _Message.Message,

  Button: _Button.Button,

  Select: _Select.Select,
  Input: _Input.Input,
  Textarea: _Textarea.Textarea,
  Upload: _Upload.Upload,
  Rating: _Rating.Rating,

  Datepicker: _Datepicker2.default,
  Datetime: _Datepicker2.default,
  DatepickerPair: _Pair2.default,

  Checkbox: _Checkbox.Checkbox,
  CheckboxGroup: _Checkbox.CheckboxGroup,
  Radio: _Checkbox.Radio,
  RadioGroup: _Checkbox.RadioGroup,

  Form: _Form.Form,
  FormItem: _Form.FormItem,
  FormControl: _Form.FormControl,
  FormSubmit: _Form.FormSubmit,

  Table: _Table.Table,
  TableHeader: _Table.TableHeader,
  Pagination: _Table.Pagination,

  Avatar: _Widgets.Avatar,
  Divider: _Widgets.Divider,
  Tip: _Widgets.Tip
};