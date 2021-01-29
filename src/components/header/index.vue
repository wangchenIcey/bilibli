<template>
  <div class="header">
    <div class="onHeader" @mousemove="Move" @mouseout="out">
      <miniHeader></miniHeader>
      <div class="bili-header" :style="`background-image: url(${pic});`">
        <div class="taper-line"></div>
        <animatedBanner v-if="is_split_layer" :list="animatedList" />
      </div>
    </div>
    <bwarp></bwarp>
  </div>
</template>

<script lang='ts'>
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
} from "vue";
import { getBgimg } from "../../api/header";
import miniHeader from "./mini-header.vue";
import bwarp from "./bwarp.vue";
import animatedBanner from "./animatedBanner.vue";
interface data {
  domWidth: number;
  translateX: number;
  translateX2: number;
  opacity: number;
  list: any;
  is_split_layer:number
}
interface e {
  style: object;
}
export default defineComponent({
  components: {
    miniHeader,
    bwarp,
    animatedBanner,
  },
  setup() {
    const pic = ref("");
    const data: data = reactive({
      domWidth: 0,
      translateX: 0,
      translateX2: 0,
      opacity: 0,
      list:{layers:[]},
      is_split_layer:0
    });
    onMounted(() => {
      getBgimg().then((r) => {
        pic.value = r.data.data.litpic;
        data.is_split_layer = r.data.data.is_split_layer
        if(data.is_split_layer == 1){
          data.list = JSON.parse(r.data.data.split_layer)
        }
      });
      data.domWidth = document.querySelector(".onHeader").clientWidth;
    });
    const animatedList = computed(() => {
      let Arr = [];
      data.list.layers.forEach((e, index) => {
        Arr.push({
          src: e.resources[0].src,
          name: e.name,
          id: e.id,
          translateX: data.translateX,
          translateX2: data.translateX2,
          opacity: index == 3 || index == 4 || index == 7 ? 0 : 1,
          video: e.resources[0].src.split(".").indexOf("webm") !== -1,
        });
      });
      return Arr;
    });
    const Move = (e) => {
      if(data.is_split_layer === 0) return;
      document.querySelectorAll(".layer .layerchild").forEach((e) => {
        e.setAttribute("class", "layerchild");
      });
      if (
        <number>data.domWidth / 2 - e.screenX > 15 ||
        <number>data.domWidth / 2 - e.screenX < -15
      ) {
        // 正整数向左  负数向右滑
        data.translateX = parseInt(
          ((<number>data.domWidth / 2 - e.screenX) / 13.5).toFixed(2)
        );

        data.translateX2 = parseInt(
          ((<number>data.domWidth / 2 - e.screenX) / 10.2).toFixed(2)
        );
        if (data.translateX > 0) {
          animatedList.value[1].opacity =
            1 - data.translateX * 0.04 < 0 ? 0 : 1 - data.translateX * 0.04;
          animatedList.value[2].opacity =
            1 - data.translateX * 0.03 < 0 ? 0 : 1 - data.translateX * 0.03;
          animatedList.value[6].opacity =
            1 - data.translateX2 * 0.03 < 0 ? 0 : 1 - data.translateX2 * 0.03;
        } else {
          animatedList.value[3].opacity = Math.abs(data.translateX) * 0.02;
          animatedList.value[4].opacity = Math.abs(data.translateX) * 0.002;
          animatedList.value[7].opacity = Math.abs(data.translateX2) * 0.02;
        }
      }
    };
    const out = () => {
      if(data.is_split_layer === 0) return;

      document.querySelectorAll(".layer .layerchild").forEach((e) => {
        e.setAttribute("class", "layerchild translayer");
      });
      data.translateX = 0;
      data.translateX2 = 0;
    };

    return {
      pic,
      Move,
      out,
      ...toRefs(data),
      animatedList,
    };
  },
});
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  z-index: 1000;
  .bili-header {
    margin: 0 auto;
    position: relative;
    z-index: 0;
    min-height: 155px;
    height: 9.375vw;
    min-width: 999px;
    background-color: #f9f9f9;
    display: flex;
    justify-content: center;
    background-repeat: no-repeat;
    background-position: center 0;
    background-size: cover;
    .taper-line {
      pointer-events: none;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100px;
      background: linear-gradient(rgba(0, 0, 0, 0.4), transparent);
    }
    .banner-link {
      z-index: 0;
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
    }
  }
}
</style>
