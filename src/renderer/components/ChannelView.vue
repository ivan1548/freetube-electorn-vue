<template>
  <div v-if="!loading">
    <div>
      <img class="channelViewBanner" :src="channel.banner">
      <br>
      <div class="channelViewTitle">
        <img class="channelViewImage" :src="channel.icon">
        <span class="channelViewName">{{channel.name}}</span>
        <br>
        <span class="channelViewSubs">{{channel.subscriberCount}} Subscribers</span>
        <div
          id="subscribeButton"
          class="channelSubButton"
          @click="toggleSubscription"
        >{{subButtonText}}</div>
      </div>
      <br>
      <hr>
      <div class="channelViewDescription">
        <span v-html="channel.description"></span>
      </div>
      <br>
      <hr>
    </div>
    <list :items="items"></list>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { invidiousAPI } from "../helper/youtubeApi";
import { isSubscribed, toggleSubscription } from "../api/subscriptions";
import Channel from "../models/channel";
import List from "./List";

export default {
  name: "subscriptions",
  components: { List },
  data() {
    return {
      subscribed: false,
      channel: {},
      items: []
    };
  },
  beforeRouteUpdate(to, from, next) {
    if (to.path !== from.path) {
      this.getChannel(to.params.id);
    }
    next();
  },
  mounted() {
    this.getChannel(this.$route.params.id);
  },
  methods: {
    toggleSubscription() {
      toggleSubscription(this.channel.channelId);
      this.subscribed = !this.subscribed;
    },
    getChannel(channelId) {
      this.showLoading();

      isSubscribed(channelId).then(result => {
        this.subscribed = result;
      });

      invidiousAPI(
        "channels",
        channelId,
        {},
        data => {
          console.log(data);

          this.channel = new Channel(data);

          this.items = data.latestVideos;
          this.hideLoading();
        },
        errorData => {
          //   showToast(errorData.responseJSON.error);
          this.hideLoading();
        }
      );
    },
    ...mapActions(["showLoading", "hideLoading"])
  },
  computed: {
    loading() {
      return this.$store.state.Loading.seen;
    },
    subButtonText() {
      return this.subscribed ? "UNSUBSCRIBE" : "SUBSCRIBE";
    }
  }
};
</script>