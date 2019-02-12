<template>
  <div>
    <list :items="items"></list>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { invidiousAPI } from "../helper/youtubeApi";
import List from "./List";

export default {
  name: "subscriptions",
  components: { List },
  data() {
    return {
      page: 1,
      query: "",
      items: []
    };
  },
  mounted() {
    this.query = this.$route.params.query;
    this.search(this.$route.params.query);
  },
  methods: {
    search(query) {
      let page = this.page;

      if (query === "") {
        return;
      }

      this.showLoading();

      //   if (page === 1) {
      //     hideViews();
      //     headerView.seen = true;
      //     headerView.title = "Search Results";
      //     searchView.videoList = [];
      //     searchView.seen = true;
      //   } else {
      //     console.log(page);
      //     showToast("Fetching results.  Please wait...");
      //   }

      invidiousAPI(
        "search",
        "",
        {
          q: query,
          page: page,
          type: "all"
        },
        data => {
          console.log(data);
          this.items = data;

          this.hideLoading();
        }
      );
    },
    ...mapActions(["showLoading", "hideLoading"])
  }
};
</script>