// 按需加载 ant-design-vue
// 手动删除没用用过的组件
import Vue from 'vue'
import Base from 'ant-design-vue/lib/base/index.js';

import 'ant-design-vue/lib/radio/style/css';
import 'ant-design-vue/lib/input/style/css';
import 'ant-design-vue/lib/checkbox/style/css';
import 'ant-design-vue/lib/time-picker/style/css';
import 'ant-design-vue/lib/date-picker/style/css';
import 'ant-design-vue/lib/empty/style/css';
import 'ant-design-vue/lib/popconfirm/style/css';
import 'ant-design-vue/lib/select/style/css';
import 'ant-design-vue/lib/popover/style/css';
import 'ant-design-vue/lib/modal/style/css';
import 'ant-design-vue/lib/button/style/css';
import 'ant-design-vue/lib/tooltip/style/css';

import { Radio,Input,Checkbox,TimePicker,Empty,Popconfirm,Select,Popover,Modal,Button,DatePicker,
  Tooltip
 } from 'ant-design-vue'

/* v1.1.3+ registration methods */
Vue.use(Base)
Vue.use(Input)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(TimePicker)
Vue.use(Empty)
Vue.use(Popconfirm)
Vue.use(Select)
Vue.use(Popover)
Vue.use(Modal)
Vue.use(Button)
Vue.use(DatePicker)
Vue.use(Tooltip)
Vue.prototype.$confirm = Modal.confirm

