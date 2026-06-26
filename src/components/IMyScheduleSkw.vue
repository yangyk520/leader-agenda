<template>
  <!-- 我的日程--市科委 -->
  <div
    idm-ctrl="idm_module"
    :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id"
    class="idm-my-schedule-skw"
  >
    <div class="my-schedule-header">
      <div class="tabs">
        <span class="active">我的日程</span>
      </div>
      <div class="calendar-toolbar">
        <a-select
          v-model="selectYear"
          @change="handleYearChange"
          style="width: 90px; margin-right: 6px"
        >
          <a-select-option
            v-for="year in yearOptions"
            :key="year"
            :value="year"
          >
            {{ year }}年
          </a-select-option>
        </a-select>
        <a-select
          v-model="selectMonth"
          @change="handleMonthChange"
          style="width: 70px; margin-right: 6px"
        >
          <a-select-option v-for="month in 12" :key="month" :value="month">
            {{ month }}月
          </a-select-option>
        </a-select>
        <a-button type="primary" @click="backToToday" class="backToday">今天</a-button>
      </div>
      <div class="right">
        <!-- <div class="addBtn" @click="addHandle">新增</div> -->
        <div class="add" @click="addHandle">
          <svg-icon iconClass="add"></svg-icon>
        </div>
        <div class="more" @click="openMore">
          <a-tooltip>
            <template slot="title"> 更多 </template>
            <img
              :src="
                IDM.url.getModuleAssetsWebPath(
                  require(`../assets/more.svg`),
                  this.moduleObject
                )
              "
              width="16px"
            />
          </a-tooltip>
        </div>
      </div>
    </div>
    <div class="my-schedule-content">
      <!-- 顶部年月选择栏 -->
      <!-- <div class="calendar-toolbar">
        <a-select
          v-model="selectYear"
          @change="handleYearChange"
          style="width: 90px; margin-right: 12px"
        >
          <a-select-option
            v-for="year in yearOptions"
            :key="year"
            :value="year"
          >
            {{ year }}年
          </a-select-option>
        </a-select>
        <a-select
          v-model="selectMonth"
          @change="handleMonthChange"
          style="width: 90px; margin-right: 12px"
        >
          <a-select-option v-for="month in 12" :key="month" :value="month">
            {{ month }}月
          </a-select-option>
        </a-select>
        <a-button type="primary" @click="backToToday" class="backToday"
          >今天</a-button
        >
      </div> -->
      <!-- 日历 周一为一周起始 -->
      <div class="calendar-container">
        <a-calendar
          v-model="currentDate"
          :first-day-of-week="1"
          class="custom-calendar"
          @change="changeHandle"
        >
          <!-- 自定义头部渲染，重写星期行 -->
          <template slot="headerRender" slot-scope="value">
            <div class="cal-header-custom">
              <!-- 年月展示（可保留原生，也可自己写） -->
              <div class="cal-title" style="display: none">
                {{ value.value.format("YYYY年MM月") }}
              </div>
              <!-- 自定义星期文字数组，周一到周日 -->
              <div class="week-row">
                <div class="week-item">周一</div>
                <div class="week-item">周二</div>
                <div class="week-item">周三</div>
                <div class="week-item">周四</div>
                <div class="week-item">周五</div>
                <div class="week-item">周六</div>
                <div class="week-item">周日</div>
              </div>
            </div>
          </template>
          <!-- 自定义日期单元格 -->
          <template slot="dateFullCellRender" slot-scope="value">
            <div
              class="cell-box"
              :class="{
                today: isToday(value),
                otherMonth: !isCurrentMonth(value),
              }"
              @click="clickCell(value)"
            >
              <!-- 公历日期数字 -->
              <div class="day-num">{{ getShowDate(value) }}</div>
              <!-- 农历/节假日文字 -->
              <div class="sub-text">{{ getLunarOrHoliday(value) }}</div>
              <!-- 日程小黄点 -->
              <span
                v-if="scheduleList.length > 0 && hasSchedule(value)"
                class="schedule-dot"
              ></span>
            </div>
          </template>
        </a-calendar>
      </div>
      <!-- 日程列表 -->
      <div class="schedule-list">
        <template v-if="showScheduleList.length > 0">
          <vue-scroll :ops="scrollOps">
            <div class="row" v-for="item in showScheduleList" :key="item.id">
              <div class="item">
                <div class="top">
                  <span>{{ item.startTime }} ~ {{ item.endTime }}</span>
                  <span class="address" :title="item.place">{{
                    item.place
                  }}</span>
                </div>
                <div class="bt" :title="item.bt">{{ item.bt }}</div>
              </div>
            </div>
          </vue-scroll>
        </template>
        <div class="empty" v-else>
          <span>暂无日程数据</span>
          <!-- <a-empty description="暂无数据" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入组件和样式
