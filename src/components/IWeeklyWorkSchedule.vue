<template>
  <div
    idm-ctrl="idm_module"
    :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id"
    class="idm-weekly-work-schedule"
  >
    <div class="weekly-work-schedule-header">
      <div class="tabs">
        <span :class="{ active: activeTab == 1 }" @click="changeTab('1')"
          >一周工作安排</span
        >
        <span :class="{ active: activeTab == 2 }" @click="changeTab('2')"
          >会议室使用</span
        >
      </div>
      <div class="right">
        <div class="updateTime" v-show="activeTab == 1">
          更新时间：{{ updateTime }}
        </div>
        <div class="applyBtn" v-show="activeTab == 2" @click="applyMeeting">
          申请会议室
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
    <!-- 一周工作安排 -->
    <div class="weekly-work-schedule-content" v-show="activeTab == 1">
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
    <!-- 会议室使用 -->
    <div class="weekly-work-schedule-content meeting" v-show="activeTab == 2">
      <template v-if="meetingTableHeader.length > 0 && meetingData.length > 0">
        <div class="meetingTable">
          <table>
            <thead>
              <tr>
                <th width="50"></th>
                <th v-for="item in meetingTableHeader" :key="item.name">
                  {{ item.name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td align="center" class="wb">上午</td>
                <td
                  v-for="(item, index) in meetingTableHeader"
                  :key="'sw' + index"
                >
                  <!-- 某个会议室上午的事项 -->
                  <div
                    class="item"
                    v-for="sitem in meetingData[index].swList"
                    :key="sitem.id"
                    @click="openDetail(sitem)"
                  >
                    <i class="icon"></i>
                    <div class="con">
                      <span class="time" v-if="sitem.start && sitem.end"
                        >{{ sitem.start.substring(11, 16) }}-{{
                          sitem.end.substring(11, 16)
                        }}</span
                      >
                      <p>{{ sitem.ngbm }}</p>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td align="center" class="wb">下午</td>
                <td
                  v-for="(item, index) in meetingTableHeader"
                  :key="'xw' + index"
                >
                  <!-- 某个会议室下午的事项 -->
                  <div
                    class="item"
                    v-for="sitem in meetingData[index].xwList"
                    :key="sitem.id"
                    @click="openDetail(sitem)"
                  >
                    <i class="icon"></i>
                    <div class="con">
                      <span class="time" v-if="sitem.start && sitem.end"
                        >{{ sitem.start.substring(11, 16) }}-{{
                          sitem.end.substring(11, 16)
                        }}</span
                      >
                      <p>{{ sitem.ngbm }}</p>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td align="center" class="wb">晚上</td>
                <td
                  v-for="(item, index) in meetingTableHeader"
                  :key="'ws' + index"
                >
                  <!-- 某个会议室晚上的事项 -->
                  <div
                    class="item"
                    v-for="sitem in meetingData[index].wsList"
                    :key="sitem.id"
                    @click="openDetail(sitem)"
                  >
                    <i class="icon"></i>
                    <div class="con">
                      <span class="time" v-if="sitem.start && sitem.end"
                        >{{ sitem.start.substring(11, 16) }}-{{
                          sitem.end.substring(11, 16)
                        }}</span
                      >
                      <p>{{ sitem.ngbm }}</p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <div class="empty" v-else>
        <a-empty description="暂无数据" />
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
      activeTab: "1", // 1 一周工作安排  2 会议室使用
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
      fullData: [],
      meetingTableHeader: [],
      meetingData: [],
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
    //切换tab
    changeTab(key) {
      this.activeTab = key;
    },
    //申请会议室
    applyMeeting() {
      var url = IDM.url.getWebPath(
        "ctrl/formControl/form?moduleId=190111184257QgSNR8cW92akDpqeWMA"
      );
      window.open(url);
    },
    //更多跳转
    openMore() {
      let url = "";
      let name = "";
      if (this.activeTab == 1) {
        url =
          "/ctrl/list/240731122244hywNDEwILcvyJuDtZG3?moduleId=240731121534LBCbaMUlj548yFfp4Tm&isView=1";
        name = "一周工作安排查看";
      }
      if (this.activeTab == 2) {
        // url = "/ctrl/meetingNoticeSkw/reserve/reserve?type=apply";
        url = "/ctrl/meetingNoticeSkw/reserve/main";
        name = "会议室使用";
      }
      // window.open(IDM.url.getWebPath(url));

      var targetObj = {
        action: IDM.url.getWebPath(url),
        isTabReload: "-1",
        name: name,
        target: "main",
        parentName: "",
      };
      top.window.$$iframeCtrl.addTab(targetObj);
    },
    openDetail(item) {
      var isRoomManager = "";
      if (!item["moduleId"]) {
        return false;
      }
      //会议变更需要检查下待办是否是我办理，是的话打开待办
      if (
        item["moduleId"] === "200819103404M68aBaOHQCJpEAaAES2" &&
        item["status"] === "1"
      ) {
        IDM.http
          .get("ctrl/meetingChange/getChangeTodo", { pk: item["sqid"] })
          .done((res) => {
            if (res.type == "success" && res.code == "200") {
              var url = "";
              if (res.data) {
                url = IDM.url.getWebPath(
                  "ctrl/formControl/form?todoId=" +
                    res.data.pId +
                    "_" +
                    res.data.pNId +
                    "&moduleId=" +
                    res.data.moduleId +
                    "&pk=" +
                    res.data.infoId
                );
              } else {
                url = IDM.url.getWebPath(
                  "ctrl/formControl/form?listId=210607181937YJxUC5fve4y7q3SH5hJ&mId=" +
                    item.moduleId +
                    "&moduleId=" +
                    item.moduleId +
                    "&method=pageCheckInfo&validateByList=1&pk=" +
                    item.sqid +
                    "&hasMine=" +
                    item.hasMine +
                    "&isRoomManager=" +
                    isRoomManager +
                    "&occupyStatus=" +
                    item.status
                );
              }
              window.open(url);
            }
          })
          .catch((err) => {
            console.log(err);
          });
        return;
      }

      if (item.hasMine || item.gkcx == "1") {
        var url = IDM.url.getWebPath(
          "ctrl/formControl/form?listId=210607181937YJxUC5fve4y7q3SH5hJ&mId=" +
            item.moduleId +
            "&moduleId=" +
            item.moduleId +
            "&method=pageCheckInfo&validateByList=1&pk=" +
            item.sqid +
            "&hasMine=" +
            item.hasMine +
            "&isRoomManager=" +
            isRoomManager +
            "&occupyStatus=" +
            item.status
        );
        window.open(url);
      }
    },
    getData() {
      // this.getMeetingData();

      var params = {
        startTime: this.startTime,
        endTime: this.endTime,
      };
      IDM.http
        .get("ctrl/skwWorkPlan/queryWorkPlan", params)
        .done((res) => {
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

            //获取会议数据
            this.getMeetingData();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMeetingData() {
      var params = {
        buildingType: "",
        siteType: "",
        rnrsValue: "",
        showTime: this.currentDate,
      };
      IDM.http
        .post("ctrl/meetingNoticeSjw/meetingReplyInfo", params)
        .done((res) => {
          if (res.type == "success" && res.code == "200") {
            var room = res.data.room;
            var currentDay = res.data.currentDay;
            var swStartTime = new Date(currentDay + " 06:00").getTime();
            var swEndTime = new Date(currentDay + " 11:59").getTime();
            var wsStartTime = new Date(currentDay + " 18:00").getTime();
            var wsEndTime = new Date(currentDay + " 05:59").getTime();
            var dayStartTime = new Date(currentDay + " 00:00").getTime();
            var dayEndTime = new Date(currentDay + " 23:59").getTime();
            var meetingData = [];
            var meetingTableHeader = []; //会议表头
            room.forEach(function (item) {
              meetingTableHeader.push({
                name: item.roomName,
              });

              let obj = item;
              obj.swList = [];
              obj.xwList = [];
              obj.wsList = [];
              let sqArr = item.sqData || []; //占用集合
              sqArr.forEach(function (sitem) {
                var sqStartTime = new Date(sitem.start).getTime();
                if (swStartTime <= sqStartTime && sqStartTime <= swEndTime) {
                  obj.swList.push(sitem);
                } else if (
                  swEndTime < sqStartTime &&
                  sqStartTime < wsStartTime
                ) {
                  obj.xwList.push(sitem);
                } else if (
                  (wsStartTime <= sqStartTime && sqStartTime <= dayEndTime) ||
                  (dayStartTime <= sqStartTime && sqStartTime <= wsEndTime)
                ) {
                  obj.wsList.push(sitem);
                }
              });
              meetingData.push(obj);
            });
            console.log(meetingData);
            this.meetingData = meetingData;
            this.meetingTableHeader = meetingTableHeader;
          }
        })
        .catch((err) => {
          console.log(err);
        });

      // var res = {
      //   code: "200",
      //   type: "success",
      //   message: "操作成功",
      //   metadata: null,
      //   token: "",
      //   data: {
      //     currentDay: "2026-04-21",
      //     startTime: "07:30",
      //     isShowBuilding: false,
      //     endTime: "19:30",
      //     room: [
      //       {
      //         isRoomManager: false,
      //         roomId: "240226143155lZDhknBaRerAkNvPxEu",
      //         roomType: "",
      //         roomName: "1001会议室",
      //         sqData: [
      //           {
      //             formId: "",
      //             leader: "",
      //             createUserId: "240205094444tfgG3YMO3TMm4prJVOw",
      //             mobile: "",
      //             start: "2026-04-21 14:12:00.0",
      //             gkcx: "1",
      //             hasMine: true,
      //             isBecheck: "-1",
      //             createUserName: "",
      //             dept: "",
      //             sqid: "260421141152XIClAVefItNG4f9fUUE",
      //             type: "",
      //             roomId: "240226143155lZDhknBaRerAkNvPxEu",
      //             noticeId: "",
      //             masterId: "260421141204Tt9tZt3LXK9BKTrc0kx",
      //             bt: "0421测试会议001",
      //             person: "",
      //             ngbm: "科委办公室(信访办公室)",
      //             ngr: "杨怡",
      //             end: "2026-04-21 16:13:00.0",
      //             meetingDuring: "2026-04-21 14:12:00.0至2026-04-21 16:13:00.0",
      //             id: "260421141204Tt9tZt3LXK9BKTrc0kx",
      //             moduleId: "190111184257QgSNR8cW92akDpqeWMA",
      //             status: "2",
      //           },
      //         ],
      //         roomClass: "A楼",
      //       },
      //       {
      //         isRoomManager: false,
      //         roomId: "24022614324419oeOhLggAbsAwdiEmZ",
      //         roomType: "",
      //         roomName: "1002会议室",
      //         sqData: null,
      //         roomClass: "A楼",
      //       },
      //       {
      //         isRoomManager: false,
      //         roomId: "240226143319xPrUaaSTsAAkiDvrotn",
      //         roomType: "",
      //         roomName: "2001会议室",
      //         sqData: null,
      //         roomClass: "B楼",
      //       },
      //       {
      //         isRoomManager: false,
      //         roomId: "240226143340V5vGxJKxQ2BfD7z4LW2",
      //         roomType: "",
      //         roomName: "2002会议室",
      //         sqData: null,
      //         roomClass: "B楼",
      //       },
      //       {
      //         isRoomManager: false,
      //         roomId: "240226143355zomug23jEXSJIUzZXfw",
      //         roomType: "",
      //         roomName: "3001会议室",
      //         sqData: null,
      //         roomClass: "C楼",
      //       },
      //       {
      //         isRoomManager: false,
      //         roomId: "240226143414S3VllHaubZwsLUZeX6i",
      //         roomType: "",
      //         roomName: "3002会议室",
      //         sqData: null,
      //         roomClass: "C楼",
      //       },
      //     ],
      //   },
      //   serverTime: "2026-04-23 10:48:52",
      // };
      // console.log(res.data);
      // if (res.type == "success" && res.code == "200") {
      //   var room = res.data.room;
      //   var currentDay = res.data.currentDay;
      //   var swStartTime = new Date(currentDay + " 06:00").getTime();
      //   var swEndTime = new Date(currentDay + " 11:59").getTime();
      //   var wsStartTime = new Date(currentDay + " 18:00").getTime();
      //   var wsEndTime = new Date(currentDay + " 05:59").getTime();
      //   var dayStartTime = new Date(currentDay + " 00:00").getTime();
      //   var dayEndTime = new Date(currentDay + " 23:59").getTime();
      //   var meetingData = [];
      //   var meetingTableHeader = []; //会议表头
      //   room.forEach(function (item) {
      //     meetingTableHeader.push({
      //       name: item.roomName,
      //     });

      //     let obj = item;
      //     obj.swList = [];
      //     obj.xwList = [];
      //     obj.wsList = [];
      //     let sqArr = item.sqData || []; //占用集合
      //     sqArr.forEach(function (sitem) {
      //       var sqStartTime = new Date(sitem.start).getTime();
      //       if (swStartTime <= sqStartTime && sqStartTime <= swEndTime) {
      //         obj.swList.push(sitem);
      //       } else if (swEndTime < sqStartTime && sqStartTime < wsStartTime) {
      //         obj.xwList.push(sitem);
      //       } else if (
      //         (wsStartTime <= sqStartTime && sqStartTime <= dayEndTime) ||
      //         (dayStartTime <= sqStartTime && sqStartTime <= wsEndTime)
      //       ) {
      //         obj.wsList.push(sitem);
      //       }
      //     });
      //     meetingData.push(obj);
      //   });
      //   console.log(meetingData);
      //   this.meetingData = meetingData;
      //   this.meetingTableHeader = meetingTableHeader;
      // }
    },
    //切换日期
    changeDate(d) {
      this.currentDate = d.date;
      this.fullData.filter((item) => {
        if (item.date == this.currentDate) {
          this.workPlan = item.workPlan || [];
        }
      });

      //获取会议数据
      this.getMeetingData();
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
    justify-content: space-between;
    color: #999;
    font-size: 18px;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 10px;
    .tabs {
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
      margin-top: -10px;
    }
    .more {
      font-size: 14px;
      margin-left: 15px;
      margin-right: 15px;
      cursor: pointer;
    }
    .applyBtn {
      background: rgba(0, 115, 202, 1);
      border-radius: 4px;
      padding: 5px 10px;
      font-size: 16px;
      color: #fff;
      cursor: pointer;
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

        .cell {
          padding: 0 10px;
          &.name {
            text-align: center;
          }
          .item {
            display: flex;
            align-items: center;
            padding: 10px 0;
            border-top: 1px dashed #eee;
            // cursor: pointer;
            &:first-child {
              border-top: none;
            }
            .icon {
              width: 10px;
              height: 10px;
              background: orange;
              border-radius: 50%;
            }
            .con {
              padding-left: 10px;
              word-break: break-all;
              .time {
                margin-right: 10px;
              }
              p {
                margin: 0;
              }
            }
          }
        }
      }
    }
    .empty {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &.meeting {
      .table_header {
        .name {
          text-align: center;
        }
      }
    }

    .meetingTable {
      flex: 1;
      overflow-y: auto;
      table {
        width: 100%;
        min-height: 100%;
        table-layout: fixed;
        border-collapse: collapse;
        th {
          text-align: center;
          border: 1px solid #ddd;
          padding: 10px 5px;
          background: #e4f3ff;
          color: #3389e0;
        }
        td {
          padding: 0 5px;
          border: 1px solid #ddd;
          vertical-align: text-top;
          &.wb {
            padding: 10px 5px;
            vertical-align: middle;
          }
          .item {
            display: flex;
            padding: 10px 0;
            border-top: 1px dashed #eee;
            cursor: pointer;
            &:first-child {
              border-top: none;
            }
            .icon {
              width: 10px;
              height: 10px;
              background: orange;
              border-radius: 50%;
              margin-top: 3px;
            }
            .con {
              flex: 1;
              padding-left: 6px;
              word-break: break-all;
              .time {
                margin-right: 10px;
                font-weight: 600;
              }
              p {
                margin: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
