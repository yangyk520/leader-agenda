<template>
  <div class="agenda-header-main">
    <div class="agenda-header-main-top flex_between">
      <div class="top-tit">
        <span class="top-tit-icon"><svg-icon icon-class="agenda" /></span>
        <span>{{ curYearAndMonth }}</span>
      </div>
      <div class="top-calendar">
        <!-- 上移 -->
        <div class="calendar-arrow arrow-left" @click="calendarToggle('left')">
          <svg-icon iconClass="rectangle_left"></svg-icon>
        </div>
        <div class="calendar-container">
          <div class="calendar-container-day" v-if="timeViewType === 'day'">
            <span>{{ curMonthAndDay }} ({{ curWeek }})</span>
          </div>
          <div class="calendar-container-week" v-if="timeViewType === 'week' && weekList.length > 0" >
            <span >{{ weekList[0].monthAndDay }} -
              {{ weekList[weekList.length - 1].monthAndDay }}
            </span>
          </div>
        </div>
        <!-- 下移 -->
        <div class="calendar-arrow arrow-left" @click="calendarToggle('right')">
          <svg-icon iconClass="rectangle_right"></svg-icon>
        </div>
        <span class="calendar-btn" @click="curDayWeekHandle">{{timeViewType === 'day'?'今天':'本周'}}</span>
      </div>
      <div class="top-view">
        <template>
          <div class="top_right flex_end">
            <div class="date_box">
              <a-week-picker v-model="select_week" placeholder="请选择" @change="onChangeDate" :locale="locale" />
            </div>
            <div class="operate_block">
              <a-button @click="exportData()" :loading="exportData_loading" type="primary">
                导出
              </a-button>
              <a-button v-if="viewModel==2" @click="handleSubmitRemark"  type="primary">
                保存备注
              </a-button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default {
  name: "AgendaHeader",
  props: {
    // 默认类型 日/周
    scheduleType: {
      type: Number,
      default: 0,
    },
    moduleObject: {
      type: Object,
      default() {
        return {};
      },
    },
    viewModel: {
      type: String,
      default: '1',// 1标识预览
    },
    publickStatus: {
      type: Number,
      default: 0 // 0标识未发布
    }
  },
  data() {
    return {
      locale,
      // 时间视图
      timeViewType: "week",
      // 今天
      today: "",
      // 当前日期
      curDate: "",
      // 当前月日
      curMonthAndDay: "",
      // 当前周
      curWeek: "",
      // 当前年月
      curYearAndMonth: "",
      // 周开始日期
      weekStart: "",
      // 一周数据
      weekList: [],
      // 周几中文
      weekCn: ["一", "二", "三", "四", "五", "六", "日"],
      // 搜索项
      searchVal: "",
      // 领导列表
      leaderList: [],
      selectedUser: '',
      save_loading: false,
      release_loading: false,
      unRelease_loading: false,
      exportData_loading: false,
      select_week: ''
    };
  },
  watch: {
    
  },
  created() {
    this.initTime(moment());
  },
  methods: {
    onChangeDate(e,dateString) {
      if(!e) {
        return
      }
      let weekList = [];
      for(let i = 1;i < 8;i++) {
        weekList.push({
          date: moment(e).day(i).format('YYYY-MM-DD'),
          monthAndDay: moment(e).day(i).format('MM月DD日')
        })
      }
      this.weekList = JSON.parse(JSON.stringify(weekList));
      console.log('weekList',weekList);
      this.sendHeadParams()
    },
    getRecord() {
      this.$emit('getRecord')
    },
    exportData() {
      this.$emit('exportData')
    },
    save() {
      this.$emit('save')
    },
    handleChange(e) {
      this.sendHeadParams()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    /**
     * 今天、本周切换
     */
    curDayWeekHandle(){
      this.select_week = '';
      this.initTime(moment());
    },
    /**
     * 导出
     */
    handleExport() {
      const params = {
        startDate:
          this.timeViewType === "day" ? this.curDate : this.weekList[0].date,
        endDate:
          this.timeViewType === "day"
            ? this.curDate
            : this.weekList[this.weekList.length - 1].date,
      };
      
      const url = (this.props.exportDataUrl || 'ctrl/leader/listExport' )+ `?startDate=${params.startDate}&endDate=${params.endDate}&userIds=${params.leaders}&content=${params.content}`;

      const a = document.createElement("a");
      a.style.display = "none";
      a.setAttribute("target", "_blank");
      a.href = IDM.url.getWebPath(url);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },

    handleSubmitRemark(){
      this.$emit("handleSubmitRemark")
    },
    /**
     * 向父组件发送参数
     */
    sendHeadParams() {
      const params = {
        weekList: this.weekList
      };
      params.dates = this.weekList.map((item) => item.date).join(",");
      if (!params.dates) {
        return
      }
      this.$emit("updateHeadParams", params);
    },
    /**
     * 初始化时间数据
     */
    initTime(today) {
      // 天数据
      this.curDate = today.format("YYYY-MM-DD");
      this.curMonthAndDay = today.format("MM月DD日");
      this.curWeek = "周" + this.weekCn[today.isoWeekday() - 1];
      this.curYearAndMonth = today.format("YYYY年MM月");
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
      this.weekStart = weekStart.format("YYYY-MM-DD");
      this.sendHeadParams();
    },
    /**
     * 日历切换
     */
    calendarToggle(type) {
      this.select_week = '';
      if (type === "left") {
        if (this.timeViewType === "day") {
          this.initTime(moment(this.curDate, "YYYY-MM-DD").subtract(1, "day"));
        } else {
          this.initTime(
            moment(this.weekStart, "YYYY-MM-DD").subtract(1, "isoWeek")
          );
        }
      } else {
        if (this.timeViewType === "day") {
          this.initTime(moment(this.curDate, "YYYY-MM-DD").subtract(-1, "day"));
        } else {
          this.initTime(
            moment(this.weekStart, "YYYY-MM-DD").subtract(-1, "isoWeek")
          );
        }
      }
      // this.sendHeadParams();
    },
  },
};
</script>
<style scoped lang="scss">
.agenda-header-main {
  font-size: 16px;
  color: #333333;

  .agenda-header-main-top {
    height: 50px;
    margin-bottom: 20px;
    font-size: 16px;
    color: #333333;
    font-weight: 500;
    user-select: none;

    .top-tit {
      display: flex;
      align-items: center;
      .top-tit-icon {
        font-size: 28px;
        color: #0086d9;

        .svg-icon {
          margin-right: 18px;
        }
      }
    }

    .top-calendar {
      display: flex;
      .calendar-arrow {
        color: #0086D9;
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
          color: #0086D9;
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
        font-size: 12px;
        cursor: pointer;
        // position: absolute;
        // right: -46px;
        // top: -2px;
      }
    }
  }
  .operate_block{
    .ant-btn{
      margin-left: 10px;
    }
    .ant-btn-primary:focus{
      background-color: #1890ff;
      border-color: #1890ff;
    }
  }
}
</style>
