<template>
  <div class="agenda-header-main">
    <div class="agenda-header-main-top flex_center">
      <div class="top-calendar">
        <!-- 上移 -->
        <div class="calendar-arrow arrow-left" @click="calendarToggle('left')">
          <svg-icon iconClass="rectangle_left"></svg-icon>
        </div>
        <div class="calendar-container">
          <div class="calendar-container-week" v-if="weekList.length > 0" >
            <span>{{ weekList[0].monthAndDay }} - {{ weekList[weekList.length - 1].monthAndDay }}</span >
          </div>
        </div>
        <!-- 下移 -->
        <div class="calendar-arrow arrow-left" @click="calendarToggle('right')">
          <svg-icon iconClass="rectangle_right"></svg-icon>
        </div>
      </div>
    </div>
    <div class="agenda-header-main-operation">
      <div class="operation-search flex_start">
        <template v-if="propData.showWeekPicker">
          <a-week-picker :value="week_picker" placeholder="选择开始周" @change="onChangeDatePicker" />
        </template>
      </div>
      <div v-if="propData.operateList && propData.operateList.length" class="operation-btns">
        <span v-if="!isView" @click="handleAdd" class="operation-btn primary">新增</span>
        <span v-if="!isView" @click="handlePublic" class="operation-btn">发布</span>
        <span @click="handleExport" class="operation-btn">导出</span>
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
  name: "LeaderAgendaHeader",
  props: {
    moduleObject: {
      type: Object,
      default() {
        return {};
      },
    },
    propData: {
      type: Object,
      default: () => {}
    },
    isView: {
      type: Boolean,
      default: false,
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
      // 当前年月
      curYearAndMonth: "",
      // 周开始日期
      weekStart: "",
      // 一周数据
      weekList: [],
      // 周几中文
      weekCn: ["一", "二", "三", "四", "五", "六", "日"],
      // 领导列表
      leaderList: [],
      selected_leader: [],
      departList: [],
      selected_depart: [],
      print_date: [],
      date_picker: '',
      week_picker: '',
      month_picker: '',
    };
  },
  watch: {
    
  },
  created() {
    this.initTime(moment());
    this.sendHeadParams();
  },
  methods: {
    handleAdd() {
      IDM.layer.open({
        type: 2,
        title: ["单位领导活动", "font-size:18px;"],
        area: ["1200px", "90%"],
        content: IDM.url.getWebPath( "ctrl/formControl/form?moduleId=240821173209i4sYjb4HrBVwcsEbRmm&mid=240821173209i4sYjb4HrBVwcsEbRmm" ),
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
    handlePublic() {
      IDM.layer.confirm('确认发布？', {icon: 3, title:'提示'}, (index)=>{
        IDM.http.get("/ctrl/czjWorkPlan/releaseByDate", {
          startDate: this.weekList[0].date,
          endDate: this.weekList[this.weekList.length - 1].date,
        }).done((d) => {
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
    handleExport() {
      const params = {
        startDate: this.weekList[0].date,
        endDate: this.weekList[this.weekList.length - 1].date
      };
      const url = `/ctrl/czjWorkPlan/czjExport?startDate=${params.startDate}&endDate=${params.endDate}&isView=${false}`;
      const a = document.createElement("a");
      a.style.display = "none";
      a.setAttribute("target", "download");
      a.href = IDM.url.getWebPath(url);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    onChangeDatePicker(date) {
      this.week_picker = date
      if(date) {
        this.initTime(moment(date._d))
      } else {
        this.initTime(moment());
      }
      this.sendHeadParams();
    },
    getOperateStyle(item) {
      let styleObject = {};
      if(item.font) {
        IDM.style.setFontStyle(styleObject,item.font)
      }
      if(item.operateListBackgroundColor && item.operateListBackgroundColor.hex8) {
        styleObject['background-color'] = item.operateListBackgroundColor.hex8;
      }
      if(item.box) {
        IDM.style.setBoxStyle(styleObject,item.box)
      }
      if(item.border) {
        IDM.style.setBorderStyle(styleObject,item.border)
      }
      return styleObject
    },
    handleClickOperate(item,index) {
      item.buttonCustomFunction && item.buttonCustomFunction.length && IDM.invokeCustomFunctions.apply(this,[item.buttonCustomFunction,{
        item,
        index,
        _this: this
      }])
    },
    /**
     * 向父组件发送参数
     */
    sendHeadParams() {
      const params = { };
      params.dates = this.weekList.map((item) => item.date).join(",");
      if(this.selected_leader && this.selected_leader.length) {
        params.leaderId = this.selected_leader.join(",");
      }
      params.deptId = this.selected_depart;
      this.$emit("updateHeadParams", params);
    },
    /**
     * 初始化时间数据
     */
    initTime(today) {

      // 天数据
      this.curDate = today.format("YYYY-MM-DD");
      this.curMonthAndDay = today.format("MM月DD日");
      this.curYearAndMonth = today.format("YYYY-MM");
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
    },
    /**
     * 日历切换
     */
    calendarToggle(type) {
      this.week_picker = '';
      if (type === "left") {
        this.initTime( moment(this.weekStart, "YYYY-MM-DD").subtract(1, "isoWeek") );
      } else {
        this.initTime( moment(this.weekStart, "YYYY-MM-DD").subtract(-1, "isoWeek") );
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
    font-size: 16px;
    color: #333333;
    font-weight: 500;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    user-select: none;
    height: 50px;

    .top-tit {
      width: 150px;
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
        .calendar-container-day, .calendar-container-week {
          color: #0086D9;
          font-weight: 400;

          span:nth-child(2) {
            color: #333;
            margin-left: 16px;
          }
        }
        .calendar-btn{
          margin-left: 0;
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
      width: 150px;
    }
  }

  .agenda-header-main-operation {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // padding: 16px 0;
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
    .operation-search{
      .form_list{
        margin-right: 15px;
        &:last-child{
          margin-right: 0;
        }
        .label{
          font-size: 14px;
        }
      }
    }
  }
}
</style>
