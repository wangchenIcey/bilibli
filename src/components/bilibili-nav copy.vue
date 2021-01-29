<template>
  <div class="elevator" :style="`top: ${px}px`">
    <div class="mask"></div>
      <div
        class="list-box"
        id="list-box"
        @mouseup="mouseup"
        @mouseout="mouseout"
        @mousemove="mousemove"
      >
        <template v-for="(item, index) in comSortList" :key="index">
          <div class="item sortable" @mousedown="mousedown(index)">
            {{ item.navName || item.name }}
          </div>
        </template>
        <div class="item sort"></div>
        <div class="item back-top"></div>
      </div>
  </div>
</template>
<script>
import { computed, defineComponent, onMounted, reactive, toRefs } from "vue";
import * as jsonData from "../menu.json";
import { sort } from "../api/header";
export default {
  setup(props) {
    const state = reactive({
      px: 260,
      sortNumber: 0,
      initSortList: [],
      sortList: [],
      activeClass: null,
      lastClientY: 0,
      newClientY: 0,
      moveX: 0,
      index: 0,
      downflag: false,
    });

    const create = (t) => {
      var e,
        i = [];
      for (i[0] = 1, e = 1; e < t; e++) {
        i[e] = i[e - 1] * e;
      }
      return i;
    };
    const encode = (t, e) => {
      var i,
        a,
        n = t.length,
        o = this.create(e),
        r = [];
      for (i = 0; i < n; i++)
        for (r[i] = 0, a = 0; a < i; a++) t[a] > t[i] && r[a]++;
      var s = 0;
      for (i = 0; i < n; i++) s += r[i] * o[n - i - 1];
      return s.toString(32);
    };
    const decode = (t, e) => {
      var i, a;
      t = parseInt(t, 32);
      var n = [],
        o = [],
        r = [],
        s = create(e);
      for (i = e - 1, a = 0; i >= 0; i--, a++)
        (n[a] = t / s[i]), 0 !== t && (t %= s[i]), (o[i] = 1);
      for (i = 0; i < e; i++) {
        var l = 0;
        for (a = 0; a < e; a++)
          if ((l += o[a]) > n[i]) {
            (r[i] = a), (o[a] = 0);
            break;
          }
      }
      return r;
    };
    const setInitSortList = () => {
      state.initSortList = getSortData();
      setSortList(state.initSortList);
    };
    const getSortData = () => {
      var t = JSON.parse(window.localStorage.index_user_setting || "{}");
      return t.len === state.sortNumber
        ? decode(t.sort, state.sortNumber)
        : defaultSort();
    };
    const setSortList = (t) => {
      for (var e = [], i = 0; i < t.length; i++) {
        var a = t[i];
        e.push({
          sort: a,
          name: jsonData.config[a].navName || jsonData.config[a].name,
          type: jsonData.config[a].type,
        });
      }
      state.sortList = e;
    };
    const comSortList = computed(() => {
      state.sortList.forEach((e, index) => {});
      return state.sortList;
    });
    const defaultSort = () => {
      for (var t = [], e = 0; e < state.sortNumber; e++) t[e] = e;
      return t;
    };
    onMounted(async () => {
        let sortData = await sort();
      if (sortData) {
        localStorage.setItem(
          "index_user_setting",
          JSON.stringify(sortData.data.data)
        );
        state.sortNumber = sortData.data.data.len;
      }
      setInitSortList();
      window.addEventListener("scroll", () => {
        let scroll =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (scroll < 260 && scroll > 10) {
          state.px = 260 - scroll;
        } else if (scroll < 260) {
          state.px = 260;
        } else {
          state.px = 10;
        }
      });
    });

    const mousedown = (index) => {

        let e = event;
      e.preventDefault();

      state.downflag = true;
      state.index = index;
      
      state.lastClientY = e.clientY;
      let el = document.createElement("div");
      el.className = "slicksort-selected item sortable";
      el.style.cssText = `position:fixed;top:${e.y - e.offsetY}px;left:${
        e.x - e.offsetX
      }px;color: #505050;
    font-size: 12px;
    width: 58px;
    height: 24px;
    z-index: 3;
    line-height: 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    -ms-user-select: none;
    user-select: none;
    background:red;`;
      document.querySelector("body").appendChild(el);
    };
    const mouseup = (e) => {
      state.downflag = false;
      state.lastClientY = 0;
      let p = document.querySelector("body");
      p.removeChild(p.children[2]);
    };
    const mousemove = (e) => {
      e.preventDefault();
      if (state.downflag == false) return;
      let x = (e.clientY - state.lastClientY) / 24;
      let leftX = x.toString().split(".")[0];
      let rightX = parseInt(x.toString().split(".")[1]) > 4 ? 1 : 0;
      state.moveX = parseInt(leftX) + rightX;
      document.querySelector("body .slicksort-selected").style.top =
        e.clientY - state.lastClientY + state.px + "px";
    };
    const mouseout = (e) => {
      if (state.downflag == false) return;
      e.preventDefault();
      function isMouseLeaveOrEnter(e, handler) {
        if (e.type != "mouseout" && e.type != "mouseover") return false;
        var reltg = e.relatedTarget
          ? e.relatedTarget
          : e.type == "mouseout"
          ? e.toElement
          : e.fromElement;
        while (reltg && reltg != handler) reltg = reltg.parentNode;
        return reltg != handler;
      }
      let el = document.getElementById("list-box");
      if (isMouseLeaveOrEnter(e, el)) {
        let p = document.querySelector("body");
        p.removeChild(p.children[2]);
        state.downflag = false
      }
    };
    return {
      ...toRefs(state),
      mousedown,
      mouseup,
      mousemove,
      comSortList,
      mouseout,
    };
  },
};
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
  }
}
</style>