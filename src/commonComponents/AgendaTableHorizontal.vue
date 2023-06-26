<template>
    <div class="AgendaTableVertical_app">
        <div class="table">
            <div class="table_header flex_between">
                <div v-for="(item,index) in header_list" :key="index" class="cell" :style="getDomBg(item,1)">{{ item.name }}</div>
            </div>
            <div class="table_body scroll_block">
                <div v-for="(item,index) in data_list" :key="index" class="row flex_between">
                    <div v-for="(item1,index1) in header_list" :key="index1" class="cell scroll_block" :class="item1.id == '0' ? 'flex_center' : ''" :style="getDomBg(item1)">
                        <div v-if="item1.id == '0'" class="user_info">
                            <div v-if="setting_data.leaderImageShow != 1" class="img_box">
                                <img :src="getUserPhoto(item)" alt="">
                            </div>
                            <div class="name">{{ item.userName }}</div>
                        </div>
                        <div v-else class="active_block">
                            <div v-if="item.data && item.data[item1.id] && item.data[item1.id].data && item.data[item1.id].data.length" class="block">
                                <div @click="editActive(item2)" v-for="(item2,index2) in getActiveList(item.data[item1.id].data)" :key="index2" class="active_list" :style="getStyleDataCancel(item2)">
                                    <div class="row flex_start time_name_row" :style="getStyleData(item2)">
                                        <div v-if="!setting_data.iconDescShow" class="img_box flex_center">
                                            <img class="clock_img" src="@/assets/clock.png" alt="">
                                        </div>
                                        <span v-if="getShowStatus('0')" class="time">{{ item2.time }}</span>
                                        <SvgIcon v-if="item2.hasAnnex" icon-class="file"></SvgIcon>
                                        <span v-if="getShowStatus('1')" class="name">{{ item2.bt }}</span>
                                    </div>
                                    <div class="row flex_start address_block">
                                        <div v-if="!setting_data.iconDescShow" class="img_box flex_center">
                                            <img class="address_img" src="@/assets/address.png" alt="">
                                        </div>
                                        <span class="address">
                                            <span v-if="getShowStatus('2')">{{ item2.place }}</span>
                                        </span>
                                    </div>
                                    <div v-if="getShowStatus('6')" class="row flex_start">
                                        <div class="img_box flex_center">
                                            <img class="" src="@/assets/host.png" alt="">
                                        </div>
                                        <span class="address"> {{ item2.host }} </span>
                                    </div>
                                    <div v-if="getShowStatus('6')" class="row flex_start">
                                        <div class="img_box flex_center">
                                            <img class="" src="@/assets/content.png" alt="">
                                        </div>
                                        <span class="address"> {{ item2.content }} </span>
                                    </div>
                                    <div v-if="getShowStatus('4')" class="row flex_start">
                                        <div class="img_box flex_center">
                                            <img class="" src="@/assets/participants.png" alt="">
                                        </div>
                                        <span class="address"> {{ item2.participants }} </span>
                                    </div>
                                    
                                    <div v-if="item2.isBusy == '1'" class="row flex_start busy_block">
                                        <div class="img_box flex_center">
                                            <img class="" src="@/assets/busy.png" alt="">
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
            </div>
        </div>
    </div>
</template>
<script>
import SvgIcon from '../icons/SvgIcon.vue';

