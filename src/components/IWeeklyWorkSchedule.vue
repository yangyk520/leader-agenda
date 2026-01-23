<template>
  <div
    idm-ctrl="idm_module"
    :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id"
    class="idm-weekly-work-schedule"
  >
    <div class="weekly-work-schedule-header">
      <div class="name">一周工作安排</div>
      <div class="updateTime">更新时间：{{ updateTime }}</div>
    </div>
    <div class="weekly-work-schedule-date">
      <div
        class="date"
        v-for="item in dateArr"
        :key="item"
        :class="{ active: item.date == currentDate }"
        @click="changeDate(item)"
      >
        <span>{{ item.dateWeek }}</span>
      </div>
    </div>
    <div class="weekly-work-schedule-content">
      <div class="table_header">
        <div
          class="name"
          v-for="sitem in tableHeader"
          :key="sitem.field"
          :style="{ width: sitem.width }"
        >
          {{ sitem.name }}
        </div>
      </div>
      <div class="table_body">
        <template v-if="workPlan.length > 0">
          <vue-scroll :ops="scrollOps">
            <div class="row" v-for="(item, index) in workPlan" :key="index">
              <div
                class="field"
                v-for="sitem in tableHeader"
                :key="sitem.field"
                :style="{ width: sitem.width }"
                :title="item[sitem.field]"
              >
                {{ item[sitem.field] }}
              </div>
            </div>
          </vue-scroll>
        </template>
        <div class="empty" v-else>
          <a-empty description="暂无数据" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from "@/mixins/index.js";
export default {
  name: "IWeeklyWorkSchedule",
  mixins: [mixins],
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        fontContent: "Hello Word",
        showWld: false,
        scheduleType: "2",
        showSubordinate: false,
      },
      updateTime: "",
      dateArr: [],
      tableHeader: [
        {
          name: "时间",
          width: "15%",
          field: "dayTime",
        },
        {
          name: "地点",
          width: "25%",
          field: "place",
        },
        {
          name: "内容",
          width: "30%",
          field: "content",
        },
        {
          name: "出席范围",
          width: "30%",
          field: "range",
        },
      ],
      workPlan: [],
      startTime: "",
      endTime: "",
      currentDate: "",
      fullData: []
    };
  },
  props: {},
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.convertAttrToStyleObject();
  },
  mounted() {
    this.startTime = this.getCurrentWeekRange().start;
    this.endTime = this.getCurrentWeekRange().end;
    this.getData();
  },
  destroyed() {},
  methods: {
    getData() {
      var params = {
        startTime: this.startTime,
        endTime: this.endTime,
      };
      IDM.http.get("ctrl/skwWorkPlan/queryWorkPlan",params).done((res) => {
        if (res.type == "success" && res.code == "200") {
          var data = res.data.workPlanList || [];
          this.updateTime = res.data.lastUpdateTime;
          this.currentDate = res.serverTime.split(" ")[0];
          this.fullData = data;
          this.dateArr = data.map((item) => {
            return {
              date: item.date,
              dateWeek: item.dateWeek,
            };
          });
          this.fullData.filter((item) => {
            if (item.date == this.currentDate) {
              this.workPlan = item.workPlan || [];
            }
          });
        }
      }).catch((err) => {
          console.log(err)
      })
    },
    changeDate(d){
      this.currentDate = d.date;
      this.fullData.filter((item) => {
        if (item.date == this.currentDate) {
          this.workPlan = item.workPlan || [];
        }
      });
      console.log(this.workPlan);
    },
    getCurrentWeekRange() {
      const today = new Date();
      const currentDate = new Date(today.getTime());

      //获取当前日期是一周的第几天（getDay()返回：0=周日，1=周一，...，6=周六）
      const dayOfWeek = currentDate.getDay();

      // 计算当前日期与本周一的差值
      // 周一：dayOfWeek=1，差值为 0；周日：dayOfWeek=0，差值为 -6（需调整为1-7=-6）
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

      // 计算本周一开始日期
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() + diffToMonday);

      // 计算本周日结束日期（周一 + 6天 = 周日）
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      return {
        start: this.formatDate(weekStart),
        end: this.formatDate(weekEnd),
      };
    },
    formatDate(date) {
      const year = date.getFullYear();
      // 月份和日期补零（确保两位数）
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需+1
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
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
.idm-weekly-work-schedule {
  height: 100%;
  padding: 15px 0;
  background: #ffffff;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  .weekly-work-schedule-header {
    display: flex;
    align-items: center;
    color: #999;
    font-size: 18px;
    margin-bottom: 10px;
    .name {
      font-weight: 600;
      margin-right: 30px;
      color: #333;
    }
  }
  .weekly-work-schedule-date {
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 18px;
    .date {
      flex: 1;
      text-align: center;
      display: flex;
      justify-content: center;
      padding: 10px 0;
      span {
        line-height: 28px;
        padding: 0 10px;
        border-radius: 14px;
        color: #557da6;
        cursor: pointer;
      }
      &.active span {
        background: #3389e0;
        color: #fff;
      }
    }
  }
  .weekly-work-schedule-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .table_header {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      color: #3389e0;
      font-weight: 600;
      .name {
        padding: 0 10px;
      }
    }
    .table_body {
      flex: 1;
      overflow: hidden;
      .row {
        padding: 10px 20px;
        border-top: 1px solid #ddd;
        display: flex;
        align-items: center;
        .field {
          padding: 0 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .field:first-child {
          color: #3389e0;
        }
      }

      .empty {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
