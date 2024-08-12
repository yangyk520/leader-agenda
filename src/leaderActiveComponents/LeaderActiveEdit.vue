<template>
  <div class="LeaderActiveEdit_app">
    <div class="table">
      <div class="table_header flex_between">
        <div v-for="(item,index) in header_list" :key="index" class="cell">
          {{ item.name }}
        </div>
      </div>
      <div v-if="data_list_table && data_list_table.length" class="table_body">
        <vue-scroll :ops="scrollOps">
          <div v-for="(item,index) in data_list_table" :key="index" class="row table_body_row flex_between">
            <div v-for="(item1,index1) in header_list" :key="index1" class="cell">
              <div class="day_active_block" v-if="item1.key == 'date' || item1.key == 'day'">
                <div>{{ week_number[index] }}</div>
                <div>{{ item[item1.key] }}</div>
              </div>
              <div v-else>
                  <a-textarea v-if="viewModel==2" v-model="item.subList[0][item1.key]" placeholder="请输入" :auto-size="{ minRows: 3, maxRows: 5 }"></a-textarea>
                   <template v-else>
                      <div class="inner-item" v-for="(inner,iindex) in item[item1.key]" :key="iindex">
                        <span>{{inner.time}}</span>
                        <span>{{inner.content}}</span>
                      </div>
                   </template>
              </div>
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
  name: "LeaderActiveEdit",
  mixins: [mixins],
  components: {
  },
  props: {
    propData: {
      type: Object,
      default() {
        return {};
      },
    },
    moduleObject: {
      type: Object,
      default() {
        return {};
      },
    },
    form_data: {
      type: Object,
      default() {
        return {};
      },
    },
    data_list_table: {
      type: Array,
      default() {
        return []
      }
    },
    viewModel: {
      type: String,
      default: '2',// 1标识预览
    },
  },
  watch: {
    propData: {
      handler: function () {
        this.convertAttrToStyleObject();
      },
      immediate: true,
      deep: true,
    }
  },
  data() {
    const header_list = [
      // {
      //   name: '序号',
      //   key: 'index'
      // },
      {
        name: this.viewModel==2?'日期':'日程',
        key: this.viewModel==2?'date':'day'
      },
      {
        name: '上午',
        key: this.viewModel==2?'morningContent':'morningSchedule'
      },
      {
        name: '下午',
        key: this.viewModel==2?'afternoonContent':'afternoonSchedule'
      }
    ]
    if(this.viewModel==2){
      header_list.push({
        name: '晚上',
        key: 'nightContent'
      })
    }
    return {
      header_list,
      week_number: ['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
    };
  },
  created() {
  },
  methods: {
    getUserPhoto(item) {
      if (item.photo) {
        return IDM.url.getWebPath(item.photo);
      } else {
        if (item.sex) {
          return IDM.url.getModuleAssetsWebPath(
            require(`../assets/default_girl.png`),
            this.moduleObject
          );
        } else {
          return IDM.url.getModuleAssetsWebPath(
            require(`../assets/default_boy.png`),
            this.moduleObject
          );
        }
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
        this.moduleObject.id + " .AgendaTableVertical_app .table",
        styleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + " .AgendaTableVertical_app .table .table_header",
        styleObjectHeader
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .AgendaTableVertical_app .table .table_header .cell",
        styleObjectCell
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + " .AgendaTableVertical_app .table .table_body",
        styleObjectBody
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id +
          " .AgendaTableVertical_app .table .table_body .row:nth-child(2n)",
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
  },
};
</script>
<style lang="scss" scoped>
.LeaderActiveEdit_app {
  height: calc(100% - 88px);
  .week_table{
    .table_body_row{
      background: #FFFCF2;
    }
  }
  .table {
    height: 100%;
    .table_header {
      // height: 48px;
      padding-right: 8px;
      text-align: center;
      background: #f9fcfe;
      border-top: 1px solid rgba(230, 230, 230, 1);
      border-right: 1px solid rgba(230, 230, 230, 1);
      border-bottom: 1px solid rgba(230, 230, 230, 1);
      .cell {
        width: 100%;
        height: 48px;
        line-height: 48px;
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
          width: 152px;
          flex-grow: 0;
          flex-shrink: 0;
          // border-left: 1px solid rgba(230, 230, 230, 1);
        }
      }
    }
    .table_body {
      height: calc(100% - 48px);
      .table_body_row {
        padding-right: 8px;
        align-items: stretch;
        border-bottom: 1px solid rgba(230, 230, 230, 1);
        border-right: 1px solid rgba(230, 230, 230, 1);
        .cell {
          width: 100%;
          flex-grow: 2;
          flex-shrink: 1;
          box-sizing: border-box;
          padding: 12px 12px 16px 12px;
          word-break: break-all;
          border-left: 1px solid rgba(230, 230, 230, 1);
          &:nth-child(1) {
            width: 152px;
            flex-grow: 0;
            flex-shrink: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            text-align: center;
          }
        }
        .day_active_block{
          
          background: white;
        }
        .inner-item {
          margin-bottom: 10px;
          line-height: 16px;
          &:last-child{
            margin-bottom: 0;
          }
          display: flex;
          span:first-child {
            min-width: 50px;
          }
        }
      }
    }
  }
  .empty_blcok{
    padding: 100px 0;
    border: 1px solid #e6e6e6;
    border-top: none;
  }
}
</style>