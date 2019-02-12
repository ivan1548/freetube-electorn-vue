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
import { invidiousAPI } from "../helper/youtubeApi";
import List from "./List";

export default {
  name: "trending",
  components: { List },
  data() {
    return {
      title: "Trending",
      items: []
    };
  },
  mounted() {
    this.getVideos();
  },
  methods: {
    getVideos() {
      this.showLoading();
      invidiousAPI("trending", "", {}, data => {
        console.log(data);
        this.items = data;
        this.hideLoading();
      });
    },
    ...mapActions(["showLoading", "hideLoading"])
  }
};
</script>