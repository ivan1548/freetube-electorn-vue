<template>
  <div>
    <div>
      <h2 style="margin-left: 15px;">{{ title }}</h2>
      <hr>
    </div>
    <list :items="items"></list>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { historyDb } from "../helper/db";
import { invidiousAPI } from "../helper/youtubeApi";
import { loadHistory } from "../api/history";
import List from "./List";

export default {
  name: "history",
  components: { List },
  data() {
    return {
      title: "Video History"
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      if (this.items.length == 0) {
        this.showLoading();

        loadHistory().then(items => {
          console.log(items);
          this.hideLoading();
        });
      }
    },
    ...mapActions(["showLoading", "hideLoading"])
  },
  computed: {
    items() {
      return this.$store.state.VideoList.history;
    }
  }
};
</script>