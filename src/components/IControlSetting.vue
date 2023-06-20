<template>
    <div idm-ctrl="idm_module" class="IControlSetting_app" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id">
        <div class="form">
            <div class="row flex_start">
                <div class="label">显示模式：</div>
                <div class="content">
                    <a-radio-group v-model="form.model" @change="onChange">
                        <a-radio :value="1">
                            视图模式
                        </a-radio>
                        <a-radio :value="2">
                            列表模式
                        </a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="row flex_start">
                <div class="label">显示方式：</div>
                <div class="content">
                    <a-radio-group v-model="form.type" @change="onChange">
                        <a-radio :value="1">
                            纵向时间，横向领导
                        </a-radio>
                        <a-radio :value="2">
                            纵向时间、横向领导
                        </a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="row flex_start">
                <div class="label">领导头像：</div>
                <div class="content">
                    <a-radio-group v-model="form.showHeader" @change="onChange">
                        <a-radio :value="1">
                            显示
                        </a-radio>
                        <a-radio :value="2">
                            不显示
                        </a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="line"></div>
            <div class="range_block">
                <div class="title flex_between">
                    <div class="title_left">区间维护</div>
                    <div class="title_right flex_end">
                        <SvgIcon icon-class="plus"></SvgIcon>
                        <span>新建</span>
                    </div>
                </div>
                <div class="main">
                    <div v-for="(item,index) in form.range_data" :key="index" class="list flex_between">
                        <div class="cell">
                            <span v-if="!item.editable">{{ item.name }}</span>
                            <a-input v-else v-model="item.name" placeholder="Basic usage" allowClear/>
                        </div>
                        <div class="cell">
                            <span v-if="!item.editable">{{ item.startTime }}</span>
                            <a-time-picker v-model="item.startTime" v-else @change="onChange" />
                        </div>
                        <div class="cell">
                            <span v-if="!item.editable">{{ item.endTime }}</span>
                            <a-time-picker v-else v-model="endTime" @change="onChange" />
                        </div>
                        <div class="cell operate flex_center">
                            <div v-if="!item.editable" @click="editRange(item)">
                                <SvgIcon icon-class="edit"></SvgIcon>
                            </div>
                            <div v-else @click="cancelEdit(item)">
                                <SvgIcon icon-class="guanbi"></SvgIcon>
                            </div>
                            <div class="delete_icon">
                                <SvgIcon icon-class="delete"></SvgIcon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="line"></div>
            <div class="row flex_start">
                <div class="label">显示要素：</div>
                <div class="content">
                    <a-checkbox-group @change="onChange">
                            <a-checkbox v-for="(item,index) in element_list" :key="index" :value="item.value">
                                {{ item.label }}
                            </a-checkbox>
                    </a-checkbox-group>
                </div>
            </div>
            <div class="row flex_start">
                <div class="label">图标说明：</div>
                <div class="content">
                    <a-radio-group v-model="form.model" @change="onChange">
                        <a-radio :value="1">
                            显示
                        </a-radio>
                        <a-radio :value="2">
                            不显示
                        </a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="row flex_start">
                <div class="label">忙闲日程：</div>
                <div class="content">
                    <a-radio-group v-model="form.model" @change="onChange">
                        <a-radio :value="1">
                            显示
                        </a-radio>
                        <a-radio :value="2">
                            不显示
                        </a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="row flex_start">
                <div class="label">空闲显示：</div>
                <div class="content">
                    <a-radio-group v-model="form.model" @change="onChange">
                        <a-radio :value="1">
                            单位办公
                        </a-radio>
                        <a-radio :value="2">
                            缩起区间
                        </a-radio>
                        <a-radio :value="3">
                            空白
                        </a-radio>
                    </a-radio-group>
                </div>
            </div>
        </div>
        <div class="button_block flex_end">
            <div class="button_list pointer">关闭</div>
            <div class="button_list button_list_primary pointer">保存</div>
        </div>
    </div>
</template>

<script>
import SvgIcon from '../icons/SvgIcon.vue';
import moment from 'moment';

