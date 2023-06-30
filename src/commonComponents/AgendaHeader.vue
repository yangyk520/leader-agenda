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
      <div class="operation-leader" v-if="viewModel == 1">
        <a-checkbox v-model="onlyView" @change="handleChange">
          只看
        </a-checkbox>
        <div class="leader-container" v-if="onlyView">
          <div
            class="leader-item"
            :class="{
              hidePhoto: leaderImageShow == 1,
              checked: leader.checked,
            }"
            v-for="(leader, l) in leaderList"
            :key="l"
            @click="handleLeaderClick(leader)"
          >
            <div class="leader-item-photh">
              <img :src="getUserPhoto(leader)" />
              <span class="leader-checked" v-show="leader.checked"
                ><svg-icon icon-class="checked"
              /></span>
            </div>
            <span>{{ leader.name }}</span>
          </div>
        </div>
      </div>
      <div class="operation-btns">
        <span class="operation-btn primary" @click="handleAdd" v-if="!isPreview"
          >新增</span
        >
        <a-popconfirm
          placement="left"
          ok-text="是"
          cancel-text="否"
          @confirm="handlePublic"
          v-if="!isPreview"
        >
          <template slot="title">确认发布？</template>
          <span class="operation-btn">发布</span>
        </a-popconfirm>

        <span class="operation-btn" @click="handleExport">导出</span>
        <span class="operation-setting" @click="handleSetting"
          ><svg-icon icon-class="setting"
        /></span>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "AgendaHeader",
  props: {
    // 预览状态
    isPreview: {
      type: Boolean,
      default: true,
    },
    // 是否展示领导头像
    leaderImageShow: {
      type: Number,
      default: 2,
    },
    // 显示模式 视图/列表
    viewModel: {
      type: Number,
      default: 1,
    },
    // 默认类型 日/周
    scheduleType: {
      type: Number,
      default: 1,
    },
    moduleObject: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      defaultTimeViewType:"",
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
      onlyView: false,
      // 领导列表
      leaderList: [],
    };
  },
  watch: {
    scheduleType: {
      handler: function (newVal) {
        console.log(newVal,1111111111)
        if(!this.defaultTimeViewType){
          this.defaultTimeViewType = newVal == '1' ? 'day' : 'week';
          this.timeViewType = this.defaultTimeViewType;
          this.sendHeadParams();
        }
      },
      deep: true,
    },
  },
  created() {
    this.getLeaderList();
    this.initTime(moment());
  },
  methods: {
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
     * 领导选中
     */
    handleLeaderClick(item) {
      item.checked = !item.checked;
      this.sendHeadParams();
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
        content: this.searchVal,
      };
      if (this.onlyView) {
        const leaders = [];
        this.leaderList.forEach((item) => {
          if (item.checked) leaders.push(item.id);
        });
        params.leaders = leaders.join(",");
      } else {
        params.leaders = this.leaderList.map((item) => item.id).join(",");
      }
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
     * 新增
     */
    handleAdd() {
      IDM.layer.open({
        type: 2,
        title: ["单位领导活动", "font-size:18px;"],
        area: ["1200px", "90%"],
        content: IDM.url.getWebPath(
          "ctrl/formControl/sysForm?moduleId=190620095151CIhXzAd3d2P12JrbQcn&formId=230620171614b9GcqFpATxmSYfCoTuq&nodeId=0"
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
     * 发布
     */
    handlePublic() {
      IDM.http
        .get("/ctrl/leaderScheduleApi/batchPush", {
          startDate:
            this.timeViewType === "day" ? this.curDate : this.weekList[0].date,
          endDate:
            this.timeViewType === "day"
              ? this.curDate
              : this.weekList[this.weekList.length - 1].date,
        })
        .done((d) => {
          if (d.code == "200") {
            IDM.message.success("发布成功");
            this.sendHeadParams();
          } else {
            IDM.message.warning("发布失败");
          }
        })
        .error((response) => {
          console.log("请求失败", response);
          IDM.message.warning("发布失败");
        })
        .always((res) => {});
    },
    /**
     * 请求领导列表
     */
    getLeaderList() {
      IDM.http
        .get("/ctrl/leaderScheduleApi/getLeaderUserInfoForMobile")
        .done((d) => {
          if (d.code == "200" && d.data) {
            this.leaderList = d.data.map((item) => {
              return {
                ...item,
                checked: false,
              };
            });
          }
        })
        .error((response) => {
          console.log("领导请求失败", response);
          this.leaderList = [];
        })
        .always((res) => {});
    },
    /**
     * 设置按钮
     */
    handleSetting() {
      let that = this;
      //组件内调用
      const controlSetPanelId = IDM.broadcast.openControlSetPanel({
        //如果要想打开IDM内置的控制中心，则此处url必须为空。
        url: IDM.url.getContextWebUrl(
          "p1000/idm/index.html#/preview/230625182026UjkhYa6n1x36dkUpPIw"
        ),
        param: {
          marketModuleId: this.moduleObject.comId,
          pageId: IDM.broadcast.pageModule.id,
          packageid: this.moduleObject.packageid,
        },
        showTop: true,
        success: (res) => {},
        yes: (res) => {},
        reset: (res) => {},
        other: (res) => {
          console.log("执行other");
          this.$emit("updateSetting");
        },
      });
      // top.closeAgendaSettingPanel = () => {
      //   console.log("执行closeAgendaSettingPanel");
      //   this.$emit("updateSetting");
      //   IDM.broadcast.closeControlSetPanel(controlSetPanelId);
      // };
    },
    /**
     * 向父组件发送参数
     */
    sendHeadParams() {
      const params = {
        timeViewType: this.timeViewType,
        searchVal: this.searchVal,
        onlyView: this.onlyView,
        leaders: "",
      };
      if (this.timeViewType === "day") {
        params.dates = this.curDate;
      } else {
        params.dates = this.weekList.map((item) => item.date).join(",");
      }

      if (this.onlyView) {
        const leaders = [];
        this.leaderList.forEach((item) => {
          if (item.checked) leaders.push(item.id);
        });
        params.leaders = leaders.join(",");
      } else {
        params.leaders = this.leaderList.map((item) => item.id).join(",");
      }
      this.$emit("updateHeadParams", params);
    },
    /**
     * 新增领导
     */
    handleLeaderAdd() {
      var opts = {
        codeType: "action",
        title: "选择用户",
        multiple: true,
        type: "codeselect",
        async: true,
        codeValue: "userinfo/usernoselect?type=allUser",
        callback: (text, ids, dataList) => {
          //点击确认后事件
          console.log(text, ids, dataList);
          this.sendHeadParams();
        },
      };
      top.openCodeWindow = window;
      top.openCodeOpts = opts;
      top.openCodeIndex = top.layer.open({
        type: 2,
        area: ["890px", "646px"],
        fixed: false,
        title: "",
        content: IDM.url.getContextWebUrl("ctrl/code/select/view"),
      });
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
     * 只看复选框切换
     */
    handleChange() {
      this.leaderList.forEach((item) => {
        item.checked = false;
      });
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
          &.checked {
            .leader-item-photh {
              position: relative;

              .leader-checked {
                position: absolute;
                top: -10px;
                right: -10px;
                color: #0080ff;
                font-size: 12px;
              }
              img {
                border: #0080ff 1px solid;
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
                color: #0080ff;
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
}
</style>
