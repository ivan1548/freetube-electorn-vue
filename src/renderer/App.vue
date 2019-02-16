<template>
  <div id="app">
    <component :is="layout"></component>
  </div>
</template>

<script>
const default_layout = "default";

export default {
  name: "freetube-electorn-vue",
  computed: {
    layout() {
      return "layout-" + (this.$route.meta.layout || default_layout);
    }
  }
};
</script>

<style>
/* CSS */
</style>
