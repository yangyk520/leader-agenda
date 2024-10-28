<template>
<div class="AgendaFooter_app flex_center">
  <div v-for="(item,index) in getStatusList" :key="index" class="status_list flex_start">
    <SvgIcon v-if="item.icon" :icon-class="item.icon"></SvgIcon>
    <span v-else class="circle" :style="getStyleData(item)"> </span>
    <span>{{ item.name }}</span>
  </div>
</div>
</template>

<script>
import SvgIcon from '../icons/SvgIcon.vue';

export default {
  name: 'AgendaFooter',
  components: {
    SvgIcon,
  },
  props: ['isPreview', 'setting_data'],
  computed: {
    getStatusList: function () {
      if ((!this.isPreview) || this.setting_data.leader) {
        return this.status_list
      }
      return this.status_list.filter((item, index) => {
        return index != 2
      })
    }
  },
  data() {
    return {
      status_list: [{
          color: '#0086D9',
          name: '正常'
        },
        // {
        //   color: '#FFA500',
        //   name: '变更'
        // },
        {
          color: '#E30000',
          name: '标记'
        }
      ]
    }
  },
  created() {

  },
  methods: {
    getStyleData(item) {
      var styleObject = {}
      styleObject['background-color'] = item.color;
      return styleObject
    },
  }
}
</script>

<style lang="scss" scoped>
.AgendaFooter_app {
  height: 42px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  box-shadow: 0px -1px 6px 0px rgba(188, 188, 188, 0.5);

  .status_list {
    margin-right: 24px;

    &:last-child {
      margin-right: 0;
    }

    .circle {
      width: 16px;
      height: 16px;
      margin-right: 8px;
      display: inline-block;
      border-radius: 50%;
    }

    .svg-icon {
      margin-right: 12px;
      font-size: 16px;
    }
  }
}
</style>
