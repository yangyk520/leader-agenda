<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
  <div
    idm-ctrl="idm_module"
    :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id"
    class="idm-weekly-work-plan"
  >
    <div class="idm-weekly-work-plan-container">
      <div class="agenda-header-main">
        <div class="agenda-header-main-top">
          <div class="top-calendar">
            <!-- 上一周 -->
            <div
              class="calendar-arrow arrow-left"
              @click="calendarToggle('left')"
            >
              <svg-icon iconClass="rectangle_left"></svg-icon>
            </div>
            <div class="calendar-container">
              <div class="calendar-container-week">
                <span
                  >{{ weekList[0].monthAndDay }} -
                  {{ weekList[weekList.length - 1].monthAndDay }}</span
                >
                <span>(第{{ weeksInYear }}周)</span>
              </div>
            </div>
            <!-- 下一周 -->
            <div
              class="calendar-arrow arrow-left"
              @click="calendarToggle('right')"
            >
              <svg-icon iconClass="rectangle_right"></svg-icon>
            </div>
            <span class="calendar-btn" @click="curDayWeekHandle">本周</span>
          </div>
        </div>
        <div class="agenda-header-main-operation">
          <div class="operation-search">
            <a-input
              ref="userNameInput"
              v-model="searchVal"
              @keyup.enter="hanldeSearch"
              style="width: 206px"
            >
              <svg-icon slot="suffix" icon-class="search" />
            </a-input>
            <span class="operation-btn primary" @click="hanldeSearch"
              >检索</span
            >
            <span class="operation-btn" @click="hanldeReset">重置</span>
          </div>
          <div class="operation-btns">
            <span class="operation-btn primary" @click="handleAdd">新增</span>
            <span class="operation-btn" @click="handleExport">导出</span>
            <span class="operation-btn" @click="handlePrint">打印</span>
          </div>
        </div>
      </div>
      <div class="agenda-main">
        <div class="table-header">
          <table class="table">
            <thead>
              <tr>
                <th width="130">日期</th>
                <th width="130">时间</th>
                <th>内容</th>
                <th width="200">地点</th>
                <th width="150">主持</th>
                <th width="200">参加</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="table-body scroll_block">
          <table class="table showAdd">
            <tbody>
              <tr class="colgroup">
                <td width="130"></td>
                <td width="130"></td>
                <td></td>
                <td width="200"></td>
                <td width="150"></td>
                <td width="200"></td>
              </tr>
              <template v-for="item in tableData">
                <tr
                  :key="item.date"
                  :class="{ istoday: judgeToday(item.date) }"
                >
                  <td
                    :rowspan="item.list.length > 0 ? item.list.length + 1 : 1"
                  >
                    {{ item.date }}
                    <div>{{ item.weekDay }}</div>
                  </td>
                  <td :class="{ ishidden: item.list.length > 0 }"></td>
                  <td :class="{ ishidden: item.list.length > 0 }"></td>
                  <td :class="{ ishidden: item.list.length > 0 }"></td>
                  <td :class="{ ishidden: item.list.length > 0 }"></td>
                  <td :class="{ ishidden: item.list.length > 0 }"></td>
                </tr>
                <template v-if="item.list.length > 0">
                  <tr
                    v-for="sitem in item.list"
                    :key="sitem.id"
                    :class="{ istoday: judgeToday(item.date) }"
                  >
                    <td>{{ sitem.time }}</td>
                    <td>
                      <div
                        class="text-left ellipsis cursor"
                        :title="sitem.title"
                        @click="detailsHandle(sitem)"
                      >
                        {{ sitem.title }}
                      </div>
                    </td>
                    <td>
                      <div class="ellipsis" :title="sitem.place">
                        {{ sitem.place }}
                      </div>
                    </td>
                    <td>
                      <div class="ellipsis" :title="sitem.host">
                        {{ sitem.host }}
                      </div>
                    </td>
                    <td>
                      <div class="ellipsis" :title="sitem.participate">
                        {{ sitem.participate }}
                      </div>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { workListMock } from "../mock/IWeeklyWorkPlan";
