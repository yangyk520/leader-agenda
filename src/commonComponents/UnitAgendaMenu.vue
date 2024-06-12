<template>
  <ul>
    <li v-for="item in menuData" :key="item.id" @click.stop="handleClick(item)">
      <div
        class="menu-item"
        :class="{ active: activeId === item.id, open: item.open }"
        :style="`padding-left:${paddingLeft}px`"
      >
        <span
          ><svg-icon :iconClass="item.type == 1 ? 'person' : 'unit'" class="icon-type"></svg-icon
          >{{ item.name }}</span
        >
        <svg-icon
          v-if="item.children && item.children.length"
          class="icon-open"
          iconClass="open"
        ></svg-icon>
      </div>
      <template v-if="item.children && item.children.length">
        <UnitAgendaMenu
          v-show="item.open"
          :menuData="item.children"
          :activeId="activeId"
          :type="type"
          :paddingLeft="paddingLeft + 25"
          @updateActiveId="updateActiveId"
        ></UnitAgendaMenu>
      </template>
    </li>
  </ul>
</template>
<script>
export default {
  name: "UnitAgendaMenu",
  props: {
    menuData: {
      type: Array,
      default() {
        return [];
      },
    },
    activeId: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "unit",
    },
    paddingLeft:{
      type: Number,
      default: 0
    }
  },
  methods: {
    handleClick(item) {
      console.log('item',item);
      if (this.type === "unit" && (item.type == 4 || item.type == 5)) {
        this.$emit("updateActiveId", {
          deptId: item.attrs.idValue
        });
      } else if (this.type === "person" && item.type == 1) {
        this.$emit("updateActiveId", {
          userId: item.attrs.idValue,
          deptId: item.attrs.deptId
        });
      }
      item.open = !item.open;
    },
    updateActiveId(id) {
      this.$emit("updateActiveId", id);
    },
  },
};
</script>
<style scoped lang="scss">
.menu-item {
  padding: 15px 27px;
  border-left: 10px solid transparent;
  color: #333333;
  transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: flex;
  justify-content: space-between;

  &:hover {
    background: rgba(84, 190, 255, 0.22);
  }
  &.active {
    border-color: #0086d9;
    background: rgba(84, 190, 255, 0.22);
    color: #0086d9;
  }

  &.open {
    .icon-open {
      transform: rotate(180deg);
    }
  }
  .icon-type {
    margin: 0 14px;
  }
}

ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
  transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>
<!-- ul {
  padding: 10px 0;
  border-bottom: 1px solid rgba(230, 230, 230, 1);
  li {
    padding: 10px 50px;
    cursor: pointer;
    transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    &.active {
      background: rgba(84, 190, 255, 0.22);
      color: #0086d9;
    }
    &:hover {
      background: rgba(84, 190, 255, 0.22);
      color: #0086d9;
    }
  }
} -->
