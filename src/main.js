import Vue from 'vue'
import Main from './Main.vue'
import { VueRegister } from '@idm-modules/core/regModule/vue';
import config from '../public/static/config.json';
//引入图标
import '@/icons' // icon
import "@/plugins/antd"
import vuescroll from 'vuescroll'

// 在这里设置全局配置
Vue.use(vuescroll, {
  ops: {
    mode: 'native',
    bar: {
      showDelay: 500,
      onlyShowBarOnScroll: false,//是否只有滚动的时候才显示滚动条
      keepShow: true,
      background: 'rgb(3, 185, 118)',
      opacity: 0.2,
      hoverStyle: false,
      specifyBorderRadius: false,
      minSize: false,
      size: '6px',
      disable: false,
      'overflow-x': 'hidden',
    }
  }, // 在这里设置全局默认配置
  name: 'vueScroll' // 在这里自定义组件名字，默认是vueScroll
});

new VueRegister(config)
const requireComponent = require.context(
  // 其组件目录的相对路径
  './components',
  // 是否查询其子目录
  false,
  // 匹配组件文件名的正则表达式
  /[A-Z]\w+\.(vue|js)$/
);

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  // 获取组件的 PascalCase 命名
  const componentName = window._.upperFirst(
    window._.camelCase(
      // 获取和目录深度无关的文件名
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )
  // 全局注册组件
  Vue.component(
    componentName+"@"+config.className+"-" +config.version,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})
Vue.prototype.IDM = window.IDM;
Vue.config.productionTip = false
//这里每次打包都会生成一个随机的变量，唯一，保证能加载到对应的对象
window[`${process.env.CodeVar}`] = Main;
// //每次打包都会生成不同的CodeVar
//这里渲染需要更改，改成实时渲染id
// new Vue({
//   render: h => h(Main),
//   data(){
//     return {
//       componentName:"HelloWorld"
//     }
//   }
// }).$mount("#component_202003T6YG1GH0L1YFEREQLKK9")
Vue.prototype.$eventBus = new Vue();