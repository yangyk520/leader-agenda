<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
  <div
    idm-ctrl="idm_module"
    :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id"
    class="idm-unit-leader-agenda-outer"
  >
    <div class="idm-unit-leader-agenda-container scroll_block">
      <AgendaHeader
        :moduleObject="moduleObject"
        :activeDepart="activeDepart"
        :activeUser="activeUser"
        @updateHeadParams="updateHeadParams"
      />
      <div class="agenda-main">
        <div class="depart-list">
          <div class="depart-list-title">
            {{ form_data.timeViewType === "person" ? "个人" : "部门" }}日程
          </div>
          <div class="depart-list-content scroll_block">
            <div
              class="list-item-outer"
              v-for="(item, index) in departList"
              :key="index"
            >
              <div
                class="list-item"
                :class="{ active: activeDepart === item.id }"
                :data-id="item.id"
                @click="departHanlde(item)"
              >
                <span>{{ item.name }}</span>
              </div>
              <ul
                v-if="
                  form_data.timeViewType === 'person' &&
                  activeDepart === item.id &&
                  item.children &&
                  item.children.length > 0
                "
              >
                <li
                  v-for="(child, c) in item.children"
                  :key="c"
                  :class="{ active: activeUser === child.relaId }"
                  :data-id="child.relaId"
                  @click="userHanlde(child)"
                >
                  {{ child.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="agenda-main-box scroll_block">
          <div class="agenda-day" v-for="(day, index) in weekList" :key="day">
            <div class="agenda-day-morning">
              <div class="agenda-day-info">
                <span>{{ day }} 周{{ weekCn[index] }}</span>
                <span>上午</span>
              </div>
              <div
                v-if="agendaList[index] && agendaList[index].morningList"
                class="agenda-day-list"
              >
                <div
                  class="agenda-day-item"
                  v-for="(agenda, a) in agendaList[index].morningList"
                  :key="a"
                  :class="{
                    active: agenda.id === activeAgenda,
                    type1: agenda.agendaType == 300,
                    type2: agenda.agendaType == 301,
                    type3: agenda.agendaType != 300 && agenda.agendaType != 301,
                  }"
                  @mouseenter="() => (activeAgenda = agenda.id)"
                >
                  <div class="agenda-day-item-left">
                    <div>{{ agenda.startTime }}</div>
                    <div>{{ agenda.endTime }}</div>
                  </div>
                  <div class="agenda-day-item-right">
                    <section>
                      <div class="item-label">内容</div>
                      ：
                      <div class="item-value">{{ agenda.bt }}</div>
                    </section>
                    <section>
                      <div class="item-label">地址</div>
                      ：
                      <div class="item-value">{{ agenda.place }}</div>
                    </section>
                    <section>
                      <div class="item-label">局领导</div>
                      ：
                      <div class="item-value">{{ agenda.attendantsText }}</div>
                    </section>
                    <section v-if="agenda.id === activeAgenda">
                      <div class="item-label">相关领导</div>
                      ：
                      <div class="item-value">{{ agenda.relateUnit }}</div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
            <div class="agenda-day-afternoon">
              <div class="agenda-day-info">下午</div>
              <div
                v-if="agendaList[index] && agendaList[index].afternoonList"
                class="agenda-day-list"
              >
                <div
                  class="agenda-day-item"
                  v-for="(agenda, a) in agendaList[index].afternoonList"
                  :key="a"
                  :class="{
                    active: agenda.id === activeAgenda,
                    type1: agenda.agendaType == 1,
                    type2: agenda.agendaType == 2,
                    type3: agenda.agendaType == 3,
                  }"
                  @mouseenter="() => (activeAgenda = agenda.id)"
                >
                  <div class="agenda-day-item-left">
                    <div>{{ agenda.startTime }}</div>
                    <div>{{ agenda.endTime }}</div>
                  </div>
                  <div class="agenda-day-item-right">
                    <section>
                      <div class="item-label">内容</div>
                      ：
                      <div class="item-value">{{ agenda.bt }}</div>
                    </section>
                    <section>
                      <div class="item-label">地址</div>
                      ：
                      <div class="item-value">{{ agenda.place }}</div>
                    </section>
                    <section>
                      <div class="item-label">局领导</div>
                      ：
                      <div class="item-value">{{ agenda.attendantsText }}</div>
                    </section>
                    <section v-if="agenda.id === activeAgenda">
                      <div class="item-label">相关领导</div>
                      ：
                      <div class="item-value">{{ agenda.relateUnit }}</div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const mock = [];
