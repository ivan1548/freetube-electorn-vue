<template>
  <div>
    <div v-for="(item, index) in items" v-bind:key="index">
      <channel-item v-if="canDisplay(item, 'channel')" :item="item"></channel-item>
      <playlist-item v-else-if="canDisplay(item, 'playlist')" :item="item"></playlist-item>
      <video-item v-else-if="!item.paid" :item="item"></video-item>
      <hr>
    </div>
  </div>
</template>

<script>
import VideoItem from "./List/VideoItem";
import ChannelItem from "./List/ChannelItem";
import PlaylistItem from "./List/PlaylistItem";
export default {
  name: "subscriptions",
  components: { VideoItem, ChannelItem, PlaylistItem },
  data() {
    return {};
  },
  props: {
    items: Array
  },
  methods: {
    canDisplay(item, type) {
      return !item.paid && item.type == type;
    }
  }
};
</script>