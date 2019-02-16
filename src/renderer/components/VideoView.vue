<template>
  <div v-if="loaded">
    <player :video="video" :playlistId="playlistId"></player>
    <div>
      <p class="title">{{video.title}}</p>
      <p class="views">{{video.views}} views</p>
      <div class="likeContainer">
        <div class="dislikeBar">
          <div class="likeBar" :style="{width: likePercentage + '%'}"></div>
        </div>
        <span class="likes">
          <i class="fas fa-thumbs-up"></i>
          {{video.likes}}
        </span>
        <span class="dislikes">
          <i class="fas fa-thumbs-down"></i>
          {{video.dislikes}}
        </span>
      </div>
    </div>
    <div class="details">
      <img id="channelIcon" @click="goToChannel()" :src="video.channelIcon">
      <p id="channelName" @click="goToChannel()">{{video.channelName}}</p>
      <p id="publishDate">Published on {{video.publishedDate}}</p>
      <div
        id="subscribeButton"
        class="playerSubButton"
        @click="toggleSubscription()"
      >{{subButtonText}}</div>
      <br>
      <br>
      <div id="description">
        <span v-html="video.descriptionHtml"></span>
      </div>
    </div>
    <playlist v-if="playlistId" :video="video" :playlistId="playlistId"></playlist>
    <div id="showComments" @click="showComments">
      Show Comments
      <i class="far fa-comments"></i> (Max of 20)
    </div>
    <comments v-if="canShowComments" :videoId="video.id"></comments>
    <recomended :items="recommendedVideoList"></recomended>
  </div>
</template>

<script>
import $ from "jquery";
import { mapActions } from "vuex";

import helper from "../helper/main";
import { invidiousAPI } from "../helper/youtubeApi";

import toast from "../api/toast";
import { addToHistory } from "../api/history";
import { isSubscribed, toggleSubscription } from "../api/subscriptions";

import Video from "../models/video";

import Player from "./VideoView/Player";
import Recomended from "./VideoView/Recomended";
import Comments from "./VideoView/Comments";
import Playlist from "./VideoView/Playlist";

export default {
  name: "video-view",
  components: { Player, Recomended, Comments, Playlist },
  data() {
    return {
      video: false,
      subscribed: false,
      canShowComments: false,
      playlistId: false,
      recommendedVideoList: []
    };
  },
  beforeRouteUpdate(to, from, next) {
    if (to.path !== from.path) {
      this.playlistId = this.$route.query.playlist;
      this.getVideo(to.params.id);
    }
    next();
  },
  mounted() {
    this.playlistId = this.$route.query.playlist;
    this.getVideo(this.$route.params.id);
  },
  methods: {
    goToChannel() {
      this.$router.push({
        name: "channel-view",
        params: { id: this.video.channelId }
      });
    },
    toggleSubscription() {
      toggleSubscription(this.video.channelId);
      this.subscribed = !this.subscribed;
    },
    showComments() {
      this.canShowComments = true;
    },
    getVideo(videoId) {
      this.showLoading();

      invidiousAPI("videos", videoId, {}, data => {
        this.video = new Video(data);

        isSubscribed(this.video.channelId).then(result => {
          this.subscribed = result;
        });

        this.recommendedVideoList = data.recommendedVideos;

        this.hideLoading();
        if (this.settings.history) {
          addToHistory(data);
        }
      });
    },
    ...mapActions(["showLoading", "hideLoading"])
  },
  computed: {
    settings() {
      return this.$store.state.Settings;
    },
    subButtonText() {
      return this.subscribed ? "UNSUBSCRIBE" : "SUBSCRIBE";
    },
    loaded() {
      return !this.$store.state.Loading.seen;
    },
    likePercentage() {
      let totalLikes =
        parseInt(this.video.likes) + parseInt(this.video.dislikes);
      return parseInt((this.video.likes / totalLikes) * 100);
    }
  }
};
</script>