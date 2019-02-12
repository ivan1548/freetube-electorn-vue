/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "landing-page",
      component: require("@/components/Subscriptions").default
    },
    {
      path: "/subscriptions",
      name: "subscriptions",
      component: require("@/components/Subscriptions").default
    },
    {
      path: "/history",
      name: "history",
      component: require("@/components/History").default
    },
    {
      path: "/saved-videos",
      name: "saved-videos",
      component: require("@/components/SavedVideos").default
    },
    {
      path: "/trending",
      name: "trending",
      component: require("@/components/Trending").default
    },
    {
      path: "/most-popular",
      name: "most-popular",
      component: require("@/components/MostPopular").default
    },
    {
      path: "/search/:query",
      name: "search",
      component: require("@/components/Search").default
    },
    {
      path: "/video/:id",
      name: "video-view",
      component: require("@/components/VideoView").default
    },
    {
      path: "/channel/:id",
      name: "channel-view",
      component: require("@/components/ChannelView").default
    },
    {
      path: "/playlist/:id",
      name: "playlist-view",
      component: require("@/components/PlaylistView").default
    },
    {
      path: "/settings",
      name: "settings",
      component: require("@/components/Settings").default
    },
    {
      path: "/about",
      name: "about",
      component: require("@/components/About").default
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
