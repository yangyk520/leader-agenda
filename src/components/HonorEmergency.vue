<template>
  <div
    idm-ctrl="idm_module"
    :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id"
    class="idm-honor-emergency"
  >
    <!-- Banner图 -->
    <div class="honor-banner-wrap">
      <div class="honor-banner">
        <img :src="
                IDM.url.getModuleAssetsWebPath(
                 require('../assets/banner.png'),
                  this.moduleObject
                )
              "
              width="100%"
            />
      </div>
      <div class="update-tip">持续更新中</div>
    </div>

    <!-- 菜单导航（放在 banner 下方） -->
    <div class="honor-menu-bar">
      <div class="menu-inner">
        <div class="menu-container">
          <div
            v-for="menu in menuList"
            :key="menu.key"
            :class="['menu-item', { active: activeMenu === menu.key }]"
            @click="switchMenu(menu.key)"
          >
            {{ menu.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="honor-content">
      <!-- 搜索栏（列表上方右侧） -->
      <div class="search-bar">
        <div class="search-container">
          <a-input
            v-model="searchVal"
            @keyup.enter="handleSearch"
            placeholder="搜索"
            class="search-input"
          >
            <svg-icon slot="suffix" icon-class="search" />
          </a-input>
          <span class="search-btn" @click="handleSearch">搜索</span>
        </div>
      </div>

      <!-- 个人/集体标签页 -->
      <div class="custom-tabs">
        <div class="tabs-header">
          <div
            :class="['tab-item', { active: activeTab === 'personal' }]"
            @click="switchTab('personal')"
          >
            个人
          </div>
          <div
            :class="['tab-item', { active: activeTab === 'collective' }]"
            @click="switchTab('collective')"
          >
            集体
          </div>
        </div>
        <div class="tabs-content">
          <a-table
            :columns="columns"
            :data-source="tableData"
            :pagination="pagination"
            :row-key="(record, index) => index"
            :loading="loading"
            :bordered="true"
            :row-class-name="(_record, index) => (index % 2 === 1 ? 'stripe-row' : '')"
            :locale="{ emptyText: '暂无数据' }"
            :customRow="customRow"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HonorEmergency",
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {},
      // 菜单列表
      menuList: [
        { key: "honor", name: "荣誉表彰" },
        { key: "annual", name: "年度嘉奖" },
        { key: "competition", name: "竞赛表扬" },
        { key: "publicity", name: "宣传选树" },
        { key: "thankyou", name: "感谢信" },
      ],
      activeMenu: "honor",
      // 搜索关键词
      searchVal: "",
      // 标签页
      activeTab: "personal",
      // 加载状态
      loading: false,
      // 分页配置
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20", "50"],
        showTotal: (total, range) => `共 ${total} 条`,
        locale: {
          items_per_page: '条/页',
          jump_to: '跳至',
          jump_to_confirm: '确定',
          page: '页',
          prev_page: '上一页',
          next_page: '下一页',
          prev_5: '向前 5 页',
          next_5: '向后 5 页',
          prev_3: '向前 3 页',
          next_3: '向后 3 页',
        },
        onChange: (page, pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
          this.fetchData();
        },
        onShowSizeChange: (current, pageSize) => {
          this.pagination.current = 1;
          this.pagination.pageSize = pageSize;
          this.fetchData();
        },
      },
      // 菜单key与honorClass参数映射
      honorClassMap: {
        honor: "1",
        annual: "2",
        competition: "3",
        publicity: "4",
        thankyou: "5",
      },
      // 标签页与honorType参数映射
      honorTypeMap: {
        personal: "1",
        collective: "2",
      },
      // 表格数据
      tableData: [],
    };
  },
  props: {},
  computed: {
    // 根据当前标签页动态生成表格列
    columns() {
      if (this.activeTab === "personal") {
        return [
          {
            title: "序号",
            dataIndex: "index",
            key: "index",
            width: 100,
            align: "center",
            customRender: (_text, _record, index) => {
              return (this.pagination.current - 1) * this.pagination.pageSize + index + 1;
            },
          },
          {
            title: "姓名",
            dataIndex: "name",
            key: "name",
            width: 180,
            align: "center",
          },
          {
            title: "部门",
            dataIndex: "department",
            key: "department",
            width: 220,
            align: "center",
          },
          {
            title: "荣誉名称",
            dataIndex: "honorName",
            key: "honorName",
            align: "left",
            ellipsis: true,
          },
          {
            title: "奖励时间",
            dataIndex: "awardTime",
            key: "awardTime",
            width: 180,
            align: "center",
          },
          {
            title: "奖励单位",
            dataIndex: "awardUnit",
            key: "awardUnit",
            width: 220,
            align: "center",
          },
        ];
      } else {
        return [
          {
            title: "序号",
            dataIndex: "index",
            key: "index",
            width: 100,
            align: "center",
            customRender: (_text, _record, index) => {
              return (this.pagination.current - 1) * this.pagination.pageSize + index + 1;
            },
          },
          {
            title: "部门",
            dataIndex: "department",
            key: "department",
            width: 220,
            align: "center",
          },
          {
            title: "荣誉名称",
            dataIndex: "honorName",
            key: "honorName",
            align: "left",
            ellipsis: true,
          },
          {
            title: "奖励时间",
            dataIndex: "awardTime",
            key: "awardTime",
            width: 180,
            align: "center",
          },
          {
            title: "奖励单位",
            dataIndex: "awardUnit",
            key: "awardUnit",
            width: 220,
            align: "center",
          },
        ];
      }
    },
  },
  watch: {
    activeTab() {
      this.pagination.current = 1;
      this.fetchData();
    },
    activeMenu() {
      this.pagination.current = 1;
      this.fetchData();
    },
  },
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.initAttrToModule();
    this.fetchData();
  },
  mounted() {},
  destroyed() {},
  methods: {
    // 请求数据
    fetchData() {
      this.loading = true;
      const honorClass = this.honorClassMap[this.activeMenu];
      const honorType = this.honorTypeMap[this.activeTab];
      const params = {
        page: String(this.pagination.current),
        limit: String(this.pagination.pageSize),
      };
      if (this.searchVal.trim()) {
        params._content = this.searchVal.trim();
        params.searchText = `检索内容：${this.searchVal.trim()}`;
      }
      let url=`/ctrl/list/query?formId=2606041006290ib0PgJ0qlLWXSeRjg8&moduleId=260525111043GGeJJGnmEPlRKpcs4AX&honorClass=${honorClass}&honorType=${honorType}`;
      IDM.http
        .post(url,params)
        .then((res) => {
          const resData = res.data || {};
          const list = resData.data || [];
          this.tableData = list.map((item) => ({
            name: item["C-HONOR-ARCHIVE-REGISTER-0002.text"] || "",
            department: (honorType=='1'?item["C-HONOR-ARCHIVE-REGISTER-0003.text"]:item["C-HONOR-ARCHIVE-REGISTER-0021.text"]) || "",
            honorName: item["B0001.value"] || "",
            awardTime: item["C-HONOR-ARCHIVE-REGISTER-0006.value"] || "",
            awardUnit: item["C-HONOR-ARCHIVE-REGISTER-0007.text"] || "",
            pk: item["A0001"] || "",
          }));
          this.pagination.total = resData.count || 0;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.tableData = [];
          this.loading = false;
        });
    },
    // 切换菜单
    switchMenu(menuKey) {
      this.activeMenu = menuKey;
    },
    // 切换标签页
    switchTab(tabKey) {
      this.activeTab = tabKey;
    },
    // 搜索
    handleSearch() {
      this.pagination.current = 1;
      this.fetchData();
    },
    // 行点击事件
    customRow(record) {
      return {
        on: {
          click: () => {
            this.handleRowClick(record);
          },
        },
      };
    },
    // 点击行跳转表单页面
    handleRowClick(record) {
      var pk = record["pk"];
      let url = IDM.url.getWebPath(
        `ctrl/formControl/form?listId=260525111946RpP5mBDGoQkJSCpYagN&method=&moduleId=260525111043GGeJJGnmEPlRKpcs4AX&pk=${pk}&isView=1`
      );
      window.open(url);
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
              break;
            case "positionY":
              break;
            case "bgRepeat":
              styleObject["background-repeat"] = element;
              break;
            case "bgAttachment":
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
        urlData: JSON.stringify(urlObject),
      };
      return params;
    },
    /**
     * 重新加载
     */
    reload() {
      this.initAttrToModule();
      this.fetchData();
    },
    /**
     * 通用的获取表达式匹配后的结果
     */
    getExpressData(dataName, dataFiled, resultData) {
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
     */
    sendBroadcastMessage(object) {
      window.IDM.broadcast && window.IDM.broadcast.send(object);
    },
    /**
     * 交互功能：设置组件的上下文内容值
     */
    setContextValue(object) {
      console.log("统一接口设置的值", object);
    },
  },
};
</script>

