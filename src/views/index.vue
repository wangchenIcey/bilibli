<template>
  <div class="b-warp">
    <IndexItem
      v-for="i in sortList"
      :key="i.sort"
      :item="i"
      :id="i.type"
      :style="`width:100%;height:456px;color:#000;font-size:20px;`"
    >
    </IndexItem>
  </div>
  <bilinav />

  <div class="foot" style="height: 200px; width: 100%"></div>
</template>

<script lang='ts'>
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  reactive,
  toRefs,
} from "vue";
import bilinav from "../components/bilibili-nav.vue";
import * as jsonData from "../menu.json";

import IndexItem from "./indexItemComponents/indexItem.vue";
import { sort } from "../api/header";
import { decode, defaultSort } from "../config/util.js";
interface Gstate {
  sortList: any;
}

export default defineComponent({
  components: {
    bilinav,
    IndexItem,
  },
  setup() {
    const Gstate: Gstate = inject("state");
    const state = reactive({
      sortNumber: 0,
      initSortList: [],
    });
    const getSortData = () => {
      var t = JSON.parse(window.localStorage.index_user_setting || "{}");
      return t.len === state.sortNumber
        ? decode(t.sort, state.sortNumber)
        : defaultSort(state.sortNumber);
    };
    const setSortList = (t) => {
      for (var e = [], i = 0; i < t.length; i++) {
        var a = t[i];
        e.push({
          sort: a,
          name: jsonData.config[a].navName || jsonData.config[a].name,
          type: jsonData.config[a].type,
          zid: jsonData.config[a].zid || "",
          tid: jsonData.config[a].tid || "",
          morelink: jsonData.config[a].morelink || "",
          component: jsonData.config[a].component || "",
          getApi: i == 0 ? true : false,
        });
        if (i == t.length - 1) {
          Gstate.sortList = e;
        }
      }
    };
    const setInitSortList = () => {
      state.initSortList = getSortData();
      setSortList(state.initSortList);
    };
    const init = () => {
      sort().then((sortData) => {
        localStorage.setItem(
          "index_user_setting",
          JSON.stringify(sortData.data.data)
        );
        state.sortNumber = sortData.data.data.len;
        setInitSortList();
      });
    };
    onMounted(() => {
      init();
    });
    return {
      ...toRefs(Gstate),
    };
  },
});
</script>
<style lang="scss">
.b-warp,
.b-footer-wrap {
  width: 1630px;
  margin: 0 auto;
  @media screen and (max-width: 1870px) {
    width: 1414px;
  }

  @media screen and (max-width: 1654px) {
    width: 1198px;
  }
}
</style>