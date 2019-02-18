<template>
  <div>
    <div v-if="isEmbed">
      <iframe
        ref="embedplayer"
        width="560"
        height="315"
        :src="`https://www.youtube-nocookie.com/embed/${
        this.video.id
      }?start=${Math.floor(this.currentTime)};rel=0;autoplay=${this.autoplay}`"
        frameborder="0"
        encrypted-media
        allowfullscreen
      ></iframe>
    </div>
    <div v-else>
      <!-- <video
        ref="player"
        class="videoPlayer"
        id="videoPlayer"
        type="application/x-mpegURL"
        object-fit="cover"
        controls
        @loadstart="loadStart"
        @volumechange="updateVolume"
        @click="togglePlay"
        @dblclick="toggleFullScreen"
        :src="currentQuality.url"
        :poster="video.thumbnail"
        v-html="subtitleHtml"
      ></video>-->
      <video-tag
        ref="video"
        @loadstart="loadStart"
        @volumechange="updateVolume"
        @rateup="speedUp"
        @ratedown="speedDown"
        :src="currentQuality.url"
        :poster="video.thumbnail"
        :subtitleHtml="subtitleHtml"
        :speed="currentSpeed"
        :volume="volume"
      ></video-tag>
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
        <span id="currentSpeed">{{currentSpeedLabel}}</span>
        <i class="fas fa-angle-down"></i>
        <div class="speedTypes">
          <ul>
            <li
              v-for="(speed, index) in allowedSpeed"
              v-bind:key="index"
              @click="selectSpeed(index)"
            >{{speed.label}}</li>
          </ul>
        </div>
      </div>
      <div class="smallButton" @click="loop">
        <i id="loopIcon" class="fas fa-sync-alt"></i> LOOP
      </div>
      <div class="smallButton" @click="toggleSave">
        <i id="saveIcon" :class="savedIconType" class="fa-star"></i>
        <span id="savedText">{{savedText}}</span>
      </div>
      <div class="smallButton" @click="copy('youtube.com')">COPY YOUTUBE LINK</div>
      <a :href="`https://youtube.com/watch?v=${video.id}`">
        <div class="smallButton">OPEN IN YOUTUBE</div>
      </a>
      <div class="smallButton" @click="copy('invidio.us')">COPY INVIDIOUS LINK</div>
      <a :href="`https://invidio.us/watch?v=${video.id}`">
        <div class="smallButton">OPEN IN INVIDIOUS</div>
      </a>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import electron from "electron";

import helper from "../../helper/main";

import toast from "../../api/toast";
import savedVideosApi from "../../api/savedVideos";

import availableSpeed from "../../models/speed";

import VideoTag from "./VideoTag";

export default {
  name: "player",
  components: { VideoTag },
  data() {
    return {
      qualities: {},
      currentQuality: false,
      allowedSpeed: [],
      currentSpeedIndex: 3,
      currentTime: 0,
      saved: false,
      subtitleHtml: "",
      volume: 0.5,
      autoplay: false
    };
  },
  props: {
    video: [Object, Boolean],
    playlistId: [String, Boolean]
  },
  mounted() {
    if (this.video) {
      this.init();
    }
  },
  methods: {
    init() {
      savedVideosApi.videoIsSaved(this.video.id).then(result => {
        this.saved = !!result;
      });

      this.initSpeed();
      this.initQuality();
      this.checkVideoSettings();
      this.initSubtitles();
    },
    loadStart() {
      this.initSpeed();
      this.player.currentTime = this.currentTime;

      if (this.settings.autoplay) {
        this.autoplay = this.settings.autoplay ? 1 : 0;
        this.player.play();
      }

      this.volume = this.player.volume;
    },
    openMiniPlayer() {
      this.pause();
      electron.ipcRenderer.send("openMiniPlayer", {
        src: this.currentQuality.url,
        volume: this.volume,
        currentTime: this.getCurrentTime(),
        thumbnail: this.video.thumbnail,
        subtitleHtml: this.subtitleHtml,
        videoId: this.video.id,
        isEmbed: this.isEmbed
      });
    },
    loop() {
      if (this.player.loop === false) {
        this.player.loop = true;
        toast.show("Video loop has been turned on.");
      } else {
        this.player.loop = false;
        toast.show("Video loop has been turned off.");
      }
    },
    pause() {
      if (this.isEmbed) {
        this.autoplay = 0;
      } else {
        this.player.pause();
      }
    },
    toggleSave() {
      savedVideosApi.toggleSavedVideo(this.video.id);
      this.saved = !this.saved;
    },
    copy(site) {
      helper.copy(site, this.video.id);
    },
    selectSpeed(index) {
      this.currentSpeedIndex = index;
    },
    speedUp() {
      if (this.currentSpeedIndex !== this.allowedSpeed.length - 1) {
        this.currentSpeedIndex += 1;
      }
    },
    speedDown() {
      if (this.currentSpeedIndex !== 0) {
        this.currentSpeedIndex -= 1;
      }
    },
    initSpeed() {
      this.allowedSpeed = availableSpeed;
      const settingsSpeed = this.settings.rate;
      const index = this.allowedSpeed.findIndex(el => {
        return settingsSpeed == el.value;
      });
      console.log(index);
      this.selectSpeed(index);
    },
    getCurrentTime() {
      if (typeof this.$refs.embedplayer !== "undefined") {
        const innerDoc =
          this.$refs.embedplayer.contentDocument ||
          this.$refs.embedplayer.contentWindow.document;
        const currentTime = innerDoc
          .querySelector(".ytp-progress-bar")
          .getAttribute("aria-valuenow");

        return currentTime;
      } else if (typeof this.player !== "undefined") {
        return this.player.currentTime;
      } else {
        return 0;
      }
    },
    updateVolume() {
      this.volume = this.player.volume;
    },
    selectQuality(qlty) {
      this.currentTime = this.getCurrentTime();

      this.currentQuality = qlty;
    },
    initQuality() {
      let result = {};
      const videoUrls = this.video.formatStreams;
      const formatUrls = this.video.adaptiveFormats;

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
    initSubtitles() {
      this.subtitleHtml = this.video.captions.reduce((acc, caption) => {
        let subtitleUrl =
          "https://www.invidio.us/api/v1/captions/" +
          this.video.id +
          "?label=" +
          caption.label;

        return (acc +=
          '<track kind="subtitles" src="' +
          subtitleUrl +
          '" srclang="' +
          caption.languageCode +
          '" label="' +
          caption.label +
          '">');
      }, "");
    },
    checkVideoSettings() {
      console.log("checkking...");

      const settingsQlty = this.settings.quality + "p";
      if (typeof this.qualities[settingsQlty] !== "undefined") {
        this.selectQuality(this.qualities[settingsQlty]);
      } else {
        if (
          typeof this.qualities["480p"] === "undefined" &&
          typeof this.qualities["720p"] === "undefined"
        ) {
          this.selectQuality(this.qualities["EMBED"]);
          toast.show("Unable to get video file.  Reverting to embeded player.");
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
    player() {
      return this.$refs.video.$refs.player;
    },
    currentSpeed() {
      return this.allowedSpeed[this.currentSpeedIndex];
    },
    currentSpeedLabel() {
      if (typeof this.currentSpeed === "undefined") {
        return "N/A";
      } else {
        return this.currentSpeed.label;
      }
    }
  }
};
</script>

