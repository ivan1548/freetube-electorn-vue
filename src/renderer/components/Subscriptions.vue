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
import { subDb } from "../helper/db";
import { invidiousAPI } from "../helper/youtubeApi";
import { loadSubscriptions } from "../api/subscriptions";
import { mapActions } from "vuex";
import List from "./List";

export default {
  name: "subscriptions",
  components: { List },
  data() {
    return {
      title: "Latest Subscriptions"
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      if (this.items.length == 0) {
        this.showLoading();

        loadSubscriptions().then(items => {
          console.log(items);
          this.hideLoading();
        });
      }
    },
    ...mapActions(["showLoading", "hideLoading"])
  },
  computed: {
    items() {
      return this.$store.state.VideoList.subscriptions;
    }
  }
};
</script>