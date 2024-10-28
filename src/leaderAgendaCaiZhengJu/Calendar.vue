<template>
  <div class="calendar-outer">
    <div class="header">
      <div class="year">
        <span @click="changeHanlde('y', -1)"
          ><svg-icon iconClass="left"></svg-icon
        ></span>
        <span>{{ nowYear }}年</span>
        <span @click="changeHanlde('y', 1)"
          ><svg-icon iconClass="right"></svg-icon
        ></span>
      </div>
      <div class="month">
        <span @click="changeHanlde('M', -1)"
          ><svg-icon iconClass="left"></svg-icon
        ></span>
        <span>{{ nowMonth }}月</span>
        <span @click="changeHanlde('M', 1)"
          ><svg-icon iconClass="right"></svg-icon
        ></span>
      </div>
    </div>
    <div class="container">
      <div class="week-bar">
        <div class="week-item" v-for="(week, wi) in weeks" :key="wi">
          {{ week }}
        </div>
      </div>
      <div
        class="calendar-row"
        v-for="(week, wi) in dayOfMonthList"
        :key="wi"
        :class="{
          close: timeViewType !== 'week',
          active: week.weekNum === nowWeek,
        }"
        @click="rowHandle(week)"
      >
        <div
          class="calendar-item"
          v-for="(day, di) in week.list"
          :key="di"
          :class="{
            isMonth: day.isMonth,
            close: timeViewType !== 'day',
            active: day.date === selectDate,
          }"
          @click="dayHandle(day)"
        >
          {{ day.day }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
export default {
  name: "Calendar",
  data() {
    return {
      weeks: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      nowYear: "",
      nowMonth: "",
      nowWeek: "",
      selectDate: "",
      timeViewType: "week",
      dayOfMonthList:[]
    };
  },
  created() {
    this.initDate();
    this.initDayOfMonthList();

    this.$eventBus.$on("updateHeadParams", (params) => {
      this.timeViewType = params.timeViewType;
      if(params.timeViewType==='day'){
        this.initDate(moment(params.dates, "YYYY-MM-DD"));
      }else{
        const dates = params.dates.split(",")
        this.initDate(moment(dates[3], "YYYY-MM-DD"));
      }
      this.initDayOfMonthList();
    });
  },
  methods: {
    dayHandle(day) {
      if (this.timeViewType !== "day") {
        return;
      }
      this.initDate(moment(day.date, "YYYY-MM-DD"));
      !day.isMonth && this.initDayOfMonthList();

      this.$eventBus.$emit("updateDate",day.date)
    },
    rowHandle(week) {
      if (this.timeViewType !== "week") {
        return;
      }
      this.initDate(moment(week.list[3].date, "YYYY-MM-DD"));
      !week.list[3].isMonth && this.initDayOfMonthList();

      this.$eventBus.$emit("updateDate",week.list.map(item => item.date).join(","))
    },
    changeHanlde() {
      this.initDate(
        moment(this.selectDate, "YYYY-MM-DD").add(arguments[1], arguments[0])
      );
      this.initDayOfMonthList();

      if (this.timeViewType === "week") {
        this.dayOfMonthList.forEach(week => {
          if(week.weekNum === this.nowWeek){
            this.$eventBus.$emit("updateDate",week.list.map(item => item.date).join(","))
          }
        })
      }else{
        this.$eventBus.$emit("updateDate",this.selectDate)
      }
    },
    initDate(date) {
      date = date || moment();
      this.nowYear = date.get("year");
      this.nowMonth = date.get("month") + 1;
      this.nowWeek = date.isoWeeks();
      this.selectDate = date.format("YYYY-MM-DD");
    },
    initDayOfMonthList() {
      // 当前选择日期本月第一天
      let startOfMonth = moment(this.selectDate, "YYYY-MM-DD").startOf("month");
      // 本月第一天其本周的第一天
      let startOfWeek = moment(startOfMonth, "YYYY-MM-DD").startOf("isoWeek");

      this.dayOfMonthList = [];
      for (let i = 0; i < 6; i++) {
        const weekList = { weekNum: startOfWeek.isoWeeks(), list: [] };
        for (var j = 0; j < 7; ++j) {
          weekList.list.push({
            date: startOfWeek.format("YYYY-MM-DD"),
            day: startOfWeek.get("date"),
            isMonth: startOfWeek.get("month") + 1 === this.nowMonth
          });
          startOfWeek = startOfWeek.add(1, "day").clone();
        }
        this.dayOfMonthList.push(weekList);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.calendar-outer {
  width: 300px;
  flex-shrink: 0;
  border: 1px solid rgb(230, 230, 230);
  margin-right: 14px;
  padding: 10px;
  user-select: none;
  .header {
    display: flex;
    justify-content: space-around;
    font-size: 16px;
    border-bottom: 1px solid rgb(230, 230, 230);
    padding-bottom: 4px;
    margin-bottom: 10px;
    .svg-icon {
      cursor: pointer;
      font-size: 18px;
      color: #666;
    }
  }
  .container {
    .week-bar {
      display: flex;
      .week-item {
        flex: 1;
        text-align: center;
        color: #666;
      }
    }
    .calendar-row {
      display: flex;
      &.close {
        background-color: transparent !important;
        font-weight: normal !important;
      }
      &:hover {
        background-color: #e6f7ff;
      }
      &.active {
        background-color: #bae7ff;
        font-weight: bold;
      }
      .calendar-item {
        flex: 1;
        text-align: center;
        height: 40px;
        line-height: 40px;
        color: #999;
        cursor: pointer;
        &.isMonth {
          color: #333;
        }
        &.close {
          background-color: transparent !important;
        }
        &:hover {
          background-color: #e6f7ff;
        }
        &.active {
          background-color: #bae7ff;
          font-weight: 700;
        }
      }
    }
  }
}
</style>
