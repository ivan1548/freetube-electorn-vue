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
import $ from "jquery";
import { take } from "rambda";
import { mapActions } from "vuex";
import { subDb } from "../helper/db";
import { invidiousAPI } from "../helper/youtubeApi";
import subscriptions, { loadSubscriptions } from "../api/subscriptions";
import List from "./List";

export default {
  name: "subscriptions",
  components: { List },
  data() {
    return {
      title: "Latest Subscriptions",
      page: 1
    };
  },
  mounted() {
    this.load();
    $(window).scroll(() => {
      if (
        $(window).scrollTop() + $(window).height() ==
        $(document).height() - 1
      ) {
        console.log(
          $(window).scrollTop() + $(window).height(),
          $(document).height()
        );
        this.page++;
      }
    });
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
      return take(this.page * 10, this.$store.state.Subscriptions.list);
    }
  }
};
</script>