export default {
    name: "IControlSetting",
    components: {
        SvgIcon,
    },
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {

            },
            form: {
                model: 1,
                type: 1,
                range_data: [
                    {
                        name: '上午',
                        startTime: '',
                        endTime: ''
                    },
                    {
                        name: '下午',
                        startTime: '',
                        endTime: ''
                    }
                ]
            },
            element_list: [
                {
                    label: '时间',
                    value: '1'
                },
                {
                    label: '名称',
                    value: '2'
                },
                {
                    label: '地点',
                    value: '3'
                },
                {
                    label: '主持人',
                    value: '4'
                },
                {
                    label: '参与人员',
                    value: '5'
                },
                {
                    label: '会议内容',
                    value: '6'
                }
            ],
        };
    },
    props: {},
    created() {
        this.moduleObject = this.$root.moduleObject;
        console.log(this.moduleObject)
        this.convertAttrToStyleObject();
    },
    mounted() {
        //赋值给window提供跨页面调用
        this.$nextTick(function (params) {
        //单独组件不能使用这种方式
        // window[this.moduleObject.packageid] = this;
        });
    },
    destroyed() {},
  methods: {
    moment,
    onChange(e) {
        console.log(e)
    },
    editRange(item) {
        this.$set(item,'editable',true)
        console.log(item)
    },
    cancelEdit(item) {
        item.editable = false;

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
            styleObject["background-size"] = (this.propData.bgSizeWidth ? this.propData.bgSizeWidth.inputVal + this.propData.bgSizeWidth.selectVal : "auto") + " " + (this.propData.bgSizeHeight ? this.propData.bgSizeHeight.inputVal + this.propData.bgSizeHeight.selectVal : "auto");
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
                    IDM.style.setBoxStyle(styleObject,element)
                    break;
                case "bgImgUrl":
                    styleObject[ "background-image" ] = `url(${window.IDM.url.getWebPath(element)})`;
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
                    IDM.style.setBorderStyle(styleObject,element)
                    break;
                case "font":
                    IDM.style.setFontStyle(styleObject,element)
                    break;
                }
            }
        }
        window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
        this.initData();
    },
    /**
     * 通用的url参数对象
     * 所有地址的url参数转换
     */
    commonParam() {
        let urlObject = IDM.url.queryObject();
        var params = {
            pageId: window.IDM.broadcast && window.IDM.broadcast.pageModule ? window.IDM.broadcast.pageModule.id : "",
            urlData: JSON.stringify(urlObject),
        };
        return params;
    },
    /**
     * 重新加载
     */
    reload() {
      //请求数据源
      this.initData();
    },
    /**
     * 加载动态数据
     */
    initData() {
        let that = this;
        //所有地址的url参数转换
        var params = that.commonParam();
    },
    /**
     * 通用的获取表达式匹配后的结果
     */
    getExpressData(dataName, dataFiled, resultData) {
        //给defaultValue设置dataFiled的值
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
        //对结果进行再次函数自定义
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
     * @param {
     *  type:"发送消息的时候定义的类型，这里可以自己用来要具体做什么，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
     * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）"
     *  message:{发送的时候传输的消息对象数据}
     *  messageKey:"消息数据的key值，代表数据类型是什么，常用于表单交互上，比如通过这个key判断是什么数据"
     *  isAcross:如果为true则代表发送来源是其他页面的组件，默认为false
     * } object
     */
    receiveBroadcastMessage(object) {
        console.log("组件收到消息", object);
      
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
        if (object.type != "pageCommonInterface") {
            return;
        }
    },
  },
};
</script>
<style lang="scss" scoped>
.IControlSetting_app{
    height: 100%;
    position: relative;
    padding: 0 20px;
    font-family: PingFangSC-Regular;
    .button_block{
        height: 52px;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        padding-right: 24px;
        box-shadow: 0 0px 10px rgb(0 0 0 / 10%);
        .button_list{
            width: 88px;
            height: 38px;
            margin-left: 12px;
            text-align: center;
            line-height: 38px;
            border-radius: 4px;
            background: #FFFFFF;
            border: 1px solid rgba(207,207,207,1);
            &:nth-child(1){
                margin-left: 0;
            }
        }
        .button_list_primary{
            color: white;
            background: #0086D9;
            border: none;
        }
    }
    .form{
        .line{
            height: 1px;
            margin: 23.5px 0;
            border: 1px solid rgba(238,238,238,1);
        }
        .row{
            margin-top: 24px;
            align-items: flex-start;
            &:nth-child(1){
                margin-top: 0;
            }
            .label{
                width: 80px;
                margin-right: 19px;
                flex-shrink: 0;
                white-space: nowrap;
                font-size: 16px;
                color: #333333;
                letter-spacing: 0;
                font-weight: 400;
            }
            .content{
                .ant-radio-wrapper{
                    min-width: 100px;
                    margin-right: 36px;
                    font-size: 16px;
                    color: #000000;
                    font-weight: 500;
                }
                .ant-checkbox-wrapper{
                    min-width: 100px;
                    margin-right: 36px;
                    font-size: 16px;
                    color: #000000;
                    font-weight: 500;
                }
                .ant-checkbox-wrapper + .ant-checkbox-wrapper{
                    margin-left: 0;
                }
            }
        }
    }
    .range_block{
        .title{
            border-bottom: 1px solid #DDDDDD;
            .title_left{
                padding: 9px 0;
                font-size: 20px;
                color: #0073CA;
                line-height: 28px;
                font-weight: 600;
                border-bottom: 2px solid #0073CA;
            }
            .title_right{
                .svg-icon{
                    margin-right: 6px;
                    color: #0086D9;
                }
                span{
                    font-size: 14px;
                    color: #0086D9;
                    letter-spacing: 0;
                    font-weight: 400;
                }
            }
        }
        .main{
            margin-top: 12px;
            .list{
                height: 42px;
                // padding: 0 16px 0 32px;
                border-left: 1px solid #E6E6E6;
                border-right: 1px solid #E6E6E6;
                border-bottom: 1px solid #E6E6E6;
                &:nth-child(1){
                    border-top: 1px solid #E6E6E6;
                }
                .cell{
                    padding: 0 5px;
                }
                .operate{
                    width: 80px;
                    flex-shrink: 0;
                    .svg-icon{
                        font-size: 20px;
                        color: #0086D9;
                        &:nth-child(1){
                            margin-left: 0;
                        }
                    }
                    .delete_icon{
                        margin-left: 6px;
                    }
                }
            }
        }
    }
}
</style>