<template>
<div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="IWeeklyWorkReview_app">
  <div class="IWeeklyWorkReview_app_header flex_start">
    <div class="line"></div>
    <div class="text">{{weekOrMonth}}</div>
  </div>
  <div class="form_block flex_start">
    <div class="form_item">
      <div class="select_box">
        <a-select v-model="leader" @change="e => handleChange(e,1)" allowClear>
          <a-select-option v-for="(item,index) in leaderList" :key="index" :value="item.value">
            {{ item.text }}
          </a-select-option>
        </a-select>
      </div>
    </div>
  </div>
  <div v-if="propData.showWld" class="table leader_table">
    <div class="table_header flex_between">
      <div class="table_header_left flex_start">
        <div class="icon"></div>
        <div class="text">委领导{{weekOrMonth}}</div>
      </div>
    </div>
    <div class="table_body">
      <vue-scroll :ops="scrollOps">
        <div v-if="table_data_leader && table_data_leader.length" class="table_body_block flex_start">
          <div v-for="(item,index) in table_data_leader" @click="clickItem(item,1)" :key="index" class="list flex_start">
            <div class="status" :class="item.updateStatus == 1 ? 'active' : ''"></div>
            <div class="name">{{ item.bt }}</div>
          </div>
        </div>
        <div class="empty_blcok" v-else>
          <a-empty description="暂无数据" />
        </div>
      </vue-scroll>
    </div>
  </div>
  <div class="footer_block flex_between" :style="`height:calc(100vh - ${propData.showWld ? 343 : 141 }px)`">
    <div class="table depart_table">
      <div class="table_header flex_between">
        <div class="table_header_left flex_start">
          <div class="icon"></div>
          <div class="text">机关处室{{weekOrMonth}}</div>
        </div>
      </div>
      <div class="table_body">
        <vue-scroll :ops="scrollOps">
          <div v-if="table_data_depart && table_data_depart.length" class="table_body_block flex_start">
            <div v-for="(item,index) in table_data_depart" @click="clickItem(item,2)" :key="index" class="list flex_start">
              <div class="status" :class="item.updateStatus == 1 ? 'active' : ''"></div>
              <div class="name">{{ item.bt }}</div>
            </div>
          </div>
          <div class="empty_blcok" v-else>
            <a-empty description="暂无数据" />
          </div>
        </vue-scroll>
      </div>
    </div>
    <div class="table unit_table">
      <div class="table_header flex_between">
        <div class="table_header_left flex_start">
          <div class="icon"></div>
          <div class="text">事业单位{{weekOrMonth}}</div>
        </div>
      </div>
      <div class="table_body">
        <vue-scroll :ops="scrollOps">
          <div v-if="table_data_unit && table_data_unit.length" class="table_body_block flex_start">
            <div v-for="(item,index) in table_data_unit" @click="clickItem(item,3)" :key="index" class="list flex_start">
              <div class="status" :class="item.updateStatus == 1 ? 'active' : ''"></div>
              <div class="name">{{ item.bt }}</div>
            </div>
          </div>
          <div class="empty_blcok" v-else>
            <a-empty description="暂无数据" />
          </div>
        </vue-scroll>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import mixins from "@/mixins/index.js";

