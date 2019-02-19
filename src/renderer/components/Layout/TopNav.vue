<template>
  <div class="topNav">
    <i @click="toggleSideNav" class="fas fa-bars" id="menuButton"></i>
    <i
      @click="refreshSubscriptions"
      class="fas fa-sync"
      id="reloadButton"
      title="Force Subscription Reload"
    ></i>
    <i @click="back" class="fas fa-arrow-left" id="backButton" title="Force Subscription Reload"></i>
    <div class="searchBar">
      <input
        ref="search"
        @keyup.enter="parseSearchText"
        v-model="searchInput"
        class="search"
        type="text"
        placeholder="Search / Go to URL"
      >
      <i
        @click="parseSearchText"
        class="fas fa-search searchButton"
        style="margin-right: -10px; cursor: pointer"
      ></i>
    </div>
    <img src="~@/assets/icons/iconBlackSmall.png" id="menuIcon"> &nbsp;
    <img src="~@/assets/icons/textBlackSmall.png" id="menuText">
  </div>
</template>

<script>
import { mapActions } from "vuex";
import ft from "../../helper/main";
import { loadSubscriptions } from "../../api/subscriptions";
import parseSearchText from "../../api/search";

export default {
  name: "top-nav",
  components: {},
  data() {
    return {
      searchInput: ""
    };
  },
  props: {
    sideNav: Boolean
  },
  mounted() {
    document.addEventListener("keydown", event => {
      if (event.which == 68 && event.altKey === true) {
        this.$refs.search.focus();
      }
    });
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    toggleSideNav() {
      this.$emit("side-nav-toggle", !this.sideNav);
    },
    goToChannel(channelId) {
      this.$router.push({
        name: "channel-view",
        params: { id: channelId }
      });
    },
    goToVideoView(videoId) {
      this.$router.push({
        name: "video-view",
        params: { id: videoId }
      });
    },
    refreshSubscriptions() {
      this.setSubscriptions([]);
      if (this.$route.name === "subscriptions") {
        this.showLoading();

        loadSubscriptions().then(items => {
          this.hideLoading();
        });
      } else {
        this.$router.push({
          name: "subscriptions"
        });
      }
    },
    parseSearchText() {
      parseSearchText(this.searchInput);
    },
    ...mapActions(["showLoading", "hideLoading", "setSubscriptions"])
  }
};
</script>