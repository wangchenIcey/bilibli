<template>
  <router-view></router-view>
</template>

<script>
import { provide, reactive } from 'vue';
export default {
  name: "App",
  setup(){
    provide('state',reactive({
      user:{}
    }))
  }
};
</script>
