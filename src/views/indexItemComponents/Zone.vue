<template>
  <div>
    <div class="space-between">
      <cardList :dataList="dataList" />
      <div class="rank-list"></div>
    </div>
  </div>
</template>
<script>
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  toRefs,
  watch,
  watchEffect,
} from "vue";
import { Getregion } from "../../api/getItem";
import cardList from "./components/card-list.vue";
export default defineComponent({
  components: {
    cardList,
  },
  props: {
    item: {
      type: Object,
      default: {},
      requires: true,
    },
    getApi: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const state = reactive({
      code: "",
      dataList:[]
    });

    watchEffect(() => {
      if (props.item.getApi) {
        Getregion({ ps: 12, rid: props.item.tid }).then((r) => {
          state.dataList = r.data.data.archives
        });
      }
    });
    // watch(
    //   () => props.item.getApi,
    //   () => {
    //     Getregion({rid:props.item.tid,ps:12}).then(r=>{
    //       console.log(r.data)
    //     })
    //   }
    // );
    return {
      ...toRefs(state),
    };
  },
});
</script>
<style lang="scss" >
.space-between {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}
.rank-list{
  width: 320px;
}
</style>