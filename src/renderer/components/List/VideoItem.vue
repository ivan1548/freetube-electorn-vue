<template>
  <div class="video">
    <div class="videoOptions">
      <i class="fas fa-ellipsis-v" @click="toggleOptions"></i>
      <ul v-if="options">
        <div v-if="watched">
          <li @click="removeFromHistory">Remove From History</li>
        </div>
        <a :href="video.youtubeUrl">
          <li>Open in YouTube</li>
        </a>
        <li v-on:click="copy('youtube.com')">Copy YouTube Link</li>
        <a :href="video.invidiousUrl">
          <li>Open in Invidious</li>
        </a>
        <li v-on:click="copy('invidio.us')">Copy Invidious Link</li>
      </ul>
    </div>
    <div class="videoThumbnail">
      <img @click="gotToVideo" :src="video.thumbnail">
      <p @click="gotToVideo" class="videoDuration">{{video.duration}}</p>
      <i class="fas fa-history videoSave" v-on:click="toggleSave"></i>
      <div v-if="video.watched" class="videoWatched">WATCHED</div>
    </div>
    <p @click="gotToVideo" class="videoTitle">{{video.title}}</p>
    <p v-on:click="goToChannel" class="channelName">{{video.channelName}}</p>
    <p
      @click="gotToVideo"
      class="videoViews"
    >{{video.views}} {{video.viewText}} - {{video.publishedDate}}</p>
    <p @click="gotToVideo" class="videoDescription">{{video.description}}</p>
    <p @click="gotToVideo" class="live">{{video.liveText}}</p>
  </div>
</template>

<script>
import { removeFromHistory, isInHistory } from "../../api/history";
import { addSavedVideo } from "../../api/savedVideos";
import helper from "../../helper/main";
import Video from "../../models/video";
export default {
  name: "video-item",
  components: {},
  data() {
    return {
      options: false,
      video: false,
      watched: false
    };
  },
  props: {
    item: Object
  },
  mounted() {
    this.video = new Video(this.item);

    isInHistory(this.video.id).then(result => {
      this.watched = result;
    });
  },
  methods: {
    toggleOptions() {
      this.options = !this.options;
    },
    gotToVideo() {
      this.$router.push({
        name: "video-view",
        params: { id: this.video.id }
      });
    },
    goToChannel() {
      this.$router.push({
        name: "channel-view",
        params: { id: this.video.channelId }
      });
    },
    removeFromHistory() {
      removeFromHistory(this.video.id);
    },
    copy(site) {
      helper.copy(site, this.video.id);
    },
    toggleSave() {
      addSavedVideo(this.video.id);
    }
  }
};
</script>