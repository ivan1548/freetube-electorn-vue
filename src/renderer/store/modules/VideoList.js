/* eslint-disable no-param-reassign */
const state = {
  subscriptions: [],
  trending: [],
  most_popular: []
};

const mutations = {
  SET_VIDEOLIST(st, { key, items }) {
    st[key] = items;
  },
  UNSET_VIDEOLIST(st, key) {
    st[key] = [];
  },
  // eslint-disable-next-line no-unused-vars
  UNSET_ALL_VIDEOLIST(st) {
    st = {
      subscriptions: [],
      trending: [],
      most_popular: []
    };
  }
};

const actions = {
  setSubscriptions({ commit }, data) {
    commit("SET_VIDEOLIST", {
      key: "subscriptions",
      items: data
    });
  },
  setTrending({ commit }, data) {
    commit("SET_VIDEOLIST", {
      key: "subscriptions",
      items: data
    });
  },
  setMostPopular({ commit }, data) {
    commit("SET_VIDEOLIST", {
      key: "subscriptions",
      items: data
    });
  },
  clearSubscriptions({ commit }) {
    commit("SET_VIDEOLIST", {
      key: "subscriptions",
      items: []
    });
  },
  clearTrending({ commit }) {
    commit("SET_VIDEOLIST", {
      key: "subscriptions",
      items: []
    });
  },
  clearMostPopular({ commit }) {
    commit("SET_VIDEOLIST", {
      key: "subscriptions",
      items: []
    });
  },
  clearVideoListStore({ commit }) {
    commit("UNSET_ALL_VIDEOLIST");
  }
};

export default {
  state,
  mutations,
  actions
};
