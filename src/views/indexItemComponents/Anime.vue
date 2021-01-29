<template>
  <div>
    <div class="space-between">
      <cardList :item='item'/>
      <div class="rank-list"></div>
    </div>
  </div>
</template>
<script>
import { computed, nextTick, onMounted, reactive, toRefs } from "vue";
import Axios from "axios";
import cardList from './components/card-list.vue'
export default {
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
    });
  
   
    return {
      ...toRefs(state),
    };
  },
};
</script>