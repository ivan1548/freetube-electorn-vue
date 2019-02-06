<template>
  <div v-if="loaded">
    <div v-if="isEmbed">
      <span v-html="embededHtml"></span>
    </div>
    <div v-else>
      <video
        ref="player"
        class="videoPlayer"
        id="videoPlayer"
        type="application/x-mpegURL"
        object-fit="cover"
        controls
        @canplay="canPlay"
        :src="currentQuality.url"
        :poster="videoThumbnail"
        v-html="subtitleHtml"
      ></video>
    </div>
    <div class="statistics">
      <div @click="openMiniPlayer" class="smallButton">
        MINI PLAYER
        <i class="fas fa-external-link-alt"></i>
      </div>
      <div class="smallButton videoQuality">
        <span id="currentQuality">{{currentQuality.name}}</span>
        <i class="fas fa-angle-down"></i>
        <div class="qualityTypes">
          <ul>
            <li
              v-for="(qlty, index) in qualities"
              v-bind:key="index"
              @click="selectQuality(qlty)"
            >{{qlty.name}}</li>
          </ul>
        </div>
      </div>
      <div class="smallButton videoSpeed">
        <span id="currentSpeed">{{currentSpeed.label}}</span>
        <i class="fas fa-angle-down"></i>
        <div class="speedTypes">
          <ul>
            <li
              v-for="(speed, index) in allowedSpeed"
              v-bind:key="index"
              @click="selectSpeed(speed)"
            >{{speed.label}}</li>
          </ul>
        </div>
      </div>
      <div class="smallButton" v-on:click="loop">
        <i id="loopIcon" class="fas fa-sync-alt"></i> LOOP
      </div>
      <div class="smallButton" v-on:click="toggleSave">
        <i id="saveIcon" :class="savedIconType" class="fa-star"></i>
        <span id="savedText">{{savedText}}</span>
      </div>
      <div class="smallButton" v-on:click="copy('youtube.com')">COPY YOUTUBE LINK</div>
      <a :href="`https://youtube.com/watch?v=${videoId}`">
        <div class="smallButton">OPEN IN YOUTUBE</div>
      </a>
      <div class="smallButton" v-on:click="copy('invidio.us')">COPY INVIDIOUS LINK</div>
      <a :href="`https://invidio.us/watch?v=${videoId}`">
        <div class="smallButton">OPEN IN INVIDIOUS</div>
      </a>
      <br>
      <p class="title">{{videoTitle}}</p>
      <p class="views">{{videoViews}} views</p>
      <div class="likeContainer">
        <div class="dislikeBar">
          <div class="likeBar" :style="{width: likePercentage + '%'}"></div>
        </div>
        <span class="likes">
          <i class="fas fa-thumbs-up"></i>
          {{videoLikes}}
        </span>
        <span class="dislikes">
          <i class="fas fa-thumbs-down"></i>
          {{videoDislikes}}
        </span>
      </div>
    </div>
    <div class="details">
      <img id="channelIcon" @click="goToChannel()" :src="channelIcon">
      <p id="channelName" @click="goToChannel()">{{channelName}}</p>
      <p id="publishDate">Published on {{publishedDate}}</p>
      <div
        id="subscribeButton"
        class="playerSubButton"
        @click="toggleSubscription()"
      >{{subButtonText}}</div>
      <br>
      <br>
      <div id="description">
        <span v-html="description"></span>
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
import { invidiousAPI } from "../helper/youtubeApi";
import { addToHistory } from "../api/history";
import savedVideosApi from "../api/savedVideos";
import { isSubscribed, toggleSubscription } from "../api/subscriptions";
import toast from "../api/toast";
import Video from "../models/video";
import availableSpeed from "../models/speed";
import dateFormat from "dateformat";
import $ from "jquery";
import { mapActions } from "vuex";
import helper from "../helper/main";
import Recomended from "./VideoView/Recomended";
import Comments from "./VideoView/Comments";
import Playlist from "./VideoView/Playlist";
export default {
  name: "player",
  components: { Recomended, Comments, Playlist },
  data() {
    return {
      video: {},
      saved: false,
      subscribed: false,
      qualities: {},
      currentQuality: false,
      allowedSpeed: [],
      canShowComments: false,
      playlistId: false,
      playerSeen: true,
      playlistSeen: false,
      firstLoad: true,
      publishedDate: "",
      videoUrl: "",
      videoId: "",
      channelId: "",
      channelIcon: "",
      channelName: "",
      description: "",
      videoThumbnail: "",
      subtitleHtml: "",
      embededHtml: "",
      currentSpeed: 1,
      videoTitle: "",
      videoViews: "",
      likePercentage: 0,
      videoLikes: 0,
      videoDislikes: 0,
      playerSeen: true,
      playlistTitle: "",
      playlistChannelName: "",
      playlistIndex: 1,
      playlistTotal: 1,
      playlistLoop: false,
      playlistShuffle: false,
      playlistShowList: true,
      recommendedVideoList: [],
      playlistVideoList: []
    };
  },
  beforeRouteUpdate(to, from, next) {
    if (to.path !== from.path) {
      this.firstLoad = true;
      this.playlistId = this.$route.query.playlist;
      this.getVideo(to.params.id);
    }
    next();
  },
  created() {
    this.playlistId = this.$route.query.playlist;
    this.getVideo(this.$route.params.id);
  },
  methods: {
    canPlay() {
      const settingsSpeed = this.settings.rate;
      const speed = this.allowedSpeed.find(el => {
        return settingsSpeed == el.value;
      });

      if (typeof speed !== "undefined") {
        this.selectSpeed(speed);
      }

      if (this.settings.autoplay) {
        this.$refs.player.play();
      }
    },
    openMiniPlayer() {},
    goToChannel() {
      this.$router.push({
        name: "channel-view",
        params: { id: this.channelId }
      });
    },
    toggleSubscription() {
      toggleSubscription(this.channelId);
      this.subscribed = !this.subscribed;
    },
    loop() {
      if (this.$refs.player.loop === false) {
        this.$refs.player.loop = true;
        toast.show("Video loop has been turned on.");
      } else {
        this.$refs.player.loop = false;
        toast.show("Video loop has been turned off.");
      }
    },
    showComments() {
      this.canShowComments = true;
    },
    toggleSave() {
      savedVideosApi.toggleSavedVideo(this.video.id);
      this.saved = !this.saved;
    },
    copy(site) {
      helper.copy(site, this.video.id);
    },
    addToHistory() {
      if (this.settings.history) {
        addToHistory(this.video.id);
      }
    },
    getVideo(videoId) {
      this.showLoading();
      this.videoId = videoId;

      savedVideosApi.videoIsSaved(this.videoId).then(result => {
        this.saved = !!result;
      });

      let videoHtml = "";
      this.embededHtml =
        "<iframe width='560' height='315' src='https://www.youtube-nocookie.com/embed/" +
        videoId +
        "?rel=0' frameborder='0' encrypted-media' allowfullscreen></iframe>";

      invidiousAPI("videos", videoId, {}, data => {
        console.log(data);
        this.video = new Video(data);

        this.videoLikes = data.likeCount;
        this.videoDislikes = data.dislikeCount;
        let totalLikes =
          parseInt(this.videoLikes) + parseInt(this.videoDislikes);
        this.likePercentage = parseInt((this.videoLikes / totalLikes) * 100);
        this.videoTitle = data.title;
        this.channelName = data.author;
        this.channelId = data.authorId;
        this.channelIcon = data.authorThumbnails[2].url;

        let videoUrls = data.formatStreams;
        let formatUrls = data.adaptiveFormats;

        // Add commas to the video view count.
        this.videoViews = data.viewCount
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        this.videoThumbnail = data.videoThumbnails[0].url;

        // Format the date to a more readable format.
        let dateString = new Date(data.published * 1000);
        dateString.setDate(dateString.getDate() + 1);
        this.publishedDate = dateFormat(dateString, "mmm dS, yyyy");

        this.description = this.parseDescription(data.descriptionHtml);

        this.initQuality(data);
        this.initSpeed(data);

        isSubscribed(this.channelId).then(result => {
          this.subscribed = result;
        });

        let useEmbedPlayer = false;

        if (!useEmbedPlayer) {
          data.captions.forEach(caption => {
            let subtitleUrl =
              "https://www.invidio.us/api/v1/captions/" +
              videoId +
              "?label=" +
              caption.label;

            videoHtml =
              videoHtml +
              '<track kind="subtitles" src="' +
              subtitleUrl +
              '" srclang="' +
              caption.languageCode +
              '" label="' +
              caption.label +
              '">';
          });

          this.subtitleHtml = videoHtml;
        }

        this.recommendedVideoList = data.recommendedVideos;

        this.hideLoading();
        this.checkVideoSettings();
        this.addToHistory();
      });
    },
    selectSpeed(speed) {
      this.currentSpeed = speed;
      if (typeof this.$refs.player !== "undefined") {
        this.$refs.player.playbackRate = speed.value;
      }
    },
    initSpeed() {
      this.allowedSpeed = availableSpeed;
    },
    selectQuality(qlty) {
      this.currentQuality = qlty;
      if (typeof this.$refs.player !== "undefined") {
        const currentPlayBackTime = this.$refs.player.currentTime;
        setTimeout(() => {
          this.$refs.player.currentTime = currentPlayBackTime;
        }, 100);
      }
    },
    initQuality(data) {
      let result = {};
      const videoUrls = data.formatStreams;
      const formatUrls = data.adaptiveFormats;

      // Search through the returned object to get the 480p and 720p video URLs (If available)
      Object.keys(videoUrls).forEach(key => {
        switch (videoUrls[key]["itag"]) {
          case "18":
            result["480p"] = {
              name: "480p",
              url: decodeURIComponent(videoUrls[key]["url"])
            };
            break;
          case "22":
            result["720p"] = {
              name: "720p",
              url: decodeURIComponent(videoUrls[key]["url"])
            };
            break;
        }
      });

      const audio = decodeURIComponent(
        formatUrls[formatUrls.length - 1]["url"]
      );

      if (typeof audio !== "undefined") {
        result["AUDIO"] = {
          name: "AUDIO",
          url: decodeURIComponent(formatUrls[formatUrls.length - 1]["url"])
        };
      }

      result["EMBED"] = {
        name: "EMBED",
        url: false
      };

      this.qualities = result;
    },
    parseDescription(descriptionText) {
      descriptionText = descriptionText.replace(/target\=\"\_blank\"/g, "");
      descriptionText = descriptionText.replace(/\/redirect.+?(?=q\=)/g, "");
      descriptionText = descriptionText.replace(/q\=/g, "");
      descriptionText = descriptionText.replace(
        /rel\=\"nofollow\snoopener\"/g,
        ""
      );
      descriptionText = descriptionText.replace(/class\=.+?(?=\")./g, "");
      descriptionText = descriptionText.replace(/id\=.+?(?=\")./g, "");
      descriptionText = descriptionText.replace(
        /data\-target\-new\-window\=.+?(?=\")./g,
        ""
      );
      descriptionText = descriptionText.replace(/data\-url\=.+?(?=\")./g, "");
      descriptionText = descriptionText.replace(
        /data\-sessionlink\=.+?(?=\")./g,
        ""
      );
      descriptionText = descriptionText.replace(/\&amp\;/g, "&");
      descriptionText = descriptionText.replace(/\%3A/g, ":");
      descriptionText = descriptionText.replace(/\%2F/g, "/");
      descriptionText = descriptionText.replace(/\&v.+?(?=\")/g, "");
      descriptionText = descriptionText.replace(
        /\&redirect\-token.+?(?=\")/g,
        ""
      );
      descriptionText = descriptionText.replace(/\&redir\_token.+?(?=\")/g, "");
      descriptionText = descriptionText.replace(
        /href\=\"http(s)?\:\/\/youtube\.com/g,
        'href="freetube://https://youtube.com'
      );
      descriptionText = descriptionText.replace(
        /href\=\"\/watch/g,
        'href="freetube://https://youtube.com'
      );
      descriptionText = descriptionText.replace(
        /href\=\"\/results\?search\_query\=/g,
        'href="freetube://'
      );
      descriptionText = descriptionText.replace(
        /yt\.www\.watch\.player\.seekTo/g,
        "changeDuration"
      );

      return descriptionText;
    },
    checkVideoSettings() {
      console.log("checkking...");
      if (this.firstLoad) {
        this.firstLoad = false;

        const settingsQlty = this.settings.quality + "p";
        if (typeof this.qualities[settingsQlty] !== "undefined") {
          this.selectQuality(this.qualities[settingsQlty]);
        } else {
          if (
            typeof this.qualities["480p"] === "undefined" &&
            typeof this.qualities["720p"] === "undefined"
          ) {
            this.selectQuality(this.qualities["EMBED"]);
            toast.show(
              "Unable to get video file.  Reverting to embeded player."
            );
          } else if (
            typeof this.qualities["720p"] === "undefined" &&
            typeof this.qualities["480p"] !== "undefined"
          ) {
            // Default to the 480p video if the 720p URL cannot be found.
            console.log("Found");
            this.selectQuality(this.qualities["480p"]);
          } else {
            // Default to the 720p video.
            this.selectQuality(this.qualities["720p"]);
          }
        }
      }
    },
    ...mapActions(["showLoading", "hideLoading"])
  },
  computed: {
    isEmbed() {
      return this.currentQuality && !this.currentQuality.url;
    },
    settings() {
      return this.$store.state.Settings;
    },
    savedText() {
      return this.saved ? "FAVORITED" : "FAVORITE";
    },
    savedIconType() {
      return this.saved ? "fas saved" : "far unsaved";
    },
    subButtonText() {
      return this.subscribed ? "UNSUBSCRIBE" : "SUBSCRIBE";
    },
    loaded() {
      return !this.$store.state.Loading.seen;
    }
  }
};
</script>