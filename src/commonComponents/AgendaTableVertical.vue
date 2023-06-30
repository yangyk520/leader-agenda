<template>
    <div class="AgendaTableVertical_app">
        <div class="table">
            <div class="table_header flex_between">
                <div v-for="(item,index) in header_list" :key="index" class="cell" :style="getDomBg(item,1)">
                    {{ item.name }}
                    <span v-if="item.id != '0' && item.week && form_data && form_data.timeViewType == 'week'">（{{ item.week }}）</span>
                </div>
            </div>
                <div class="table_body">
                    <vue-scroll :ops="scrollOps">

                        <div v-for="(item,index) in data_list" :key="index" class="row table_body_row flex_between">
                            <div v-for="(item1,index1) in header_list" :key="index1" class="cell" :class="item1.id == '0' ? 'flex_center' : ''" :style="getDomBg(item1)">
                                <div v-if="item1.id == '0'" class="user_info">
                                    <div v-if="setting_data.leaderImageShow != 1" class="img_box">
                                        <img :src="getUserPhoto(item)" alt="">
                                    </div>
                                    <div class="name">{{ item.userName }}</div>
                                </div>
                                <div v-else class="active_block">
                                    <div v-if="item.data && item.data[item1.id] && item.data[item1.id].data && item.data[item1.id].data.length" class="block">
                                        <div @click="editActive(item2)" v-for="(item2,index2) in getActiveList(item.data[item1.id].data)" :key="index2" class="active_list" :style="getStyleDataCancel(item2)">
                                            <div v-if="getShowStatus('0',item2) || getShowStatus('1',item2)" class="row flex_start time_name_row" :style="getStyleData(item2)">
                                                <div class="svg_box flex_center">
                                                    <SvgIcon icon-class="clock"></SvgIcon>
                                                </div>
                                                <div>
                                                    <span v-if="getShowStatus('0',item2)" class="time">{{ `${item2.time} ${ item2.endTime && getShowStatus('-1',item2) ? '-' : '' } ${item2.endTime && getShowStatus('-1',item2) ? item2.endTime : ''}`  }}</span>
                                                    <SvgIcon v-if="item2.hasAnnex && getShowStatus('1',item2)" icon-class="file"></SvgIcon>
                                                    <span v-if="getShowStatus('1',item2)" class="name">{{ item2.bt }}</span>
                                                </div>
                                            </div>
                                            <div v-if="getShowStatus('2',item2) && item2.place" class="row flex_start address_block">
                                                <div class="svg_box flex_center">
                                                    <SvgIcon icon-class="address"></SvgIcon>
                                                </div>
                                                <span class="address">
                                                    <span >{{ item2.place }}</span>
                                                </span>
                                            </div>
                                            <div v-if="getShowStatus('3',item2) && item2.host" class="row flex_start">
                                                <div class="svg_box flex_center">
                                                    <SvgIcon icon-class="host"></SvgIcon>
                                                </div>
                                                <span class="address"> {{ item2.host }} </span>
                                            </div>
                                            <div v-if="getShowStatus('6',item2) && item2.content" class="row flex_start">
                                                <div class="svg_box flex_center">
                                                    <SvgIcon icon-class="content"></SvgIcon>
                                                </div>
                                                <span class="address"> {{ item2.content }} </span>
                                            </div>
                                            <div v-if="getShowStatus('4',item2) && item2.participants" class="row flex_start">
                                                <div class="svg_box flex_center">
                                                    <SvgIcon icon-class="participants"></SvgIcon>
                                                </div>
                                                <span class="address"> {{ item2.participants }} </span>
                                            </div>
                                            
                                            <div v-if="item2.isBusy == '1' && setting_data.busyDetailShow == 1" class="row flex_start busy_block">
                                                <div class="svg_box flex_center">
                                                    <SvgIcon icon-class="busy"></SvgIcon>
                                                </div>
                                                <span class="busy">忙碌</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="empty">
                                        {{ setting_data.emptyShowType == 2 || setting_data.emptyShowType == 1 ? '' : '单位内办公' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </vue-scroll>

                </div>
            
        </div>
    </div>
</template>
<script>
import SvgIcon from '../icons/SvgIcon.vue';
import mixins from '@/mixins/index.js'
export default {
    name: 'AgendaTableVertical',
    mixins: [mixins],
    components: {
        SvgIcon,
    },
    props: [ 'propData','moduleObject','header_list','data_list','setting_data','isPreview','form_data' ],
    watch: {
        propData: {
            handler: function() {
                this.convertAttrToStyleObject()
            },
            immediate: true,
            deep: true
        }
    },
    data() {
        return {
            
        }
    },
    created() {
        console.log('isPreview',this.isPreview)
    },
    methods: {
        getDomBg(item,is_header) {
            var styleObject = {};
            if ( item.week == '周六' || item.week == '周日' ) {
                styleObject['background-color'] = '#FFFCF2';
            }
            if ( is_header ) {
                styleObject['border-bottom'] = '1px solid rgb(230, 230, 230)';

            }
            return styleObject
        },
        getActiveList(data) {
            if ( !this.isPreview ) {
                return data
            }
            let result = [];
            data.forEach(item => {
                if ( item.state != 0 ) {
                    result.push(item)
                }
            });
            return result
        },
        
        getShowStatus(data,item) {
            // data为-1表示结束时间
            if ( data == '-1' && item.isBusy == '1' && this.setting_data.busyDetailShow == 1 ) {
                return true
            }
            if ( this.setting_data && this.setting_data.viewColumn && this.setting_data.viewColumn.includes(data) ) {
                if ( data != '0' && item.isBusy == '1' && this.setting_data.busyDetailShow == 1 ) {
                    return false
                } else {
                    return true
                }   
            } else {
                return false
            }
        },
        getUserPhoto(item) {
            if ( item.photo ) {
                return IDM.url.getWebPath(item.photo)
            } else {
                if ( item.sex ) {
                    return IDM.url.getModuleAssetsWebPath( require(`../assets/default_girl.png`), this.moduleObject );
                } else {
                    return IDM.url.getModuleAssetsWebPath( require(`../assets/default_boy.png`), this.moduleObject );
                }
            }
        },
        convertAttrToStyleObject() {
            var styleObject = {};
            var styleObjectHeader = {};
            var styleObjectCell = {};
            var styleObjectBody = {};
            var styleObjectBodyRow = {};
            if ( this.propData.stripe && this.propData.bgColorStripe && this.propData.bgColorStripe.hex8 ) {
                styleObjectBodyRow['background-color'] = this.propData.bgColorStripe.hex8;
            }
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "heightTableHeader":
                            styleObjectHeader['height'] = element;
                            styleObjectHeader['line-height'] = element;
                            styleObjectCell['height'] = element;
                            styleObjectCell['line-height'] = element;
                            break;
                        case "bgColorTableHeader":
                            if (element && element.hex8) {
                                styleObjectHeader["background-color"] = element.hex8;
                            }
                            break;
                        case "maxHeightTableBody":
                            styleObjectBody['max-height'] = element;
                            break;
                        case "heightTable":
                            styleObject['height'] = element;
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .AgendaTableVertical_app .table', styleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .AgendaTableVertical_app .table .table_header', styleObjectHeader);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .AgendaTableVertical_app .table .table_header .cell', styleObjectCell);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .AgendaTableVertical_app .table .table_body', styleObjectBody);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .AgendaTableVertical_app .table .table_body .row:nth-child(2n)', styleObjectBodyRow);
        },
        getStyleDataCancel(item) {
            var styleObject = {};
            if ( item.state == 3 ) {
                styleObject['text-decoration'] = 'line-through';
            }
            return styleObject
        },
        getStyleData(item) {
            var styleObject = {};
            switch (item.state) {
                case 1:
                    styleObject['color'] = '#0086D9';
                    break;
                case 2:
                    styleObject['color'] = '#FFA500';
                    break
                case 0:
                    styleObject['color'] = '#E30000';
                    break
                default:
                    break;
            }
            return styleObject
        },
    }
}
</script>
<style lang="scss" scoped>
.AgendaTableVertical_app{
    height: calc(100% - 128px);
    .table{
        height: 100%;
        border: 1px solid rgba(230,230,230,1);
        .table_header{
            height: 48px;
            padding-right: 8px;
            text-align: center;
            background: #F9FCFE;
            border-bottom: 1px solid rgba(230,230,230,1);
            .cell{
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
                border-right: 1px solid rgba(230,230,230,1);
                &:last-child{
                    border-right: none;
                }
                &:nth-child(1){
                    width: 152px;
                    flex-grow: 0;
                    flex-shrink: 0;
                }
            }
        }
        .table_body{
            height: calc(100% - 48px);
            .table_body_row{
                padding-right: 8px;
                align-items: stretch;
                border-bottom: 1px solid rgba(230,230,230,1);
                .cell{
                    width: 100%;
                    // height: 100%;
                    flex-grow: 2;
                    flex-shrink: 1;
                    box-sizing: border-box;
                    padding: 12px 12px 16px 12px;
                    border-right: 1px solid rgba(230,230,230,1);
                    &:last-child{
                        border-right: none;
                    }
                    &:nth-child(1){
                        width: 152px;
                        flex-grow: 0;
                        flex-shrink: 0;
                        padding: 12px;
                        text-align: center;
                    }
                    
                    .active_block{
                        .active_list{
                            margin-bottom: 16px;
                            padding-bottom: 16px;
                            border-bottom: 1px dotted #979797;
                            &:last-child{
                                margin-bottom: 0;
                                padding-bottom: 0;
                                border-bottom: none;
                            }
                            .time_name_row{
                                 .svg-icon{
                                    font-size: 14px;
                                    margin-right: 5px;
                                }
                            }
                            &>.row{
                                align-items: flex-start;
                            }
                            .address_block{
                                align-items: flex-start;
                                .address_img{
                                    flex-shrink: 0;
                                    position: relative;
                                    top: 3px;
                                }
                            }
                            .busy_block{
                                margin-top: 1px;
                            }
                            .time{
                                margin-right: 20px;
                            }
                            .svg_box{
                                width: 20px;
                                height: 20px;
                                margin-right: 5px;
                                flex-shrink: 0;
                                .svg-icon{
                                    font-size: 16px;
                                    margin: 0;
                                }
                            }
                            .time,.name,.address,.busy{
                                font-size: 16px;
                                line-height: 22px;
                                font-weight: 400;
                                word-wrap: break-word;
                                word-break: break-all;
                            }
                            .address{
                                span{
                                    margin-left: 30px;
                                    &:nth-child(1){
                                        margin-left: 0;
                                    }
                                }
                            }
                        }
                    }
                    .user_info{
                        .name{
                            font-size: 20px;
                            color: #333333;
                            text-align: center;
                            font-weight: 500;
                        }
                        .img_box{
                            width: 64px;
                            height: 64px;
                            border-radius: 4px;
                            overflow: hidden;
                            margin-bottom: 16px;
                            img{
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                            }
                        }
                    }
                    .empty{
                        font-size: 16px;
                        color: #0086D9;
                        font-weight: 400;
                    }
                }
            }
        }
    }
}
</style>