<template>
  <div class="playlistVideo">
    <div class="videoOptions">
      <i class="fas fa-ellipsis-v" @click="toggleOptions"></i>
      <ul v-if="options">
        <div v-if="video.watched">
          <li v-on:click="history(video.id)">Remove From History</li>
        </div>
        <a :href="video.youtubeUrl">
          <li>Open in YouTube</li>
        </a>
        <li v-on:click="copy(video.id)">Copy YouTube Link</li>
        <a :href="video.invidiousUrl">
          <li>Open in Invidious</li>
        </a>
        <li v-on:click="copy(video.id)">Copy Invidious Link</li>
      </ul>
    </div>
    <div class="playlistVideoThumbnail">
      <img @click="gotToVideo" :src="video.thumbnail">
      <p @click="gotToVideo" class="videoDuration">{{video.duration}}</p>
      <i class="fas fa-history playlistVideoSave" v-on:click="toggleSave(video.id)"></i>
      <div v-if="video.watched" class="videoWatched">WATCHED</div>
    </div>
    <p @click="gotToVideo" class="playlistVideoTitle">{{video.title}}</p>
    <p v-on:click="channel(video.channelId)" class="playlistChannelName">{{video.channelName}}</p>
    <p @click="gotToVideo" class="live">{{video.liveText}}</p>
  </div>
</template>

<script>
import Video from "../../models/video";

export default {
  name: "playlist-video-item",
  components: {},
  data() {
    return {
      options: false,
      video: false
    };
  },
  props: {
    item: Object,
    playlistId: String
  },
  mounted() {
    this.video = new Video(this.item);
  },
  methods: {
    toggleOptions() {
      this.options = !this.options;
    },
    gotToVideo() {
      this.$router.push({
        name: "video-view",
        params: { id: this.video.id },
        query: { playlist: this.playlistId }
      });
    },
    history(id) {},
    copy(id) {},
    play(id) {},
    channel(id) {},
    toggleSave(id) {}
  }
};
</script>