<template>
  <div
    idm-ctrl="idm_module"
    :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id"
    class="idm-salary-check"
  >
    <div class="salary-query-bar">
      <div class="query-item">
        <span class="query-label">开始时间：</span>
        <a-month-picker
          :value="startTime"
          class="query-input"
          format="YYYY-MM"
          placeholder="开始时间"
          @change="(date, dateString) => startTime = date"
        />
      </div>
      <div class="query-item">
        <span class="query-label">结束时间：</span>
        <a-month-picker
          :value="endTime"
          class="query-input"
          format="YYYY-MM"
          placeholder="结束时间"
          @change="(date, dateString) => endTime = date"
        />
      </div>
      <a-button type="primary" class="query-btn" @click="handleQuery">
        查询
      </a-button>
      <a-button class="reset-btn" @click="handleReset">
        重置
      </a-button>
    </div>
    <div class="salary-total-bar">
      <span class="salary-total-label">本次查询发放总额：</span>
      <span class="salary-total-value">{{ formatMoney(totalAmount) }}</span>
    </div>
    <div class="salary-header">
      <div class="salary-tabs">
        <div
          v-for="tab in tabList"
          :key="tab.key"
          :class="['tab-item', { active: activeTab === tab.key }]"
          @click="switchTab(tab.key)"
        >
          {{ tab.name }}
        </div>
      </div>
      <a-button
        type="primary"
        class="export-btn"
        :loading="exportLoading"
        @click="handleExport"
      >
        导出明细
      </a-button>
    </div>
    <div class="salary-content">
      <div class="salary-table-wrap">
        <a-table
          :columns="currentColumns"
          :data-source="currentData"
          :pagination="false"
          :row-key="(record, index) => activeTab + '_' + index"
          :loading="loading"
          :bordered="true"
          :scroll="{ x: tableScrollX, y: tableHeight }"
          :locale="{ emptyText: '暂无数据' }"
          :customRow="customRow"
          :rowClassName="rowClassName"
          size="small"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "ISalaryCheck",
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {},
      activeTab: "basic",
      loading: false,
      exportLoading: false,
      tableHeight: undefined,
      wrapperWidth: 1200,
      startTime: null,
      endTime: null,
      totalAmount: 0,
      tabList: [
        { key: "basic", name: "基本工资" },
        { key: "allowance", name: "津补贴" },
        { key: "oneTime", name: "一次性收入" }
      ],
      // 表格数据
      tableData: {
        basic: [],
        allowance: [],
        oneTime: []
      },
      // 汇总数据
      summaryData: {
        basic: {},
        allowance: {},
        oneTime: {}
      }
    };
  },
  props: {},
  computed: {
    currentColumns() {
      return this.getColumnsByTab(this.activeTab);
    },
    currentData() {
      const list = this.tableData[this.activeTab] || [];
      const summary = this.summaryData[this.activeTab];
      // 有数据时才追加汇总行
      if (list.length && summary && Object.keys(summary).length) {
        const summaryRow = { ...summary, _isSummary: true };
        // 避免“合计”显示在年月列下方
        if (summaryRow.年月 === "合计") {
          summaryRow.年月 = "";
        }
        return [...list, summaryRow];
      }
      return list;
    },
    tableScrollX() {
      const cols = this.currentColumns;
      if (!cols.length) return 1200;
      return cols.reduce((sum, item) => sum + (item.width || 100), 0);
    }
  },
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.convertAttrToStyleObject();
    this.setDefaultQueryTime();
    this.initData();
  },
  mounted() {
    this.$nextTick(() => {
      this.calcTableHeight();
      window.addEventListener("resize", this.calcTableHeight);
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.calcTableHeight);
  },
  methods: {
    // 计算表格可用高度，使表格填满页面并随窗口自适应
    calcTableHeight() {
      this.$nextTick(() => {
        const wrapper = this.$el;
        if (!wrapper) return;
        this.wrapperWidth = wrapper.clientWidth || window.innerWidth;
        // 优先取组件自身高度，未撑开时回退到视口高度
        const wrapperHeight = wrapper.clientHeight || window.innerHeight;
        const queryBar = wrapper.querySelector(".salary-query-bar");
        const totalBar = wrapper.querySelector(".salary-total-bar");
        const header = wrapper.querySelector(".salary-header");
        const queryBarHeight = queryBar ? queryBar.offsetHeight : 40;
        const totalBarHeight = totalBar ? totalBar.offsetHeight : 40;
        const headerHeight = header ? header.offsetHeight : 48;
        // 留出 queryBar、totalBar、header、padding(12*2)、margin 等空隙
        const extraHeight = queryBarHeight + totalBarHeight + headerHeight + 72;
        const bodyHeight = Math.max(wrapperHeight - extraHeight, 200);
        this.tableHeight = bodyHeight;
        // 通过 CSS 变量让表格主体在数据不足时仍撑满剩余空间
        wrapper.style.setProperty("--salary-table-body-height", bodyHeight + "px");
      });
    },
    // 根据 tab 获取列配置（动态根据汇总数据中的 key 生成）
    getColumnsByTab(tabKey) {
      const summary = this.summaryData[tabKey] || {};
      let keys = Object.keys(summary);
      // 若汇总数据为空，则取第一条数据 key 兜底
      if (!keys.length) {
        const firstRow = (this.tableData[tabKey] || [])[0];
        if (firstRow) {
          keys = Object.keys(firstRow).filter(key => key !== "_isSummary");
        }
      }
      if (!keys.length) {
        return [];
      }
      return this.generateColumns(this.reorderKeys(keys));
    },
    // 将 姓名、部门、年月 排在最前面
    reorderKeys(keys) {
      const priority = ["姓名", "部门", "年月"];
      const priorityKeys = priority.filter(key => keys.includes(key));
      const otherKeys = keys.filter(key => !priority.includes(key));
      return [...priorityKeys, ...otherKeys];
    },
    // 由字段 key 数组生成列配置
    generateColumns(keys) {
      const colsWidth = keys.reduce((sum, key) => sum + this.estimateColumnWidth(key), 0);
      // 列总宽超过容器宽度时固定左侧三列，否则不固定
      const shouldFix = colsWidth > this.wrapperWidth;
      const fixedLeftKeys = shouldFix ? ["姓名", "部门", "年月"] : [];
      const dataCols = keys.map(key => {
        const isText = this.isTextColumn(key);
        return {
          title: key,
          dataIndex: key,
          key: key,
          width: this.estimateColumnWidth(key),
          fixed: fixedLeftKeys.includes(key) ? "left" : undefined,
          align: isText ? "center" : "right",
          customRender: (text, record) => {
            // 汇总行合并 姓名、部门、年月 三列并显示“合计”
            if (record._isSummary) {
              if (key === "姓名") {
                return {
                  children: "合计",
                  attrs: { colSpan: 3 }
                };
              }
              if (key === "部门" || key === "年月") {
                return {
                  attrs: { colSpan: 0 }
                };
              }
            }
            if (isText) {
              return text;
            }
            return this.formatMoney(text);
          }
        };
      });
      return dataCols;
    },
    // 判断是否为文本列（非数字列）
    isTextColumn(key) {
      return ["姓名", "部门", "年月"].includes(key);
    },
    // 估算列宽
    estimateColumnWidth(key) {
      if (key === "姓名") return 90;
      if (key === "部门") return 130;
      if (key === "年月") return 90;
      return Math.max(key.length * 20, 100);
    },
    // 格式化金额
    formatMoney(value) {
      if (value === undefined || value === null || value === "") {
        return "-";
      }
      const num = parseFloat(value);
      if (isNaN(num)) {
        return value;
      }
      return num.toFixed(2);
    },
    // 设置默认查询时间：当年1月至当月
    setDefaultQueryTime() {
      const now = new Date();
      const currentYear = now.getFullYear();
      this.startTime = moment(window.IDM.dateFormat(new Date(currentYear, 0, 1).getTime(), "Y-m"), "YYYY-MM");
      this.endTime = moment(window.IDM.dateFormat(now.getTime(), "Y-m"), "YYYY-MM");
    },
    // 查询
    handleQuery() {
      this.initData();
    },
    // 重置查询条件
    handleReset() {
      this.setDefaultQueryTime();
      this.initData();
    },
    // 切换 Tab
    switchTab(key) {
      if (this.activeTab === key) return;
      this.activeTab = key;
      this.initData();
      this.calcTableHeight();
    },
    // 导出明细
    handleExport() {
      this.exportLoading = true;
      const url = this.propData.exportDataUrl || "ctrl/mobilizationPayroll/exportSalaryExcel";
      const params = {
        startTime: this.startTime ? this.startTime.format("YYYY-MM") : "",
        endTime: this.endTime ? this.endTime.format("YYYY-MM") : ""
      };

      IDM.http
        .post(url, params, { responseType: "blob" })
        .then(res => {
          this.exportLoading = false;
          const blob = new Blob([res.data]);
          const fileName = `薪资明细_${this.getTabName()}_${this.formatDate(new Date())}.xlsx`;
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = downloadUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);
        })
        .catch(err => {
          this.exportLoading = false;
          console.log(err);
          IDM.message.error("导出失败，请稍后重试");
        });
    },
    getTabName() {
      const tab = this.tabList.find(item => item.key === this.activeTab);
      return tab ? tab.name : "";
    },
    formatDate(date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}${m}${d}`;
    },
    customRow(record) {
      return {
        on: {
          click: () => {
            this.propData.clickFunction &&
              this.propData.clickFunction.length &&
              IDM.invokeCustomFunctions.apply(this, [
                this.propData.clickFunction,
                { item: record, activeTab: this.activeTab, _this: this }
              ]);
          }
        }
      };
    },
    rowClassName(record) {
      return record._isSummary ? "summary-row" : "";
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
            ? this.propData.bgSizeWidth.inputVal + this.propData.bgSizeWidth.selectVal
            : "auto") +
          " " +
          (this.propData.bgSizeHeight
            ? this.propData.bgSizeHeight.inputVal + this.propData.bgSizeHeight.selectVal
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
     */
    commonParam() {
      let urlObject = IDM.url.queryObject();
      var params = {
        pageId:
          window.IDM.broadcast && window.IDM.broadcast.pageModule
            ? window.IDM.broadcast.pageModule.id
            : "",
        urlData: JSON.stringify(urlObject)
      };
      return params;
    },
    /**
     * 重新加载
     */
    reload() {
      this.initData();
    },
    /**
     * 加载动态数据
     */
    // 判断是否为静态模拟数据模式（地址栏 static=1）
    isStaticMode() {
      return IDM.url.queryString("static") === "1";
    },
    initData() {
      if (this.isStaticMode()) {
        this.loading = true;
        setTimeout(() => {
          this.loadMockData();
          this.loading = false;
          this.calcTableHeight();
        }, 300);
        return;
      }

      const url = this.propData.listDataUrl || "ctrl/mobilizationPayroll/getUserSalaryList";
      const params = {
        startTime: this.startTime ? this.startTime.format("YYYY-MM") : "",
        endTime: this.endTime ? this.endTime.format("YYYY-MM") : ""
      };

      this.loading = true;
      IDM.http
        .get(url, params)
        .done(res => {
          this.loading = false;
          if (res.code == "200" || res.type == "success") {
            const data = res.data || {};
            this.totalAmount = data.total || 0;
            this.tableData = {
              basic: data.salaryArray || [],
              allowance: data.allowanceArray || [],
              oneTime: data.atOnceArray || []
            };
            this.summaryData = {
              basic: data.salaryTotal || {},
              allowance: data.allowanceTotal || {},
              oneTime: data.atOnceTotal || {}
            };
          } else {
            this.resetData();
          }
          this.calcTableHeight();
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
          // 接口异常时使用本地模拟数据
          // this.loadMockData();
          // this.calcTableHeight();
        });
    },
    resetData() {
      this.totalAmount = 0;
      this.tableData = { basic: [], allowance: [], oneTime: [] };
      this.summaryData = { basic: {}, allowance: {}, oneTime: {} };
    },
    // 模拟数据（开发或接口异常时展示）
    loadMockData() {
      const salaryTotal = {
        职务工资: "2000.48", 十三薪: "200.4", 通讯: "404", 医保: "1002",
        公积金补扣: "602", 基础绩效补发: "200.12", 补充公积金: "402",
        补充公积金补扣: "602", 姓名: "", 年金: "1002", 部门: "",
        基础绩效: "400.22", 独生子女父母奖励费: "2002", 独子补发: "2002",
        会费: "1002", 其他二: "201.28", 年金补扣: "602", 职务: "6002",
        住房公积金: "402", 其他一: "201.06", 工会补扣: "602",
        上下班交通费补贴: "202", 实发工资: "40002", 年月: "合计",
        基础绩效奖: "200.12", 交通费补贴: "602", 级别补发: "6002",
        职业年金: "402", 通讯费: "201.2", 养老金: "402", 其他扣项: "202",
        级别: "10002", 养老: "1002", 独子费: "4002", 公积金: "1002",
        工会费: "402", 交通补发: "402", 级别工资: "4002", 医保补扣: "602",
        应扣工资: "1002", 职务补发: "402.2", 应发工资: "20002",
        补充公积: "1002", 医疗保险金: "402", 通讯补发: "201.2",
        养老补扣: "602"
      };
      const salaryArray = [{
        职务工资: "1000.24", 十三薪: "100.2", 通讯: "202", 医保: "501",
        公积金补扣: "301", 基础绩效补发: "100.06", 补充公积金: "201",
        补充公积金补扣: "301", 姓名: "冯老师", 年金: "501", 部门: "动员处",
        基础绩效: "200.11", 独生子女父母奖励费: "1001", 独子补发: "1001",
        会费: "501", 其他二: "100.64", 年金补扣: "301", 职务: "3001",
        住房公积金: "201", 其他一: "100.53", 工会补扣: "301",
        上下班交通费补贴: "101", 实发工资: "20001", 年月: "202608",
        基础绩效奖: "100.06", 交通费补贴: "301", 级别补发: "3001",
        职业年金: "201", 通讯费: "100.6", 养老金: "201", 其他扣项: "101",
        级别: "5001", 养老: "501", 独子费: "2001", 公积金: "501",
        工会费: "201", 交通补发: "201", 级别工资: "2001", 医保补扣: "301",
        应扣工资: "501", 职务补发: "201.1", 应发工资: "10001",
        补充公积: "501", 医疗保险金: "201", 通讯补发: "100.6",
        养老补扣: "301"
      }];

      const allowanceTotal = {
        工作性补发: "4004.2", 生活性补贴: "8892", 应扣津补贴: "26",
        公务交通补发: "204", 实发津补贴: "22227.34", 姓名: "", 部门: "",
        住房补发: "-196.46", 其他扣项2: "204", 其他扣项3: "2006",
        年度考核奖: "2004", 房贴: "204", 工作性: "204.46", 养老金1: "204",
        未休假补贴: "204", 养老补扣1: "204", 公积金1: "204.02", 年月: "合计",
        平时考核奖: "2004", 生活性补发: "846", 公务交通: "2004", 养老: "204",
        个税: "204", 生活性: "-396", 住房公积金1: "204",
        住房公积金补扣1: "204.2", 住房补贴: "-196.2", 年终奖: "204",
        工作性津贴: "2004", 应发津补贴: "204", 公务交通补贴: "204"
      };
      const allowanceArray = [{
        工作性补发: "2002.1", 生活性补贴: "4446", 应扣津补贴: "13",
        公务交通补发: "102", 实发津补贴: "11113.67", 姓名: "冯老师",
        部门: "动员处", 住房补发: "-98.23", 其他扣项2: "102", 其他扣项3: "1003",
        年度考核奖: "1002", 房贴: "102", 工作性: "102.23", 养老金1: "102",
        未休假补贴: "102", 养老补扣1: "102", 公积金1: "102.01", 年月: "202608",
        平时考核奖: "1002", 生活性补发: "423", 公务交通: "1002", 养老: "102",
        个税: "102", 生活性: "-198", 住房公积金1: "102",
        住房公积金补扣1: "102.1", 住房补贴: "-98.1", 年终奖: "102",
        工作性津贴: "1002", 应发津补贴: "102", 公务交通补贴: "102"
      }];

      const atOnceTotal = {
        年终一次性奖金: "2017", 平时考核奖: "217.46", 扣市管保健个人: "-213.2",
        其他扣项: "6", 实发一次性: "13397", 补发工资: "217", 姓名: "", 部门: "",
        公务员奖励奖金: "417", 其他二: "-383", 年度考核奖: "4017.2",
        未休假补贴: "8905", 其他一: "859", 年月: "合计"
      };
      const atOnceArray = [{
        年终一次性奖金: "1002", 平时考核奖: "102.23", 扣市管保健个人: "-98.1",
        其他扣项: "3", 实发一次性: "6667", 补发工资: "102", 姓名: "冯老师",
        部门: "动员处", 公务员奖励奖金: "202", 其他二: "-198",
        年度考核奖: "2002.1", 未休假补贴: "4446", 其他一: "423", 年月: "202608"
      }];

      this.totalAmount = 75626.34;
      this.tableData = { basic: salaryArray, allowance: allowanceArray, oneTime: atOnceArray };
      this.summaryData = { basic: salaryTotal, allowance: allowanceTotal, oneTime: atOnceTotal };
    },
    /**
     * 组件通信：接收消息的方法
     */
    receiveBroadcastMessage(object) {
      console.log("组件收到消息", object);
      if (object.type === "linkageReload") {
        this.reload();
      }
    },
    /**
     * 组件通信：发送消息的方法
     */
    sendBroadcastMessage(object) {
      window.IDM.broadcast && window.IDM.broadcast.send(object);
    },
    /**
     * 交互功能：设置组件的上下文内容值
     */
    setContextValue(object) {
      if (object.type != "pageCommonInterface") {
        return;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.idm-salary-check {
  height: 100vh!important;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  padding: 12px;
  box-sizing: border-box;

  .salary-query-bar {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .query-item {
      display: flex;
      align-items: center;
      margin-right: 16px;

      .query-label {
        color: #333333;
        font-size: 14px;
        white-space: nowrap;
      }

      .query-input {
        width: 160px;
      }
    }

    .query-btn {
      background-color: #0073ca;
      border-color: #0073ca;
      margin-right: 8px;
    }

    .reset-btn {
      color: #666666;
      border-color: #d9d9d9;
    }
  }

  .salary-total-bar {
    margin-bottom: 12px;
    padding: 8px 12px;
    // background: #f5f7fa;
    border-radius: 4px;

    .salary-total-label {
      color: #333333;
      font-size: 14px;
    }

    .salary-total-value {
      color: #1890ff;
      font-size: 16px;
      font-weight: 600;
    }
  }

  .salary-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    .salary-tabs {
      display: flex;
      align-items: center;

      .tab-item {
        padding: 6px 16px;
        font-size: 14px;
        color: #333333;
        cursor: pointer;
        border: 1px solid #d9d9d9;
        background: #ffffff;
        transition: all 0.2s;

        &:not(:first-child) {
          margin-left: -1px;
        }

        &:first-child {
          border-radius: 4px 0 0 4px;
        }

        &:last-child {
          border-radius: 0 4px 4px 0;
        }

        &:hover {
          color: #0073ca;
        }

        &.active {
          background: #0073ca;
          border-color: #0073ca;
          color: #ffffff;
          font-weight: 600;
          z-index: 1;
        }
      }
    }

    .export-btn {
      background-color: #0073ca;
      border-color: #0073ca;
      border-radius: 4px;
    }
  }

  .salary-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .salary-table-wrap {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>

<style lang="scss">
.idm-salary-check {
  .salary-table-wrap .ant-table-wrapper {
    flex: 1;
    overflow: hidden;
  }

  .ant-spin-nested-loading,
  .ant-spin-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .ant-table {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .ant-table-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .ant-table-scroll {
    flex: 1;
    overflow: hidden;
  }

  .ant-table-small {
    border: 1px solid #e8e8e8;
    border-radius: 4px;
  }

  .ant-table-thead > tr > th {
    background: #f9fcfe;
    color: #333333;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 10px 4px;
  }

  .ant-table-tbody > tr > td {
    text-align: center;
    padding: 10px 4px;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .ant-table-tbody > tr:hover > td {
    background: #e6f7ff;
  }

  .ant-table-tbody > tr.summary-row {
    background: #fffbe6;
    font-weight: 600;
  }

  .ant-table-tbody > tr.summary-row:hover > td {
    background: #fff3b8;
  }

  .ant-table-placeholder {
    color: #999999;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    padding: 32px 0;
    padding-top: 100px;
  }
}
</style>
