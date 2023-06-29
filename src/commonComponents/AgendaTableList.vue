<template>
    <div class="AgendaTableList_app">
        <div class="table">
            <div class="table_header row flex_between">
                <div v-for="(item,index) in header_data" :key="index" class="cell">
                    {{ item.name }}
                </div>
            </div>
            <div v-if="makeHeaderData && makeHeaderData.length"  class="table_body">
                <vue-scroll  :ops="scrollOps">

                    <div v-for="(item,index) in makeHeaderData" :key="index" class="row table_body_row flex_between">
                        <div class="table_body_header flex_center">
                            <div>
                                <div>{{ item.name }}</div>
                                <div>{{ item.week }}</div>
                            </div>
                        </div>
                        <div class="table_body_main">
                            <template v-if="item.subHeader && item.subHeader.length">
                                <div v-for="(item1,index1) in item.subHeader" :key="index1" class="flex_between row">
                                    <div class="table_body_header_sub flex_center">
                                        <span>{{ item1.name }}</span>
                                    </div>
                                    <div class="table_body_main_sub">
                                        <template v-if="data_list_table[item1.id] && data_list_table[item1.id].data && data_list_table[item1.id].data.length">
                                            <div v-for="(item2,index2) in data_list_table[item1.id].data" :key="index2" class="flex_between row">
                                                <div class="cell">{{  `${item2.time} - ${item2.endTime}` }}</div>
                                                <div class="cell">{{ item2.bt }}</div>
                                                <div class="cell">{{ item2.participants }}</div>
                                                <div class="cell">{{ item2.place }}</div>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="flex_between row">
                                                <div v-for="(item2,index2) in 4" :key="index2" class="cell"></div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="flex_between row empty_block_row">
                                    <div class="table_body_header_sub flex_center">
                                        <span>{{  }}</span>
                                    </div>
                                    <div class="table_body_main_sub">
                                        <div class="flex_between row">
                                            <div v-for="(item2,index2) in 4" :key="index2" class="cell"></div>
                                        </div>
                                    </div>
                                </div>

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
import mixins from '@/mixins/index.js'

export default {
    name: 'AgendaTableList',
    mixins: [mixins],
    props: [ 'isPreview','data_list_table','header_list_table','setting_data' ],
    computed: {
        makeHeaderData: function() {
            if ( this.setting_data && this.setting_data.emptyShowType == 1 && this.header_list_table && this.header_list_table.length ) {
                let header_list_table = JSON.parse(JSON.stringify(this.header_list_table));
                header_list_table.forEach(item => {
                    let is_empty = true;
                    item.subHeader && item.subHeader.length && item.subHeader.forEach((item2) => {
                        if ( this.data_list_table[item2.id] && this.data_list_table[item2.id].data && this.data_list_table[item2.id].data.length ) {
                            is_empty = false;
                        }
                    })
                    if ( is_empty ) {
                        item.subHeader = []
                    }
                });
                return header_list_table
            } else {
                return this.header_list_table
            }
        }
    },
    data() {
        return {
            header_data: [
                {
                    id: 1,
                    name: '日期'
                },
                {
                    id: 2,
                    name: ''
                },
                {
                    id: 3,
                    name: '时间'
                },
                {
                    id: 4,
                    name: '标题'
                },
                {
                    id: 5,
                    name: '参与人员'
                },
                {
                    id: 6,
                    name: '地点'
                }
            ],
        }
    },
    created() {

    },
    methods: {
        
    }
}
</script>
<style lang="scss" scoped>
.AgendaTableList_app{
    height: calc(100% - 128px);
    .table{
        height: 100%;
        border: 1px solid rgba(230,230,230,1);
        .table_header{
            height: 38px;
            text-align: center;
            background: #F9FCFE;
            border-bottom: 1px solid rgba(230,230,230,1);
            .cell{
                width: 100%;
                height: 38px;
                line-height: 38px;
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
                    width: 118px;
                    flex-grow: 0;
                    flex-shrink: 0;
                }
                &:nth-child(2){
                    width: 90px;
                    flex-grow: 0;
                    flex-shrink: 0;
                }
                &:nth-child(3){
                    width: 130px;
                    flex-grow: 0;
                    flex-shrink: 0;
                }
            }
        }
        .table_body{
            height: calc(100% - 38px);
            font-size: 16px;
            color: #333333;
            font-weight: 400;
            .table_body_row{
                align-items: stretch;
                border-bottom: 1px solid rgba(230,230,230,1);
                .table_body_header{
                    width: 118px;
                    text-align: center;
                    border-right: 1px solid rgba(230,230,230,1);
                    &:last-child{
                        border-right: none;
                    }
                }
                .table_body_main{
                    width: calc(100% - 118px);
                    &>.row{
                        align-items: stretch;
                        border-bottom: 1px solid rgba(230,230,230,1);
                        &:last-child{
                            border-bottom: none;
                        }
                        &:nth-child(2n){
                            background-color: #F9FCFE;
                        }
                        .table_body_header_sub{
                            width: 90px;
                            min-height: 32px;
                            border-right: 1px solid rgba(230,230,230,1);
                            &:last-child{
                                border-right: none;
                            }
                        }
                        .table_body_main_sub{
                            width: calc(100% - 90px);
                            &>.row{
                                border-bottom: 1px solid rgba(230,230,230,1);
                                &:last-child{
                                    border-bottom: none;
                                }
                                .cell{
                                    width: 100%;
                                    height: 32px;
                                    line-height: 32px;
                                    flex-grow: 2;
                                    flex-shrink: 1;
                                    box-sizing: border-box;
                                    padding: 0 12px;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    border-right: 1px solid rgba(230,230,230,1);
                                    &:nth-child(1){
                                        width: 130px;
                                        flex-grow: 0;
                                        flex-shrink: 0;
                                    }
                                    &:last-child{
                                        border-right: none;
                                    }
                                }
                            }
                        }
                    }
                    .empty_block_row{
                        height: 100%;
                        .table_body_main_sub{
                            &>.row{
                                height: 100%;
                                .cell{
                                    height: 100% !important;
                                }
                            }
                        }
                        
                    }  
                    
                }
            }
            
        }
    }
    .empty_blcok{
        padding: 100px 0;
    }
}
</style>
