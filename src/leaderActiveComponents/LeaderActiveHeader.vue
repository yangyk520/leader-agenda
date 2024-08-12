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
        <span class="calendar-btn" @click="curDayWeekHandle">{{timeViewType === 'day'?'今天':'本周'}}</span>
      </div>
      <div class="top-view">
        <template v-if="viewModel == '1'">
          <span :class="{ active: timeViewType === 'day' }" @click="timeViewToggle('day')" >日</span >
          <span :class="{ active: timeViewType === 'week' }" @click="timeViewToggle('week')" >周</span >
        </template>
        <template v-else>
          <div class="top_right flex_end">
            <div v-if="viewModel == 2" class="select_box">
              <a-select v-model="selectedUser" show-search placeholder="请选择" option-filter-prop="children" style="width: 200px" :filter-option="filterOption" @change="handleChange" >
                <a-select-option v-for="(item,index) in leaderList" :key="index" :value="item.userId">
                  {{ item.userName }}
                </a-select-option>
              </a-select>
            </div>
            <div class="operate_block">
              <a-button v-if="viewModel == 2" @click="save()" :loading="save_loading" type="primary">
                保存
              </a-button>
              <template v-if="viewModel == 2">
                <a-button  v-if="publickStatus === 0" @click="release()" :loading="release_loading" type="primary">
                  发布
                </a-button>
                <a-button v-else @click="unRelease()" :loading="unRelease_loading" type="primary">
                  取消发布
                </a-button>
              </template>
              <a-button @click="exportData()" :loading="exportData_loading" type="primary">
                导出
              </a-button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
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
      // 领导列表
      leaderList: [],
      selectedUser: '',
      save_loading: false,
      release_loading: false,
      unRelease_loading: false,
      exportData_loading: false
    };
  },
  watch: {
    scheduleType: {
      handler: function (newVal) {
        if(!this.defaultTimeViewType){
          this.defaultTimeViewType = newVal == '1' ? 'day' : 'week';
          this.timeViewType = this.defaultTimeViewType;
          this.sendHeadParams();
        }
      },
      deep: true,
      immediate: true
    },
  },
  created() {
    if ( this.viewModel == '2' ) {
      this.getLeaderList();
    }
    this.initTime(moment());
  },
  methods: {
    exportData() {
      this.$emit('exportData')
    },
    save() {
      this.$emit('save')
    },
    release() {
      this.$emit('release')
    },
    unRelease() {
      this.$emit('unRelease')
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
      this.initTime(moment());
      // this.sendHeadParams();
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
          "ctrl/formControl/sysForm?moduleId=230707104025XyvXLw0OS2fq4YSag9r&formId=230707104026StmXGrEk5KQkiQQnytf"
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
      IDM.layer.confirm('确认发布？', {icon: 3, title:'提示'}, (index)=>{
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
        
        IDM.layer.close(index);
      });
    },
    /**
     * 请求领导列表
     */
    getLeaderList() {
      IDM.http
        .get("/ctrl/p2433JxwLeaderSchedule/getLeader")
        .done((d) => {
          if (d.code == "200" && d.data && d.data.length) {
            this.leaderList = d.data;
            this.selectedUser = d.data[0].userId
            this.sendHeadParams()
          }
        }).error((response) => {
          console.log("领导请求失败", response);
          this.leaderList = [];
          this.selectedUser = ''
        }).always((res) => {

        });
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
        leaders: "",
        weekList: this.weekList
      };
      if (this.timeViewType === "day") {
        params.dates = this.curDate;
      } else {
        params.dates = this.weekList.map((item) => item.date).join(",");
      }
      if(this.viewModel == '2') {
        if(this.selectedUser) {
          params.leaders = this.selectedUser;
        } else {
          return
        }
      }
      
      if (!params.dates) {
        return
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
      this.sendHeadParams();
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
    .ant-btn-primary:focus{
      background-color: #1890ff;
      border-color: #1890ff;
    }
  }
}
</style>
