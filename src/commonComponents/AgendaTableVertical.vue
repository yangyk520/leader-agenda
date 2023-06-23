<template>
    <div class="AgendaTableVertical_app">
        <div class="table">
            <div class="table_header flex_between">
                <div v-for="(item,index) in header_list" :key="index" class="cell">{{ item.name }}</div>
            </div>
            <div class="table_body scroll_block">
                <div v-for="(item,index) in data_list" :key="index" class="row flex_between">
                    <div v-for="(item1,index1) in header_list" :key="index1" class="cell" :class="item1.id == 1 ? 'flex_center' : ''">
                        <div v-if="item1.id == 1" class="user_info">
                            <img src="@/assets/default_avatar.png" alt="">
                            <div class="name">{{ item.name }}</div>
                        </div>
                        <div v-else class="active_block">
                            <div v-if="item[item1.id] && item[item1.id].length" class="block">
                                <div v-for="(item2,index2) in item[item1.id]" :key="index2" class="active_list">
                                    <div class="row flex_start" :style="getStyleData(item2)">
                                        <!-- <SvgIcon icon-class="clock"></SvgIcon> -->
                                        <div class="img_box flex_center">
                                            <img class="clock_img" src="@/assets/clock.png" alt="">
                                        </div>
                                        <span class="time">{{ item2.time }}</span>
                                        <span class="name">{{ item2.name }}</span>
                                    </div>
                                    <div class="row flex_start address_block">
                                        <!-- <SvgIcon icon-class="address"></SvgIcon> -->
                                        <div class="img_box flex_center">
                                            <img class="address_img" src="@/assets/address.png" alt="">
                                        </div>
                                        <span class="address">{{ item2.address }}</span>
                                    </div>
                                    <div v-if="item2.busyStatus" class="row flex_start busy_block">
                                        <div class="img_box flex_center">
                                            <img class="clock_img" src="@/assets/busy.png" alt="">
                                        </div>
                                        <span class="busy">忙碌</span>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="empty">
                                单位内办公
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
        // SvgIcon,
    },
    props: [ 'propData','moduleObject' ],
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
            header_list: [
                {
                    id: 1,
                    name: '领导'
                },
                {
                    id: 2,
                    name: '上午'
                },
                {
                    id: 3,
                    name: '下午'
                }
            ],
            data_list: [
                {
                    name: '路飞',
                    headerImg: '',
                    '2': [
                        {
                            time: '8:30',
                            name: '党组会',
                            status: 1,
                            address: '东区礼合楼202（云鹃路166号） 主持人:宋骏  会议内容:主要是就当前工作进行汇报、分析和研究，讨论解决工作中的重大问题，推动单位工作向正确方向发展等，并且…',
                            busyStatus: 1
                        }
                    ],
                    '3': [
                        {
                            time: '13:30',
                            name: '经济工作监督座谈会',
                            status: 2,
                            address: '东区礼合楼202'
                        },
                        {
                            time: '15:30',
                            name: '2023年“一网通办”工作推进专题会',
                            status: 3,
                            address: '东区礼合楼201（云鹃路169号）'
                        }
                    ]
                },
                {
                    name: '宋俊',
                    headerImg: '',
                    '2': [
                        // {
                        //     time: '8:30',
                        //     name: '党组会',
                        //     status: 4,
                        //     address: '东区礼合楼202（云鹃路166号） 主持人:宋骏  会议内容:主要是就当前工作进行汇报、分析和研究，讨论解决工作中的重大问题，推动单位工作向正确方向发展等，并且…'
                        // }
                    ],
                    '3': [
                        {
                            time: '13:30',
                            name: '经济工作监督座谈会',
                            address: '东区礼合楼202'
                        },
                        {
                            time: '15:30',
                            name: '2023年“一网通办”工作推进专题会',
                            address: '东区礼合楼201（云鹃路169号）'
                        },
                        {
                            time: '15:30',
                            name: '2023年“一网通办”工作推进专题会',
                            address: '东区礼合楼201（云鹃路169号）'
                        }
                    ]
                },
                {
                    name: '徐华磊',
                    headerImg: '',
                    '2': [
                        {
                            time: '8:30',
                            name: '党组会',
                            address: '东区礼合楼202（云鹃路166号） 主持人:宋骏  会议内容:主要是就当前工作进行汇报、分析和研究，讨论解决工作中的重大问题，推动单位工作向正确方向发展等，并且…'
                        }
                    ],
                    '3': [
                        {
                            time: '13:30',
                            name: '经济工作监督座谈会',
                            address: '东区礼合楼202'
                        },
                        {
                            time: '15:30',
                            name: '2023年“一网通办”工作推进专题会',
                            address: '东区礼合楼201（云鹃路169号）'
                        }
                    ]
                },
                {
                    name: '徐华磊',
                    headerImg: '',
                    '2': [
                        {
                            time: '8:30',
                            name: '党组会',
                            address: '东区礼合楼202（云鹃路166号） 主持人:宋骏  会议内容:主要是就当前工作进行汇报、分析和研究，讨论解决工作中的重大问题，推动单位工作向正确方向发展等，并且…'
                        }
                    ],
                    '3': [
                        {
                            time: '13:30',
                            name: '经济工作监督座谈会',
                            address: '东区礼合楼202'
                        },
                        {
                            time: '15:30',
                            name: '2023年“一网通办”工作推进专题会',
                            address: '东区礼合楼201（云鹃路169号）'
                        }
                    ]
                },
                {
                    name: '徐华磊',
                    headerImg: '',
                    '2': [
                        {
                            time: '8:30',
                            name: '党组会',
                            address: '东区礼合楼202（云鹃路166号） 主持人:宋骏  会议内容:主要是就当前工作进行汇报、分析和研究，讨论解决工作中的重大问题，推动单位工作向正确方向发展等，并且…'
                        }
                    ],
                    '3': [
                        {
                            time: '13:30',
                            name: '经济工作监督座谈会',
                            address: '东区礼合楼202'
                        },
                        {
                            time: '15:30',
                            name: '2023年“一网通办”工作推进专题会',
                            address: '东区礼合楼201（云鹃路169号）'
                        }
                    ]
                }
            ]
        }
    },
    created() {

    },
    methods: {
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
        getStyleData(item) {
            var styleObject = {};
            switch (item.status) {
                case 1:
                    styleObject['color'] = '#0086D9';
                    break;
                case 2:
                    styleObject['color'] = '#FFA500';
                    break
                case 3:
                    styleObject['color'] = '#E30000';
                    break
                case 4:
                    styleObject['text-decoration'] = 'line-through';
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
        border: 1px solid rgba(230,230,230,1);
        .table_header{
            height: 48px;
            text-align: center;
            background: #F9FCFE;
            border-bottom: 1px solid rgba(230,230,230,1);
            .cell{
                height: 48px;
                line-height: 48px;
                flex-grow: 2;
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
                }
            }
        }
        .table_body{
            // max-height: 300px;
            overflow: auto;
            &>.row{
                border-bottom: 1px solid rgba(230,230,230,1);
                align-items: stretch;
                &:last-child{
                    border-bottom: none;
                }
                .cell{
                    width: 100%;
                    // height: 100%;
                    flex-grow: 2;
                    flex-shrink: 1;
                    box-sizing: border-box;
                    padding: 12px 12px 0 12px;
                    border-right: 1px solid rgba(230,230,230,1);
                    &:last-child{
                        border-right: none;
                    }
                    &:nth-child(1){
                        width: 152px;
                        flex-grow: 0;
                        flex-shrink: 0;
                        text-align: center;
                        img{
                            width: 64px;
                            height: 64px;
                            margin-bottom: 16px;
                        }
                    }
                    .time,.name,.address,.busy{
                        font-size: 16px;
                        line-height: 22px;
                        font-weight: 400;
                        word-wrap: break-word;
                    }
                    .time,.name{
                        color: #0086D9;
                    }
                    .active_block{
                        .active_list{
                            margin-bottom: 16px;
                            padding-bottom: 16px;
                            border-bottom: 1px dotted #979797;
                            &:last-child{
                                margin-bottom: 0;
                                border-bottom: none;
                            }
                            .svg-icon{
                                font-size: 14px;
                                margin-right: 5px;
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
                                margin-right: 10px;
                            }
                            .img_box{
                                width: 16px;
                                height: 16px;
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