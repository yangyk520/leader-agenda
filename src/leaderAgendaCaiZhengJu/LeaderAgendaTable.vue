<template>
  <div class="LeaderActiveEdit_app" :id="id">
    <div class="table">
      <div class="table_header flex_between">
        <div v-for="(item,index) in header_list" :key="index" :style="getCellStyle(item)" class="cell">
          {{ item.label }}
        </div>
      </div>
      <div v-if="data_list_table && data_list_table.length" class="table_body">
        <vue-scroll :ops="scrollOps">
          <div v-for="(item,index) in data_list_table" :key="index" class="row table_body_row flex_between">
            <div v-for="(item1,index1) in header_list" :key="index1" :style="getCellStyle(item1)" class="cell">
              <template v-if="item1.key == 'type'">
                {{ item[item1.key] }}
              </template>
              <template v-else>
                <div v-if="item[item1.key]?.length" class="active_block">
                  <div @click="editActive(item2)" v-for="(item2,index2) in item[item1.key]" :key="index2" class="active_list" :style="getStyleDataCancel(item2)">
                    <ActiveItem :item2="item2"></ActiveItem>
                  </div>
                </div>
                <div class="btn-add" @click="addHanlder(item1.key,item.type)"><svg-icon icon-class="add-new"></svg-icon></div>
              </template>
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
import ActiveItem from './ActiveItem.vue'
import mixins from "@/mixins/index.js";
export default {
  name: "LeaderAgendaTable",
  mixins: [mixins],
  components: {
    ActiveItem
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
    data_list_table: {
      type: Array,
      default() {
        return []
      }
    },
    header_list: {
      type: Array,
      default() {
        return []
      }
    }
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
    return {
      id: IDM.UUID(),
      week_number: ['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
    };
  },
  created() {

  },
  methods: {
    addHanlder(date,now){
      IDM.layer.open({
        type: 2,
        title: ["单位领导活动", "font-size:18px;"],
        area: ["1200px", "90%"],
        content: IDM.url.getWebPath( `ctrl/formControl/form?moduleId=240821173209i4sYjb4HrBVwcsEbRmm&startDate=${date}&type=${now == '上午' ? 1 : 2}` ),
        success: (layero, index) => {
          top.close = () => {
            IDM.layer.close(index);
            this.$emit('updateTableDate')
          };
        },
        end: () => {
          this.$emit('updateTableDate')
        },
      });
    },
    editActive(item) {
      console.log(item)
      IDM.layer.open({
        type: 2,
        title: ["单位领导活动", "font-size:18px;"],
        area: ["1200px", "90%"],
        content: IDM.url.getWebPath( item.url ),
        success: (layero, index) => {
          top.close = () => {
            IDM.layer.close(index);
          };
        },
        end: () => {
          console.log('end')
          this.$emit('updateTableDate')
        },
      });

    },
    getCellStyle(item) {
      if(item.width) {
        return {
          width: item.width
        }
      } else {
        return {}
      }
    },
    getInnerHtml(item,item1) {
      if(item1.renderFunction && item1.renderFunction.length) {
        let result = IDM.invokeCustomFunctions.apply(this,[item1.renderFunction,{
          item,
          item1,
          _this: this
        }])
        if(result && result[0]) {
          return result[0]
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    addAgendaItem(item,item1) {
      let dayType, dateStart, dateEnd;
      if(item1.key == 'am') {
        dayType = '1';
        dateStart = item.date + ' ' + '09:00';
        dateEnd = item.date + ' ' + '09:30'
      } else {
        dayType = '2';
        dateStart = item.date + ' ' + '13:30';
        dateEnd = item.date + ' ' + '14:00'
      }
      this.$emit('handleAddData',{
        dayType,
        dateStart,
        dateEnd
      })
    },
    getItemStatus(item) {
      if(item.jjcd == 1) {
        return 'important'
      } else if (item.jjcd== 2) {
        return 'repeat'
      } else {
        return ''
      }
    },
    handleClickAgendaItem(item) {
      this.propData.agendaClickFunction && this.propData.agendaClickFunction.length && IDM.invokeCustomFunctions.apply(this,[this.propData.agendaClickFunction,{
        item: item,
        _this: this
      }])
    },
    deleteAgenda(item) {
      let that = this;
      this.$confirm({
        title: '提示',
        content: '删除此日程，是否确认？',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk() {
          that.$emit('handleDeleteData',item)
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    convertAttrToStyleObject() {
      var styleObject = {};
      var styleObjectHeader = {};
      var styleObjectCell = {};
      var styleObjectBody = {};
      var styleObjectBodyRow = {};
      if ( this.propData.stripe && this.propData.bgColorStripe && this.propData.bgColorStripe.hex8 ) {
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
      window.IDM.setStyleToPageHead(
        this.id + " .table",
        styleObject
      );
      window.IDM.setStyleToPageHead(
        this.id + " .table .table_header",
        styleObjectHeader
      );
      window.IDM.setStyleToPageHead(
        this.id +
          " .table .table_header .cell",
        styleObjectCell
      );
      window.IDM.setStyleToPageHead(
        this.id + " .table .table_body",
        styleObjectBody
      );
      window.IDM.setStyleToPageHead( this.id + " .table .table_body .row:nth-child(2n)", styleObjectBodyRow );
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
  height: calc(100% - 120px);
  margin-top: 18px;
  padding-bottom: 25px;
  flex: 1;
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
          position: relative;
          flex-grow: 2;
          flex-shrink: 1;
          box-sizing: border-box;
          padding: 12px 20px 12px 20px;
          word-break: break-all;
          font-size: 14px;
          border-left: 1px solid rgba(230, 230, 230, 1);
          min-height: 132px;
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
          .active_block{
            .active_list{
              cursor: pointer;
              margin-bottom: 16px;
              padding-bottom: 16px;
              border-bottom: 1px dotted #979797;
              &:last-child{
                  margin-bottom: 0;
                  padding-bottom: 0;
                  border-bottom: none;
              }
            }
          }

          .btn-add {
            position: absolute;
            right: 2px;
            bottom: 0;
            font-size: 20px;
            cursor: pointer;
            color:#0086d9;
          }
        }
      }
      .note{
        .cell{
          &:nth-child(1){
            background: gainsboro;
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