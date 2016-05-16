"use strict"

module.exports = [
  '基础',
  { path: '/button', text: 'Button', component: require('./pages/button.jsx') },
  { path: '/icon', text: 'Icon', component: require('./pages/icon.jsx') },
  { path: '/grid', text: 'Grid', component: require('./pages/grid.jsx') },
  '表单',
  { path: '/form', text: 'Form', component: require('./pages/form.jsx') },
  { path: '/formitem', text: 'FormItem', component: require('./pages/formItem.jsx') },
  { path: '/formControl', text: 'FormControl', component: require('./pages/formControl.jsx') },
  { path: '/formSubmit', text: 'FormSubmit', component: require('./pages/formSubmit.jsx') },
  { path: '/checkbox', text: 'Checkbox', component: require('./pages/checkbox.jsx') },
  { path: '/checkboxGroup', text: 'CheckboxGroup', component: require('./pages/checkboxGroup.jsx') },
  { path: '/datepicker', text: 'Datepicker', component: require('./pages/datepicker.jsx') },
  { path: '/input', text: 'Input', component: require('./pages/input.jsx') },
  { path: '/textArea', text: 'Textarea', component: require('./pages/textArea.jsx') },
  { path: '/radioGroup', text: 'RadioGroup', component: require('./pages/radioGroup.jsx') },
  { path: '/rating', text: 'Rating', component: require('./pages/rating.jsx') },
  { path: '/select', text: 'Select', component: require('./pages/select.jsx') },
  { path: '/upload', text: 'Upload', component: require('./pages/upload.jsx') },
  '常用',
  { path: '/table', text: 'Table', component: require('./pages/table.jsx') },
  { path: '/pagination', text: 'Pagination', component: require('./pages/pagination.jsx') },
  { path: '/modal', text: 'Modal', component: require('./pages/modal.jsx') },
  { path: '/message', text: 'Message', component: require('./pages/message.jsx') }
];
