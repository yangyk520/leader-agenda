<template>
  <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="IWeeklyMorningAfternoonWork_app">
    <LeaderActiveHeader
      :ref="moduleObject.id"
      :moduleObject="moduleObject"
      :scheduleType="propData.scheduleType"
      :viewModel="propData.viewModel"
      :publickStatus="publickStatus"
      @updateHeadParams="updateHeadParams"
      @exportData="exportData"
    />
    <div class="IWeeklyMorningAfternoonWork_app_table">
      <template v-if="propData.release">
        <LeaderActiveTable
          :ref="`${moduleObject.id}-table`"
          :propData="propData"
          :moduleObject="moduleObject"
          :form_data="form_data"
          :header_list="header_list"
          :data_list="data_list"
        ></LeaderActiveTable>
      </template>
      <template v-else>
        <LeaderActiveTableRelease
          :ref="`${moduleObject.id}-table`"
          :propData="propData"
          :moduleObject="moduleObject"
          :form_data="form_data"
          :header_list="header_list"
          :data_list="data_list"
        ></LeaderActiveTableRelease>
      </template>
    </div>
  </div>
</template>

<script>
const mock = [];
import LeaderActiveHeader from "@/weeklyMorningAfternoonComponents/LeaderActiveHeader.vue";
import LeaderActiveTable from "@/weeklyMorningAfternoonComponents/LeaderActiveTable.vue";
import LeaderActiveTableRelease from "@/weeklyMorningAfternoonComponents/LeaderActiveTableRelease.vue";
export default {
  name: "IWeeklyMorningAfternoonWork",
  components: {
    LeaderActiveHeader,
    LeaderActiveTable,
    LeaderActiveTableRelease,
  },
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        viewModel: "2", // 1标识预览；2标识编辑
        scheduleType: 2, // 1标识day
        release: false,
      },
      form_data: {},

      header_list: [],
      data_list: [
        {
          name: "杨峥",
          "2024-08-15": [
            {
              afternoon: "啊实打实大师大师",
              morning: "啊实打实大师大师",
            },
          ],
          "2024-08-16": [
            {
              afternoon: "啊实打实大萨达",
              morning: "啊实打实大师",
            },
          ],
          "2024-08-17": [
            {
              afternoon: "",
              morning: "",
            },
          ],
          id: "240620205510Zabo4E8hFgGSrOmye2B",
          "2024-08-18": [
            {
              afternoon: "",
              morning: "",
            },
          ],
          "2024-08-12": [
            {
              afternoon: "阿达阿达是的\nasdasdasasdas\n阿达是的\nasdasdasd\n啊实打实大\nasdasd",
              morning: "asdasdasd\n啊实打实大\nadsasdasd \n大大是的\nasdasd\n阿达电视",
            },
          ],
          "2024-08-13": [
            {
              afternoon: "阿达是的",
              morning: "阿达是的",
            },
          ],
          url: "ctrl/formControl/sysForm?moduleId=240618142931D60CRcXePZpwsnOMkYZ&nodeId=-2&pk=240812130413RVrH4qO6cGuYOnA7nGG",
          "2024-08-14": [
            {
              afternoon: "啊实打实大",
              morning: "阿达阿达是的",
            },
          ],
        },
        {
          name: "熊英",
          "2024-08-15": [],
          "2024-08-16": [],
          "2024-08-17": [],
          id: "230620163205bAj7chroOLLpRrw3Ad8",
          "2024-08-18": [],
          "2024-08-12": [],
          "2024-08-13": [],
          url: "ctrl/formControl/sysForm?moduleId=240618142931D60CRcXePZpwsnOMkYZ&nodeId=0&leaderId=230620163205bAj7chroOLLpRrw3Ad8&leaderName=熊英&startTime=2024-08-12&endTime=2024-08-18",
          "2024-08-14": [],
        },
        {
          name: "强鹏程",
          "2024-08-15": [],
          "2024-08-16": [],
          "2024-08-17": [],
          id: "230620163205rVj3L3uZKvVT5hQu4zX",
          "2024-08-18": [],
          "2024-08-12": [],
          "2024-08-13": [],
          url: "ctrl/formControl/sysForm?moduleId=240618142931D60CRcXePZpwsnOMkYZ&nodeId=0&leaderId=230620163205rVj3L3uZKvVT5hQu4zX&leaderName=强鹏程&startTime=2024-08-12&endTime=2024-08-18",
          "2024-08-14": [],
        },
        {
          name: "卢伟",
          "2024-08-15": [],
          "2024-08-16": [],
          "2024-08-17": [],
          id: "230620163205fLsADHXD56vF8BfvKqV",
          "2024-08-18": [],
          "2024-08-12": [],
          "2024-08-13": [],
          url: "ctrl/formControl/sysForm?moduleId=240618142931D60CRcXePZpwsnOMkYZ&nodeId=0&leaderId=230620163205fLsADHXD56vF8BfvKqV&leaderName=卢伟&startTime=2024-08-12&endTime=2024-08-18",
          "2024-08-14": [],
        },
        {
          name: "马文才",
          "2024-08-15": [],
          "2024-08-16": [],
          "2024-08-17": [],
          id: "230620163205axjx4Wyetu4xBjShTE7",
          "2024-08-18": [],
          "2024-08-12": [],
          "2024-08-13": [],
          url: "ctrl/formControl/sysForm?moduleId=240618142931D60CRcXePZpwsnOMkYZ&nodeId=0&leaderId=230620163205axjx4Wyetu4xBjShTE7&leaderName=马文才&startTime=2024-08-12&endTime=2024-08-18",
          "2024-08-14": [],
        },
        {
          name: "陈晓云",
          "2024-08-15": [],
          "2024-08-16": [],
          "2024-08-17": [],
          id: "2306201632055fyiUaWf26bIN8SQXUv",
          "2024-08-18": [],
          "2024-08-12": [],
          "2024-08-13": [],
          url: "ctrl/formControl/sysForm?moduleId=240618142931D60CRcXePZpwsnOMkYZ&nodeId=0&leaderId=2306201632055fyiUaWf26bIN8SQXUv&leaderName=陈晓云&startTime=2024-08-12&endTime=2024-08-18",
          "2024-08-14": [],
        },
      ],
      header_list_table: [],
      data_list_table: [],
      week_number: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
      publickStatus: 0,
    };
  },
  props: {},
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.initAttrToModule();
  },
  mounted() {},
  destroyed() {},
  methods: {
    exportData() {
      this.$refs[`${this.moduleObject.id}`].changeButtonLoadingStatus("exportData_loading", true);
      let days_arr = this.form_data.weekList;
      let startDate = days_arr[0]?.date;
      let endDate = days_arr[days_arr.length - 1]?.date;
      let fileName = `领导${startDate}至${endDate}安排.xls`;
      IDM.http
        .post(
          "/ctrl/cooperLeaderWeek/exportLeaderWeekData",
          {
            startTime: startDate,
            endTime: endDate,
          },
          {
            responseType: "blob",
          }
        )
        .then(res => {
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
        })
        .catch(err => {
          this.$refs[this.moduleObject.id][`exportData_loading`] = false;
          console.log(err);
        });
    },
    /**
     * 更新头部组件参数
     */
    updateHeadParams(params) {
      console.log("更新头部组件参数", params);
      this.form_data = params;
      this.makeHeaderListData(params.weekList || []);
      this.initData();
    },
    makeHeaderListData(weekList) {
      let header_list = JSON.parse(JSON.stringify(weekList));
      header_list.forEach((item, index) => {
        item["week"] = this.week_number[index];
      });
      this.header_list = header_list;
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
      const themeNamePrefix = IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix ? IDM.setting.applications.themeNamePrefix : "idm-theme-";
      for (var i = 0; i < themeList.length; i++) {
        var item = themeList[i];

        if (item.key != IDM.theme.getCurrentThemeInfo()) {
          //此处比对是不渲染输出不用的样式，如果页面会刷新就可以把此处放开
          continue;
        }
        IDM.setStyleToPageHead("." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active", {
          color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : "",
        });
      }
    },

    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.initAttrToModule();
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      var styleObject = {};
      if (this.propData.bgSize && this.propData.bgSize == "custom") {
        styleObject["background-size"] =
          (this.propData.bgSizeWidth ? this.propData.bgSizeWidth.inputVal + this.propData.bgSizeWidth.selectVal : "auto") +
          " " +
          (this.propData.bgSizeHeight ? this.propData.bgSizeHeight.inputVal + this.propData.bgSizeHeight.selectVal : "auto");
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
              IDM.style.setBoxStyle(styleObject, element);
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
              IDM.style.setBorderStyle(styleObject, element);
              break;
            case "font":
              IDM.style.setFontStyle(styleObject, element);
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
        pageId: window.IDM.broadcast && window.IDM.broadcast.pageModule ? window.IDM.broadcast.pageModule.id : "",
        urlData: JSON.stringify(urlObject),
      };
      return params;
    },
    /**
     * 重新加载
     */
    reload() {
      //请求数据源
      this.initData();
    },
    /**
     * 加载动态数据
     */
    initData() {
      this.getWeekInitData();
    },
    getWeekInitData() {
      let days_arr = this.form_data.weekList;
      let startDate = days_arr[0]?.date;
      let endDate = days_arr[days_arr.length - 1]?.date;
      IDM.http
        .get("/ctrl/cooperLeaderWeek/getLeaderDataIndex", {
          startTime: startDate,
          endTime: endDate,
        })
        .then(res => {
          this.data_list = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 通用的获取表达式匹配后的结果
     */
    getExpressData(dataName, dataFiled, resultData) {
      //给defaultValue设置dataFiled的值
      var _defaultVal = undefined;
      if (dataFiled) {
        var filedExp = dataFiled;
        filedExp = dataName + (filedExp.startsWiths("[") ? "" : ".") + filedExp;
        var dataObject = { IDM: window.IDM };
        dataObject[dataName] = resultData;
        _defaultVal = window.IDM.express.replace.call(this, "@[" + filedExp + "]", dataObject);
      }
      //对结果进行再次函数自定义
      if (this.propData.customFunction && this.propData.customFunction.length > 0) {
        var params = this.commonParam();
        var resValue = "";
        try {
          resValue =
            window[this.propData.customFunction[0].name] &&
            window[this.propData.customFunction[0].name].call(this, {
              ...params,
              ...this.propData.customFunction[0].param,
              moduleObject: this.moduleObject,
              expressData: _defaultVal,
              interfaceData: resultData,
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
      console.log("组件收到消息", object);
      // 配置了刷新KEY，消息类型是websocket，收到的消息对象有message并不为空
      if (this.propData.messageRefreshKey && this.propData.messageRefreshKey.length && object.type === "websocket" && object.message) {
        const messageData = (typeof object.message === "string" && JSON.parse(object.message)) || object.message;
        const arr = this.propData.messageRefreshKey || [];
        if (messageData.badgeType && arr.includes(messageData.badgeType)) {
          this.reload();
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
    },
  },
};
</script>
<style scoped lang="scss">
.IWeeklyMorningAfternoonWork_app {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px 20px 20px 20px;
  background: #ffffff;
  overflow-y: auto;
  // border: 1px solid rgba(230,230,230,1);
  // box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.07);
  .IWeeklyMorningAfternoonWork_app_table {
    height: calc(100% - 70px);
  }
}
</style>
