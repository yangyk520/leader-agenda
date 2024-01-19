<template>
  <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="IDailyScheduling_app">
    <div class="scroll_block">
      <div class="IDailyScheduling_header flex_between">
        <div class="left flex_start">
          <!-- <div class="button_box">月</div> -->
          <div @click="goBackCurrentMonth()" class="button_box">返回今天</div>
        </div>
        <div class="center flex_center">
          <div class="select_box">
            <a-select v-model="select_year" @change="changeCurrentTime(e)">
              <a-select-option v-for="(item,index) in getYearsList()" :key="index" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </div>
          <span>年</span>
          <div class="select_box">
            <a-select v-model="select_month" @change="changeCurrentTime(e)">
              <a-select-option v-for="(item,index) in getMonthsList()" :key="index" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </div>
          <span>月</span>
        </div>
        <div class="right flex_end">
          <div v-if="queryObject.showScheduling == '1'" class="button_box scheduling" @click="scheduling()">综合排班</div>
          <div v-if="queryObject.showExport == '1'" class="button_box export" @click="doExport()">导出</div>
          <div v-if="queryObject.showHolidayExport == '1'" class="button_box holidy_export" @click="doExportHoliday()">节假日导出</div>
          <div v-if="queryObject.showReset == '1'" class="button_box reset" @click="reset()">重置</div>
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
            <div v-for="(item1,index1) in table_header" :key="index1" class="cell" :class="getCellClassName(item[item1.value])">
              <div class="cell_header flex_between">
                <div class="left flex_start">
                  <span v-if="item[item1.value].holidayType == 2">休</span>
                </div>
                <div class="right flex_end">
                  <span v-if="getLunarCalendar(item[item1.value].date).solarFestival" class="lunar_calendar active">
                    {{ getLunarCalendar(item[item1.value].date).solarFestival }}
                  </span>
                  <span v-else class="lunar_calendar">
                    {{ getLunarCalendar(item[item1.value].date).value }}
                  </span>
                  <span class="solar_calendar">{{ getDateValue(item[item1.value].date) }}</span>
                </div>
              </div>
              <div class="cell_body">
                <template v-if="item[item1.value].leaderDuty && item[item1.value].leaderDuty.length">
                  <div class="leader_duty duty_list flex_between" :class="getDutyListClassName(item[item1.value].leaderDuty)">
                    <div class="left flex_start">
                      <div v-for="(item3,index3) in item[item1.value].leaderDuty" :key="index3" class="person_list flex_start">
                        <a-popover overlayClassName="person_list_pop" trigger="hover">
                          <template slot="content">
                            <div class="person_list_pop_row">
                              值班组：{{ item3.dutyGroup }}
                            </div>
                            <div class="person_list_pop_row">
                              <div>值班时间：</div>
                              <div>{{ item3.dutyTime }}</div>
                            </div>
                            <div v-if="item3.shiftChangesType" class="person_list_pop_row">
                              <div>{{ item3.shiftChangesType == '1' ? '换班' : '替班' }}：</div>
                              <div v-for="(item4,index4) in item3.shiftChanges" :key="index4">
                                <div>{{ item4.date }}</div>
                                <div>{{ item4.info }}</div>
                              </div>
                            </div>
                            <div v-if="item3.phone" class="person_list_pop_row">
                              电话：{{ item3.phone }}
                            </div>
                          </template>
                          <span>{{ item3.name }}</span>
                          <img v-if="item3.gender" :src="getAssetsImg(item3.gender == 1 ? 'man' : 'woman')" alt="">
                          <template v-if="item3.shiftChangesType">
                            <img v-if="item3.shiftChangesType == 1" :src="getAssetsImg('change')" alt="">
                            <img v-if="item3.shiftChangesType == 2" :src="getAssetsImg('replace')" alt="">
                          </template>
                        </a-popover>
                      </div>
                    </div>
                    <div class="right">
                      <img v-if="item[item1.value].holidayType == 2" :src="getAssetsImg('zhiban')" alt="">
                      <img v-else :src="getAssetsImg('leader')" alt="">
                    </div>
                  </div>
                </template>
                <template v-if="item[item1.value].dayDuty && item[item1.value].dayDuty.length">
                  <div class="day_duty duty_list flex_between" :class="getDutyListClassName(item[item1.value].dayDuty)">
                    <div class="left flex_start">
                      <div v-for="(item3,index3) in item[item1.value].dayDuty" :key="index3" class="person_list flex_start">
                        <a-popover overlayClassName="person_list_pop" trigger="hover">
                          <template slot="content">
                            <div class="person_list_pop_row">
                              值班组：{{ item3.dutyGroup }}
                            </div>
                            <div class="person_list_pop_row">
                              <div>值班时间：</div>
                              <div>{{ item3.dutyTime }}</div>
                            </div>
                            <div v-if="item3.shiftChangesType" class="person_list_pop_row">
                              <div>{{ item3.shiftChangesType == '1' ? '换班' : '替班' }}：</div>
                              <div v-for="(item4,index4) in item3.shiftChanges" :key="index4">
                                <div>{{ item4.date }}</div>
                                <div>{{ item4.info }}</div>
                              </div>
                            </div>
                            <div v-if="item3.phone" class="person_list_pop_row">
                              电话：{{ item3.phone }}
                            </div>
                          </template>
                          <span>{{ item3.name }}</span>
                          <img v-if="item3.gender" :src="getAssetsImg(item3.gender == 1 ? 'man' : 'woman')" alt="">
                          <template v-if="item3.shiftChangesType">
                            <img v-if="item3.shiftChangesType == 1" :src="getAssetsImg('change')" alt="">
                            <img v-if="item3.shiftChangesType == 2" :src="getAssetsImg('replace')" alt="">
                          </template>
                        </a-popover>
                      </div>
                    </div>
                    <div class="right">
                      <img :src="getAssetsImg('dayduty')" alt="">
                    </div>
                  </div>
                </template>
                <template v-if="item[item1.value].nightDuty && item[item1.value].nightDuty.length">
                  <div class="night_duty duty_list flex_between" :class="getDutyListClassName(item[item1.value].nightDuty)">
                    <div class="left flex_start">
                      <div v-for="(item3,index3) in item[item1.value].nightDuty" :key="index3" class="person_list flex_start">
                        <a-popover overlayClassName="person_list_pop" trigger="hover">
                          <template slot="content">
                            <div class="person_list_pop_row">
                              值班组：{{ item3.dutyGroup }}
                            </div>
                            <div class="person_list_pop_row">
                              <div>值班时间：</div>
                              <div>{{ item3.dutyTime }}</div>
                            </div>
                            <div v-if="item3.shiftChangesType" class="person_list_pop_row">
                              <div>{{ item3.shiftChangesType == '1' ? '换班' : '替班' }}：</div>
                              <div v-for="(item4,index4) in item3.shiftChanges" :key="index4">
                                <div>{{ item4.date }}</div>
                                <div>{{ item4.info }}</div>
                              </div>
                            </div>
                            <div v-if="item3.phone" class="person_list_pop_row">
                              电话：{{ item3.phone }}
                            </div>
                          </template>
                          <span>{{ item3.name }}</span>
                          <img v-if="item3.gender" :src="getAssetsImg(item3.gender == 1 ? 'man' : 'woman')" alt="">
                          <template v-if="item3.shiftChangesType">
                            <img v-if="item3.shiftChangesType == 1" :src="getAssetsImg('change')" alt="">
                            <img v-if="item3.shiftChangesType == 2" :src="getAssetsImg('replace')" alt="">
                          </template>
                        </a-popover>
                      </div>
                    </div>
                    <div class="right">
                      <img :src="getAssetsImg('nightduty')" alt="">
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
import LunarCalendar from "lunar-calendar" //获取二十四节气和农历日期
// import calendar from 'js-calendar-converter'
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
        },
        {
          label: '周日',
          value: 'Sunday'
        },
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
                  },
                  {
                    name: '王翔',
                    sex: 2
                  },
                  {
                    name: '李煜',
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
      queryObject: {},
    }
  },
  props: {
  },
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.makeDefaultData()
    this.convertAttrToStyleObject();
    this.getInitData()
  },
  mounted() {},
  destroyed() {},
  methods:{
    makeDefaultData() {
      let queryObject = IDM.url.queryObject();
      this.queryObject = queryObject;
      this.select_year = parseInt(queryObject.year);
      this.select_month = parseInt(queryObject.month);
    },
    reset() {
      let that = this;
      this.$confirm({
        title: '提示',
        content: '重置排班，是否确认？',
        cancelText: '取消',
        okText: '确定',
        onOk() {
          that.schedulingReset()
        },
        onCancel() {},
      });
    },
    doExport() {
      IDM.http.get(`ctrl/dutyScheduleCtrl/generate`,{
        year: this.select_year,
        month: this.select_month
      },{
        responseType: 'blob'
      }).then((res) => {
        let name = `${this.select_year}年${this.select_month}月排班表.xlsx`;
        this.downloadFile(res.data,name)
      }).catch((err) => {
        console.log(err)
      })
    },
    doExportHoliday() {
      IDM.layer.open({
        type: 2,
        title: '节假日选择',
        content: IDM.url.getWebPath(`ctrl/dutyScheduleCtrl/holiday/select?year=${this.select_year}`),
        area: ['400px', '300px']
      });
      
    },
    downloadFile(data,name) {
      let blob = new Blob([data], {
          type: 'application/vnd.ms-excel',
        })
        const blobUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        // 截取文件名
        const fileName = name
        a.style.display = 'none'
        a.href = blobUrl
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(blobUrl) // 释放内存
        document.body.removeChild(a)
    },
    scheduling() {
      this.schedulingApi()
    },
    schedulingApi() {
      let that = this;
      IDM.http.get("ctrl/dutyScheduleCtrl/judgeIsScheduled",{
        year: this.select_year,
        month: this.select_month
      }).then((res) => {
        if ( res.data.code == '200' ) {
          let flag = res.data.data;
          if ( flag == '0' ) {
            this.$confirm({
              title: '提示',
              content: '确认排班？',
              cancelText: '取消',
              okText: '确定',
              onOk() {
                let url = IDM.url.getWebPath(`/ctrl/dutyScheduleCtrl/dailyScheduling?year=${that.select_year}&month=${that.select_month}`)
                window.open(url);
              },
              onCancel() {},
            });
          } else if (flag == '1') {
            IDM.message.info('没有可用的值班组')
          } else if (flag == '2') {
            this.$confirm({
              title: '提示',
              content: '已排过班,是否重置?',
              cancelText: '取消',
              okText: '确定',
              onOk() {
                that.schedulingReset()
              },
              onCancel() {},
            });
          } else if (flag == '3') {
            IDM.message.info('本月之后已排过班!')
          } 
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    schedulingReset() {
      IDM.http.get('/ctrl/dutyScheduleCtrl/judgeReset',{
        year: this.select_year,
        month: this.select_month
      }).then((res) => {
        if ( res.data.code == '200' ) {
          let flag = res.data.data;
          if (flag == '0'){
            this.schedulingResetApi()
          } else if (flag == '1') {
            IDM.message.info('重置的月份已大于当前月!')
          } else if (flag == '2') {
            IDM.message.info('本月之后已排过班!')
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    schedulingResetApi() {
      IDM.http.get('/ctrl/dutyScheduleCtrl/resetDuty',{
        year: this.select_year,
        month: this.select_month
      }).then((res) => {
        if ( res.data.code == '200' ) {
          IDM.message.success(res.data.message)
          this.getInitData()
        } else {
          IDM.message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    goBackCurrentMonth() {
      this.getCurrentTime()
      this.getInitData()
    },
    getDutyListClassName(arr) {
      let flag = false
      arr && arr.length && arr.forEach((item) => {
        if( item.isSelf ) {
          flag = true
        }
      })
      if(flag) {
        return 'isSelf'
      } else {
        return ''
      }
    },
    getCellClassName(item) {
      var time = new Date(item.date);
      let month = time.getMonth() + 1;
      let result = '';
      if ( month == this.select_month ) {
        result = 'isCurrentMonth'
      }
      if ( item.holidayType == 2 ) {
        result = result ? `${result} isRelax` : 'isRelax'
      }
      return result
    },
    getCurrentTime() {
      var time = new Date();
      this.select_year = time.getFullYear()
      this.select_month = time.getMonth() + 1;
    },
    getLunarCalendar(value) {
      var time = new Date(value);
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      if ( (!year) || (!month) || !day ) {
        return ''
      }
      let obj = LunarCalendar.solarToLunar(year,month,day)
      console.log(obj);
      let result = obj.lunarMonthName + obj.lunarDayName
      return {
        value: result,
        solarFestival: obj.lunarFestival
      }
    },
    changeCurrentTime(e) {
      this.getInitData()
    },
    getDateValue(value) {
      return IDM.dateFormat(value,"d日");
    },
    getInitData() {
      IDM.http.get('/ctrl/newSchedule/GetFgwSchedule',{
        year: this.select_year,
        month: this.select_month
      }).then((res) => {
        if ( res.data.code == '200' ) {
          this.data_list = res.data.data;
        }
      }).catch((err) => {
        console.log(err)
      })
    },
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
    
    propDataWatchHandle(propData){
      this.propData = propData.compositeAttr||{};
      this.convertAttrToStyleObject()
      this.getInitData()
    },
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
    reload(){
      //请求数据源
      this.getInitData();
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
    receiveBroadcastMessage(messageObject){
      console.log("组件收到消息",messageObject)
      // 配置了刷新KEY，消息类型是websocket，收到的消息对象有message并不为空
      if(this.propData.messageRefreshKey && this.propData.messageRefreshKey.length && messageObject.type === 'websocket' && messageObject.message){
        const messageData = typeof messageObject.message === 'string' && JSON.parse(messageObject.message) || messageObject.message
        const arr = this.propData.messageRefreshKey || []
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
    padding: 20px 20px 32px 20px;
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
          // width: 60px;
          width: 90px;
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
          margin-left: 0;
        }
      }
      .scheduling{
        width: 100px;
        color: white;
        background: #2EC178;
      }
      .export,.reset{
        width: 80px;
        color: #666666;
        font-weight: 400;
        background: #FFFFFF;
        border: 1px solid rgba(204,204,204,1);
      }
      .holidy_export{
        width: 120px;
        color: #666666;
        font-weight: 400;
        background: #FFFFFF;
        border: 1px solid rgba(204,204,204,1);
      }
    }
  }
  .table{
    margin-top: 30px;
    .cell{
      width: 100%;
    }
    .table_header{
      margin-bottom: 4px;
      .cell{
        text-align: right;
        font-size: 20px;
        line-height: 20px;
        color: #333333;
        text-align: right;
        font-weight: 500;
        &:nth-child(6){
          color: #E02020;
        }
        &:last-child{
          color: #E02020;
        }
      }
    }
    .table_body{
      .row{
        align-items: stretch;
        &:nth-child(1){
          .cell{
            border-top: 1px solid rgba(231,231,231,1);
          }
        }
        .isRelax{
          background: rgba(253,227,228,0.60);
        }
        .cell{
          width: 14.2857%;
          flex-grow: 0;
          flex-shrink: 0;
          min-height: 130px;
          padding: 16px 13px;
          border-right: 1px solid rgba(231,231,231,1);
          border-bottom: 1px solid rgba(231,231,231,1);
          &:nth-child(1){
            border-left: 1px solid rgba(231,231,231,1);
          }
          .cell_header{
            height: 24px;
            margin-bottom: 6px;
            .left{
              font-size: 16px;
              color: #E02020;
              font-weight: 500;
            }
            .right{
              max-width: 80%;
              overflow: hidden;
              white-space: nowrap;
              .lunar_calendar{
                max-width: 60%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
                line-height: 16px;
                font-size: 16px;
                color: #999999;
                font-weight: 400;
              }
              .solar_calendar{
                margin-left: 20px;
                display: inline-block;
                line-height: 20px;
                font-size: 20px;
                color: #999999;
                text-align: right;
                font-weight: 500;
              }
              .active{
                color: #E02020;
              }
            }
          }
          .cell_body{
            .duty_list{
              margin-bottom: 8px;
              padding: 10px;
              align-items: flex-start;

              &:last-child{
                margin-bottom: 0;
              }
              .left{
                flex-wrap: wrap;
                .person_list{
                  margin-right: 13px;
                  white-space: nowrap;
                  &:last-child{
                    margin-right: 0;
                  }
                  img{
                    margin-left: 3px;
                  }
                }
              }
            }
            .day_duty{
              background: #FFFDF2;
            }
            .night_duty{
              background: #EBF4FF;
            }
            .leader_duty{
              background: #F6EBFF;
            }
            .isSelf{
              background: #32C5FF;
            }
          }
        }
        .isCurrentMonth{
          .cell_header{
            .right{
              .solar_calendar{
                color: #333333;
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
.person_list_pop{
  .person_list_pop_row{
    margin-bottom: 10px;
    line-height: 20px;
    font-size: 15px;
    color: #666666;
    font-weight: 400;
    &:last-child{
      margin-bottom: 0;
    }
  }
}
.IDailyScheduling_app{
  .ant-select-selection{
    box-shadow: none;
    border-color: rgba(204,204,204,1);
  }
  .ant-select-selection:focus, .ant-select-selection:active{
    border-color: rgba(204,204,204,1);
    box-shadow: none;
  }
  .ant-select-focused .ant-select-selection, .ant-select-selection:focus, .ant-select-selection:active{
    border-color: rgba(204,204,204,1);
    box-shadow: none;
  }
  .ant-select-selection:hover{
    border-color: rgba(204,204,204,1);
    box-shadow: none;
  }
}
</style>