<template>
  <component :is="componentId" :item="item"></component>
</template>
<script>
import {
  computed,
  ref,
  markRaw,
  nextTick,
  onMounted,
  reactive,
  defineAsyncComponent,
  toRefs,
} from "vue";
import Axios from "axios";
export default {
  props: {
    item: {
      type: Object,
      default: {},
      requires: true,
    },
  },
  setup(props) {
    const componentId = ref(null);

    onMounted(() => {
      let item = props.item;
      let component = new Promise((resolve, reject) => {
        return resolve(import(`./${item.component}.vue`));
      });
      component.then((r) => {
        componentId.value = markRaw(r.default);
        setTimeout(() => {
          nextTick(() => {
            const element = document.getElementById(item.type);
            item.element = element;
            item.offsetTop = element.getBoundingClientRect().top;
          });
        });
      });
    });
    return {
      componentId,
    };
  },
};
</script>