<template>
  <div class="agenda-table-horizontal">
    <table
      class="agenda-table-horizontal-main"
      border="1"
      cellspacing="0"
      ref="table"
    >
      <colgroup>
        <col
          :width="`${index === 0 ? '150' : thAuto ? 'auto' : '200'}`"
          v-for="(item, index) in header_list"
          :key="index"
        />
      </colgroup>
      <thead>
        <tr>
          <template v-for="(item, index) in header_list">
            <th v-if="item.userId == 0" class="td-title" :key="index">
              {{ item.userName }}
            </th>
            <th v-else :key="index" class="th-user">
              <div class="user_info">
                <div v-if="setting_data.leaderImageShow != 1" class="img_box">
                  <img :src="getUserPhoto(item)" alt="" />
                </div>
                <div class="td-username">{{ item.userName }}</div>
              </div>
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(time, ti) in data_list" :key="ti">
          <template v-for="(header, hi) in header_list">
            <td v-if="header.userId == 0" class="td-time" :key="hi">
              <span>{{ time.name }}</span>
            </td>
            <td v-else :key="hi" class="active_block">
              <div
                v-if="
                  time.data &&
                  time.data[header.userId] &&
                  time.data[header.userId].data &&
                  time.data[header.userId].data.length
                "
                class="block"
              >
                <div
                  @click="editActive(todo)"
                  v-for="(todo, index) in getActiveList(
                    time.data[header.userId].data
                  )"
                  :key="index"
                  class="active_list"
                  :style="getStyleDataCancel(todo)"
                >
                  <div
                    class="row flex_start time_name_row"
                    :style="getStyleData(todo)"
                  >
                    <div
                      v-if="!setting_data.iconDescShow"
                      class="img_box flex_center"
                    >
                      <img class="clock_img" src="@/assets/clock.png" alt="" />
                    </div>
                    <span v-if="getShowStatus('0')" class="time">{{
                      todo.time
                    }}</span>
                    <SvgIcon v-if="todo.hasAnnex" icon-class="file"></SvgIcon>
                    <span v-if="getShowStatus('1')" class="name">{{
                      todo.bt
                    }}</span>
                  </div>
                  <div class="row flex_start address_block">
                    <div
                      v-if="!setting_data.iconDescShow"
                      class="img_box flex_center"
                    >
                      <img
                        class="address_img"
                        src="@/assets/address.png"
                        alt=""
                      />
                    </div>
                    <span class="address">
                      <span v-if="getShowStatus('2')">{{ todo.place }}</span>
                    </span>
                  </div>
                  <div v-if="getShowStatus('6')" class="row flex_start">
                    <div class="img_box flex_center">
                      <img class="" src="@/assets/host.png" alt="" />
                    </div>
                    <span class="address"> {{ todo.host }} </span>
                  </div>
                  <div v-if="getShowStatus('6')" class="row flex_start">
                    <div class="img_box flex_center">
                      <img class="" src="@/assets/content.png" alt="" />
                    </div>
                    <span class="address"> {{ todo.content }} </span>
                  </div>
                  <div v-if="getShowStatus('4')" class="row flex_start">
                    <div class="img_box flex_center">
                      <img class="" src="@/assets/participants.png" alt="" />
                    </div>
                    <span class="address"> {{ todo.participants }} </span>
                  </div>

                  <div
                    v-if="todo.isBusy == '1'"
                    class="row flex_start busy_block"
                  >
                    <div class="img_box flex_center">
                      <img class="" src="@/assets/busy.png" alt="" />
                    </div>
                    <span class="busy">忙碌</span>
                  </div>
                </div>
              </div>
              <div v-else class="empty">
                {{
                  setting_data.emptyShowType == 2 ||
                  setting_data.emptyShowType == 1
                    ? ""
                    : "单位内办公"
                }}
              </div>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import SvgIcon from "../icons/SvgIcon.vue";

