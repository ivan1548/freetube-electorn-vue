<template>
  <div id="recommendations">
    <strong>Recommendations</strong>
    <div v-for="(video, index) in videos" v-bind:key="index">
      <div class="recommendVideo" v-on:click="goToVideo(video.id)">
        <div class="recommendThumbnail">
          <img :src="video.thumbnail">
          <p v-on:click="goToVideo(video.id)" class="videoDuration">{{video.duration}}</p>
        </div>
        <p class="recommendTitle">{{video.title}}</p>
        <p class="recommendChannel">{{video.channelName}}</p>
        <p class="recommendDate">{{video.viewCount}}</p>
      </div>
      <hr>
    </div>
  </div>
</template>

<script>
import { invidiousAPI } from "../../helper/youtubeApi";
import Playlist from "../../models/playlist";
import Video from "../../models/video";

export default {
  name: "video-view-recomended",
  components: {},
  data() {
    return {};
  },
  props: {
    items: Array
  },
  methods: {
    goToVideo(videoId) {
      this.$router.push({
        name: "video-view",
        params: { id: videoId },
        query: { playlist: this.playlistId }
      });
    }
  },
  computed: {
    videos() {
      return this.items.map(el => {
        return new Video(el);
      });
    }
  }
};
</script>