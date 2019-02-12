<template>
  <div class="video">
    <div class="videoThumbnail">
      <img @click="goToPlaylist" :src="playlist.thumbnail">
      <div class="videoPlaylist" @click="goToPlaylist">
        <span class="videoPlaylistTotals">{{playlist.videoCount}}</span>
        <i class="fas fa-list-ol videoPlaylistIcon"></i>
      </div>
    </div>
    <p @click="goToPlaylist" class="videoTitle">{{playlist.title}}</p>
    <p @click="goToChannel" class="channelName">{{playlist.channelName}}</p>
    <p @click="goToPlaylist" class="videoDescription">{{playlist.description}}</p>
    <p
      @click="goToPlaylist"
      class="viewPlaylist"
    >VIEW FULL PLAYLIST ({{playlist.videoCount}} videos)</p>
  </div>
</template>

<script>
import Playlist from "../../models/playlist";

export default {
  name: "playlist-item",
  components: {},
  data() {
    return {
      playlist: false
    };
  },
  props: {
    item: Object
  },
  mounted() {
    this.playlist = new Playlist(this.item);
  },
  methods: {
    goToPlaylist() {
      this.$router.push({
        name: "playlist-view",
        params: { id: this.playlist.id }
      });
    },
    goToChannel() {
      this.$router.push({
        name: "channel-view",
        params: { id: this.playlist.channelId }
      });
    }
  }
};
</script>