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
    class="idm-holiday-duty-schedule"
  >
    <div class="idm-holiday-duty-schedule-container">
      <div class="card-panel">
        <div class="content-body">
          <div class="table-toolbar">
            <div class="section-title">节假日值班安排表</div>
            <div class="filter-area">
              <div class="search-item">
                <label class="tit">值班单位：</label>
                <div class="con">
                  <a-input
                    v-model="searchUnit"
                    placeholder="请输入要检索的单位名称"
                  ></a-input>
                </div>
              </div>
              <div class="search-item">
                <label class="tit">值班日期：</label>
                <div class="con">
                  <a-range-picker
                    v-model="searchDate"
                    :placeholder="['开始日期', '结束日期']"
                    :format="dateFormat"
                    @change="changeDate"
                  />
                </div>
              </div>
              <button
                id="searchBtn"
                class="btn-primary"
                @click="searchDataHandle"
              >
                查询
              </button>
              <button class="btn-outline" @click="resetSearch">重置</button>
              <button id="searchBtn" class="btn-primary" @click="addHandle">
                新建
              </button>
              <button id="searchBtn" class="btn-primary" @click="exportHandle">
                导出
              </button>
              <button
                class="btn-sort"
                v-show="sortMode == 'date'"
                @click="changeType('unit')"
              >
                按单位分组
              </button>
              <button
                class="btn-sort"
                v-show="sortMode == 'unit'"
                @click="changeType('date')"
              >
                按日期分组
              </button>
            </div>
          </div>
          <div class="table-wrapper">
            <table class="duty-table" id="dutyTable">
              <thead>
                <tr>
                  <th>单位名称</th>
                  <th>日期</th>
                  <th>班次</th>
                  <th>厅级领导名称</th>
                  <th>职务</th>
                  <th>手机号</th>
                  <th>处级领导名称</th>
                  <th>职务</th>
                  <th>手机号</th>
                  <th>值班员</th>
                  <th>职务</th>
                  <th>手机号</th>
                </tr>
              </thead>
              <template v-if="!isloading && defaultData.length > 0">
                <tbody
                  v-for="group in pageData"
                  :key="group.groupKey"
                  :data-group="group.groupKey"
                >
                  <tr class="group-header-row" @click="foldRow(group)">
                    <td colspan="12" class="group-header-cell">
                      <div class="content">
                        <div class="toggle-icon">
                          <svg-icon
                            iconClass="fold_down"
                            v-if="!group.isfold"
                          ></svg-icon>
                          <svg-icon iconClass="fold_right" v-else></svg-icon>
                        </div>
                        <div class="group-name">
                          <span v-show="sortMode == 'unit'"
                            >单位：{{ group.groupKey }}</span
                          >
                          <span v-show="sortMode == 'date'"
                            >日期：{{ group.groupKey }}</span
                          >
                        </div>
                        <div class="record-count">
                          共 {{ group.records.length }} 条记录
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr
                    v-for="(item, index) in group.records"
                    :key="index"
                    v-show="!group.isfold"
                    @click="detailsHandle(item)"
                  >
                    <td class="unit-cell">
                      {{ item["260318173354Nuk3etlOXkyyUpXuIk3.text"] }}
                    </td>
                    <td>{{ item["260318173545fwnM7nEE9HOhJIrXwez"] }}</td>
                    <td>{{ item["260318173615MgiM382XZ6lw3NE5xbL"] }}</td>
                    <td>{{ item["260312155432Neh5oKPYgCezjwuazi7"] }}</td>
                    <td>{{ item["C-ZB-ZBZ-RY-0005"] }}</td>
                    <td>{{ item["C-ZB-ZBZ-RY-0008"] }}</td>
                    <td>{{ item["26031215555258Lb8SGOeuSat1zESJI"] }}</td>
                    <td>{{ item["260312155703l8a4nWAiDu613mDOnDI"] }}</td>
                    <td>{{ item["260312160852gsaw0rfy6kRuHtytAQL"] }}</td>
                    <td>{{ item["C-ZB-ZBZ-RY-0001"] }}</td>
                    <td>{{ item["260312155847jzXjO2chpBhh5whjlJx"] }}</td>
                    <td>{{ item["260312160948BG8WcV5IkPQrFhc3via"] }}</td>
                  </tr>
                </tbody>
              </template>
              <template v-if="!isloading && defaultData.length == 0">
                <tbody>
                  <tr>
                    <td colspan="12" class="no-data">暂无数据</td>
                  </tr>
                </tbody>
              </template>
              <template v-if="isloading">
                <tbody>
                  <tr>
                    <td colspan="12" class="no-data">数据请求中...</td>
                  </tr>
                </tbody>
              </template>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { holidayListMock, userInfoMock } from "../mock/IHolidayDutySchedule";
