<template>
  <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="idm-leader-agenda-outer"> <div class="scroll_block">
    <LeaderActiveHeader :ref="moduleObject.id" :moduleObject="moduleObject" :scheduleType="propData.scheduleType" :viewModel="propData.viewModel" :publickStatus="publickStatus" 
      @updateHeadParams="updateHeadParams" 
      @save="save" 
      @unRelease="unRelease"
      @release="release"
      @exportData="exportData" />
    <template v-if="propData.isPreview">
      <LeaderActiveTable :propData="propData" :moduleObject="moduleObject" :form_data="form_data" :header_list="header_list" :data_list="data_list"></LeaderActiveTable>
    </template>
    <template v-else>
      <LeaderActiveEdit @updateTableData="updateTableData" :form_data="form_data" :data_list_table="data_list_table"></LeaderActiveEdit>
    </template>
   </div>
  </div>
</template>

<script>
const mock = []
import LeaderActiveHeader from "../leaderActiveComponents/LeaderActiveHeader.vue"
import LeaderActiveTable from '@/leaderActiveComponents/LeaderActiveTable.vue'
import LeaderActiveEdit from "@/leaderActiveComponents/LeaderActiveEdit.vue"
export default {
  name: 'ILeaderActive',
  components:{
    LeaderActiveHeader,
    LeaderActiveTable,
    LeaderActiveEdit
  },
  data(){
    return {
      moduleObject:{},
      propData:this.$root.propData.compositeAttr||{
        viewModel: '2',// 1标识预览；2标识编辑
        scheduleType: 2, // 1标识day
      },
      form_data: {},
      
      header_list: [],
      data_list: [],
      header_list_table: [],
      data_list_table: [],
      week_number: ['周一','周二','周三','周四','周五','周六','周日'],
      publickStatus: 0
    }
  },
  props: {
  },
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.initAttrToModule();
  },
  mounted() {},
  destroyed() {},
  methods:{
    exportData() {
      this.$refs[this.moduleObject.id][`exportData_loading`] = true;

      let days_arr = this.form_data.dates.split(',');
      let startDate = days_arr[0];
      let endDate = days_arr[days_arr.length - 1];
      let fileName = `领导${startDate}至${endDate}活动安排.doc`;
      let url

      // window.open('http://localhost:8081/DreamWeb/ctrl/p2433JxwLeaderSchedule/download?templateId=2402201548552eQLEcA2QZHDx2gnV3C&fileName=%E9%A2%86%E5%AF%BC2024-03-18%E8%87%B32024-03-24%E6%B4%BB%E5%8A%A8%E5%AE%89%E6%8E%92.doc&moduleId=240220154854Kosqknc4MPO2LNAK95c&userId=230622133333yNhQrjaq7e1LDAdiEfs&sDate=2024-03-18&eDate=2024-03-24')

      IDM.http.post('/ctrl/p2433JxwLeaderSchedule/download',{
        templateId: '2402201548552eQLEcA2QZHDx2gnV3C',
        fileName: fileName,
        moduleId: '240220154854Kosqknc4MPO2LNAK95c',
        userId: this.form_data.leaders,
        sDate: startDate,
        eDate: endDate,
      },{
        responseType: "blob",
      }).then((res) => {
        this.$refs[this.moduleObject.id][`exportData_loading`] = false;
        const blob = new Blob([res.data]);
        let url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.setAttribute("target", "_blank");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }).catch((err) => {
        this.$refs[this.moduleObject.id][`exportData_loading`] = false;
        console.log(err)
      })
    },
    release() {
      this.$refs[this.moduleObject.id][`release_loading`] = true;
      let days_arr = this.form_data.dates.split(',');
      let startDate = days_arr[0];
      let endDate = days_arr[days_arr.length - 1];
      IDM.http.post('/ctrl/p2433JxwLeaderSchedule/release',{
        userIds: this.form_data.leaders,
        sDate: startDate,
        eDate: endDate,
      }).then((res) => {
        this.$refs[this.moduleObject.id][`release_loading`] = false;
        if ( res.data.code == '200' ) {
          IDM.message.success(res.data.message)
          this.initData()
        } else {
          IDM.message.error(res.data.message)
        }
      }).catch((err) => {
        this.$refs[this.moduleObject.id][`release_loading`] = false;
        console.log(err)
      })
    },
    unRelease() {
      this.$refs[this.moduleObject.id][`unRelease_loading`] = true;
      let days_arr = this.form_data.dates.split(',');
      let startDate = days_arr[0];
      let endDate = days_arr[days_arr.length - 1];
      IDM.http.post('/ctrl/p2433JxwLeaderSchedule/unRelease',{
        userIds: this.form_data.leaders,
        sDate: startDate,
        eDate: endDate,
      }).then((res) => {
        this.$refs[this.moduleObject.id][`unRelease_loading`] = false;
        if ( res.data.code == '200' ) {
          IDM.message.success(res.data.message)
          this.initData()
        } else {
          IDM.message.error(res.data.message)
        }
      }).catch((err) => {
        this.$refs[this.moduleObject.id][`unRelease_loading`] = false;
        console.log(err)
      })
    },
    save() {
      this.$refs[this.moduleObject.id][`save_loading`] = true;
      IDM.http.post('/ctrl/p2433JxwLeaderSchedule/save',JSON.stringify(this.data_list_table),{
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((res) => {
        this.$refs[this.moduleObject.id][`save_loading`] = false;

        if ( res.data.code == '200' ) {
          IDM.message.success(res.data.message)
          this.initData()
        } else {
          IDM.message.error(res.data.message)
        }
      }).catch((err) => {
        this.$refs[this.moduleObject.id][`save_loading`] = false;
        console.log(err)
      })
    },
    updateTableData() {
      this.initData()
    },
   
    /**
     * 更新头部组件参数
     */
    updateHeadParams(params){
      console.log('更新头部组件参数',params)
      let form_data = params;
      if ( form_data.timeViewType == "week" ) {
        let header_list = params.weekList.map((item,index) => {
          return {
            name: item.monthAndDay,
            key: item.date,
            week: this.week_number[index]
          }
        });
        header_list.unshift({
          name: '领导',
          key: 'leaderText'
        })
        this.header_list = header_list;
      } else {
        this.header_list = [
          {
            name: '领导',
            key: 'leaderText'
          },
          {
            name: '上午',
            key: 'morningContent'
          },
          {
            name: '下午',
            key: 'afternoonContent'
          }
        ]
      }
      this.form_data = params;
      this.initData()
    },
    
    /**
     * 对属性设置进行初始化
     */
    initAttrToModule() {
      this.convertAttrToStyleObject();
      this.convertThemeListAttrToStyleObject();
    },
    /**
     * 主题颜色
     */
    convertThemeListAttrToStyleObject() {
      const themeList = this.propData.themeList;
      if (!themeList) {
        return;
      }
      const themeNamePrefix =
        IDM.setting &&
        IDM.setting.applications &&
        IDM.setting.applications.themeNamePrefix
          ? IDM.setting.applications.themeNamePrefix
          : "idm-theme-";
      for (var i = 0; i < themeList.length; i++) {
        var item = themeList[i];

        if (item.key != IDM.theme.getCurrentThemeInfo()) {
          //此处比对是不渲染输出不用的样式，如果页面会刷新就可以把此处放开
          continue;
        }
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active",
          {
            color: item.mainColor
              ? IDM.hex8ToRgbaString(item.mainColor.hex8)
              : "",
          }
        );
      }
    },
    
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData){
      this.propData = propData.compositeAttr||{};
      this.initAttrToModule()
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject(){
      var styleObject = {};
      if(this.propData.bgSize&&this.propData.bgSize=="custom"){
        styleObject["background-size"]=(this.propData.bgSizeWidth?this.propData.bgSizeWidth.inputVal+this.propData.bgSizeWidth.selectVal:"auto")+" "+(this.propData.bgSizeHeight?this.propData.bgSizeHeight.inputVal+this.propData.bgSizeHeight.selectVal:"auto")
      }else if(this.propData.bgSize){
        styleObject["background-size"]=this.propData.bgSize;
      }
      if(this.propData.positionX&&this.propData.positionX.inputVal){
        styleObject["background-position-x"]=this.propData.positionX.inputVal+this.propData.positionX.selectVal;
      }
      if(this.propData.positionY&&this.propData.positionY.inputVal){
        styleObject["background-position-y"]=this.propData.positionY.inputVal+this.propData.positionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if(!element&&element!==false&&element!=0){
            continue;
          }
          switch (key) {
            case "width":
            case "height":
              styleObject[key]=element;
              break;
            case "bgColor":
              if(element&&element.hex8){
                styleObject["background-color"]=element.hex8;
              }
              break;
            case "box":
              IDM.style.setBoxStyle(styleObject, element)
              break;
            case "bgImgUrl":
              styleObject["background-image"]=`url(${window.IDM.url.getWebPath(element)})`;
              break;
            case "positionX":
              //背景横向偏移
              
              break;
            case "positionY":
              //背景纵向偏移
              
              break;
            case "bgRepeat":
              //平铺模式
                styleObject["background-repeat"]=element;
              break;
            case "bgAttachment":
              //背景模式
                styleObject["background-attachment"]=element;
              break;
            case "border":
              IDM.style.setBorderStyle(styleObject, element)
              break;
            case "font":
              IDM.style.setFontStyle(styleObject, element)
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id,styleObject);
    },
    /**
     * 通用的url参数对象
     * 所有地址的url参数转换
     */
    commonParam(){
      let urlObject = IDM.url.queryObject();
      var params = {
        pageId:
          window.IDM.broadcast && window.IDM.broadcast.pageModule
            ? window.IDM.broadcast.pageModule.id
            : "",
        urlData: JSON.stringify(urlObject),
      };
      return params;
    },
    /**
     * 重新加载
     */
    reload(){
      //请求数据源
      this.initData();
    },
    /**
     * 加载动态数据
     */
    initData(){
      if ( this.propData.viewModel == 1 ) {
        if ( this.form_data.timeViewType == 'day' ) {
          this.getDayInitData()
        } else {
          this.getWeekInitData()
        }
      } else {
        this.getWeekInitDataTableList()
      }
    },
    getDayInitData() {
      IDM.http.get('/ctrl/p2433JxwLeaderSchedule/get',{
        sDate: this.form_data.dates,
        eDate: this.form_data.dates,
      }).then((res) => {
        if ( res.data.code == '200' ) {
          this.data_list = res.data.data[0].subList || [];
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getWeekInitData() {
      let days_arr = this.form_data.dates.split(',');
      let startDate = days_arr[0];
      let endDate = days_arr[days_arr.length - 1];
      IDM.http.get('/ctrl/p2433JxwLeaderSchedule/get',{
        sDate: startDate,
        eDate: endDate,
      }).then((res) => {
        this.data_list = res.data.data.data;
        let data = res.data.data;
        let result = [];
        let user_ids = [];
        data[0] && data[0].subList && data[0].subList.forEach((item) => {
          user_ids.push({
            leader: item.leader,
            leaderText: item.leaderText
          })
        })
        let obj = {};
        user_ids.forEach((item,index) => {
          obj = {
            leader: item.leader,
            leaderText: item.leaderText
          };
          data.forEach((item1,index2) => {
            obj[item1.date] = item1.subList[index];
          })
          result.push(obj);
        })
        this.data_list = result;
      }).catch((err) => {
        console.log(err)
      })
    },
    getWeekInitDataTableList() {
      let days_arr = this.form_data.dates.split(',');
      let startDate = days_arr[0];
      let endDate = days_arr[days_arr.length - 1];
      IDM.http.get('/ctrl/p2433JxwLeaderSchedule/editGet',{
        sDate: startDate,
        eDate: endDate,
        userIds: this.form_data.leaders,
      }).then((res) => {
        this.data_list_table = res.data.data;
        if(this.data_list_table && this.data_list_table.length){
          this.publickStatus = this.data_list_table[0].status
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * 通用的获取表达式匹配后的结果
     */
    getExpressData(dataName,dataFiled,resultData){
      //给defaultValue设置dataFiled的值
      var _defaultVal = undefined;
      if(dataFiled){
        var filedExp = dataFiled;
        filedExp =
          dataName +
          (filedExp.startsWiths("[") ? "" : ".") +
          filedExp;
        var dataObject = { IDM: window.IDM };
        dataObject[dataName] = resultData;
        _defaultVal = window.IDM.express.replace.call(
          this,
          "@[" + filedExp + "]",
          dataObject
        );
      }
      //对结果进行再次函数自定义
      if(this.propData.customFunction&&this.propData.customFunction.length>0){
        var params = this.commonParam();
        var resValue = "";
        try {
          resValue = window[this.propData.customFunction[0].name]&&window[this.propData.customFunction[0].name].call(this,{
            ...params,
            ...this.propData.customFunction[0].param,
            moduleObject:this.moduleObject,
            expressData:_defaultVal,interfaceData:resultData
          });
        } catch (error) {
        }
        _defaultVal = resValue;
      }
      
      return _defaultVal;
    },
    /**
     * 组件通信：接收消息的方法
     * @param {
     *  type:"发送消息的时候定义的类型，这里可以自己用来要具体做什么，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
     * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）"
     *  message:{发送的时候传输的消息对象数据}
     *  messageKey:"消息数据的key值，代表数据类型是什么，常用于表单交互上，比如通过这个key判断是什么数据"
     *  isAcross:如果为true则代表发送来源是其他页面的组件，默认为false
     * } object 
     */
    receiveBroadcastMessage(object){
      console.log("组件收到消息",object)
      if(object.type&&object.type=="linkageShowModule"){
        this.showThisModuleHandle();
      }else if(object.type&&object.type=="linkageHideModule"){
        this.hideThisModuleHandle();
      }
    },
    /**
     * 组件通信：发送消息的方法
     * @param {
     *  type:"自己定义的，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
     * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）",
     *  message:{实际的消息对象},
     *  rangeModule:"为空发送给全部，根据配置的属性中设定的值（值的内容是组件的packageid数组），不取子表的，比如直接 this.$root.propData.compositeAttr["attrKey"]（注意attrKey是属性中定义的bindKey）,这里的格式为：['1','2']"",
     *  className:"指定的组件类型，比如只给待办组件发送，然后再去过滤上面的值"
     *  globalSend:如果为true则全站发送消息，注意全站rangeModule是无效的，只有className才有效，默认为false
     * } object 
     */
    sendBroadcastMessage(object){
        window.IDM.broadcast&&window.IDM.broadcast.send(object);
    },
    /**
     * 交互功能：设置组件的上下文内容值
     * @param {
     *  type:"定义的类型，已知类型：pageCommonInterface（页面统一接口返回值）、"
     *  key:"数据key标识，页面每个接口设置的数据集名称，方便识别获取自己需要的数据"
     *  data:"数据集，内容为：字符串 or 数组 or 对象"
     * }
     */
    setContextValue(object) {
      console.log("统一接口设置的值", object);
    }
  }
}
</script>
<style scoped lang="scss">
.idm-leader-agenda-outer {
  position: relative;
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  overflow-y: auto;
  // border: 1px solid rgba(230,230,230,1);
  // box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.07);
  .scroll_block{
    height: 100%;
    overflow-y: auto;
    padding: 20px 20px 32px 20px;
  }
  
}
</style>
<style lang="scss">
.scroll_block::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.scroll_block::-webkit-scrollbar-thumb {
    background-color: #ccc;
}
.scroll_block::-webkit-scrollbar-thumb {
    min-height: 18px;
    border-radius: 4px;
}
</style>