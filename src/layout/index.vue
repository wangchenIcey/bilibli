<template>
  <headers></headers>
  <router-view></router-view>
</template>

<script lang="ts">
import headers from "../components/header/index.vue";
import { defineComponent } from "vue";
export default defineComponent({
  components:{
    headers
  },
  setup() {},
});
</script>

<style scoped lang='scss'>
</style>