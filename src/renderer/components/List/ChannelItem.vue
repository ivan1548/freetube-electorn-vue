<template>
  <div class="video">
    <div class="channelThumbnail">
      <img @click="goToChannel" :src="channel.thumbnail">
    </div>
    <p @click="goToChannel" class="videoTitle">{{channel.channelName}}</p>
    <p
      @click="goToChannel"
      class="channelName"
    >{{channel.subscriberCount}} subscribers - {{channel.videoCount}} videos</p>
    <p @click="goToChannel" class="videoDescription">{{channel.channelDescription}}</p>
  </div>
</template>

<script>
import Channel from "../../models/channel";
export default {
  name: "channel-item",
  components: {},
  data() {
    return {
      channel: false
    };
  },
  props: {
    item: Object
  },
  mounted() {
    this.channel = new Channel(this.item);
  },
  methods: {
    goToChannel() {
      this.$router.push({
        name: "channel-view",
        params: { id: this.channel.channelId }
      });
    }
  }
};
</script>