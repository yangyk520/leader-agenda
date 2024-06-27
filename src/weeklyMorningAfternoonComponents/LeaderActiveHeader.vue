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
          <div class="calendar-container-week" v-if="weekList.length > 0" >
            <span >{{ weekList[0].monthAndDay }} - {{ weekList[weekList.length - 1].monthAndDay }}</span >
            <span>(第{{ weeksInYear }}周)</span>
          </div>
        </div>
        <!-- 下移 -->
        <div class="calendar-arrow arrow-left" @click="calendarToggle('right')">
          <svg-icon iconClass="rectangle_right"></svg-icon>
        </div>
        <span class="calendar-btn" @click="curDayWeekHandle">{{'本周'}}</span>
      </div>
      <div class="top-view">
        <div class="top_right flex_end">
          <div class="operate_block">
            <a-button @click="exportData()" :loading="exportData_loading" type="primary">
              导出
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "AgendaHeader",
  props: {
    moduleObject: {
      type: Object,
      default() {
        return {};
      },
    }
  },
  data() {
    return {
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
      // 第几周
      weeksInYear: "",
     
      exportData_loading: false
    };
  },
  watch: {
    
  },
  created() {
    this.initTime(moment());
  },
  methods: {
    changeButtonLoadingStatus(key,status) {
      this.$set(this.$data,key,status)
    },
    exportData() {
      this.$emit('exportData')
    },
    /**
     * 今天、本周切换
     */
    curDayWeekHandle(){
      this.initTime(moment());
      // this.sendHeadParams();
    },
    /**
     * 导出
     */
    handleExport() {
      const params = {
        startDate: this.weekList[0].date,
        endDate: this.weekList[this.weekList.length - 1].date,
      };
      
      const url = `ctrl/leader/listExport?startDate=${params.startDate}&endDate=${params.endDate}&userIds=${params.leaders}&content=${params.content}`;

      const a = document.createElement("a");
      a.style.display = "none";
      a.setAttribute("target", "_blank");
      a.href = IDM.url.getWebPath(url);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    /**
     * 向父组件发送参数
     */
    sendHeadParams() {
      const params = {
        leaders: "",
        weekList: this.weekList
      };
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
      this.weeksInYear = weekStart.isoWeeks();
      this.weekStart = weekStart.format("YYYY-MM-DD");
      this.sendHeadParams();
    },
    /**
     * 日历切换
     */
    calendarToggle(type) {
      if (type === "left") {
        this.initTime( moment(this.weekStart, "YYYY-MM-DD").subtract(1, "isoWeek") );
      } else {
        this.initTime( moment(this.weekStart, "YYYY-MM-DD").subtract(-1, "isoWeek") );
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

    .top-view {
      span {
        width: 60px;
        display: inline-block;
        border: 1px solid rgba(204, 204, 204, 1);
        border-radius: 4px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;

        &:first-child {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
        &:last-child {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border-left: 0;
        }

        &.active {
          background: #0086d9;
          border-color: #0086d9;
          color: #fff;
        }
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
      font-size: 12px;
      cursor: pointer;

      &.primary {
        background: #0086d9;
        border-color: #0086d9;
        color: #fff;
      }
    }
    .operation-leader {
      display: flex;
      font-size: 14px;
      align-items: center;
      flex: 1;
      padding-left: 16px;

      .leader-container {
        display: flex;

        .leader-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 52px;
          &.checked {
            .leader-item-photh {
              position: relative;

              .leader-checked {
                position: absolute;
                top: -10px;
                right: -10px;
                color: #0086D9;
                font-size: 12px;
              }
              img {
                border: #0086D9 1px solid;
                border-radius: 4px;
              }
            }
          }
          &.hidePhoto {
            width: auto;
            .leader-item-photh {
              display: none;
            }
            span {
              padding: 2px 12px;
              background-color: #eee;
              border-radius: 2px;
              margin-right: 8px;
              border: 1px solid transparent;
            }

            &.checked {
              span {
                border: 1px solid rgba(0, 134, 217, 1);
                color: #0086D9;
              }
            }
          }
          .leader-item-photh {
            width: 28px;
            height: 28px;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 4px;

            img {
              width: 100%;
              height: 100%;
              vertical-align: baseline;
              border: transparent 1px solid;
              object-fit: cover;
            }
            .avatar-empty {
              width: 100%;
              height: 100%;
              background: #0086d9;
              text-align: center;
              color: #fff;
              font-size: 12px;
              line-height: 28px;
              border-radius: 4px;
            }
          }

          span {
            display: inline-block;
            white-space: nowrap;
            text-align: center;
          }
        }
      }
    }

    .operation-setting {
      font-size: 18px;
      color: #666666;
      margin-left: 24px;
      cursor: pointer;
      .svg-icon {
        vertical-align: -0.24em;
      }
    }
  }
  .operate_block{
    .ant-btn{
      margin-left: 10px;
    }
    .ant-btn-primary{
      background-color: #0086d9;
      border-color: #0086d9;
    }
    .ant-btn-primary:focus{
      background-color: #0086d9;
      border-color: #0086d9;
    }
  }
}
</style>
