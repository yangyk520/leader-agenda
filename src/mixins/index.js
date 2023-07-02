export default {
    data() {
        return {
            scrollOps: {
                scrollPanel: {
                    scrollingX: false
                },
                bar: {
                    background: '#ccc'
                },
                vuescroll: {
                    wheelScrollDuration: 100
                }
            },
        }
    },
    methods: {
        editActive(item) {
            if ( !item.clickUrl ) {
                return
            }
            if ( this.setting_data && (!this.setting_data.hasPermission) && (!item.mySchedule) && item.isBusy == '1' ) {
                return
            }
            let that = this;
            IDM.layer.open({
                title: ["单位领导活动", "font-size:18px;"],
                type: 2,
                area: ["1200px", "90%"],
                content: IDM.url.getWebPath(item.clickUrl),
                success: function (layero, index) {
                    top.close = function () {
                        IDM.layer.close(index);
                        that.$emit('updateTableData')
                    };
                },
                end: function () {
                    that.$emit('updateTableData')
                },
            });
        },
        getActiveList(data) {
            if ( !data ) {
                return []
            }
            return data
            // if ( !this.isPreview ) {
            //     return data
            // }
            // let result = [];
            // data.forEach(item => {
            //     if ( item.state != 0 ) {
            //         result.push(item)
            //     }
            // });
            // return result
        }
    }
}