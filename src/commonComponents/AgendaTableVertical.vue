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
                                        <ActiveItem :item2="item2" :setting_data="setting_data"></ActiveItem>
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
import ActiveItem from './ActiveItem.vue'
export default {
    name: 'AgendaTableVertical',
    mixins: [mixins],
    components: {
        ActiveItem,
        // SvgIcon,
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