import { Calendar } from "ant-design-vue";
import "ant-design-vue/lib/calendar/style/css";

import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

import LunarCalendar from "lunar-calendar"; //获取二十四节气和农历日期
import mixins from "@/mixins/index.js";
export default {
  name: "IMyScheduleSkw",
  mixins: [mixins],
  components: {
    ACalendar: Calendar,
  },
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        fontContent: "Hello Word",
        showWld: false,
        scheduleType: "2",
        showSubordinate: false,
      },
      currentDate: "",
      selectYear: "",
      selectMonth: "",
      yearOptions: [2023, 2024, 2025, 2026, 2027, 2028, 2029],
      startTime: "", //面板开始时间
      endTime: "", //面板结束时间
      scheduleList: [], //当前面板的全部日程数据
      showScheduleList: [], //选择日期的日程数据
    };
  },
  props: {},
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.convertAttrToStyleObject();

    this.currentDate = moment();
    this.selectYear = moment().year();
    this.selectMonth = moment().month() + 1;
    // this.initYearList();
    // console.log('初始化');
    this.getData();

    window.reoladSchedule = this.reoladSchedule; //表单保存成功回调
  },
  mounted() {},
  destroyed() {},
  methods: {
    // 获取日历面板全部42天日期（moment数组）
    getAllPanelDays() {
      const panelMoment = this.currentDate.clone();
      // 当月1号
      const monthFirst = panelMoment.clone().startOf("month");
      // 找到当月1号所在周的周一（面板第一列是周一）
      let start = monthFirst.clone().weekday(0);

      // 循环42天（6行 ×7列）
      const allDays = [];
      for (let i = 0; i < 42; i++) {
        const day = start.clone().add(i, "day");
        allDays.push(day);
      }
      return allDays.map((m) => m.format("YYYY-MM-DD"));
    },
    reoladSchedule(){
      console.log('刷新日程');
      this.getData("refresh");
    },
    getData(type) {
      const panelStart = this.getAllPanelDays()[0];
      const panelEnd =
        this.getAllPanelDays()[this.getAllPanelDays().length - 1];
      if (
        type != "refresh" &&
        panelStart == this.startTime &&
        panelEnd == this.endTime
      ) {
        this.getCurSchedule();
        return;
      }
      this.startTime = panelStart;
      this.endTime = panelEnd;
      console.log("第一天：", panelStart, "----最后一天：", panelEnd);

      var params = {
        start: this.startTime,
        end: this.endTime,
        typeVal: "1",
        userIds: "",
        dateTyp: "2",
      };
      IDM.http
        .post("ctrl/scheduleList/queryData", params)
        .done((res) => {
          if (res.type == "success" && res.code == "200") {
            this.scheduleList = res.data || [];
            this.getCurSchedule();
          }
        })
        .catch((err) => {
          console.log(err);
        });

      // setTimeout(() => {
      //   var data = [
      //     {
      //       sourceId: "260624105158R4Gk32CW1JjGcm4PE1j",
      //       agendaType: "1",
      //       cuid: "2304262344149Udi66t0GHpPZLH2AN9",
      //       attendantsText: "",
      //       userName: "张捷飞",
      //       userId: "2304262344149Udi66t0GHpPZLH2AN9",
      //       url: "",
      //       remoteId: "",
      //       isJoin: "1",
      //       bt: "测试数据一",
      //       otherEndTimeAll: "2026-06-03 09:00:00",
      //       sourceModuleId: "",
      //       paType: "1",
      //       agendaTypeText: "普通日程",
      //       otherEndTime: "2026-06-02 09:00:01",
      //       isPublic: "1",
      //       startTime: "2026-06-01 08:30:00",
      //       id: "260624105158R4Gk32CW1JjGcm4PE1j",
      //       endTime: "2026-06-02 09:00:00",
      //       isFullday: "true",
      //       place: "市大数据中心",
      //       mobileUrl: "",
      //       sourceInfoId: "",
      //     },
      //     {
      //       sourceId: "260624105402g3hWWvXg0U1qtrFxJ8Q",
      //       agendaType: "1",
      //       cuid: "2304262344149Udi66t0GHpPZLH2AN9",
      //       attendantsText: "",
      //       userName: "张捷飞",
      //       userId: "2304262344149Udi66t0GHpPZLH2AN9",
      //       url: "",
      //       remoteId: "",
      //       isJoin: "1",
      //       bt: "日程事项",
      //       otherEndTimeAll: "2026-06-03 10:00:00",
      //       sourceModuleId: "",
      //       paType: "1",
      //       agendaTypeText: "普通日程",
      //       otherEndTime: "2026-06-02 10:00:01",
      //       isPublic: "1",
      //       startTime: "2026-06-01 09:30:00",
      //       id: "260624105402g3hWWvXg0U1qtrFxJ8Q",
      //       endTime: "2026-06-02 10:00:00",
      //       isFullday: "true",
      //       place: "大数据中心",
      //       mobileUrl: "",
      //       sourceInfoId: "",
      //     },
      //     {
      //       sourceId: "260624105402g3hWWvXg0U1qtrFxJ8Q",
      //       agendaType: "1",
      //       cuid: "2304262344149Udi66t0GHpPZLH2AN9",
      //       attendantsText: "",
      //       userName: "张捷飞",
      //       userId: "2304262344149Udi66t0GHpPZLH2AN9",
      //       url: "",
      //       remoteId: "",
      //       isJoin: "1",
      //       bt: "日程事项3333333",
      //       otherEndTimeAll: "2026-06-03 10:00:00",
      //       sourceModuleId: "",
      //       paType: "1",
      //       agendaTypeText: "普通日程",
      //       otherEndTime: "2026-06-02 10:00:01",
      //       isPublic: "1",
      //       startTime: "2026-06-25 09:30:00",
      //       id: "260624105402g3hWWvXg0U1qtrFxJ8Q11",
      //       endTime: "2026-06-26 10:00:00",
      //       isFullday: "true",
      //       place: "大数据中心2",
      //       mobileUrl: "",
      //       sourceInfoId: "",
      //     },
      //     {
      //       sourceId: "260624105402g3hWWvXg0U1qtrFxJ8Q",
      //       agendaType: "1",
      //       cuid: "2304262344149Udi66t0GHpPZLH2AN9",
      //       attendantsText: "",
      //       userName: "张捷飞",
      //       userId: "2304262344149Udi66t0GHpPZLH2AN9",
      //       url: "",
      //       remoteId: "",
      //       isJoin: "1",
      //       bt: "日程事项3333333",
      //       otherEndTimeAll: "2026-06-03 10:00:00",
      //       sourceModuleId: "",
      //       paType: "1",
      //       agendaTypeText: "普通日程",
      //       otherEndTime: "2026-06-02 10:00:01",
      //       isPublic: "1",
      //       startTime: "2026-06-26 09:30:00",
      //       id: "260624105402g3hWWvXg0U1qtrFxJ8Q11",
      //       endTime: "2026-06-26 10:00:00",
      //       isFullday: "true",
      //       place: "大数据中心333",
      //       mobileUrl: "",
      //       sourceInfoId: "",
      //     },
      //   ];
      //   this.scheduleList = data;
      //   this.getCurSchedule();
      // }, 400);
    },
    //获取当前显示的日程
    getCurSchedule() {
      this.showScheduleList = [];
      let date = this.currentDate; // 当前日期
      this.scheduleList.forEach((item) => {
        if (this.judgeDate(date, item.startTime, item.endTime)) {
          this.showScheduleList.push(item);
        }
      });
    },
    changeHandle(date) {
      // console.log('changeHandle: ' + date._d + "-------currentDate:  " + this.currentDate._d);
      // console.log('日期改变');
      this.getData();
    },
    // 生成年份下拉选项）
    initYearList() {
      // const cur = new Date().getFullYear();
      // for (let i = cur - 10; i <= cur + 10; i++) {
      //   this.yearOptions.push(i);
      // }
    },
    // 判断是否是今日
    isToday(date) {
      const today = moment();
      return date.isSame(today, "day");
    },
    // 判断是否是当前展示月份的日期
    isCurrentMonth(date) {
      if (!date || !date.isValid()) return false;
      return date.isSame(this.currentDate, "month");
    },
    // 切换年份
    handleYearChange(val) {
      this.currentDate = moment([val, this.selectMonth - 1, 1]);
      // console.log('切换年份');
      this.getData();
    },
    // 切换月份
    handleMonthChange(val) {
      this.currentDate = moment([this.selectYear, val - 1, 1]);
      // console.log('切换月份');
      this.getData();
    },
    // 返回今日
    backToToday() {
      const today = moment();
      this.currentDate = today;
      this.selectYear = today.year();
      this.selectMonth = today.month() + 1;
      // console.log('返回今日');
      this.getData();
    },
    // 获取公历文本
    getShowDate(date) {
      return date.date();
    },
    // 获取农历 / 节假日文本
    getLunarOrHoliday(date) {
      const year = date.year();
      const month = date.month() + 1;
      const day = date.date();
      if (!year || !month || !day) {
        return "";
      }
      let obj = LunarCalendar.solarToLunar(year, month, day);
      return obj.lunarFestival || obj.lunarDayName;
    },
    // 判断当天是否有日程
    hasSchedule(date) {
      var ishas = false;
      this.scheduleList.forEach((item) => {
        if (this.judgeDate(date, item.startTime, item.endTime)) {
          ishas = true;
        }
      });
      return ishas;
    },
    // 点击日期
    clickCell(date) {
      this.selectYear = date.year();
      this.selectMonth = date.month() + 1;
    },
    //新增
    addHandle() {
      var url = IDM.url.getWebPath(
        "ctrl/formControl/form?moduleId=180719094152MnF6C2hEPtqIvhjJIxo"
      );
      // IDM.layer.open({
      //   type: 2,
      //   title: ["新增日程", "font-size:18px;"],
      //   area: ["1200px", "90%"],
      //   content: url,
      //   success: (layero, index) => {
      //     top.close = () => {
      //       IDM.layer.close(index);
      //       this.getData("refresh");
      //     };
      //   },
      //   end: () => {
      //     this.getData("refresh");
      //   },
      // });
      var maxHeight = $(top.window).height() - 100;
      window.openWinView(this, {"url": url,"area":"1000,"+maxHeight+""});
    },
    //更多跳转
    openMore() {
      let url = "/ctrl/portal/index?tId=180716195406IobKjqrskQLve0Pxjyc";
      let name = "我的日程";
      var targetObj = {
        action: IDM.url.getWebPath(url),
        isTabReload: "-1",
        name: name,
        target: "main",
        parentName: "",
      };
      top.window.$$iframeCtrl.addTab(targetObj);
    },
    formatDate(year, month, day) {
      // 月份和日期补零（确保两位数）
      month = String(month).padStart(2, "0"); // 月份从0开始，需+1
      day = String(day).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    //判断当前格子的日期是否有日程数据
    judgeDate(date, startTime, endTime) {
      const year = date.year();
      const month = date.month() + 1;
      const day = date.date();
      const fullDate = this.formatDate(year, month, day);
      startTime = startTime.split(" ")[0];
      endTime = endTime.split(" ")[0];
      if (
        new Date(fullDate).getTime() >= new Date(startTime).getTime() &&
        new Date(fullDate).getTime() <= new Date(endTime).getTime()
      ) {
        return true;
      }
      return false;
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.convertAttrToStyleObject();
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
      this.getData();
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
        var dataObject = {
          IDM: window.IDM,
        };
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
      // 配置了刷新KEY，消息类型是websocket，收到的消息对象有message并不为空
      if (
        this.propData.messageRefreshKey &&
        this.propData.messageRefreshKey.length &&
        object.type === "websocket" &&
        object.message
      ) {
        const messageData =
          (typeof object.message === "string" && JSON.parse(object.message)) ||
          object.message;
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
<style lang="scss" scoped>
.idm-my-schedule-skw {
  height: 100%;
  background: #ffffff;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  .my-schedule-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #999;
    font-size: 18px;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 10px;
    height: 48px;
    .tabs {
      height: 100%;
      display: flex;
      align-items: flex-end;
      margin-bottom: -2px;
      span {
        padding-bottom: 10px;
        font-weight: 600;
        margin-right: 30px;
        color: #333;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        &.active {
          color: rgba(0, 115, 202, 1);
          border-bottom: 2px solid rgba(0, 115, 202, 1);
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      height: 100%;
    }
    .more {
      font-size: 14px;
      margin-left: 10px;
      margin-right: 15px;
      cursor: pointer;
    }
    .add {
      padding: 5px;
      cursor: pointer;
    }
    .addBtn {
      background: #0073ca;
      border-radius: 4px;
      padding: 5px 10px;
      font-size: 16px;
      color: #fff;
      cursor: pointer;
    }
  }
  .my-schedule-content {
    padding: 0 1px;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .empty {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    ::v-deep .custom-calendar {
      .ant-fullcalendar-header {
        display: none;
      }
      .cal-header-custom {
        .week-row {
          display: flex;
          .week-item {
            flex: 1;
            text-align: center;
            border: 1px solid #ddd;
            padding: 3px 0;
            margin-left: -1px;
            font-size: 14px;
            background: #e4f3ff;
            color: #3389e0;
          }
        }
      }
      .ant-fullcalendar {
        margin-top: -1px;
        margin-left: -1px;
        table {
          height: auto;
        }
      }
      .ant-fullcalendar-calendar-body {
        padding: 0;
      }
      .ant-fullcalendar-table {
        width: 100%;
        table-layout: fixed;
        thead {
          display: none;
        }
        tbody {
          td {
            border: 1px solid #ddd;
            padding: 0;
          }
        }
        .cell-box {
          width: 100%;
          height: 100%;
          padding: 2px;
          text-align: center;
          cursor: pointer;
          position: relative;
          .day-num {
            font-size: 14px;
            font-weight: 500;
            border-radius: 100%;
            line-height: 1.2;
          }
          .sub-text {
            font-size: 10px;
            color: #999;
          }
          /* 日程 */
          .schedule-dot {
            position: absolute;
            top: 3px;
            right: 6px;
            width: 6px;
            height: 6px;
            background: #ffc53d;
            border-radius: 50%;
          }
        }

        /* 当天 */
        .today {
          // background: #dceefb;
        }

        /* 非当月 */
        .otherMonth {
          background: #f3f3f3;
        }
        /* 选择 */
        .ant-fullcalendar-selected-day .cell-box {
          background: #dceefb;
        }
      }
    }
    .schedule-list {
      flex: 1;
      overflow: hidden;
      .row {
        padding: 5px 0;
        border-bottom: 1px dashed #ddd;
        .item {
          border-left: 3px solid #0073ca;
          font-size: 14px;
          padding-left: 10px;
        }
        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .address {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 15px;
            text-align: right;
          }
        }
        .bt {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 3px;
        }
      }
    }
  }
  .calendar-toolbar {
    display: flex;
    align-items: center;
    justify-content: center;
    .backToday {
      background-color: #0073ca;
      border-color: #0073ca;
      width: 50px;
      padding: 5px 0;
    }
  }
}
</style>
