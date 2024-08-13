<template>
  <div class="LeaderActiveTable_app">
    <div class="table">
      <div class="table_header flex_between">
        <div class="cell">领导</div>
        <div v-for="(item, index) in header_list" :key="index" class="cell">
          <div class="cell_top">
            {{ item.date }}
            <div class="week">({{ item.week }})</div>
          </div>
          <div class="cell_bottom flex_between">
            <div class="list">上午</div>
            <div class="list">下午</div>
          </div>
        </div>
      </div>
      <div v-if="data_list && data_list.length" class="table_body">
        <vue-scroll :ops="scrollOps">
          <div v-for="(item, index) in data_list" :key="index" class="row table_body_row flex_between">
            <div class="cell flex_center">
              <span @click="handleClickLeader(item)" class="pointer">{{ item.name }}</span>
            </div>
            <div v-for="(item1, index1) in header_list" :key="index1" class="cell flex_between">
              <div class="list">{{ item[item1.date] ? item[item1.date][0]?.morning : "" }}</div>
              <div class="list">{{ item[item1.date] ? item[item1.date][0]?.afternoon : "" }}</div>
            </div>
          </div>
        </vue-scroll>
      </div>
      <div class="empty_blcok" v-else>
        <a-empty description="暂无数据" />
      </div>
    </div>
  </div>
</template>
<script>
import mixins from "@/mixins/index.js";
export default {
  name: "LeaderActiveTable",
  mixins: [mixins],
  components: {},
  props: ["propData", "moduleObject", "header_list", "data_list", "form_data"],
  watch: {
    propData: {
      handler: function () {
        this.convertAttrToStyleObject();
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    handleClickLeader(item) {
      this.propData.clickFunction &&
        this.propData.clickFunction.length &&
        IDM.invokeCustomFunctions.apply(this, [
          this.propData.clickFunction,
          {
            item: item,
            _this: this,
          },
        ]);
    },
    getDomBg(item, isHeader) {
      var styleObject = {};
      if (item.week != "周六" && item.week != "周日" && !isHeader) {
        styleObject["background-color"] = "#FFFFFF";
      }
      return styleObject;
    },

    getUserPhoto(item) {
      if (item.photo) {
        return IDM.url.getWebPath(item.photo);
      } else {
        if (item.sex) {
          return IDM.url.getModuleAssetsWebPath(require(`../assets/default_girl.png`), this.moduleObject);
        } else {
          return IDM.url.getModuleAssetsWebPath(require(`../assets/default_boy.png`), this.moduleObject);
        }
      }
    },
    convertAttrToStyleObject() {
      var styleObject = {};
      var styleObjectHeader = {};
      var styleObjectCell = {};
      var styleObjectBody = {};
      var styleObjectBodyRow = {};
      if (this.propData.stripe && this.propData.bgColorStripe && this.propData.bgColorStripe.hex8) {
        styleObjectBodyRow["background-color"] = this.propData.bgColorStripe.hex8;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case "heightTableHeader":
              styleObjectHeader["height"] = element;
              styleObjectHeader["line-height"] = element;
              styleObjectCell["height"] = element;
              styleObjectCell["line-height"] = element;
              break;
            case "bgColorTableHeader":
              if (element && element.hex8) {
                styleObjectHeader["background-color"] = element.hex8;
              }
              break;
            case "maxHeightTableBody":
              styleObjectBody["max-height"] = element;
              break;
            case "heightTable":
              styleObject["height"] = element;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .LeaderActiveTable_app .table", styleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .LeaderActiveTable_app .table .table_header", styleObjectHeader);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .LeaderActiveTable_app .table .table_header .cell", styleObjectCell);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .LeaderActiveTable_app .table .table_body", styleObjectBody);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .LeaderActiveTable_app .table .table_body .row:nth-child(2n)", styleObjectBodyRow);
    },
    getStyleDataCancel(item) {
      var styleObject = {};
      if (item.state == 3) {
        styleObject["text-decoration"] = "line-through";
      }
      return styleObject;
    },
  },
};
</script>
<style lang="scss" scoped>
.LeaderActiveTable_app {
  height: 100%;
  .week_table {
    .table_body_row {
      background: #fffcf2;
    }
  }
  .table {
    height: 100%;
    .table_header {
      // height: 48px;
      padding-right: 0;
      text-align: center;
      background: #f4f9f8;
      border-top: 1px solid rgba(230, 230, 230, 1);
      border-right: 1px solid rgba(230, 230, 230, 1);
      border-left: 1px solid rgba(230, 230, 230, 1);
      border-bottom: 1px solid rgba(230, 230, 230, 1);
      .cell {
        width: 100%;
        align-items: stretch;
        flex-grow: 2;
        flex-shrink: 1;
        box-sizing: border-box;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        font-weight: 500;
        border-left: 1px solid rgba(230, 230, 230, 1);
        overflow: hidden;
        &:nth-child(1) {
          width: 122px;
          flex-grow: 0;
          flex-shrink: 0;
          border-left: none;
        }
        .cell_top {
          padding: 10px 0;
        }
        .cell_bottom {
          border-top: 1px solid rgba(230, 230, 230, 1);
          .list {
            width: 100%;
            height: 100%;
            padding: 10px 0;
            text-align: center;
            &:nth-child(1) {
              background: #fef4ec;
              border-right: 1px solid rgba(230, 230, 230, 1);
            }
            &:nth-child(2) {
              background: #e9f0ff;
            }
          }
        }
      }
    }
    .table_body {
      height: calc(100% - 101px);
      .table_body_row {
        padding-right: 0;
        align-items: stretch;
        border-bottom: 1px solid rgba(230, 230, 230, 1);
        border-right: 1px solid rgba(230, 230, 230, 1);
        border-left: 1px solid rgba(230, 230, 230, 1);
        .cell {
          width: 100%;
          flex-grow: 2;
          flex-shrink: 1;
          box-sizing: border-box;
          word-break: break-all;
          border-left: 1px solid rgba(230, 230, 230, 1);
          white-space: pre-line;
          &:nth-child(1) {
            width: 122px;
            flex-grow: 0;
            flex-shrink: 0;
            padding: 12px 0;
            border-left: none;
            background: #f4f9f8;
          }
          .list {
            width: 100%;
            height: 100%;
            align-items: stretch;
            padding: 12px 12px 12px 12px;
            &:nth-child(1) {
              border-right: 1px solid rgba(230, 230, 230, 1);
            }
          }
        }
        .day_active_block {
          background: white;
        }
        .leader_name {
          text-align: center;
        }
      }
    }
  }
  .empty_blcok {
    padding: 100px 0;
    border: 1px solid #e6e6e6;
    border-top: none;
  }
}
</style>
