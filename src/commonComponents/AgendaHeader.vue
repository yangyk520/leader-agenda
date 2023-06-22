<template>
  <div class="agenda-header-main">
    <div class="agenda-header-main-top">
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
          <div
            class="calendar-container-week"
            v-if="timeViewType === 'week' && weekList.length > 0"
          >
            <span
              >{{ weekList[0].monthAndDay }} -
              {{ weekList[weekList.length - 1].monthAndDay }}</span
            >
            <span>(第{{ weeksInYear }}周)</span>
          </div>
        </div>
        <!-- 下移 -->
        <div class="calendar-arrow arrow-left" @click="calendarToggle('right')">
          <svg-icon iconClass="rectangle_right"></svg-icon>
        </div>
      </div>
      <div class="top-view">
        <span
          :class="{ active: timeViewType === 'day' }"
          @click="timeViewToggle('day')"
          >日</span
        >
        <span
          :class="{ active: timeViewType === 'week' }"
          @click="timeViewToggle('week')"
          >周</span
        >
      </div>
    </div>
    <div class="agenda-header-main-operation">
      <div class="operation-search">
        <a-input ref="userNameInput" v-model="searchVal" style="width: 206px">
          <svg-icon slot="suffix" icon-class="search" />
        </a-input>
        <span class="operation-btn primary" @click="hanldeSearch">检索</span>
        <span class="operation-btn" @click="hanldeReset">重置</span>
      </div>
      <div class="operation-leader">
        <a-checkbox v-model="onlyView" @change="handleChange">
          只看
        </a-checkbox>
        <div class="leader-container">
          <div class="leader-item" v-for="(leader, l) in leaderList" :key="l">
            <div class="leader-item-photh">
              <img
                v-if="leader.photoPath"
                :src="IDM.url.getWebPath(item.photoPath)"
              />
              <div v-else class="avatar-empty">
                <span>{{ leader.userName.slice(leader.userName.length - 2) }}</span>
              </div>
            </div>
            <span>{{ leader.userName }}</span>
          </div>
          <div class="leader-item">
            <div class="leader-item-add"><svg-icon icon-class="add" /></div>
          </div>
        </div>
      </div>
      <div class="operation-btns">
        <span class="operation-btn primary">新增</span>
        <span class="operation-btn">发布</span>
        <span class="operation-btn">导出</span>
        <span class="operation-setting"><svg-icon icon-class="setting" /></span>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "AgendaHeader",
  data() {
    return {
      // 时间视图
      timeViewType: "day",
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
      // 搜索项
      searchVal: "",
      // 只看复选框
      onlyView: true,
      // 领导列表
      leaderList: [
        {
          userName: "张三",
          userId: "101",
          phothPath: "",
        },
        {
          userName: "李四",
          userId: "102",
          phothPath: "",
        },
        {
          userName: "王五",
          userId: "103",
          phothPath: "",
        },
        {
          userName: "赵六",
          userId: "104",
          phothPath: "",
        },
        {
          userName: "钱七七",
          userId: "105",
          phothPath: "",
        },
      ],
    };
  },
  created() {
    this.initTime(moment());
  },
  methods: {
    /**
     * 搜索
     */
    hanldeSearch() {},
    /**
     * 重置
     */
    hanldeReset() {
      this.searchVal = "";
    },
    /**
     * 只看复选框切换
     */
    handleChange() {},
    /**
     * 时间视图切换
     */
    timeViewToggle(type) {
      this.timeViewType = type;
    },
    /**
     * 初始化时间数据
     */
    initTime(today) {
      // 天数据
      this.curDate = today.format("YYYY-MM-DD");
      this.curMonthAndDay = today.format("MM月DD日");
      console.log(this.curDate);
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
    },
    /**
     * 日历切换
     */
    calendarToggle(type) {
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
    },
  },
};
</script>
<style scoped lang="scss">
.agenda-header-main {
  font-size: 16px;
  color: #333333;

  .agenda-header-main-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    color: #333333;
    font-weight: 500;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
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
        color: #0080ff;
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin: 0 16px;
      }
      .calendar-container {
        .calendar-container-day,
        .calendar-container-week {
          color: #0080ff;

          span:nth-child(2) {
            color: #333;
            margin-left: 16px;
          }
        }
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

      .leader-container {
        display: flex;

        .leader-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 52px;
          .leader-item-photh {
            width: 28px;
            height: 28px;
            overflow: hidden;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 4px;
            img {
              width: 100%;
              height: 100%;
              vertical-align: baseline;
            }
            .avatar-empty {
              width: 100%;
              height: 100%;
              background: #0086D9;
              text-align: center;
              color: #fff;
              font-size: 12px;
              line-height: 28px;
            }
          }
          .leader-item-add {
            border: 1px solid rgba(204,204,204,1);
            border-radius: 2px;
            width: 28px;
            height: 28px;
            text-align: center;
            line-height: 26px;
            color: #999;
            cursor: pointer;
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
}
</style>
