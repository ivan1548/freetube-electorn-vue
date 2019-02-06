<template>
  <div v-if="!loading">
    <div class="playlistSideView">
      <div class="playlistThumbnail">
        <img :src="playlist.thumbnail">
      </div>
      <h2>{{playlist.title}}</h2>
      <hr>
      <div @click="goToChannel()" class="playlistChannel">
        <img :src="playlist.channelThumbnail">
        <h3>{{playlist.channelName}}</h3>
      </div>
      <p>{{playlist.videoCount}} videos - {{playlist.viewCount}} views - Last updated on {{playlist.lastUpdated}}</p>
      <hr>
      <p v-html="playlist.description"></p>
    </div>
    <div class="playlistVideoView">
      <div v-for="(item, index) in items" v-bind:key="index">
        <playlist-video-item :playlistId="playlist.id" :item="item"></playlist-video-item>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
import { invidiousAPI } from "../helper/youtubeApi";
import { mapActions } from "vuex";
import PlaylistVideoItem from "./PlaylistView/PlaylistVideoItem";
import Playlist from "../models/playlist";

export default {
  name: "subscriptions",
  components: { PlaylistVideoItem },
  data() {
    return {
      playlist: {},
      subButtonText: "sub",
      items: []
    };
  },
  beforeRouteUpdate(to, from, next) {
    if (to.path !== from.path) {
      this.getPlaylist(to.params.id);
    }
    next();
  },
  mounted() {
    this.getPlaylist(this.$route.params.id);
  },
  methods: {
    goToChannel() {
      this.$router.push({
        name: "channel-view",
        params: { id: this.playlist.channelId }
      });
    },
    getPlaylist(playlistId) {
      this.showLoading();
      invidiousAPI(
        "playlists",
        playlistId,
        {},
        data => {
          console.log(data);

          this.playlist = new Playlist(data);

          this.items = data.latestVideos;

          let amountOfPages = Math.ceil(data.videoCount / 100);
          for (let i = 1; i <= amountOfPages; i++) {
            invidiousAPI("playlists", playlistId, { page: i }, data => {
              console.log(data);

              this.items = data.videos;
            });
          }
          this.hideLoading();
        },
        errorData => {
          //   showToast(errorData.responseJSON.error);
          this.hideLoading();
        }
      );
    },
    getVideos() {
      // Sort alphabetically
      this.showLoading();
      subDb
        .find({})
        .sort({
          channelName: 1
        })
        .exec((err, subs) => {
          subs.forEach((channel, index) => {
            let channelId = channel.channelId;
            let videoList = [];

            invidiousAPI(
              "channels/videos",
              channelId,
              { page: 1 },
              data => {
                this.items = this.items.concat(data.slice(0, 10));
                this.hideLoading();
              },
              errorData => {}
            );
          });
        });
    },
    ...mapActions(["showLoading", "hideLoading"])
  },
  computed: {
    loading() {
      return this.$store.state.Loading.seen;
    }
  }
};
</script>