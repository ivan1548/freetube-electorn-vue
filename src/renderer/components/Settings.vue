<template>
  <div>
    <h1 class="center">Settings</h1>
    <div class="center">
      <input
        type="checkbox"
        id="themeSwitch"
        name="set-name"
        class="switch-input"
        v-model="useDarkTheme"
      >
      <label for="themeSwitch" class="switch-label">Use Dark Theme</label>
      <input
        type="checkbox"
        id="torSwitch"
        name="set-name"
        class="switch-input"
        v-model="settings.useTor"
      >
      <label for="torSwitch" class="switch-label">Use Tor for API calls</label>
      <input
        type="checkbox"
        id="updatesSwitch"
        name="set-name"
        class="switch-input"
        v-model="settings.updates"
      >
      <label for="updatesSwitch" class="switch-label">Check for Updates</label>
      <br>
      <input
        type="checkbox"
        id="historySwitch"
        name="set-name"
        class="switch-input"
        v-model="settings.history"
      >
      <label for="historySwitch" class="switch-label">Remember History</label>
      <input
        type="checkbox"
        id="autoplaySwitch"
        name="set-name"
        class="switch-input"
        v-model="settings.autoplay"
      >
      <label for="autoplaySwitch" class="switch-label">Autoplay Videos</label>
      <input
        type="checkbox"
        id="subtitlesSwitch"
        name="set-name"
        class="switch-input"
        v-model="settings.subtitles"
      >
      <label for="subtitlesSwitch" class="switch-label">Turn on Subtitles by Default</label>
      <br>
      <br>
      <div class="select center">
        <select v-model="settings.quality" id="qualitySelect" class="select-text" required>
          <option value="480">480p</option>
          <option value="720" selected>720p</option>
        </select>
        <span class="select-highlight"></span>
        <span class="select-bar"></span>
        <label class="select-label">Default Video Quality</label>
      </div>
      <br>
      <br>
      <div class="select center">
        <select v-model="settings.rate" id="rateSelect" class="select-text" required>
          <option value="0.25">0.25x</option>
          <option value="0.5">0.5x</option>
          <option value="0.75">0.75x</option>
          <option value="1" selected>1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="1.75">1.75x</option>
          <option value="2">2x</option>
        </select>
        <span class="select-highlight"></span>
        <span class="select-bar"></span>
        <label class="select-label">Default Video Speed</label>
      </div>
      <br>
    </div>
    <div class="center">
      <div @click="importSubscriptions" class="settingsButton">IMPORT SUBSCRIPTIONS</div>
      <div @click="exportSubscriptions" class="settingsButton">EXPORT SUBSCRIPTIONS</div>
    </div>
    <br>
    <br>
    <div class="center">
      <div @click="clearHistoryDB" class="settingsButton">CLEAR HISTORY</div>
      <div @click="clearSavedVideosDB" class="settingsButton">CLEAR FAVORITED VIDEOS</div>
      <div @click="clearSubscriptionsDB" class="settingsButton">CLEAR SUBSCRIPTIONS</div>
    </div>
    <br>
    <br>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import settingsApi from "../api/settings";
import settings from "../api/settings";

export default {
  name: "settings",
  components: {},
  data() {
    return {
      useDarkTheme: this.$store.state.Settings.theme === "dark",
      settings: Object.assign({}, this.$store.state.Settings)
    };
  },
  methods: {
    importSubscriptions() {
      settingsApi.importSubscriptions();
    },
    exportSubscriptions() {
      settingsApi.exportSubscriptions();
    },
    clearHistoryDB() {
      this.showConfirmDialog({
        message: "Are you sure you want to delete your history?",
        callback: settingsApi.clearDb,
        params: ["history"]
      });
    },
    clearSavedVideosDB() {
      this.showConfirmDialog({
        message: "Are you sure you want to remove all saved videos?",
        callback: settingsApi.clearDb,
        params: ["saved"]
      });
    },
    clearSubscriptionsDB() {
      this.showConfirmDialog({
        message: "Are you sure you want to remove all subscriptions?",
        callback: settingsApi.clearDb,
        params: ["subscriptions"]
      });
    },
    ...mapActions(["showConfirmDialog"])
  },
  watch: {
    settings: {
      handler: (val, oldVal) => {
        settingsApi.updateSettings(val);
      },
      deep: true
    },
    useDarkTheme(val, old) {
      if (val !== old) {
        this.settings.theme = val ? "dark" : "light";
      }
    }
  }
};
</script>