<template>
  <div class="ActiveItem_app">
    <div v-if="item2 && item2.morningContent" class="morning">
      <span>上午：</span>{{ item2.morningContent }}
    </div>
    <div v-if="item2 && item2.afternoonContent" class="afternoon">
      <span>下午：</span>{{ item2.afternoonContent }}
    </div>
  </div>
</template>
<script>

export default {
  name: "ActiveItem",
  components: {
  },
  props: ["item2"],
  data() {
    return {};
  },
  created() {
  },
  methods: {
    getShowStatus(data, item) {
      // data为-1表示结束时间
      if (
        data == "-1" &&
        item.isBusy == "1" &&
        !item.mySchedule &&
        this.setting_data &&
        !this.setting_data.hasPermission
      ) {
        return true;
      }
      if (
        this.setting_data &&
        this.setting_data.viewColumn &&
        this.setting_data.viewColumn.includes(data)
      ) {
        // 判断忙碌不显示时条件
        if (
          data != "0" &&
          item.isBusy == "1" &&
          !item.mySchedule &&
          this.setting_data &&
          !this.setting_data.hasPermission
        ) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
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
.ActiveItem_app {
  text-align: left;
  .time_name_row {
    .svg-icon {
      font-size: 14px;
      margin-right: 5px;
    }
  }
  & > .row {
    align-items: flex-start;
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
  .svg_box {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    flex-shrink: 0;
    .svg-icon {
      font-size: 16px;
      margin: 0;
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
    word-break: break-all;
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
</style>