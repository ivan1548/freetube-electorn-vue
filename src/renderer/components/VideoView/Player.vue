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
      <video
        ref="player"
        class="videoPlayer"
        id="videoPlayer"
        type="application/x-mpegURL"
        object-fit="cover"
        controls
        @loadstart="loadStart"
        @volumechange="updateVolume"
        :src="currentQuality.url"
        :poster="video.thumbnail"
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

export default {
  name: "player",
  components: {},
  data() {
    return {
      qualities: {},
      currentQuality: false,
      allowedSpeed: [],
      currentSpeed: {},
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
  created() {
    if (this.video) {
      this.init();
    }
  },
  methods: {
    init() {
      savedVideosApi.videoIsSaved(this.video.id).then(result => {
        this.saved = !!result;
      });

      this.initQuality();
      this.initSpeed();
      this.checkVideoSettings();
      this.initSubtitles();
    },
    loadStart() {
      const settingsSpeed = this.settings.rate;
      const speed = this.allowedSpeed.find(el => {
        return settingsSpeed == el.value;
      });

      if (typeof speed !== "undefined") {
        this.selectSpeed(speed);
      }

      this.$refs.player.currentTime = this.currentTime;

      if (this.settings.autoplay) {
        this.autoplay = this.settings.autoplay ? 1 : 0;
        this.$refs.player.play();
      }

      this.volume = this.$refs.player.volume;
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
      if (this.$refs.player.loop === false) {
        this.$refs.player.loop = true;
        toast.show("Video loop has been turned on.");
      } else {
        this.$refs.player.loop = false;
        toast.show("Video loop has been turned off.");
      }
    },
    pause() {
      if (this.isEmbed) {
        this.autoplay = 0;
      } else {
        this.$refs.player.pause();
      }
    },
    toggleSave() {
      savedVideosApi.toggleSavedVideo(this.video.id);
      this.saved = !this.saved;
    },
    copy(site) {
      helper.copy(site, this.video.id);
    },
    selectSpeed(speed) {
      this.currentSpeed = speed;
      if (typeof this.$refs.player !== "undefined") {
        this.$refs.player.playbackRate = speed.value;
      }
    },
    initSpeed() {
      this.allowedSpeed = availableSpeed;
      const settingsSpeed = this.settings.rate;
      const speed = this.allowedSpeed.find(el => {
        return settingsSpeed == el.value;
      });
      this.currentSpeed = speed;
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
      } else if (typeof this.$refs.player !== "undefined") {
        return this.$refs.player.currentTime;
      } else {
        return 0;
      }
    },
    updateVolume() {
      this.volume = this.$refs.player.volume;
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
      let videoHtml = "";
      this.video.captions.forEach(caption => {
        let subtitleUrl =
          "https://www.invidio.us/api/v1/captions/" +
          this.video.id +
          "?label=" +
          caption.label;

        let videoHtml =
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
    }
  }
};
</script>

