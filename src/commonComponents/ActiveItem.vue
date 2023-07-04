<template>
    <div class="ActiveItem_app">
        <div v-if="getShowStatus('0',item2) || getShowStatus('1',item2)" class="row flex_start time_name_row" :style="getStyleData(item2)">
            <div class="svg_box flex_center">
                <SvgIcon icon-class="clock"></SvgIcon>
            </div>
            <div>
                <span v-if="getShowStatus('0',item2)" class="time">{{ `${item2.time} ${ item2.endTime && getShowStatus('-1',item2) ? '-' : '' } ${item2.endTime && getShowStatus('-1',item2) ? item2.endTime : ''}`  }}</span>
                <SvgIcon v-if="item2.hasAnnex && getShowStatus('1',item2)"  icon-class="file"></SvgIcon>
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
        
        <div v-if="item2.isBusy == '1'" class="row flex_start busy_block">
            <div class="svg_box flex_center">
                <SvgIcon icon-class="busy"></SvgIcon>
            </div>
            <span class="busy">忙碌</span>
        </div>
    </div>
</template>
<script>
import SvgIcon from '../icons/SvgIcon.vue';

export default {
    name: 'ActiveItem',
    components: {
        SvgIcon,
    },
    props: [ 'item2','setting_data' ],
    data() {
        return {

        }
    },
    created() {

    },
    methods: {
        getShowStatus(data,item) {
            // data为-1表示结束时间
            if ( data == '-1' && item.isBusy == '1' && (!item.mySchedule) && this.setting_data && !this.setting_data.hasPermission ) {
                return true
            }
            if ( this.setting_data && this.setting_data.viewColumn && this.setting_data.viewColumn.includes(data) ) {
                // 判断忙碌不显示时条件
                if ( data != '0' && item.isBusy == '1' && (!item.mySchedule) && this.setting_data && !this.setting_data.hasPermission ) {
                    return false
                } else {
                    return true
                }   
            } else {
                return false
            }
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
        }
    }
}
</script>
<style lang="scss" scoped>
.ActiveItem_app{
    text-align: left;
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
</style>