export default {
  name: "AgendaTableVertical",
  components: {
    SvgIcon,
  },
  props: [
    "propData",
    "moduleObject",
    "header_list",
    "data_list",
    "setting_data",
    "isPreview",
  ],
  watch: {
    propData: {
      handler: function () {
        this.convertAttrToStyleObject();
      },
      immediate: true,
      deep: true,
    },
    header_list: {
      handler: function () {
        this.getLastThWidth();
      },
      immediate: true,
      deep: true,
    },
    data_list: {
      handler: function () {
        this.getLastThWidth();
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      thAuto: true,
    };
  },
  created() {
    console.log("isPreview", this.isPreview);
  },
  methods: {
    getLastThWidth() {
      this.$nextTick(() => {
        const lastThEle = this.$refs.table.querySelector(
          "thead tr th:last-child"
        );
        if(lastThEle){
          const width = lastThEle.offsetWidth;
          this.thAuto = width > 200;
        }
      });
    },
    getDomBg(item, is_header) {
      var styleObject = {};
      if (item.week == "周六" || item.week == "周日") {
        styleObject["background-color"] = "#FFFCF2";
      }
      if (is_header) {
        // styleObject['border-bottom'] = '1px solid rgb(230, 230, 230)';
      }
      return styleObject;
    },
    getActiveList(data) {
      if (!this.isPreview) {
        return data;
      }
      let result = [];
      data.forEach((item) => {
        if (item.state != 0) {
          result.push(item);
        }
      });
      return result;
    },
    editActive(item) {
      if (!item.clickUrl) {
        return;
      }
      let that = this;
      IDM.layer.open({
        type: 2,
        area: ["1200px", "90%"],
        content: IDM.url.getWebPath(item.clickUrl),
        success: function (layero, index) {
          top.close = function () {
            IDM.layer.close(index);
            that.$emit("updateTableData");
          };
        },
        // end: function () {
        //     that.$emit('updateTableData')
        // },
      });
    },
    getShowStatus(data) {
      if (
        this.setting_data &&
        this.setting_data.viewColumn &&
        this.setting_data.viewColumn.includes(data)
      ) {
        if (data == "6" && this.setting_data.busyDetailShow == 1) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    getUserPhoto(item) {
      if (item.photo) {
        return IDM.url.getWebPath(item.photo);
      } else {
        return IDM.url.getModuleAssetsWebPath(
          require("../assets/default_avatar.png"),
          this.moduleObject
        );
      }
    },
    convertAttrToStyleObject() {
      var styleObject = {};
      var styleObjectHeader = {};
      var styleObjectCell = {};
      var styleObjectBody = {};
      var styleObjectBodyRow = {};
      if (
        this.propData.stripe &&
        this.propData.bgColorStripe &&
        this.propData.bgColorStripe.hex8
      ) {
        styleObjectBodyRow["background-color"] =
          this.propData.bgColorStripe.hex8;
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
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + " .agenda-table-horizontal .table",
        styleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + " .agenda-table-horizontal .table .table_header",
        styleObjectHeader
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .agenda-table-horizontal .table .table_header .cell",
        styleObjectCell
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + " .agenda-table-horizontal .table .table_body",
        styleObjectBody
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .agenda-table-horizontal .table .table_body .row:nth-child(2n)",
        styleObjectBodyRow
      );
    },
    getStyleDataCancel(item) {
      var styleObject = {};
      if (item.state == 3) {
        styleObject["text-decoration"] = "line-through";
      }
      return styleObject;
    },
    getStyleData(item) {
      var styleObject = {};
      switch (item.state) {
        case 1:
          styleObject["color"] = "#0086D9";
          break;
        case 2:
          styleObject["color"] = "#FFA500";
          break;
        case 0:
          styleObject["color"] = "#E30000";
          break;
        default:
          break;
      }
      return styleObject;
    },
  },
};
</script>
<style lang="scss" scoped>
.agenda-table-horizontal {
  width: 100%;
  height: calc(100% - 108px);
  overflow: auto;
  border: 1px solid #ddd;
  position: relative;

  ::v-deep .simplebar-scrollbar:before {
    background-color: #e8e8e8;
  }
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #ccc;
  }
  &::-webkit-scrollbar-track {
    border-radius: 0;
    background: transparent;
  }

  .agenda-table-horizontal-main {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    border: 1px solid rgba(230, 230, 230, 1);
    text-align: center;
    th,
    td {
      padding: 0;
      margin: 0;
    }
    thead th {
      height: 64px;
      background: #f9fcfe;
      font-size: 20px;
      color: #333333;
      position: sticky;
      top: 0;
      z-index: 2;
    }
    .td-title {
      // width: 152px;
      font-size: 16px;
      color: #333333;
      font-weight: 500;
      left: 0;
      z-index: 3;
    }
    .td-time {
      width: 100%;
      font-size: 16px;
      color: #333333;
      font-weight: 500;
      position: sticky;
      left: 0;
      z-index: 1;
      background-color: #fff;
    }
    .th-user {
      // width: 200px;
    }
    .user_info {
      display: flex;
      justify-content: center;
      align-items: center;
      .name {
        font-size: 20px;
        color: #333333;
        text-align: center;
        font-weight: 500;
      }
      .img_box {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        margin-right: 12px;
        overflow: hidden;
        img {
          object-fit: cover;
        }
      }
    }
    .active_block {
      padding: 10px;
      .active_list {
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px dotted #979797;
        &:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        .time_name_row {
          .svg-icon {
            font-size: 14px;
            margin-right: 5px;
          }
        }
        .address_block {
          align-items: flex-start;
          .address_img {
            flex-shrink: 0;
            position: relative;
            top: 3px;
          }
        }
        .busy_block {
          margin-top: 1px;
        }
        .time {
          margin-right: 20px;
        }
        .img_box {
          width: 20px;
          height: 20px;
          margin-right: 5px;
          flex-shrink: 0;
          .clock_img {
            width: 16px;
            height: 16px;
          }
          .address_img {
            width: 14px;
            height: 16px;
          }
          img {
            width: 16px;
          }
        }
        .time,
        .name,
        .address,
        .busy {
          font-size: 16px;
          line-height: 22px;
          font-weight: 400;
          word-wrap: break-word;
        }
        .address {
          span {
            margin-left: 30px;
            &:nth-child(1) {
              margin-left: 0;
            }
          }
        }
      }
    }
  }

  .table {
    display: flex;
    border: 1px solid rgba(230, 230, 230, 1);
    .table_header {
      display: flex;
      flex-direction: column;
      width: 152px;
      flex-shrink: 0;
      text-align: center;
      background: #f9fcfe;
      .cell {
        min-height: 200px;
        width: 100%;
        flex-grow: 2;
        flex-shrink: 1;
        box-sizing: border-box;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        font-weight: 500;
        border-right: 1px solid rgba(230, 230, 230, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid rgb(230, 230, 230);
        &:last-child {
          border-bottom: none;
        }
        &:nth-child(1) {
          min-height: auto;
          height: 64px;
          flex-grow: 0;
          flex-shrink: 0;
        }
      }
    }
    .table_body {
      display: flex;
      width: 100%;
      overflow: auto;
      & > .row {
        min-width: 240px;
        width: 100%;
        // height: 100%;
        flex-grow: 2;
        flex-shrink: 1;
        display: flex;
        flex-direction: column;
        border-right: 1px solid rgba(230, 230, 230, 1);
        border-bottom: 1px solid rgba(230, 230, 230, 1);
        align-items: stretch;
        &:last-child {
          border-right: none;
        }
        .cell {
          width: 100%;
          height: 200px;
          box-sizing: border-box;
          padding: 12px 12px 16px 12px;
          border-bottom: 1px solid rgba(230, 230, 230, 1);
          flex-grow: 2;
          flex-shrink: 1;
          overflow: auto;
          &:last-child {
            border-bottom: none;
          }
          &:nth-child(1) {
            height: 64px;
            flex-grow: 0;
            flex-shrink: 0;
            padding: 12px;
            text-align: center;
            overflow: hidden;
          }

          .user_info {
            display: flex;
            justify-content: center;
            align-items: center;
            .name {
              font-size: 20px;
              color: #333333;
              text-align: center;
              font-weight: 500;
            }
            .img_box {
              width: 40px;
              height: 40px;
              border-radius: 4px;
              margin-right: 12px;
              overflow: hidden;
              img {
                object-fit: cover;
              }
            }
          }
          .empty {
            font-size: 16px;
            color: #0086d9;
            font-weight: 400;
          }
        }
      }
    }
  }
}
</style>