<style scoped lang="scss">
.idm-honor-emergency {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;

  .honor-banner-wrap {
    position: relative;
    width: 100%;

    .honor-banner {
      width: 100%;
      height: 200px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .update-tip {
      position: absolute;
      top: 20px;
      right: 30px;
      padding: 8px 20px;
      background: linear-gradient(135deg, #ff4d4f, #ff7875);
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      border-radius: 20px;
      box-shadow: 0 4px 12px rgba(255, 77, 79, 0.4);
      z-index: 10;
      animation: pulse 2s infinite;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 4px 12px rgba(255, 77, 79, 0.4);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(255, 77, 79, 0.6);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 4px 12px rgba(255, 77, 79, 0.4);
    }
  }

  .honor-menu-bar {
    width: 100%;
    background: #A60F00;

    .menu-inner {
      width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 30px;
      box-sizing: border-box;
      line-height: 1;
    }

    .menu-container {
      display: flex;

      .menu-item {
        padding: 18px 55px;
        color: #fff;
        font-size: 18px;
        cursor: pointer;
        transition: background-color 0.3s;
        position: relative;
        margin-right: 10px;

        &:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        &.active {
          background: #e5a50a;
          color: #333;
        }
      }
    }
  }

  .honor-content {
    flex: 1;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;

    .search-bar {
      width: 1400px;
      display: flex;
      justify-content: flex-end;
      margin-bottom: 15px;

      .search-container {
        display: flex;
        align-items: center;

        .search-input {
          width: 240px;
          margin-right: 10px;
        }

        .search-btn {
          padding: 8px 24px;
          background: #e5a50a;
          color: #333;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;

          &:hover {
            background: #d49509;
          }
        }
      }
    }

    .custom-tabs {
      width: 1400px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
      overflow: hidden;
      padding: 20px;
      box-sizing: border-box;
      flex: 1;
      font-size: 16px;

      .tabs-header {
        display: flex;
        justify-content: center;
        border-bottom: 2px solid #e4e7ed;
        position: relative;
        margin-bottom: 20px;

        .tab-item {
          padding: 12px 36px;
          font-size: 18px;
          color: #909399;
          cursor: pointer;
          position: relative;
          transition: color 0.3s;

          &:hover {
            color: #409eff;
          }

          &.active {
            color: #409eff;
            font-weight: 600;

            &::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 50%;
              transform: translateX(-50%);
              width: 40px;
              height: 3px;
              background: #409eff;
              border-radius: 2px;
            }
          }
        }
      }

      .tabs-content {
        font-size: 16px;

        ::v-deep .ant-table-tbody > tr {
          cursor: pointer;
          font-size: 16px;
        }

        ::v-deep .ant-table-thead > tr > th {
          text-align: center!important;
          font-size: 17px;
        }

        ::v-deep .ant-table-thead > tr > th .ant-table-header-column {
          display: inline-block;
          text-align: center;
        }

        ::v-deep .ant-table-tbody > tr > td {
          font-size: 16px;
        }

        ::v-deep .stripe-row {
          background-color: #fafafa;
        }
      }
    }
  }
}

/* 响应式样式 */
@media (max-width: 1400px) {
  .idm-honor-emergency {
    .honor-menu-bar .menu-inner,
    .honor-content .search-bar,
    .honor-content .custom-tabs {
      width: 100%;
      min-width: 900px;
    }
  }
}

@media (max-width: 768px) {
  .idm-honor-emergency {
    .honor-banner-wrap {
      .honor-banner {
        height: 120px;
      }

      .update-tip {
        top: 10px;
        right: 10px;
        padding: 6px 12px;
        font-size: 14px;
      }
    }

    .honor-menu-bar {
      background: rgba(0, 0, 0, 0.70);

      .menu-inner {
        padding: 10px;
        min-width: auto;

        .menu-container {
          flex-wrap: wrap;
          justify-content: center;

          .menu-item {
            padding: 10px 24px;
            font-size: 16px;
          }
        }
      }
    }

    .honor-content {
      padding: 10px;

      .search-bar {
        min-width: auto;
        margin-bottom: 10px;

        .search-container {
          width: 100%;
          justify-content: center;

          .search-input {
            width: 180px;
          }
        }
      }

      .custom-tabs {
        min-width: auto;
        overflow-x: auto;
        padding: 10px;
      }
    }
  }
}

@media (max-width: 480px) {
  .idm-honor-emergency {
    .honor-menu-bar {
      .menu-container {
        .menu-item {
          padding: 8px 16px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
