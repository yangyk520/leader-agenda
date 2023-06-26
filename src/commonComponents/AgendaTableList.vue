<template>
    <div class="AgendaTableList_app">
        <div class="table">
            <div class="table_header row flex_between">
                <div v-for="(item,index) in header_data" :key="index" class="cell">
                    {{ item.name }}
                </div>
            </div>
            <div v-if="header_list_table && header_list_table.length" class="table_body">
                <div v-for="(item,index) in header_list_table" :key="index" class="row flex_between">
                    <div class="table_body_header flex_center">
                        <div>
                            <div>{{ item.name }}</div>
                            <div>{{ item.week }}</div>
                        </div>
                    </div>
                    <div class="table_body_main">
                        <div v-for="(item1,index1) in item.subHeader" :key="index1" class="flex_between row">
                            <div class="table_body_header_sub flex_center">
                                <span>{{ item1.name }}</span>
                            </div>
                            <div class="table_body_main_sub">
                                <template v-if="data_list_table[item1.id].data && data_list_table[item1.id].data.length">
                                    <div v-for="(item2,index2) in data_list_table[item1.id].data" :key="index2" class="flex_between row">
                                        <div class="cell">{{  `${item2.time} - ${item2.endTime}` }}</div>
                                        <div class="cell">{{ item2.content }}</div>
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
                    </div>
                </div>
               
            </div>
            <div class="empty_blcok" v-else>
                <a-empty description="暂无数据" />
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: 'AgendaTableList',
    props: [ 'isPreview','data_list_table','header_list_table' ],
    computed: {
        
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
    .table{
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
            }
        }
        .table_body{
            font-size: 16px;
            color: #333333;
            font-weight: 400;
            &>.row{
                align-items: stretch;
                border-bottom: 1px solid rgba(230,230,230,1);
                &:last-child{
                    border-bottom: none;
                }
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
                                    border-right: 1px solid rgba(230,230,230,1);
                                    &:last-child{
                                        border-right: none;
                                    }
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