export default {
  name: 'IWeeklyWorkReview',
  mixins: [mixins],
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        fontContent: "Hello Word",
        showWld:false,
        scheduleType:'2'
      },
      leader: '',
      leaderList: [],
      table_data_leader: [],
      table_data_depart: [],
      table_data_unit: [],
    }
  },
  props: {},
  created() {
    this.moduleObject = this.$root.moduleObject
    this.convertAttrToStyleObject();
    this.getLeaderDepartUnitList()
    this.getDefaultValue()
  },
  mounted() {

  },
  computed:{
    weekOrMonth(){
      return this.propData.scheduleType == '1' ? '一周工作安排':'月度工作要点'
    }
  },
  destroyed() {},
  methods: {
    getDefaultValue() {
      let value = IDM.url.queryString("value");
      if(value && value != 'undefined') {
        this.leader = value;
      }
    },
    clickItem(item,type) {
      this.propData.clickFunction && this.propData.clickFunction.length && IDM.invokeCustomFunctions.apply(this,[this.propData.clickFunction,{
        item: item,
        type: type,
        _this: this
      }])
    },
    getLeaderDepartUnitList() {
      IDM.http.get(this.propData.optionDataUrl,{

      }).then((res) => {
        if ( res.data.code == '200' ) {
          this.leaderList = res.data.data.selectArray || [];
          if(!this.leader) {
            this.leader = this.leaderList[0]?.value;
          }
          this.getTableData()
        }
      }).catch((err) => {
          console.log(err)
      })
    },
    getTableData() {
      this.getLeaderTableData()
    },
    getLeaderTableData() {
      IDM.http.get(this.propData.listDataUrl,{
        date: this.leader
      }).then((res) => {
        if ( res.data.code == '200' ) {
          this.table_data_leader = res.data.data.wldList;
          this.table_data_depart = res.data.data.deptList;
          this.table_data_unit = res.data.data.unitList;
        }
      }).catch((err) => {
          console.log(err)
      })
    },
    handleChange(e,type) {
      console.log(e);
      this.getTableData()
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
        styleObject["background-size"] = (this.propData.bgSizeWidth ? this.propData.bgSizeWidth.inputVal + this.propData.bgSizeWidth.selectVal : "auto") + " " + (this.propData.bgSizeHeight ? this.propData.bgSizeHeight.inputVal + this.propData.bgSizeHeight.selectVal : "auto")
      } else if (this.propData.bgSize) {
        styleObject["background-size"] = this.propData.bgSize;
      }
      if (this.propData.positionX && this.propData.positionX.inputVal) {
        styleObject["background-position-x"] = this.propData.positionX.inputVal + this.propData.positionX.selectVal;
      }
      if (this.propData.positionY && this.propData.positionY.inputVal) {
        styleObject["background-position-y"] = this.propData.positionY.inputVal + this.propData.positionY.selectVal;
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
              IDM.style.setBoxStyle(styleObject, element)
              break;
            case "bgImgUrl":
              styleObject["background-image"] = `url(${window.IDM.url.getWebPath(element)})`;
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
              IDM.style.setBorderStyle(styleObject, element)
              break;
            case "font":
              IDM.style.setFontStyle(styleObject, element)
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
        pageId: window.IDM.broadcast && window.IDM.broadcast.pageModule ?
          window.IDM.broadcast.pageModule.id :
          "",
        urlData: JSON.stringify(urlObject),
      };
      return params;
    },
    /**
     * 重新加载
     */
    reload() {
      this.getTableData()
    },
    /**
     * 通用的获取表达式匹配后的结果
     */
    getExpressData(dataName, dataFiled, resultData) {
      //给defaultValue设置dataFiled的值
      var _defaultVal = undefined;
      if (dataFiled) {
        var filedExp = dataFiled;
        filedExp =
          dataName +
          (filedExp.startsWiths("[") ? "" : ".") +
          filedExp;
        var dataObject = {
          IDM: window.IDM
        };
        dataObject[dataName] = resultData;
        _defaultVal = window.IDM.express.replace.call(
          this,
          "@[" + filedExp + "]",
          dataObject
        );
      }
      //对结果进行再次函数自定义
      if (this.propData.customFunction && this.propData.customFunction.length > 0) {
        var params = this.commonParam();
        var resValue = "";
        try {
          resValue = window[this.propData.customFunction[0].name] && window[this.propData.customFunction[0].name].call(this, {
            ...params,
            ...this.propData.customFunction[0].param,
            moduleObject: this.moduleObject,
            expressData: _defaultVal,
            interfaceData: resultData
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
      console.log("组件收到消息", object)
      // 配置了刷新KEY，消息类型是websocket，收到的消息对象有message并不为空
      if(this.propData.messageRefreshKey && this.propData.messageRefreshKey.length && object.type === 'websocket' && object.message){
        const messageData = typeof object.message === 'string' && JSON.parse(object.message) || object.message
        const arr = this.propData.messageRefreshKey || [];
        if(messageData.badgeType && arr.includes(messageData.badgeType)){
          this.reload()
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
    }
  }
}
</script>
<style lang="scss" scoped>
.IWeeklyWorkReview_app{
  padding: 0 20px 20px 20px;
  background: white;
  .IWeeklyWorkReview_app_header{
    padding: 14px 10px;
    border-bottom: 1px solid rgba(216,216,216,1);;
    .line{
      width: 4px;
      height: 20px;
      margin-right: 12px;
      background: #3389E0;
    }
    .text{
      font-family: PingFangSC-Regular;
      font-size: 18px;
      color: #333333;
      letter-spacing: 0;
      font-weight: 400;
    }
  }
  .form_block{
    margin-top: 18px;
    .select_box{
      width: 300px;
      .ant-select{
        width: 100%;
      }
    }
  }
  .leader_table{
    height: 184px;
    margin-top: 18px;
    .table_body_block{
      height: calc(100% - 48px);
      flex-wrap: wrap;
      padding: 20px 50px;
      .list{
        width: 20%;
        padding: 15px 10px;
        
      }
    }
  }
  .table{
    overflow: hidden;
    border: 1px solid rgba(216,216,216,1);
    border-radius: 10px;
    .table_header{
      height: 48px;
      padding: 0 13px 0 10px;
      background: #EDF5FF;
      border-bottom: 1px solid rgba(216,216,216,1);
      // border-radius: 10px 10px 0px 0px;
      .icon{
        width: 8px;
        height: 10px;
        margin-right: 8px;
        background: #3389E0;
      }
      
    }
    .table_body{
      height: calc(100% - 48px);
      position: relative;
      .status{
        width: 10px;
        height: 10px;
        flex-shrink: 0;
        flex-grow: 0;
        margin-right: 10px;
        border-radius: 50%;
        background: #D8D8D8;
        &.active{
          background: #78E530;
        }
      }
      .name{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        font-weight: 400;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .empty_blcok{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
      }
    }
  }
  .footer_block{
    height: calc(100vh - 343px);
    margin-top: 15px;
    .table{
      width: 50%;
      height: 100%;
      .table_body_block{
        flex-wrap: wrap;
        padding: 6px 14px;
        .list{
          width: 50%;
          height: 54px;
          padding: 0 10px;
          &:nth-child(4n){
            background: #F9F9F9;
          }
          &:nth-child(4n-1){
            background: #F9F9F9;
          }
        }
      }
    }
    .depart_table{
      margin-right: 10px;
    }
    .unit_table{
      margin-left: 10px;
    }
  }
}
</style>
