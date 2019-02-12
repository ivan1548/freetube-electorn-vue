<template>
  <div id="miniPL">
    <i id="miniPLDropdown" @click="toggle" class="fas fa-angle-down"></i>
    <p id="miniPLTitle">
      <span v-on:click="goToPlaylist">{{playlist.title}}</span>
      <br>
      <span
        id="miniPLChannelName"
        v-on:click="goToChannel"
      >{{playlist.channelName}} - {{playlistIndex}} / {{playlist.videoCount}}</span>
    </p>
    <i id="miniPLLoop" v-on:click="playlistLoopToggle" class="fas fa-redo"></i>
    <i id="miniPLShuffle" v-on:click="playlistShuffleToggle" class="fas fa-random"></i>
    <br>
    <br>
    <hr v-if="seen" style="width: 97%">
    <div v-if="seen" id="miniPLVideoList">
      <div v-for="(video, index) in videos" v-bind:key="index">
        <div v-on:click="goToVideo(video.id)" class="miniPLVideo">
          <span class="miniPLIndex">{{video.index}}</span>
          <img :src="video.thumbnail" class="miniPLThumbnail">
          <p class="miniPLVideoTitle">{{video.title}}</p>
          <p class="miniPLVideoChannelName">{{video.channelName}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { invidiousAPI } from "../../helper/youtubeApi";
import Playlist from "../../models/playlist";
import Video from "../../models/video";

export default {
  name: "video-view-playlist",
  components: {},
  data() {
    return {
      seen: true,
      loop: false,
      shuffle: false,
      playlist: {},
      videos: [],
      playlistIndex: false
    };
  },
  props: {
    video: Object,
    playlistId: String
  },
  mounted() {
    this.loadPlaylist();
  },
  methods: {
    playlistLoopToggle() {},
    playlistShuffleToggle() {},
    toggle() {
      this.seen = !this.seen;
    },
    loadPlaylist() {
      invidiousAPI("playlists", this.playlistId, {}, data => {
        this.playlist = new Playlist(data);

        let amountOfPages = Math.ceil(data.videoCount / 100);

        for (let i = 1; i <= amountOfPages; i++) {
          invidiousAPI("playlists", this.playlistId, { page: i }, data => {
            let result = [];
            data.videos.forEach(video => {
              if (video.videoId == this.video.id) {
                this.playlistIndex = video.index + 1;
              }
              let videoModel = new Video(video);
              videoModel.index = video.index + 1;

              result.push(videoModel);
            });

            this.videos = result;
          });
        }
      });
    },
    goToChannel() {
      this.$router.push({
        name: "channel-view",
        params: { id: this.playlist.channelId }
      });
    },
    goToPlaylist() {
      this.$router.push({
        name: "playlist-view",
        params: { id: this.playlist.id }
      });
    },
    goToVideo(videoId) {
      this.$router.push({
        name: "video-view",
        params: { id: videoId },
        query: { playlist: this.playlistId }
      });
    }
  }
};
</script>