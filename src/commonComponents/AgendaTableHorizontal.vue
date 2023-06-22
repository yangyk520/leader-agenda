<template>
  <div class="AgendaTableHorizontal_app">
    <div class="table">
      <div class="table_header flex_between">
        <div v-for="(header, h) in header_list" :key="h" class="cell">
          {{ header.name }}
        </div>
      </div>
      <div class="table_body">
        <div
          v-for="(item, index) in data_list"
          :key="index"
          class="row flex_between"
        >
          <div
            v-for="(header, h) in header_list"
            :key="h"
            class="cell"
            :class="header.id == 1 ? 'flex_center' : ''"
          >
            <div v-if="header.id == 1" class="user_info">
              <div class="name">{{ item.time }}</div>
            </div>
            <div v-else class="active_block">
              <div
                v-if="item[header.id] && item[header.id].length"
                class="block"
              >
                <div
                  v-for="(todo, t) in item[header.id]"
                  :key="t"
                  class="active_list"
                >
                  <div class="row" :style="getStyleData(todo)">
                    <SvgIcon icon-class="clock"></SvgIcon>
                    <span class="time">{{ todo.time }}</span>
                    <span class="name">{{ todo.name }}</span>
                  </div>
                  <div class="row flex_start address_block">
                    <SvgIcon icon-class="address"></SvgIcon>
                    <span class="address">{{ todo.address }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="empty">单位内办公</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SvgIcon from "../icons/SvgIcon.vue";

export default {
  name: "AgendaTableVertical",
  components: {
    SvgIcon,
  },
  data() {
    return {
      header_list: [
        {
          id: 1,
          name: "时间",
          headerImg: "",
        },
        {
          id: 2,
          name: "路飞",
          headerImg: "",
        },
        {
          id: 3,
          name: "宋俊",
          headerImg: "",
        },
        {
          id: 4,
          name: "徐华磊",
          headerImg: "",
        },
        {
          id: 5,
          name: "徐华磊",
          headerImg: "",
        },
      ],
      data_list: [
        {
          time: "上午",
          2: [
            {
              time: "8:30",
              name: "党组会",
              status: 1,
              address:
                "东区礼合楼202（云鹃路166号） 主持人:宋骏  会议内容:主要是就当前工作进行汇报、分析和研究，讨论解决工作中的重大问题，推动单位工作向正确方向发展等，并且…",
            },
          ],
          3: [
            {
              time: "13:30",
              name: "经济工作监督座谈会",
              status: 2,
              address: "东区礼合楼202",
            },
            {
              time: "15:30",
              name: "2023年“一网通办”工作推进专题会",
              status: 3,
              address: "东区礼合楼201（云鹃路169号）",
            },
          ],
          4: [
            {
              time: "13:30",
              name: "经济工作监督座谈会",
              status: 2,
              address: "东区礼合楼202",
            },
            {
              time: "15:30",
              name: "2023年“一网通办”工作推进专题会",
              status: 3,
              address: "东区礼合楼201（云鹃路169号）",
            },
          ],
        },
        {
          time: "下午",
          2: [
            {
              time: "8:30",
              name: "党组会",
              status: 1,
              address:
                "东区礼合楼202（云鹃路166号） 主持人:宋骏  会议内容:主要是就当前工作进行汇报、分析和研究，讨论解决工作中的重大问题，推动单位工作向正确方向发展等，并且…",
            },
          ],
          3: [
            {
              time: "13:30",
              name: "经济工作监督座谈会",
              status: 2,
              address: "东区礼合楼202",
            },
            {
              time: "15:30",
              name: "2023年“一网通办”工作推进专题会",
              status: 3,
              address: "东区礼合楼201（云鹃路169号）",
            },
          ],
        },
      ],
    };
  },
  created() {},
  methods: {
    getStyleData(item) {
      var styleObject = {};
      switch (item.status) {
        case 1:
          styleObject["color"] = "#0086D9";
          break;
        case 2:
          styleObject["color"] = "#FFA500";
          break;
        case 3:
          styleObject["color"] = "#E30000";
          break;
        case 4:
          styleObject["text-decoration"] = "line-through";
          break;
        default:
          break;
      }
      return styleObject;
    },
  },
};
</script>
<style lang="scss" scoped>
.AgendaTableHorizontal_app {
  .table {
    .table_header {
      height: 48px;
      text-align: center;
      background: #f9fcfe;
      border: 1px solid rgba(230, 230, 230, 1);
      .cell {
        height: 48px;
        line-height: 48px;
        width: 100%;
        flex-grow: 2;
        flex-shrink: 1;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        font-weight: 500;
        border-right: 1px solid rgba(230, 230, 230, 1);
        &:last-child {
          border-right: none;
        }
        &:nth-child(1) {
          width: 152px;
          flex-grow: 0;
          flex-shrink: 0;
        }
      }
    }
    .table_body {
      & > .row {
        border-bottom: 1px solid rgba(230, 230, 230, 1);
        border-left: 1px solid rgba(230, 230, 230, 1);
        border-right: 1px solid rgba(230, 230, 230, 1);
        align-items: stretch;
        .cell {
          width: 100%;
          // height: 100%;
          flex-grow: 2;
          flex-shrink: 1;
          box-sizing: border-box;
          padding: 12px 12px 0 12px;
          border-right: 1px solid rgba(230, 230, 230, 1);
          &:last-child {
            border-right: none;
          }
          &:nth-child(1) {
            width: 152px;
            flex-grow: 0;
            flex-shrink: 0;
            text-align: center;
            img {
              width: 64px;
              height: 64px;
              margin-bottom: 16px;
            }
          }
          .time,
          .name,
          .address {
            font-size: 16px;
            line-height: 22px;
            font-weight: 400;
            word-wrap: break-word;
          }
          .time,
          .name {
            color: #0086d9;
          }
          .active_block {
            .active_list {
              margin-bottom: 16px;
              padding-bottom: 16px;
              border-bottom: 1px dotted #979797;
              &:last-child {
                margin-bottom: 0;
                border-bottom: none;
              }
              .svg-icon {
                font-size: 14px;
                margin-right: 5px;
              }
              .address_block {
                align-items: flex-start;
                .svg-icon {
                  flex-shrink: 0;
                  position: relative;
                  top: 3px;
                }
              }
              .time {
                margin-right: 10px;
              }
            }
          }
          .user_info {
            .name {
              font-size: 20px;
              color: #333333;
              text-align: center;
              font-weight: 500;
            }
          }
          .empty {
            font-size: 16px;
            color: #0086d9;
            font-weight: 400;
          }
        }
      }
    }
  }
}
</style>
