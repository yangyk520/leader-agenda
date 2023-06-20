// 按需加载 ant-design-vue
// 手动删除没用用过的组件
import Vue from 'vue'
import Base from 'ant-design-vue/lib/base/index.js';

import 'ant-design-vue/lib/radio/style/css';
import 'ant-design-vue/lib/input/style/css';
import 'ant-design-vue/lib/checkbox/style/css';
import 'ant-design-vue/lib/time-picker/style/css';
import { Radio,Checkbox,TimePicker } from 'ant-design-vue'

/* v1.1.3+ registration methods */
Vue.use(Base)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(TimePicker)

