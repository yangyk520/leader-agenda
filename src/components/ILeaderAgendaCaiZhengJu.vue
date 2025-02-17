<template>
<div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="IWorkStatistics_app">
  <LeaderAgendaHeader :ref="moduleObject.id" :moduleObject="moduleObject" 
    :propData="propData" 
    @updateHeadParams="updateHeadParams" 
    :isView="isView"
    :isAll="isAll"
  >
  </LeaderAgendaHeader>
  <!-- <div class="IWorkStatistics_app_middle">
      <Calendar></Calendar>
    </div> -->
  <LeaderAgendaTable :propData="propData" :header_list="header_list" :data_list_table="data_list" @updateTableDate="updateTableDate" :isView="isView"></LeaderAgendaTable>
  <AgendaFooter :setting_data="setting_data" :propData="propData"></AgendaFooter>
</div>
</template>

<script>
import LeaderAgendaHeader from "@/leaderAgendaCaiZhengJu/AgendaHeader.vue"
import LeaderAgendaTable from "@/leaderAgendaCaiZhengJu/LeaderAgendaTable.vue"
import AgendaFooter from "@/leaderAgendaCaiZhengJu/AgendaFooter.vue"
// import Calendar from "@/leaderAgendaCaiZhengJu/Calendar.vue"
export default {
  name: 'ILeaderAgendaCaiZhengJu',
  components: {
    LeaderAgendaHeader,
    LeaderAgendaTable,
    AgendaFooter,
    // Calendar
  },
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        showWeekPicker: true,
        showLeaderFilter: true,
        operateList: [{
          buttonText: '导出'
        }]
      },
      isView: false,
      isAll: false,// 是否隐藏领导下拉选择-根据url参数显示
      form_data: {},
      header_list: [],
      data_list: [],
      successData: {},
    }
  },
  props: {},
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.isView = IDM.url.queryString("isView") == '1' ? true : false;
    if(this.isView && IDM.url.queryString("isAll") == '1') {
      this.isAll = true
    } else {
      this.isAll = false
    }
    this.initAttrToModule();
  },
  mounted() {
    top.window.$agendaActive = this;
  },
  destroyed() {},
  methods: {
    updateTableDate() {
      this.getInitData();
    },
    getInitData() {
      // if (!this.moduleObject.env || this.moduleObject.env == "develop") {
      if (this.develop) {
        this.data_list = [
          {
            "type": "上午",
            "2024-09-30": [],
            "2025-02-11": [{
                "title": "测试会议",
                "url": "ctrl/formControl/form?moduleId=240821173209i4sYjb4HrBVwcsEbRmm&listId=240821173210yY2wB59zU4GVwmpIMrD&method=view&validateByList=1&pk=240930103543tbpFi6kSe3xqHqmiVmz",
                "time": "9时00分",
                "releaseType": 1,
                "releaseTypeText": "已发布",
                "range": "测试领导",
                "place": "市政府"
              },
              {
                "title": "测试会议222",
                "url": "ctrl/formControl/form?moduleId=240821173209i4sYjb4HrBVwcsEbRmm&listId=240821173210yY2wB59zU4GVwmpIMrD&method=view&validateByList=1&pk=240930103543tbpFi6kSe3xqHqmiVmz",
                "time": "9时00分",
                "releaseType": 1,
                "releaseTypeText": "已发布",
                "range": "测试领导",
                "place": "市政府"
              }
            ],
            "2024-10-02": [],
            "2024-10-03": [],
            "2024-10-04": [],
            "2024-10-05": [],
            "2024-10-06": []
          },
          {
            "type": "下午",
            "2024-09-30": [],
            "2025-02-11": [
              {
                "title": "测试只保存不发布",
                "url": "ctrl/formControl/form?moduleId=240821173209i4sYjb4HrBVwcsEbRmm&listId=240821173210yY2wB59zU4GVwmpIMrD&method=view&validateByList=1&pk=240930103631DgPwdr6nBrkxTZGZMUw",
                "time": "下午",
                "releaseType": 1,
                "releaseTypeText": "已发布",
                "range": "测试领导人员",
                "place": "市财政局"
              },
              {
                "title": "测试只保存不发布222444444444",
                "url": "ctrl/formControl/form?moduleId=240821173209i4sYjb4HrBVwcsEbRmm&listId=240821173210yY2wB59zU4GVwmpIMrD&method=view&validateByList=1&pk=240930103631DgPwdr6nBrkxTZGZMUw",
                "time": "下午",
                "releaseType": 1,
                "releaseTypeText": "已发布",
                "range": "测试领导人员",
                "place": "市财政局"
              }
            ],
            "2024-10-02": [],
            "2024-10-03": [],
            "2024-10-04": [],
            "2024-10-05": [],
            "2024-10-06": []
          }
        ]
      } else {
        let dates = this.form_data.dates;
        let dates_arr = dates ? dates.split(',') : [];
        let startDate = dates_arr[0];
        let endDate = dates_arr.length ? dates_arr[dates_arr.length - 1] : '';
        var params = this.commonParam();
        params = this.makeParamsData(params);
        IDM.http.get('ctrl/czjWorkPlan/getData', {
          startDate,
          endDate,
          leaderId: this.form_data?.leaderId,
          leaderName: this.form_data?.leaderName,
          isView: this.isView,
          isAll: this.isAll
        }).then((res) => {
          console.log(res)
          this.data_list = res.data.data
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    makeParamsData(data) {
      let result = {};
      if (this.propData.paramsMakeFunction && this.propData.paramsMakeFunction.length && window[this.propData.paramsMakeFunction[0].name]) {
        result = window[this.propData.paramsMakeFunction[0].name].call(this, {
          ...data,
          ...this.propData.paramsMakeFunction[0].param,
          moduleObject: this.moduleObject,
        });
        console.log("自定义参数函数", result);
        return result;
      }
      return data;
    },
    handleAddData(item) {
      this.propData.addAgendaCellFunction && this.propData.addAgendaCellFunction.length && IDM.invokeCustomFunctions.apply(this, [this.propData.addAgendaCellFunction, {
        item,
        _this: this
      }])
    },
    refreshData(isRefresh) {
      console.log('触发关闭弹框操作');
      IDM.layer.closeAll();
      if (isRefresh) {
        this.getInitData()
      }
    },
    updateHeadParams(params) {
      console.log('更新头部组件参数', params)
      let form_data = params;
      this.form_data = params;
      this.makeHeaderData(params.dates)
      this.getInitData()
    },
    makeHeaderData(dates) {
      const datesArr = dates.split(',')
      const header_list = [{
        label: '时间',
        key: 'type',
      }]
      datesArr.forEach((item) => {
        header_list.push({
          label: item,
          key: item,
        })
      })
      this.header_list = header_list
    },
    exportData() {
      this.$refs[this.moduleObject.id][`exportData_loading`] = true;

      let days_arr = this.form_data.dates.split(',');
      let startDate = days_arr[0];
      let endDate = days_arr[days_arr.length - 1];
      let fileName = `电子周表（${startDate}-${endDate}）.xls`;
      IDM.http.post('/ctrl/sfzyjzxcustom/dzzbExport', {
        startTime: startDate,
        endTime: endDate,
      }, {
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
        IDM.setting.applications.themeNamePrefix ?
        IDM.setting.applications.themeNamePrefix :
        "idm-theme-";
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
          " .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active", {
            color: item.mainColor ?
              IDM.hex8ToRgbaString(item.mainColor.hex8) :
              "",
          }
        );
      }
    },

    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.initAttrToModule()
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      var styleObject = {};
      if (this.propData.bgSize && this.propData.bgSize == "custom") {
        styleObject["background-size"] = (this.propData.bgSizeWidth ? this.propData.bgSizeWidth.inputVal + this.propData.bgSizeWidth.selectVal : "auto") + " " + (this.propData.bgSizeHeight ? this.propData.bgSizeHeight.inputVal + this.propData.bgSizeHeight.selectVal : "auto")
      } else if (this.propData.bgSize) {
        styleObject["background-size"] = this.propData.bgSize;
      }
      if (this.propData.positionX && this.propData.positionX.inputVal) {
        styleObject["background-position-x"] = this.propData.positionX.inputVal + this.propData.positionX.selectVal;
      }
      if (this.propData.positionY && this.propData.positionY.inputVal) {
        styleObject["background-position-y"] = this.propData.positionY.inputVal + this.propData.positionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case "width":
            case "height":
              styleObject[key] = element;
              break;
            case "bgColor":
              if (element && element.hex8) {
                styleObject["background-color"] = element.hex8;
              }
              break;
            case "box":
              IDM.style.setBoxStyle(styleObject, element)
              break;
            case "bgImgUrl":
              styleObject["background-image"] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case "positionX":
              //背景横向偏移

              break;
            case "positionY":
              //背景纵向偏移

              break;
            case "bgRepeat":
              //平铺模式
              styleObject["background-repeat"] = element;
              break;
            case "bgAttachment":
              //背景模式
              styleObject["background-attachment"] = element;
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
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
    },
    /**
     * 通用的url参数对象
     * 所有地址的url参数转换
     */
    commonParam() {
      let urlObject = IDM.url.queryObject();
      var params = {
        pageId: window.IDM.broadcast && window.IDM.broadcast.pageModule ?
          window.IDM.broadcast.pageModule.id :
          "",
        urlData: JSON.stringify(urlObject),
      };
      return params;
    },
    /**
     * 重新加载
     */
    reload() {
      //请求数据源
      this.getInitData();
    },
    makeDataFormat(data_list) {
      data_list && data_list.length && data_list.forEach((item) => {
        item['am'] = [];
        item['pm'] = [];
        item.data && item.data.length && item.data.forEach((item1) => {
          if (item1.rcsd == 1) {
            item1.time = IDM.dateFormat(item1.sdate, 'H:i');
            item.am.push(item1)
          } else if (item1.rcsd == 2) {
            item1.time = IDM.dateFormat(item1.sdate, 'H:i');
            item.pm.push(item1)
          } else {
            item.am.push({
              ...item1,
              time: IDM.dateFormat(item1.sdate, 'H:i')
            })
            item.pm.push({
              ...item1,
              time: item1.defaultTime
            })
          }
        })
      })
      return data_list
    },
    /**
     * 通用的获取表达式匹配后的结果
     */
    getExpressData(dataName, dataFiled, resultData) {
      //给defaultValue设置dataFiled的值
      var _defaultVal = undefined;
      if (dataFiled) {
        var filedExp = dataFiled;
        filedExp =
          dataName +
          (filedExp.startsWiths("[") ? "" : ".") +
          filedExp;
        var dataObject = {
          IDM: window.IDM
        };
        dataObject[dataName] = resultData;
        _defaultVal = window.IDM.express.replace.call(
          this,
          "@[" + filedExp + "]",
          dataObject
        );
      }
      //对结果进行再次函数自定义
      if (this.propData.customFunction && this.propData.customFunction.length > 0) {
        var params = this.commonParam();
        var resValue = "";
        try {
          resValue = window[this.propData.customFunction[0].name] && window[this.propData.customFunction[0].name].call(this, {
            ...params,
            ...this.propData.customFunction[0].param,
            moduleObject: this.moduleObject,
            expressData: _defaultVal,
            interfaceData: resultData
          });
        } catch (error) {}
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
    receiveBroadcastMessage(object) {
      console.log("组件收到消息", object)
      // 配置了刷新KEY，消息类型是websocket，收到的消息对象有message并不为空
      if (this.propData.messageRefreshKey && this.propData.messageRefreshKey.length && object.type === 'websocket' && object.message) {
        const messageData = typeof object.message === 'string' && JSON.parse(object.message) || object.message
        const arr = this.propData.messageRefreshKey || [];
        if (messageData.badgeType && arr.includes(messageData.badgeType)) {
          this.reload()
        }
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
    sendBroadcastMessage(object) {
      window.IDM.broadcast && window.IDM.broadcast.send(object);
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

<style lang="scss" scoped>
.IWorkStatistics_app {
  height: 100vh;
  padding: 0 20px 25px 20px;

  .IWorkStatistics_app_middle {
    height: calc(100% - 120px);
    display: flex;
    align-items: flex-start;
    margin-top: 18px;
    padding-bottom: 25px;
  }
}
</style>
