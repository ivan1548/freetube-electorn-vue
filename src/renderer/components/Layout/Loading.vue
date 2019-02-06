<template>
  <div id="loading" v-if="seen">
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "loading",
  components: {},
  data() {
    return {};
  },
  methods: {},
  computed: {
    seen() {
      return this.$store.state.Loading.seen;
    }
  }
};
</script>