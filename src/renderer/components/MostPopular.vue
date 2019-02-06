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
import { invidiousAPI } from "../helper/youtubeApi";
import { mapActions } from "vuex";
import List from "./List";

export default {
  name: "most-popular",
  components: { List },
  data() {
    return {
      title: "Most Popular",
      items: []
    };
  },
  mounted() {
    this.getVideos();
  },
  methods: {
    getVideos() {
      this.showLoading();
      invidiousAPI("top", "", {}, data => {
        console.log(data);
        this.items = data;
        this.hideLoading();
      });
    },
    ...mapActions(["showLoading", "hideLoading"])
  }
};
</script>