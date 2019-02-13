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
import { sort } from "rambda";
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
        loadHistory();
      }
    },
    ...mapActions(["showLoading", "hideLoading"])
  },
  computed: {
    items() {
      return sort(
        (a, b) => a.index - b.index,
        this.$store.state.VideoList.history
      );
    }
  }
};
</script>