import AgendaHeader from "../commonComponents/UnitAgendaHeader.vue";
import {
  departListMock,
  agendaListMock,
  userInfoMock,
} from "../mock/IUnitLeaderAgenda";
export default {
  name: "ILeaderAgenda",
  components: {
    AgendaHeader,
  },
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {},
      form_data: {
        timeViewType: "",
      },
      // 周几中文
      weekCn: ["一", "二", "三", "四", "五", "六", "日"],
      departList: [],
      activeDepart: "",
      activeUser: "",
      weekList: [],
      agendaList: [],
      activeAgenda: "",
      userInfo: null,
    };
  },
  props: {},
  watch: {
    activeDepart: function (newVal) {
      if (this.form_data.timeViewType === "person") {
        this.getDepartList(newVal);
      }
    },
  },
  created() {
    this.moduleObject = this.$root.moduleObject;

    if (!this.moduleObject.env || this.moduleObject.env == "develop") {
      this.userInfo = userInfoMock;
    } else {
      this.userInfo = IDM.user.getCurrentUserInfo();
    }

    this.getDepartList();
    this.initAttrToModule();
  },
  mounted() {},
  destroyed() {},
  methods: {
    departHanlde(item) {
      this.activeDepart = item.id;
      this.initData();
    },
    userHanlde(item) {
      this.activeUser = item.relaId;
      this.initData();
    },
    initActiveDepartOrUser() {
      this.activeDepart = this.userInfo.userOrgId;
      this.activeUser = this.userInfo.userid;
      // this.initData();
    },
    getDepartList(deptId) {
      if (!this.moduleObject.env || this.moduleObject.env == "develop") {
        this.departList = departListMock;
        if (!deptId) {
          this.initActiveDepartOrUser();
        }
      } else {
        IDM.http
          .post("ctrl/userinfo/asyncData", {
            fid: deptId ? deptId : this.userInfo.unitInfo.unitId,
          })
          .then((res) => {
            if (res.status == "200") {
              if (deptId) {
                const list = res.data.filter((item) => {
                  return item.type === "userinfo";
                });
                this.departList.forEach((item) => {
                  if (item.id === this.activeDepart) {
                    item.children = list;
                  }
                });
              } else {
                this.departList = res.data.filter((item) => {
                  item.children = [];
                  return item.type === "department";
                });
                this.initActiveDepartOrUser();
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    /**
     * 更新头部组件参数
     */
    updateHeadParams(params) {
      console.log("更新头部组件参数", params);
      if (params.timeViewType != this.form_data.timeViewType) {
        this.initActiveDepartOrUser();
        params.timeViewType === "person" &&
          this.getDepartList(this.activeDepart);
      }
      this.weekList = params.dates.split(",");
      this.form_data = params;
      this.initData();
    },
    /**
     * 对属性设置进行初始化
     */
    initAttrToModule() {
      this.initBaseAttrToModule();
      this.convertAttrToStyleObject();
      this.convertThemeListAttrToStyleObject();
    },
    /**
     * 主题颜色
     */
    convertThemeListAttrToStyleObject() {
      const themeList = this.propData.themeList;
      if (!themeList) {
        return;
      }
      const themeNamePrefix =
        IDM.setting &&
        IDM.setting.applications &&
        IDM.setting.applications.themeNamePrefix
          ? IDM.setting.applications.themeNamePrefix
          : "idm-theme-";
      for (var i = 0; i < themeList.length; i++) {
        var item = themeList[i];

        if (item.key != IDM.theme.getCurrentThemeInfo()) {
          //此处比对是不渲染输出不用的样式，如果页面会刷新就可以把此处放开
          continue;
        }
        IDM.setStyleToPageHead(
          "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active",
          {
            color: item.mainColor
              ? IDM.hex8ToRgbaString(item.mainColor.hex8)
              : "",
          }
        );
      }
    },
    /**
     * 加载基本属性到组件中
     */
    initBaseAttrToModule() {},
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.initAttrToModule();
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
      //请求数据源
      this.initData();
    },
    /**
     * 加载动态数据
     */
    initData() {
      console.log("加载数据");
      if (!this.moduleObject.env || this.moduleObject.env == "develop") {
        const result = agendaListMock.data;
        result.forEach((item) => {
          item.morningList = item.list.filter(
            (inner) => inner.porid === "morning"
          );
          item.afternoonList = item.list.filter(
            (inner) => inner.porid === "afternoon"
          );
        });
        this.agendaList = result;
      } else {
        IDM.http
          .get("ctrl/deptScheduleList/queryWeekData", {
            deptId: this.activeDepart,
            userId:
              this.form_data.timeViewType === "person" ? this.activeUser : "",
            startTime: this.weekList[0],
            endTime: this.weekList[this.weekList.length - 1],
            searchText: this.form_data.searchVal,
          })
          .then((res) => {
            console.log("单位领导日程数据",res)
            if (res.data.code == "200") {
              const result = res.data.data;
              result.forEach((item) => {
                item.morningList = item.list.filter(
                  (inner) => inner.porid === "morning"
                );
                item.afternoonList = item.list.filter(
                  (inner) => inner.porid === "afternoon"
                );
              });
              this.agendaList = result;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    /**
    /**
     * 通用的获取表达式匹配后的结果
     */
    getExpressData(dataName, dataFiled, resultData) {
      //给defaultValue设置dataFiled的值
      var _defaultVal = undefined;
      if (dataFiled) {
        var filedExp = dataFiled;
        filedExp = dataName + (filedExp.startsWiths("[") ? "" : ".") + filedExp;
        var dataObject = { IDM: window.IDM };
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
      if (object.type && object.type == "linkageShowModule") {
        this.showThisModuleHandle();
      } else if (object.type && object.type == "linkageHideModule") {
        this.hideThisModuleHandle();
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
<style scoped lang="scss">
.idm-unit-leader-agenda-outer {
  position: relative;
  width: 100%;
  height: 100%;
  background: #ffffff;
  overflow-y: auto;
  border: 1px solid rgba(230, 230, 230, 1);
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.07);
  color: #333;
  .idm-unit-leader-agenda-container {
    height: 100%;
    overflow-y: auto;
    padding: 20px;
  }

  .agenda-main {
    display: flex;
    justify-content: space-between;
    height: calc(100% - 115px);
    .depart-list {
      height: 100%;
      width: 300px;
      border: 1px solid rgba(230, 230, 230, 1);
      .depart-list-title {
        height: 48px;
        line-height: 48px;
        text-align: center;
        background: #f9fcfe;
        border-bottom: 1px solid rgba(230, 230, 230, 1);
        font-size: 16px;
        color: #333333;
      }
      .depart-list-content {
        height: calc(100% - 48px);
        overflow-y: auto;
        .list-item {
          padding: 15px 27px;
          border-left: 10px solid transparent;
          color: #333333;
          transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
          cursor: pointer;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

          &:hover {
            border-color: #0086d9;
            background: rgba(84, 190, 255, 0.22);
            color: #0086d9;
          }
          &.active {
            border-color: #0086d9;
            background: rgba(84, 190, 255, 0.22);
            color: #0086d9;
          }
        }

        ul,
        li {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        ul {
          padding: 10px 0;
          border-bottom: 1px solid rgba(230, 230, 230, 1);
          li {
            padding: 10px 50px;
            cursor: pointer;
            transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
            &.active {
              background: rgba(84, 190, 255, 0.22);
              color: #0086d9;
            }
            &:hover {
              background: rgba(84, 190, 255, 0.22);
              color: #0086d9;
            }
          }
        }
      }
    }

    .agenda-main-box {
      width: calc(100% - 314px);
      height: 100%;
      overflow-y: auto;
      padding: 0 10px;
      margin: 0 -10px;
      .agenda-day {
        display: flex;
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0;
        }
        & > div {
          width: 50%;
        }
        .agenda-day-info {
          background: #f9fcfe;
          border: 1px solid rgba(230, 230, 230, 1);
          height: 48px;
          line-height: 48px;
          padding: 0 27px;
        }
        .agenda-day-morning {
          border-right: 1px solid rgba(230, 230, 230, 1);
          .agenda-day-info {
            display: flex;
            border-right: none;
            span:last-child {
              flex: 1;
              text-align: center;
            }
          }

          .agenda-day-item {
            margin-right: 30px;
          }
        }
        .agenda-day-afternoon {
          .agenda-day-info {
            border-left: none;
            text-align: center;
          }
        }

        .agenda-day-list {
          //display: flex;

          .agenda-day-item {
            display: flex;
            margin-bottom: 20px;
            transition: all 0.6s cubic-bezier(0.075, 0.82, 0.165, 1);
            &:last-child {
              margin-bottom: 0;
            }
            &.active {
              box-shadow: 0px 0px 6px 5px rgba(173, 173, 173, 0.5);
              .agenda-day-item-right section .item-value {
                line-clamp: 2;
                -webkit-line-clamp: 2;
              }
            }
            &.type2 {
              .agenda-day-item-right {
                background: #fff3e1;
              }
              .agenda-day-item-right {
                border-color: #f7ac00;
              }
            }
            &.type3 {
              .agenda-day-item-right {
                background: rgba(68, 215, 182, 0.12);
              }
              .agenda-day-item-right {
                border-color: #44d7b6;
              }
            }
            .agenda-day-item-left {
              width: 100px;
              text-align: center;
              & > div {
                margin-top: 20px;
              }
            }
            .agenda-day-item-right {
              width: calc(100% - 100px);
              background: #e3f7ff;
              border-left: 6px solid #0086d9;
              padding: 12px 20px;

              section {
                margin-bottom: 10px;
                display: flex;

                &:last-child {
                  margin-bottom: 0;
                }

                .item-label {
                  width: 60px;
                  display: inline-block;
                  text-align-last: justify;
                }
                .item-value {
                  width: calc(100% - 60px);
                  display: -webkit-box;
                  overflow: hidden;
                  -webkit-box-orient: vertical;
                  line-clamp: 1;
                  -webkit-line-clamp: 1;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.scroll_block::-webkit-scrollbar {
  width: 6px;
  height: 8px;
}
.scroll_block::-webkit-scrollbar-thumb {
  background-color: #ccc;
}
.scroll_block::-webkit-scrollbar-thumb {
  min-height: 18px;
  border-radius: 4px;
}
</style>
