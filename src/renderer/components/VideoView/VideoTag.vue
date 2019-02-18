<template>
  <video
    ref="player"
    class="videoPlayer"
    id="videoPlayer"
    type="application/x-mpegURL"
    object-fit="cover"
    controls
    @click="click"
    @dblclick="dblclick"
    @loadstart="loadstart"
    @volumechange="volumechange"
    :src="src"
    :poster="poster"
    v-html="subtitleHtml"
  ></video>
</template>
<script>
export default {
  data() {
    return {
      subtitleIndex: 0
    };
  },
  props: {
    src: String,
    poster: String,
    subtitleHtml: String,
    speed: Object
  },
  mounted() {
    document.addEventListener("keydown", event => {
      var tag = event.target.tagName.toLowerCase();
      if (tag != "input" && tag != "textarea") {
        switch (event.which) {
          case 32:
            // Space Bar
            event.preventDefault();
            this.togglePlay();
            break;
          case 74:
            // J Key
            event.preventDefault();
            this.changeDurationBySeconds(-10);
            break;
          case 75:
            // K Key
            event.preventDefault();
            this.togglePlay();
            break;
          case 76:
            // L Key
            event.preventDefault();
            this.changeDurationBySeconds(10);
            break;
          case 79:
            // O Key
            event.preventDefault();
            this.$emit("ratedown");
            break;
          case 80:
            // P Key
            event.preventDefault();
            this.$emit("rateup");
            break;
          case 70:
            // F Key
            event.preventDefault();

            this.toggleFullScreen();
            break;
          case 77:
            // M Key
            event.preventDefault();

            if (this.player.volume > 0) {
              this.changeVolume(-1);
            } else {
              this.changeVolume(1);
            }
            break;
          case 67:
            // C Key
            if (!this.player) return;
            let tracks = this.player.textTracks;

            if (this.player.textTracks[0].mode === "showing") {
              this.player.textTracks[0].mode = "hidden";
            } else {
              this.player.textTracks[0].mode = "showing";
            }
            break;
          case 38:
            // Up Arrow Key
            event.preventDefault();
            this.changeVolume(0.05);
            break;
          case 40:
            // Down Arrow Key
            event.preventDefault();
            this.changeVolume(-0.05);
            break;
          case 37:
            // Left Arrow Key
            event.preventDefault();
            this.changeDurationBySeconds(-5);
            break;
          case 39:
            // Right Arrow Key
            event.preventDefault();
            this.changeDurationBySeconds(5);
            break;
          case 49:
            // 1 Key
            event.preventDefault();
            this.changeDurationByPercentage(0.1);
            break;
          case 50:
            // 2 Key
            event.preventDefault();
            this.changeDurationByPercentage(0.2);
            break;
          case 51:
            // 3 Key
            event.preventDefault();
            this.changeDurationByPercentage(0.3);
            break;
          case 52:
            // 4 Key
            event.preventDefault();
            this.changeDurationByPercentage(0.4);
            break;
          case 53:
            // 5 Key
            event.preventDefault();
            this.changeDurationByPercentage(0.5);
            break;
          case 54:
            // 6 Key
            event.preventDefault();
            this.changeDurationByPercentage(0.6);
            break;
          case 55:
            // 7 Key
            event.preventDefault();
            this.changeDurationByPercentage(0.7);
            break;
          case 56:
            // 8 Key
            event.preventDefault();
            this.changeDurationByPercentage(0.8);
            break;
          case 57:
            // 9 Key
            event.preventDefault();
            this.changeDurationByPercentage(0.9);
            break;
          case 48:
            // 0 Key
            event.preventDefault();
            this.changeDurationByPercentage(0);
            break;
        }
      }
    });
  },
  methods: {
    loadstart() {
      this.$emit("loadstart");
    },
    volumechange() {
      this.$emit("volumechange");
    },
    click() {
      this.togglePlay();

      this.$emit("click");
    },
    dblclick() {
      this.toggleFullScreen();

      this.$emit("dblclick");
    },
    toggleFullScreen() {
      if (!this.player) return;

      if (document.webkitFullscreenElement !== null) {
        document.webkitExitFullscreen();
      } else {
        this.player.webkitRequestFullscreen();
      }
    },
    togglePlay() {
      if (!this.player) return;

      if (this.player.paused) {
        this.player.play();
      } else {
        this.player.pause();
      }
    },
    changeDurationBySeconds(seconds) {
      if (!this.player) return;

      this.player.currentTime += seconds;
    },
    changeDurationByPercentage(percentage) {
      if (!this.player) return;

      this.player.currentTime = this.player.duration * percentage;
    },
    changeVolume(amount) {
      if (!this.player) return;

      let volume = this.player.volume;
      volume = volume + amount;
      if (volume > 1) {
        this.player.volume = 1;
      } else if (volume < 0) {
        this.player.volume = 0;
      } else {
        this.player.volume = volume;
      }
    }
  },
  computed: {
    player() {
      if (typeof this.$refs.player !== "undefined") {
        return this.$refs.player;
      }
      return false;
    }
  },
  watch: {
    speed(newVal, oldVal) {
      if (!this.player) return;

      this.player.playbackRate = newVal.value;
    }
  }
};
</script>