export default {
    name: 'AgendaTableVertical',
    components: {
        SvgIcon,
    },
    props: [ 'propData','moduleObject','header_list','data_list','setting_data','isPreview' ],
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
            // header_list: [
            //     {
            //         id: '0',
            //         name: '领导'
            //     },
            //     {
            //         id: 2,
            //         name: '上午'
            //     },
            //     {
            //         id: 3,
            //         name: '下午'
            //     }
            // ],
            // data_list: [
            //     {
            //         userName: '路飞',
            //         photo: '',
            //         data: {
            //             '2': {
            //                 data: [
            //                     {
            //                         time: '8:30',
            //                         name: '党组会',
            //                         status: 1,
            //                         place: '东区礼合楼202（云鹃路166号） 主持人:宋骏  会议内容:主要是就当前工作进行汇报、分析和研究，讨论解决工作中的重大问题，推动单位工作向正确方向发展等，并且…',
            //                         isBusy: 1,
            //                         participants: '周东升,余慧强',
            //                         content: '测试内容'
            //                     }
            //                 ]
            //             } ,
            //             '3': {
            //                 data: [
            //                     {
            //                         time: '13:30',
            //                         name: '经济工作监督座谈会',
            //                         status: 2,
            //                         address: '东区礼合楼202'
            //                     },
            //                     {
            //                         time: '15:30',
            //                         name: '2023年“一网通办”工作推进专题会',
            //                         status: 3,
            //                         address: '东区礼合楼201（云鹃路169号）'
            //                     }
            //                 ]
            //             } 
            //         }
                    
            //     },
            //     {
            //         userName: '宋俊',
            //         photo: '',
            //         data: {
            //             '2': {
            //                 data: [ ]
            //             } ,
            //             '3': {
            //                 data: [
            //                     {
            //                         time: '13:30',
            //                         name: '经济工作监督座谈会',
            //                         place: '东区礼合楼202'
            //                     },
            //                     {
            //                         time: '15:30',
            //                         name: '2023年“一网通办”工作推进专题会',
            //                         place: '东区礼合楼201（云鹃路169号）'
            //                     },
            //                     {
            //                         time: '15:30',
            //                         name: '2023年“一网通办”工作推进专题会',
            //                         place: '东区礼合楼201（云鹃路169号）'
            //                     }
            //                 ]
            //             } 
            //         }
            //     },
            //     {
            //         userName: '徐华磊',
            //         photo: '',
            //         data: {
            //             '2': {
            //                 data: [
            //                     {
            //                         time: '8:30',
            //                         name: '党组会',
            //                         place: '东区礼合楼202（云鹃路166号） 主持人:宋骏  会议内容:主要是就当前工作进行汇报、分析和研究，讨论解决工作中的重大问题，推动单位工作向正确方向发展等，并且…'
            //                     }
            //                 ]
            //             } ,
            //             '3': {
            //                 data: [
            //                     {
            //                         time: '13:30',
            //                         name: '经济工作监督座谈会',
            //                         place: '东区礼合楼202'
            //                     },
            //                     {
            //                         time: '15:30',
            //                         name: '2023年“一网通办”工作推进专题会',
            //                         place: '东区礼合楼201（云鹃路169号）'
            //                     }
            //                 ]
            //             } 
            //         }
            //     },
            //     {
            //         userName: '王磊',
            //         photo: '',
            //         data: {
            //             '2': {
            //                 data: [
            //                     {
            //                         time: '8:30',
            //                         name: '党组会',
            //                         place: '东区礼合楼202（云鹃路166号） 主持人:宋骏  会议内容:主要是就当前工作进行汇报、分析和研究，讨论解决工作中的重大问题，推动单位工作向正确方向发展等，并且…'
            //                     }
            //                 ]
            //             } ,
            //             '3': {
            //                 data: [
            //                     {
            //                         time: '13:30',
            //                         name: '经济工作监督座谈会',
            //                         place: '东区礼合楼202'
            //                     },
            //                     {
            //                         time: '15:30',
            //                         name: '2023年“一网通办”工作推进专题会',
            //                         place: '东区礼合楼201（云鹃路169号）'
            //                     }
            //                 ]
            //             } 
            //         }
            //     },
            // ]
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
                // styleObject['border-bottom'] = '1px solid rgb(230, 230, 230)';

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
        editActive(item) {
            if ( this.isPreview || !item.clickUrl ) {
                return
            }
            let that = this;
            IDM.layer.open({
                type: 2,
                area: ["1200px", "90%"],
                content: IDM.url.getWebPath(item.clickUrl),
                success: function (layero, index) {
                    top.close = function () {
                        IDM.layer.close(index);
                        that.$emit('updateTableData')
                    };
                }
                // end: function () {
                //     that.$emit('updateTableData')
                // },
            });
        },
        getShowStatus(data) {
            if ( this.setting_data && this.setting_data.viewColumn && this.setting_data.viewColumn.includes(data) ) {
                if ( data == '6' && this.setting_data.busyDetailShow == 1 ) {
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
                return IDM.url.getModuleAssetsWebPath(require('../assets/default_avatar.png'),this.moduleObject) 
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
    .table{
      display: flex;
      border: 1px solid rgba(230,230,230,1);
        .table_header{
            display: flex;
            flex-direction: column;
            width: 152px;
            flex-shrink: 0;
            text-align: center;
            background: #F9FCFE;
            .cell{
                min-height: 200px;
                width: 100%;
                flex-grow: 2;
                flex-shrink: 1;
                box-sizing: border-box;
                font-size: 16px;
                color: #333333;
                letter-spacing: 0;
                font-weight: 500;
                border-right: 1px solid rgba(230,230,230,1);
                display: flex;
                justify-content: center;
                align-items: center;
                border-bottom: 1px solid rgb(230, 230, 230);
                &:last-child{
                  border-bottom: none;
                }
                &:nth-child(1){
                    min-height: auto;
                    height: 64px;
                    flex-grow: 0;
                    flex-shrink: 0;
                }
            }
        }
        .table_body{
            display: flex;
            width: 100%;
            overflow: auto;
            &>.row{
                min-width: 240px;
                width: 100%;
                // height: 100%;
                flex-grow: 2;
                flex-shrink: 1;
                display: flex;
                flex-direction: column;
                border-right: 1px solid rgba(230,230,230,1);
                border-bottom: 1px solid rgba(230,230,230,1);
                align-items: stretch;
                &:last-child{
                  border-right: none;
                }
                .cell{
                    width: 100%;
                    // height: 200px;
                    box-sizing: border-box;
                    padding: 12px 12px 16px 12px;
                    border-bottom: 1px solid rgba(230,230,230,1);
                    flex-grow: 2;
                    flex-shrink: 1;
                    overflow: auto;
                    &:last-child{
                      border-bottom: none;
                    }
                    &:nth-child(1){
                        height: 64px;
                        flex-grow: 0;
                        flex-shrink: 0;
                        padding: 12px;
                        text-align: center;
                        overflow: hidden;
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
                          .img_box{
                              width: 20px;
                              height: 20px;
                              margin-right: 5px;
                              flex-shrink: 0;
                              .clock_img{
                                  width: 16px;
                                  height: 16px;
                              }
                              .address_img{
                                  width: 14px;
                                  height: 16px;
                              }
                              img{
                                  width: 16px;
                              }
                          }
                          .time,.name,.address,.busy{
                              font-size: 16px;
                              line-height: 22px;
                              font-weight: 400;
                              word-wrap: break-word;
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
                      display: flex;
                      justify-content: center;
                      align-items: center;
                        .name{
                            font-size: 20px;
                            color: #333333;
                            text-align: center;
                            font-weight: 500;
                        }
                        .img_box{
                            width: 40px;
                            height: 40px;
                            border-radius: 4px;
                            margin-right: 12px;
                            overflow: hidden;
                            img{
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