export default {
  name: "IHolidayDutySchedule",
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {},
      sortMode: "unit", // 'unit' 或 'date'
      searchUnit: "",
      searchDate: [],
      startDate: "",
      endDate: "",
      defaultData: [],
      pageData: [],
      dateFormat: "YYYY-MM-DD",
      userInfo: null,
      isloading: true,
      isnw: false,
    };
  },
  props: {},
  computed: {},
  created() {
    this.moduleObject = this.$root.moduleObject;

    if (!this.moduleObject.env || this.moduleObject.env == "develop") {
      this.userInfo = userInfoMock;
    } else {
      this.userInfo = IDM.user.getCurrentUserInfo();
    }
    this.isnw =
      this.userInfo &&
      this.userInfo.unitInfo.unitId == "231219181755gyLnq6mzyGKnlaizWB6"; //是否是农委
    console.log("userInfo: ", this.userInfo);

    this.initData();
    window.$holidaySchedule = this;
  },
  mounted() {},
  destroyed() {},
  methods: {
    //改变类别
    changeType(type) {
      this.sortMode = type;
      this.initData();
    },
    //改变日期
    changeDate(date, dateString) {
      this.startDate = dateString[0] ? dateString[0] : "";
      this.endDate = dateString[1] ? dateString[1] : "";
    },
    //检索
    searchDataHandle() {
      this.initData();
    },
    //重置
    resetSearch() {
      this.searchUnit = "";
      this.searchDate = [];
      this.startDate = "";
      this.endDate = "";
      this.initData();
    },
    //新建
    addHandle() {
      var url = IDM.url.getWebPath(
        `ctrl/formControl/sysForm?moduleId=260312155112lL6t182YWixYFFbt41j`
      );
      window.open(url);
    },
    //导出
    exportHandle() {
      var fid = IDM.url.queryString("zbmangeId");
      var customorder = this.sortMode == "date" ? "time" : "";
      var url = IDM.url.getWebPath(
        "ctrl/holidayduty/export?fid=" + fid + "&customorder=" + customorder
      );
      if (this.searchUnit) {
        url += "&query_260318173354Nuk3etlOXkyyUpXuIk3=" + this.searchUnit;
      } 
      if (this.startDate && this.endDate) {
        url += "&query_260318173545fwnM7nEE9HOhJIrXwez=" + (this.startDate) + " - " + (this.endDate);
      }
      console.log("export url: ", url);
      window.location.href = encodeURI(url);
    },
    //更新视图
    refreshDisplay(type) {
      let filtered = this.defaultData;
      if (this.sortMode === "unit") {
        const groups = this.groupByUnit(filtered);
        console.log(groups);
        this.pageData = groups;
      } else {
        const groups = this.groupByDate(filtered);
        console.log(groups);
        this.pageData = groups;
      }
    },
    // 按单位分组
    groupByUnit(data) {
      const groups = new Map();
      data.forEach((item) => {
        const unit = item["260318173354Nuk3etlOXkyyUpXuIk3.text"];
        if (!groups.has(unit)) groups.set(unit, []);
        groups.get(unit).push(item);
      });
      // const sortedUnits = Array.from(groups.keys()).sort();
      const sortedUnits = Array.from(groups.keys());
      const result = [];
      for (let unit of sortedUnits) {
        result.push({ groupKey: unit, records: groups.get(unit) });
      }
      return result;
    },
    // 按日期分组
    groupByDate(data) {
      const groups = new Map();
      data.forEach((item) => {
        const date = item["260318173545fwnM7nEE9HOhJIrXwez"];
        if (!groups.has(date)) groups.set(date, []);
        groups.get(date).push(item);
      });
      const sortedDates = Array.from(groups.keys()).sort();
      const result = [];
      for (let date of sortedDates) {
        result.push({ groupKey: date, records: groups.get(date) });
      }
      return result;
    },
    //搜索
    hanldeSearch() {
      this.initData();
    },
    //重置
    hanldeReset() {
      this.searchVal = "";
      this.initData();
    },
    //查看详情
    detailsHandle(item) {
      console.log(item);
      var pk = item["A0001"];
      let url = IDM.url.getWebPath(
        `ctrl/formControl/form?listId=260312161539TZ3z5L7RS08Su2hoycj&method=viewList&moduleId=260312155112lL6t182YWixYFFbt41j&pk=${pk}`
      );
      window.open(url);
    },
    //折叠
    foldRow(group) {
      this.$set(group, "isfold", !group.isfold);
    },
    // changeTableWidth() {
    //   $(".agenda-main .table-header").width(
    //     $(".agenda-main .table-body table").width()
    //   );
    //   window.onresize = () => {
    //     $(".agenda-main .table-header").width(
    //       $(".agenda-main .table-body table").width()
    //     );
    //   };
    // },
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
      this.isloading = true;
      this.defaultData = [];
      if (!this.moduleObject.env || this.moduleObject.env == "develop") {
        const result = holidayListMock.data.dataList;
        this.defaultData = result;
        this.refreshDisplay();
        this.$nextTick(() => {
          this.isloading = false;
          // this.changeTableWidth();
        });
      } else {
        let url = `ctrl/list/query?formId=260312161539TZ3z5L7RS08Su2hoycj&moduleId=${IDM.url.queryString(
          "moduleId"
        )}&zbmangeId=${IDM.url.queryString("zbmangeId")}`;
        let searchText = [];
        let params = {
          page: 1,
          limit: 1000,
        };
        if (this.sortMode == "date") {
          params.customorder = "time";
        }
        if (this.searchUnit) {
          params["query_260318173354Nuk3etlOXkyyUpXuIk3"] = this.searchUnit;
          searchText.push(`值班单位：${this.searchUnit}`);
        }
        if (this.startDate && this.endDate) {
          params[
            "query_260318173545fwnM7nEE9HOhJIrXwez"
          ] = `${this.startDate} - ${this.endDate}`;
          searchText.push(`值班日期：${this.startDate} - ${this.endDate}`);
        }
        params.searchText = searchText.join("、");
        console.log(params);
        IDM.http
          .post(url, params)
          .done((res) => {
            console.log("数据", res);
            const result = res.data || [];
            this.defaultData = result;
            this.refreshDisplay();
            this.$nextTick(() => {
              this.isloading = false;
              // this.changeTableWidth();
            });
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
      } else if (
        object.type &&
        object.type == "websocket" &&
        this.propData.messageRefreshKey
      ) {
        const messageData =
          (typeof object.message === "string" && JSON.parse(object.message)) ||
          object.message;
        const arr = Array.isArray(this.propData.messageRefreshKey)
          ? this.propData.messageRefreshKey
          : [this.propData.messageRefreshKey];
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
<style scoped lang="scss">
.idm-holiday-duty-schedule {
  width: 100%;
  height: 100vh;
  background: #ffffff;
  overflow-y: auto;
  border: 1px solid rgba(230, 230, 230, 1);
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.07);
  color: #333;
  font-size: 16px;

  .idm-holiday-duty-schedule-container {
    height: 100%;
    overflow-y: auto;
    padding: 20px;
  }

  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 20px;
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #1e3b4f;
      border-left: 4px solid #1b82d1;
      padding-left: 14px;
      line-height: 1.3;
    }
    .filter-area {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }
    .search-item {
      display: flex;
      align-items: center;
      width: 320px;
      .tit {
        width: 90px;
        text-align: right;
      }
      .con {
        flex: 1;
      }
    }
    ::v-deep .ant-input {
      height: 40px;
    }
    .btn-primary {
      background: #0080ff;
      border: none;
      color: #fff;
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
    }
    .btn-primary:hover {
      background: #0080ff;
    }
    .btn-outline {
      background: white;
      border: 1px solid #bdd3e2;
      padding: 10px 18px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    .btn-outline:hover {
      background: #f2f7fc;
    }
    .btn-sort {
      background: #f0f4f9;
      border: 1px solid #cbdde6;
      padding: 10px 18px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      color: #0080ff;
    }
    .btn-sort:hover {
      background: #e6edf4;
    }
  }

  .table-wrapper {
    overflow-x: auto;
    border-radius: 14px;
    border: 1px solid #eef2f8;
    margin-top: 12px;
    .duty-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      table-layout: fixed;
    }
    .duty-table th {
      background: #f8fafd;
      padding: 14px 12px;
      font-weight: 600;
      color: #1f4e6e;
      border-bottom: 1px solid #e2e9f0;
      text-align: center;
    }
    .duty-table td {
      padding: 12px 10px;
      border-bottom: 1px solid #ecf3f8;
      text-align: center;
      vertical-align: middle;
      color: #2c4a66;
    }

    .duty-table tr {
      cursor: pointer;
    }

    .duty-table tr:hover td {
      background-color: #fafefb;
    }

    .group-header-row {
      background-color: #f1f7fc;
      cursor: pointer;
      transition: background 0.2s;
    }
    .group-header-row:hover {
      background-color: #e6f0f7;
    }
    .group-header-cell {
      padding: 12px 16px !important;
      font-weight: 600;
      color: #1a5d7a;
      border-bottom: 1px solid #d0e2ef;
      background-color: inherit;
      .content {
        display: flex;
        align-items: center;
      }
    }
    .toggle-icon {
      display: inline-block;
      margin-right: 12px;
      font-size: 14px;
      font-weight: normal;
      width: 20px;
      text-align: center;
    }
    .group-name {
      font-size: 16px;
      letter-spacing: 0.5px;
    }
    .record-count {
      margin-left: 16px;
      font-size: 13px;
      font-weight: normal;
      color: #6c8ea0;
    }

    .record-row.collapsed {
      display: none;
    }

    .empty-row td {
      text-align: center;
      padding: 40px;
      color: #99b2c4;
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
