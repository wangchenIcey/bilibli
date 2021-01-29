<template>
  <div class="elevator" :style="`top: ${px}px`">
    <div class="mask"></div>
    <div class="list-box" id="list-box">
      <template v-for="(item, eindex) in sortList" :key="eindex">
        <div
          class="item sortable"
          @click="getContent(eindex)"
          :class="{ active: eindex == index }"
        >
          {{ item.navName || item.name }}
        </div>
      </template>
      <div class="item sort"></div>
      <div class="item back-top"></div>
    </div>
  </div>
</template>
<script>
import {
  computed,
  defineComponent,
  inject,
  nextTick,
  onMounted,
  reactive,
  toRefs,
  watch,
} from "vue";
import { sort } from "../api/header";
import { scrollToElem, debounce } from "./smooth-scroll";
export default defineComponent({
  setup() {
    const state = reactive({
      px: 260,
      sortNumber: 0,
      initSortList: [],
      current: -1,
      sortList: [],
      activeClass: null,
      lastClientY: 0,
      newClientY: 0,
      moveX: 0,
      index: 0,
      scrollTop: 0,
      downflag: false,
    });
    const Gstate = inject("state");
    const scroll = () => {
      state.scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop + document.body.scrollTop;
      // 判断是否已经滚动到该楼层，使用offset获得更好的交互体验
      let len = Gstate.sortList.length;
      let itemlist = Gstate.sortList;
      if (state.flag) {
        let i = state.index;
        if (!itemlist[i].getApi) {
          itemlist[i].getApi = true;
        }
        itemlist[i + 1 < len ? i + 1 : len - 1].getApi = true;
      } else {
        for (let i = 0; i < len; i++) {
          if (state.scrollTop >= itemlist[i].offsetTop - 100) {
            state.index = i;
            state.current = i;
            if (!itemlist[i].getApi) {
              itemlist[i].getApi = true;
            }
            itemlist[i + 1 < len ? i + 1 : len - 1].getApi = true;
          } else if (state.scrollTop < itemlist[0].offsetTop - 100) {
            // 滚动到顶部则取消高亮
            state.index = -1;
            state.current = -1;
          }
        }
      }

      // 设置整个navbarOffsetTop位置
      let scroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scroll < 260 && scroll > 10) {
        state.px = 260 - scroll;
      } else if (scroll < 260) {
        state.px = 260;
      } else {
        state.px = 10;
      }
    };
    onMounted(() => {
      document.addEventListener("scroll", scroll, true);
    });
    const getContent = (index) => {
      // 缓动滚动到指定楼层
      if (index === state.current) return;
      state.current = index;
      state.index = index;
      Gstate.sortList[index].getApi = true;
      const target = Gstate.sortList[index].element;
      scrollToElem(target, 300, 100 || 0);
    };
    return {
      ...toRefs(state),
      ...toRefs(Gstate),
      getContent,
    };
  },
});
</script>

<style lang="scss" >
.elevator {
  position: fixed;

  left: calc(50% + 3px);
  top: 10px;
  margin-left: 825px;
  z-index: 10;

  @media screen and (max-width: 1870px) {
    margin-left: 716px;
  }
  @media screen and (max-width: 1654px) {
    margin-left: 615px;
  }
  .list-box {
    padding-top: 6px;
    position: relative;
    background: #fff;
    border: 1px solid #e7e7e7;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    z-index: 2;
    .sort {
      height: 32px;
      line-height: 32px;
      position: relative;
      border-top: 1px solid #e7e7e7;
      margin-top: 5px;
    }
    .back-top {
      position: absolute;
      left: -1px;
      bottom: -32px;
      width: 56px;
      line-height: 30px;
      height: 32px;
      border: 1px solid #e7e7e7;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }
  }

  .item {
    color: #505050;
    font-size: 12px;
    width: 54px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    -ms-user-select: none;
    user-select: none;
    background: #fff;
    &:hover {
      background-color: #00a1d6;
      color: #fff;
    }
    &.active {
      background-color: #00a1d6;
      color: #fff;
    }
  }
}
</style>