export default {
  name: "IWeeklyWorkPlan",
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {},
      // 当前日期
      curDate: "",
      // 周开始日期
      weekStart: "",
      // 一周数据
      weekList: [],
      // 周几中文
      weekCn: ["一", "二", "三", "四", "五", "六", "日"],
      // 第几周
      weeksInYear: "",
      // 搜索项
      searchVal: "",
      //表格数据
      tableData: [],
    };
  },
  props: {},
  computed: {},
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.initTime(moment());
    this.initData();
    window.$workplan = this;
  },
  mounted() {},
  destroyed() {},
  methods: {
    // 初始化时间数据
    initTime(today) {
      // 天数据
      this.curDate = today.format("YYYY-MM-DD");
      // 周数据
      const weekStart = today.startOf("isoWeek");
      this.weekList = [];
      for (var i = 0; i <= 6; i++) {
        const day = moment(weekStart).add(i, "days");
        this.weekList.push({
          date: day.format("YYYY-MM-DD"),
          monthAndDay: day.format("MM月DD日"),
        });
      }
      this.weeksInYear = weekStart.isoWeeks();
      this.weekStart = weekStart.format("YYYY-MM-DD");
    },
    //日历切换
    calendarToggle(type) {
      if (type === "left") {
        this.initTime(
          moment(this.weekStart, "YYYY-MM-DD").subtract(1, "isoWeek")
        );
      } else {
        this.initTime(
          moment(this.weekStart, "YYYY-MM-DD").subtract(-1, "isoWeek")
        );
      }
      this.initData();
    },
    //今天、本周切换
    curDayWeekHandle() {
      this.initTime(moment());
      this.initData();
    },
    //搜索
    hanldeSearch() {
      this.initData();
    },
    //重置
    hanldeReset() {
      this.searchVal = "";
      this.initData();
    },
    //新增
    handleAdd() {
      // IDM.layer.open({
      //   type: 2,
      //   title: ["新增", "font-size:18px;"],
      //   area: ["1200px", "90%"],
      //   content: IDM.url.getWebPath("ctrl/formControl/form?moduleId=260123171126HVw7nF6Spwv7eZMQIyl"),
      //   success: (layero, index) => {
      //     top.close = () => {
      //       IDM.layer.close(index);
      //       this.initData();
      //     };
      //   },
      //   end: () => {
      //     this.initData();
      //   },
      // });

      var url = IDM.url.getWebPath(
        "ctrl/formControl/form?moduleId=260123171126HVw7nF6Spwv7eZMQIyl"
      );
      window.open(url);
    },
    //导出
    handleExport() {
      const params = {
        startTime: this.weekList[0].date,
        endTime: this.weekList[this.weekList.length - 1].date,
        content: this.searchVal,
      };
      const url = `ctrl/weeklyschedule/exportnew?${IDM.url.stringify(params)}`;
      const a = document.createElement("a");
      a.style.display = "none";
      a.setAttribute("target", "_blank");
      a.setAttribute("download", IDM.url.getWebPath(url));
      a.href = IDM.url.getWebPath(url);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    //打印
    handlePrint() {
      /* eslint-disable no-undef */
      const params = {
        startTime: this.weekList[0].date,
        endTime: this.weekList[this.weekList.length - 1].date,
        content: this.searchVal,
      };
      IDM.http
        .get("ctrl/weeklyschedule/printdata", params)
        .done((res) => {
          if (res.code == "200") {
            Public.officeEdit(
              res.data.fileName,
              "0",
              "0",
              res.data.fileId,
              "260123171126HVw7nF6Spwv7eZMQIyl",
              false,
              {}
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //查看详情
    detailsHandle(item) {
      console.log(item);
      let url = IDM.url.getWebPath(
        `ctrl/formControl/sysForm?moduleId=${item.moduleId}&formId=${item.formId}&pk=${item.id}`
      );
      if (item.isEdit == 0) {
        url = IDM.url.getWebPath(
          `ctrl/formControl/sysForm?moduleId=${item.moduleId}&formId=${item.formId}&pk=${item.id}&nodeId=-1`
        );
      }
      window.open(url);

      // IDM.layer.open({
      //   type: 2,
      //   title: ["详情", "font-size:18px;"],
      //   area: ["1200px", "90%"],
      //   content: url,
      //   success: (layero, index) => {
      //     top.close = () => {
      //       IDM.layer.close(index);
      //       if(item.isEdit == 1) {
      //         this.initData();
      //       }
      //     };
      //   },
      //   end: () => {
      //     if(item.isEdit == 1) {
      //       this.initData();
      //     }
      //   },
      // });
    },
    //判断是不是今天
    judgeToday(date) {
      let today = IDM.dateFormat(new Date(), "Y-m-d");
      return date == today;
    },
    changeTableWidth() {
      $(".agenda-main .table-header").width(
        $(".agenda-main .table-body table").width()
      );
      window.onresize = () => {
        $(".agenda-main .table-header").width(
          $(".agenda-main .table-body table").width()
        );
      };
    },
    groupByDate(list) {
      const result = {};
      list.forEach((item) => {
        const date = item.date;
        if (!result[date]) {
          result[date] = { date, weekDay: this.getWeekDay(date), list: [] };
        }
        result[date].list.push(item);
      });
      let newArr = this.mergeDateAndMeeting(this.weekList, result);
      return newArr;
    },
    getWeekDay(dateStr) {
      const week = ["日", "一", "二", "三", "四", "五", "六"];
      const day = new Date(dateStr).getDay();
      return `周${week[day]}`;
    },
    mergeDateAndMeeting(dateList, groupedData) {
      return dateList.map((item) => {
        const meeting = groupedData[item.date] || {
          date: item.date,
          weekDay: this.getWeekDay(item.date),
          list: [], // 没会议就置空数组
        };
        return {
          ...meeting,
          monthAndDay: item.monthAndDay,
        };
      });
    },
    /**
     * 对属性设置进行初始化
     */
    initAttrToModule() {
      this.initBaseAttrToModule();
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
     * 加载基本属性到组件中
     */
    initBaseAttrToModule() {},
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
          (this.propData.bgSizeWidth
            ? this.propData.bgSizeWidth.inputVal +
              this.propData.bgSizeWidth.selectVal
            : "auto") +
          " " +
          (this.propData.bgSizeHeight
            ? this.propData.bgSizeHeight.inputVal +
              this.propData.bgSizeHeight.selectVal
            : "auto");
      } else if (this.propData.bgSize) {
        styleObject["background-size"] = this.propData.bgSize;
      }
      if (this.propData.positionX && this.propData.positionX.inputVal) {
        styleObject["background-position-x"] =
          this.propData.positionX.inputVal + this.propData.positionX.selectVal;
      }
      if (this.propData.positionY && this.propData.positionY.inputVal) {
        styleObject["background-position-y"] =
          this.propData.positionY.inputVal + this.propData.positionY.selectVal;
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
              styleObject[
                "background-image"
              ] = `url(${window.IDM.url.getWebPath(element)})`;
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
    reload() {
      //请求数据源
      this.initData();
    },
    /**
     * 加载动态数据
     */
    initData() {
      console.log("加载数据");
      if (!this.moduleObject.env || this.moduleObject.env == "develop") {
        const result = workListMock.data.dataList;
        const groupedData = this.groupByDate(result);
        console.log("表格数据", groupedData);
        this.tableData = groupedData;
        this.$nextTick(() => {
          this.changeTableWidth();
        });
      } else {
        const params = {
          startTime: this.weekList[0].date,
          endTime: this.weekList[this.weekList.length - 1].date,
          content: this.searchVal,
        };
        IDM.http
          .get("ctrl/weeklyschedule/managementdata", params)
          .done((res) => {
            console.log("数据", res);
            if (res.code == "200") {
              const result = res.data.dataList;
              const groupedData = this.groupByDate(result);
              console.log("表格数据", groupedData);
              this.tableData = groupedData;
            }
            this.$nextTick(() => {
              this.changeTableWidth();
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    /**
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
        _defaultVal = window.IDM.express.replace.call(
          this,
          "@[" + filedExp + "]",
          dataObject
        );
      }
      //对结果进行再次函数自定义
      if (
        this.propData.customFunction &&
        this.propData.customFunction.length > 0
      ) {
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
      if (object.type && object.type == "linkageShowModule") {
        this.showThisModuleHandle();
      } else if (object.type && object.type == "linkageHideModule") {
        this.hideThisModuleHandle();
      } else if (
        object.type &&
        object.type == "websocket" &&
        this.propData.messageRefreshKey
      ) {
        const messageData =
          (typeof object.message === "string" && JSON.parse(object.message)) ||
          object.message;
        const arr = Array.isArray(this.propData.messageRefreshKey)
          ? this.propData.messageRefreshKey
          : [this.propData.messageRefreshKey];
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
.idm-weekly-work-plan {
  position: relative;
  width: 100%;
  height: 100%;
  background: #ffffff;
  overflow-y: auto;
  border: 1px solid rgba(230, 230, 230, 1);
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.07);
  color: #333;
  font-size: 16px;

  .idm-weekly-work-plan-container {
    height: 100%;
    overflow-y: auto;
    padding: 20px;
  }

  .agenda-header-main {
    font-size: 16px;
    color: #333333;

    .agenda-header-main-top {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      color: #333333;
      font-weight: 500;
      border-bottom: 1px solid rgba(238, 238, 238, 1);
      user-select: none;
      height: 50px;

      .top-calendar {
        display: flex;
        .calendar-arrow {
          color: #0086d9;
          font-size: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          margin: 0 16px;
        }
        .calendar-container {
          display: flex;
          align-items: center;
          .calendar-container-day,
          .calendar-container-week {
            color: #0086d9;
            font-weight: 400;

            span:nth-child(2) {
              color: #333;
              margin-left: 16px;
            }
          }
        }

        .calendar-btn {
          display: inline-block;
          cursor: pointer;
          border: 1px solid rgba(201, 201, 201, 1);
          border-radius: 2px;
          line-height: 26px;
          padding: 0 10px;
          margin-left: 12px;
          font-size: 16px;
          cursor: pointer;
        }
      }
    }

    .agenda-header-main-operation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      user-select: none;

      .operation-btn {
        display: inline-block;
        cursor: pointer;
        border: 1px solid rgba(201, 201, 201, 1);
        border-radius: 2px;
        line-height: 30px;
        padding: 0 20px;
        margin-left: 12px;
        font-size: 16px;
        cursor: pointer;

        &.primary {
          background: #0086d9;
          border-color: #0086d9;
          color: #fff;
        }
      }
    }
  }

  .agenda-main {
    height: calc(100% - 115px);
    position: relative;
    padding-top: 50px;
    .table-header {
      position: absolute;
      top: 0;
      left: 0;
      width: calc(100% - 8px);
    }
    .table-body {
      height: 100%;
      overflow-y: auto;
      padding: 0 10px;
      margin: -1px -10px 0 -10px;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      tr {
        th,
        td {
          border: 1px solid #e6e6e6;
          text-align: center;
        }
        th {
          background: #f9fcfe;
          font-weight: 500;
          height: 50px;
        }
        td {
          padding: 8px;
          .text-left {
            text-align: left;
          }
          .ellipsis {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .cursor {
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }
          &.ishidden {
            display: none;
          }
        }
      }
      .colgroup {
        visibility: hidden;
        td {
          padding: 0;
        }
      }
      .istoday {
        background-color: #eaf4fb;
      }
    }
  }
}
</style>
<style lang="scss">
.scroll_block::-webkit-scrollbar {
  width: 6px;
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
