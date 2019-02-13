/* eslint-disable no-param-reassign */
const state = {
  subscriptions: [],
  trending: [],
  most_popular: [],
  history: []
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
  },
  PREPEND_TO_VIDEOLIST(st, { key, item }) {
    st[key].unshift(item);
  },
  REMOVE_FROM_VIDEOLIST(st, { key, id }) {
    const index = st[key].findIndex(item => {
      return item.videoId === id;
    });

    if (index !== -1) {
      st[key].splice(index, 1);
    }
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
  setHistory({ commit }, data) {
    commit("SET_VIDEOLIST", {
      key: "history",
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
  clearHistory({ commit }) {
    commit("SET_VIDEOLIST", {
      key: "history",
      items: []
    });
  },
  clearVideoListStore({ commit }) {
    commit("UNSET_ALL_VIDEOLIST");
  },
  addVideoToHistory({ commit }, data) {
    commit("PREPEND_TO_VIDEOLIST", {
      key: "history",
      item: data
    });
  },
  removeVideoFromHistory({ commit }, data) {
    commit("REMOVE_FROM_VIDEOLIST", {
      key: "history",
      id: data
    });
  }
};

export default {
  state,
  mutations,
  actions
};
