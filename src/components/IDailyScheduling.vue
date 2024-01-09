<template>
  <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="IDailyScheduling_app">
    <div class="scroll_block">
      <div class="IDailyScheduling_header flex_between">
        <div class="left flex_start">
          <div class="button_box">月</div>
          <div class="button_box">返回今天</div>
        </div>
        <div class="center flex_center">
          <div class="select_box">
            <a-select v-model="select_year">
              <a-select-option v-for="(item,index) in getYearsList()" :key="index" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </div>
          <span>年</span>
          <div class="select_box">
            <a-select v-model="select_month">
              <a-select-option v-for="(item,index) in getMonthsList()" :key="index" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </div>
          <span>月</span>
        </div>
        <div class="right flex_end">
          <div class="button_box">综合排班</div>
          <div class="button_box">重置</div>
        </div>
      </div>
      <div class="table">
        <div class="table_header flex_between">
          <div v-for="(item,index) in table_header" :key="index" class="cell">
            {{ item.label }}
          </div>
        </div>
        <div class="table_body">
          <div v-for="(item,index) in data_list" :key="index" class="row flex_between">
            <div v-for="(item1,index1) in table_header" :key="index1" class="cell">
              <div class="cell_header flex_between">
                <div class="left flex_start">
                  <span>休</span>
                </div>
                <div class="right flex_end">
                  <span>二十</span>
                  <span>26日</span>
                </div>
              </div>
              <div class="cell_body">
                <template>
                  <div v-for="(item2,index2) in item[item1.value].dayduty" :key="index2" class="day_duty flex_between">
                    <div class="left flex_start">
                      <div v-for="(item3,index3) in item2.person" :key="index3" class="person_list flex_start">
                        <span>{{ item3.name }}</span>
                        <img :src="getAssetsImg('man')" alt="">
                      </div>
                    </div>
                    <div class="right">
                      <img :src="getAssetsImg('dayduty')" alt="">
                    </div>
                  </div>
                </template>
                <template>
                  <div v-for="(item2,index2) in item[item1.value].nightduty" :key="index2" class="day_duty flex_between">
                    <div class="left flex_start">
                      <div v-for="(item3,index3) in item2.person" :key="index3" class="person_list flex_start">
                        <span>{{ item3.name }}</span>
                        <img :src="getAssetsImg('man')" alt="">
                      </div>
                    </div>
                    <div class="right">
                      <img :src="getAssetsImg('dayduty')" alt="">
                    </div>
                  </div>
                </template>
                <template>
                  <div v-for="(item2,index2) in item[item1.value].leader" :key="index2" class="day_duty flex_between">
                    <div class="left flex_start">
                      <div v-for="(item3,index3) in item2.person" :key="index3" class="person_list flex_start">
                        <span>{{ item3.name }}</span>
                        <img :src="getAssetsImg('man')" alt="">
                      </div>
                    </div>
                    <div class="right">
                      <img :src="getAssetsImg('dayduty')" alt="">
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IDailyScheduling',
  components:{
    
  },
  data(){
    return {
      moduleObject:{},
      propData:this.$root.propData.compositeAttr||{
        startYear: 2000,
        endYear: 2030,
        defaultYear: 2024,
        defaultMonth: 10
      },
      select_year: '',
      select_month: '',
      table_header: [
        {
          label: '周日',
          value: 'Sunday'
        },
        {
          label: '周一',
          value: 'Monday'
        },
        {
          label: '周二',
          value: 'Tuesday'
        },
        {
          label: '周三',
          value: 'Wednesday'
        },
        {
          label: '周四',
          value: 'Thursday'
        },
        {
          label: '周五',
          value: 'Friday'
        },
        {
          label: '周六',
          value: 'Saturday'
        }
      ],
      data_list: [
        {
          Sunday: {
            dayduty: [
              {
                person: [
                  {
                    name: '李军',
                    sex: 1
                  },
                  {
                    name: '王楠',
                    sex: 2
                  },
                  {
                    name: '费玉清',
                    sex: 2
                  }
                ]
              }
            ],
            nightduty: [
              {
                person: [
                  {
                    name: '李军',
                    sex: 1
                  },
                  {
                    name: '王楠',
                    sex: 2
                  },
                  {
                    name: '费玉清',
                    sex: 2
                  }
                ]
              }
            ],
            leader: [
              {
                person: [
                  {
                    name: '李军',
                    sex: 1
                  },
                  {
                    name: '王楠',
                    sex: 2
                  },
                  {
                    name: '费玉清',
                    sex: 2
                  }
                ]
              }
            ]
          },
          Monday: {},
          Tuesday: {},
          Wednesday: {},
          Thursday: {},
          Friday: {},
          Saturday: {},
        },
        {
          Sunday: {},
          Monday: {},
          Tuesday: {},
          Wednesday: {},
          Thursday: {},
          Friday: {},
          Saturday: {},
        },
        {
          Sunday: {},
          Monday: {},
          Tuesday: {},
          Wednesday: {},
          Thursday: {},
          Friday: {},
          Saturday: {},
        },
        {
          Sunday: {},
          Monday: {},
          Tuesday: {},
          Wednesday: {},
          Thursday: {},
          Friday: {},
          Saturday: {},
        },
        {
          Sunday: {},
          Monday: {},
          Tuesday: {},
          Wednesday: {},
          Thursday: {},
          Friday: {},
          Saturday: {},
        },
        {
          Sunday: {},
          Monday: {},
          Tuesday: {},
          Wednesday: {},
          Thursday: {},
          Friday: {},
          Saturday: {},
        }
      ],
    }
  },
  props: {
  },
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.convertAttrToStyleObject();
  },
  mounted() {},
  destroyed() {},
  methods:{
    getAssetsImg(name) {
      return IDM.url.getModuleAssetsWebPath(require(`../assets/${name}.png`),this.moduleObject)
    },
    getYearsList() {
      let years = [];
      let startYear = this.propData.startYear || 2000;
      let endYear = this.propData.endYear || 2030;
      for(let i = startYear;i < endYear+1;i++) {
        years.push({
          value: i,
          label: i
        })
      }
      return years;
    },
    getMonthsList() {
      let months = [];
      for(let i = 1;i < 13;i++) {
        months.push({
          value: i,
          label: i
        })
      }
      return months;
    },


    updateTableData() {
      this.initData()
    },
    getSettingData(is_update_table_data) {
      IDM.http.get('/ctrl/leaderScheduleApi/getViewConfigByPC',{

      }).then((res) => {
          if ( res.data.code == '200' ) {
            this.setting_data = res.data.data || {};
            // this.setting_data.viewModel = 1
            // this.setting_data.viewType = 2
            if ( is_update_table_data ) {
              this.initData()
            }
          }
      }).catch((err) => {
          console.log(err)
      })
    },
    /**
     * 更新头部组件参数
     */
    updateHeadParams(params){
      console.log('更新头部组件参数',params)
      this.form_data = params;
      this.initData()
      // this.getSettingData(1)
    },
    /**
     * 更新设置
     */
    updateSetting(){
      console.log('更新设置')
      this.getSettingData(1)
    },
    /**
     * 对属性设置进行初始化
     */
    initAttrToModule() {
      this.initBaseAttrToModule();
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
    initBaseAttrToModule() {
      this.isPreview = IDM.url.queryString("isPreview") == 1;
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData){
      this.propData = propData.compositeAttr||{};
      this.initAttrToModule()
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject(){
      this.convertThemeListAttrToStyleObject()
      var styleObject = {};
      if(this.propData.bgSize&&this.propData.bgSize=="custom"){
        styleObject["background-size"]=(this.propData.bgSizeWidth?this.propData.bgSizeWidth.inputVal+this.propData.bgSizeWidth.selectVal:"auto")+" "+(this.propData.bgSizeHeight?this.propData.bgSizeHeight.inputVal+this.propData.bgSizeHeight.selectVal:"auto")
      }else if(this.propData.bgSize){
        styleObject["background-size"]=this.propData.bgSize;
      }
      if(this.propData.positionX&&this.propData.positionX.inputVal){
        styleObject["background-position-x"]=this.propData.positionX.inputVal+this.propData.positionX.selectVal;
      }
      if(this.propData.positionY&&this.propData.positionY.inputVal){
        styleObject["background-position-y"]=this.propData.positionY.inputVal+this.propData.positionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if(!element&&element!==false&&element!=0){
            continue;
          }
          switch (key) {
            case "width":
            case "height":
              styleObject[key]=element;
              break;
            case "bgColor":
              if(element&&element.hex8){
                styleObject["background-color"]=element.hex8;
              }
              break;
            case "box":
              IDM.style.setBoxStyle(styleObject, element)
              break;
            case "bgImgUrl":
              styleObject["background-image"]=`url(${window.IDM.url.getWebPath(element)})`;
              break;
            case "positionX":
              //背景横向偏移
              
              break;
            case "positionY":
              //背景纵向偏移
              
              break;
            case "bgRepeat":
              //平铺模式
                styleObject["background-repeat"]=element;
              break;
            case "bgAttachment":
              //背景模式
                styleObject["background-attachment"]=element;
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
      window.IDM.setStyleToPageHead(this.moduleObject.id,styleObject);
    },
    /**
     * 通用的url参数对象
     * 所有地址的url参数转换
     */
    commonParam(){
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
    reload(){
      //请求数据源
      this.initData();
    },
    /**
     * 加载动态数据
     */
    initData(){
      if ( this.setting_data.viewModel == 1 ) {
        if ( this.form_data.timeViewType == 'day' ) {
          this.getDayInitData()
        } else {
          this.getWeekInitData()
        }
      } else {
        this.getWeekInitDataTableList()
      }
    },
    getDayInitData() {
      IDM.http.get('/ctrl/leaderScheduleApi/getDaySchedule',{
        date: this.form_data.dates,
        content: this.form_data.searchVal,
        userIds: this.form_data.leaders,
        isPreview: this.isPreview
      }).then((res) => {
        if ( res.data.code == '200' ) {
          this.header_list = res.data.data.header;
          this.data_list = res.data.data.data;

          this.formatHorizontalData(res.data.data.header,res.data.data.data)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getWeekInitData() {
      let days_arr = this.form_data.dates.split(',');
      let startDate = days_arr[0];
      let endDate = days_arr[days_arr.length - 1];
      IDM.http.get('/ctrl/leaderScheduleApi/getWeekSchedule',{
        startDate: startDate,
        endDate: endDate,
        userIds: this.form_data.leaders,
        content: this.form_data.searchVal
      }).then((res) => {
        this.header_list = res.data.data.header;
        this.data_list = res.data.data.data;

        this.formatHorizontalData(res.data.data.header,res.data.data.data)
      }).catch((err) => {
        console.log(err)
      })
    },
    getWeekInitDataTableList() {
      let days_arr = this.form_data.dates.split(',');
      let startDate = days_arr[0];
      let endDate = days_arr[days_arr.length - 1];
      IDM.http.get('/ctrl/leaderScheduleApi/getWeekScheduleInList',{
        startDate: startDate,
        endDate: endDate,
        userIds: this.form_data.leaders,
        content: this.form_data.searchVal
      }).then((res) => {
        this.header_list_table = res.data.data.header;
        this.data_list_table = res.data.data.data;
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * 格式化水平表格数据
     */
    formatHorizontalData(header,list){
      this.header_list_horizontal = [
        {
          userId: 0,
          userName:'时间'
        }
      ];
      
      list.forEach(item=>{
        this.header_list_horizontal.push({
          userId: item.userId,
          userName: item.userName,
          photo: item.photo,
          sex: item.sex
        })
      });

      this.data_list_horizontal = [];
      header.forEach((time,index) => {
        if(index>0){
          const row = {
            id: time.id,
            name: time.name,
            week: time.week,
            data:{}
          }
           list.forEach(inner=>{
            row.data[inner.userId] = inner.data[time.id]
          });
          this.data_list_horizontal.push(row)
        }
      })
      console.log(this.data_list_horizontal,789)
    },
    /**
     * 通用的获取表达式匹配后的结果
     */
    getExpressData(dataName,dataFiled,resultData){
      //给defaultValue设置dataFiled的值
      var _defaultVal = undefined;
      if(dataFiled){
        var filedExp = dataFiled;
        filedExp =
          dataName +
          (filedExp.startsWiths("[") ? "" : ".") +
          filedExp;
        var dataObject = { IDM: window.IDM };
        dataObject[dataName] = resultData;
        _defaultVal = window.IDM.express.replace.call(
          this,
          "@[" + filedExp + "]",
          dataObject
        );
      }
      //对结果进行再次函数自定义
      if(this.propData.customFunction&&this.propData.customFunction.length>0){
        var params = this.commonParam();
        var resValue = "";
        try {
          resValue = window[this.propData.customFunction[0].name]&&window[this.propData.customFunction[0].name].call(this,{
            ...params,
            ...this.propData.customFunction[0].param,
            moduleObject:this.moduleObject,
            expressData:_defaultVal,interfaceData:resultData
          });
        } catch (error) {
        }
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
    receiveBroadcastMessage(object){
      console.log("组件收到消息",object)
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
    sendBroadcastMessage(object){
        window.IDM.broadcast&&window.IDM.broadcast.send(object);
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
<style scoped lang="scss">
.IDailyScheduling_app {
  position: relative;
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  overflow-y: auto;
  font-family: SourceHanSansCN-Regular;
  .scroll_block{
    height: 100%;
    overflow-y: auto;
    padding: 20px 20px 62px 20px;
  }
  .IDailyScheduling_header{
    .button_box{
      height: 32px;
      line-height: 32px;
      text-align: center;
      font-size: 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    .left{
      .button_box{
        margin-right: 18px;
        &:nth-child(1){
          width: 60px;
          color: white;
          background: #0091FF;
        }
        &:nth-child(2){
          width: 90px;
          color: #666666;
          font-weight: 400;
          background: #FFFFFF;
          border: 1px solid rgba(204,204,204,1);
        }
        &:last-child{
          margin-right: 0;
        }
      }
    }
    .center{
      .select_box{
        width: 80px;
        margin-right: 7px;
        .ant-select{
          width: 100%;
        }
      }
      span{
        margin-right: 15px;
        font-size: 16px;
        color: #666666;
        font-weight: 500;
        &:last-child{
          margin-right: 0;
        }
      }
    }
    .right{
      .button_box{
        margin-left: 15px;
        &:nth-child(1){
          width: 100px;
          margin-left: 0;
          color: white;
          background: #2EC178;
        }
        &:nth-child(2){
          width: 80px;
          color: #666666;
          font-weight: 400;
          background: #FFFFFF;
          border: 1px solid rgba(204,204,204,1);
        }
      }
    }
  }
  .table{
    .cell{
      width: 100%;
    }
    .table_header{
      .cell{
        text-align: right;
      }
    }
    .table_body{
      .row{
        &:nth-child(1){
          .cell{
            border-top: 1px solid rgba(231,231,231,1);
          }
        }
        .cell{
          min-height: 130px;
          padding: 16px 13px;
          border-right: 1px solid rgba(231,231,231,1);
          border-bottom: 1px solid rgba(231,231,231,1);
          &:nth-child(1){
            border-left: 1px solid rgba(231,231,231,1);
          }
          .cell_body{
            .day_duty{
              padding: 10px;
              background: #FFFDF2;
              .left{
                .person_list{
                  margin-right: 13px;
                  &:last-child{
                    margin-right: 0;
                  }
                  img{
                    margin-left: 3px;
                  }
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
  width: 8px;
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