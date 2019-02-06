<template>
  <ul id="subscriptions">
    <li
      v-for="(sub, index) in subscriptions"
      v-bind:key="index"
      @click="goToChannel(sub.channelId)"
    >
      <img :src="sub.channelThumbnail">
      {{sub.channelName}}
      <i class="fas fa-times" @click="toggleSubscription(sub.channelId)"></i>
    </li>
  </ul>
</template>

<script>
export default {
  name: "side-nav-subscriptions",
  components: {},
  data() {
    return {};
  },
  methods: {
    goToChannel(channelId) {
      this.$router.push({
        name: "channel-view",
        params: { id: channelId }
      });
    },
    getSubscriptions() {},
    toggleSubscription() {}
  },
  computed: {
    subscriptions() {
      return this.$store.state.Subscriptions.list;
    }
  }
};
</script>