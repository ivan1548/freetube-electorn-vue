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
import { savedVidsDb } from "../helper/db";
import { invidiousAPI } from "../helper/youtubeApi";
import { mapActions } from "vuex";
import List from "./List";

export default {
  name: "saved-videos",
  components: { List },
  data() {
    return {
      title: "Favorited Videos",
      items: []
    };
  },
  mounted() {
    this.getVideos();
  },
  methods: {
    getVideos() {
      this.showLoading();
      savedVidsDb
        .find({})
        .sort({
          timeSaved: -1
        })
        .exec((err, docs) => {
          let videoList = [];
          let requests = docs.reduce((promiseChain, video, index) => {
            return promiseChain.then(
              () =>
                new Promise(resolve => {
                  invidiousAPI("videos", video.videoId, {}, data => {
                    videoList.splice(index, 0, data);
                    resolve();
                  });
                })
            );
          }, Promise.resolve());
          requests.then(() => {
            this.items = videoList;
            this.hideLoading();
          });
        });
    },
    ...mapActions(["showLoading", "hideLoading"])
  }
};
</script>