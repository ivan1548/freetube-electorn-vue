<template>
  <div>
    <template v-if="playerData.isEmbed">
      <iframe
        ref="embedplayer"
        width="560"
        height="315"
        :src="`https://www.youtube-nocookie.com/embed/${playerData.videoId}?start=${Math.floor(playerData.currentTime)};rel=0;autoplay=1`"
        frameborder="0"
        encrypted-media
        allowfullscreen
      ></iframe>
    </template>
    <template v-else>
      <!-- <video
        ref="player"
        class="videoPlayer"
        id="videoPlayer"
        type="application/x-mpegURL"
        object-fit="cover"
        controls
        @loadstart="loadStart"
        :src="playerData.src"
        :poster="playerData.thumbnail"
        v-html="playerData.subtitleHtml"
      ></video>-->
      <video-tag
        ref="video"
        @loadstart="loadStart"
        :src="playerData.src"
        :poster="playerData.thumbnail"
        :subtitleHtml="playerData.subtitleHtml"
        :volume="playerData.volume"
      ></video-tag>
    </template>
  </div>
</template>

<script>
import VideoTag from "./VideoView/VideoTag";

export default {
  name: "mini-player",
  components: { VideoTag },
  data() {
    return {
      startTime: 0,
      playerData: {}
    };
  },
  created() {
    this.playerData = this.$route.params;
  },
  methods: {
    loadStart() {
      this.player.volume = this.playerData.volume;
      this.player.currentTime = this.playerData.currentTime;
      this.player.play();
    }
  },
  computed: {
    player() {
      return this.$refs.video.$refs.player;
    }
  }
};
</script>
