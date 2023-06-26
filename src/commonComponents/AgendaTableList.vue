<template>
    <div class="AgendaTableList_app">
        <div class="table">
            <div class="table_header row flex_between">
                <div v-for="(item,index) in header_list" :key="index" class="cell">
                    {{ item.name }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: 'AgendaTableList',
    props: [ 'isPreview' ],
    computed: {
        
    },
    data() {
        return {
            header_list: [
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
                    width: 152px;
                    flex-grow: 0;
                    flex-shrink: 0;
                }
            }
        }
    }
}
</style>