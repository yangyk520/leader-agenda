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
          <div class="calendar-container-week">
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
        <span class="calendar-btn" @click="curDayWeekHandle">本周</span>
      </div>
      <div class="top-view">
        <!-- <span
          v-if="showLeader"
          :class="{ active: timeViewType === 'leader' }"
          @click="timeViewToggle('leader')"
          >领导</span
        > -->
        <span
          :class="{ active: timeViewType === 'unit' }"
          @click="timeViewToggle('unit')"
          >部门</span
        >
        <span
          :class="{ active: timeViewType === 'person' }"
          @click="timeViewToggle('person')"
          >个人</span
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
      <div class="operation-btns">
        <span class="operation-btn primary" @click="handleAdd" v-if="showAddBtn || timeViewType === 'person'"
          >新增</span
        >
        <span class="operation-btn" @click="handleExport">导出</span>
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
    },
    activeDepart: {
      type: String,
      default: "",
    },
    activeUser: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 时间视图
      timeViewType: "unit",
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
      showLeader: false, //是否显示领导
      showAddBtn: true, //是否显示新增按钮
    };
  },
  watch: {},
  created() {
    //领导日程需展示的部门ID
    if (
      IDM.url.queryString("tswLeaderDeptId") ==
      "240228110905cCi7EaR0bC99sbnGQyP"
    ) {
      console.log("显示领导");
      this.showLeader = true;
    }
    //团市委加新增按钮权限控制
    if (IDM.url.queryString("tswUnitId") == "230426153026kSH07mN5WNg3grdZw65") {
      IDM.http
        .get("ctrl/tswCustom/getUserRoles")
        .done((res) => {
          if (res.type == "success" && res.code == "200") {
            this.showAddBtn = res.data.isDeptScheduleAdmin;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    this.initTime(moment());
    this.sendHeadParams();
  },
  methods: {
    /**
     * 今天、本周切换
     */
    curDayWeekHandle() {
      this.initTime(moment());
      this.sendHeadParams();
    },
    /**
     * 头像
     */
    getUserPhoto(item) {
      if (item.photo) {
        return IDM.url.getWebPath(item.photo);
      } else {
        return IDM.url.getModuleAssetsWebPath(
          require(`../assets/default_${item.sex ? "girl" : "boy"}.png`),
          this.moduleObject
        );
      }
    },
    /**
     * 导出
     */
    handleExport() {
      const params = {
        startTime: this.weekList[0].date,
        endTime: this.weekList[this.weekList.length - 1].date,
        searchText: this.searchVal,
        deptId: this.activeDepart,
        userId: this.timeViewType === "person" ? this.activeUser : "",
      };
      const url = `ctrl/deptScheduleList/exportWeekData?${IDM.url.stringify(
        params
      )}`;

      const a = document.createElement("a");
      a.style.display = "none";
      a.setAttribute("target", "_blank");
      a.setAttribute("download", IDM.url.getWebPath(url));
      a.href = IDM.url.getWebPath(url);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    /**
     * 新增
     */
    handleAdd() {
      IDM.layer.open({
        type: 2,
        title: ["新增日程", "font-size:18px;"],
        area: ["1200px", "90%"],
        content: IDM.url.getWebPath(
          "ctrl/formControl/form?moduleId=180719094152MnF6C2hEPtqIvhjJIxo&editType=" +
            this.timeViewType
        ),
        success: (layero, index) => {
          top.close = () => {
            IDM.layer.close(index);
            this.sendHeadParams();
          };
        },
        end: () => {
          this.sendHeadParams();
        },
      });
    },
    /**
     * 向父组件发送参数
     */
    sendHeadParams() {
      const params = {
        timeViewType: this.timeViewType,
        searchVal: this.searchVal,
      };
      params.dates = this.weekList.map((item) => item.date).join(",");
      this.$emit("updateHeadParams", params);
    },
    /**
     * 搜索
     */
    hanldeSearch() {
      this.sendHeadParams();
    },
    /**
     * 重置
     */
    hanldeReset() {
      this.searchVal = "";
      this.sendHeadParams();
    },
    /**
     * 时间视图切换
     */
    timeViewToggle(type) {
      this.timeViewType = type;
      this.sendHeadParams();
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
    },
    /**
     * 日历切换
     */
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
      this.sendHeadParams();
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
    height: 50px;

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
