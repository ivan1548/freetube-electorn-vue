/* eslint-disable no-param-reassign */
const state = {
  useTor: false,
  history: true,
  autoplay: true,
  subtitles: false,
  updates: true,
  theme: "light",
  quality: "720",
  rate: "1"
};

const mutations = {
  SET_ALL(st, payload) {
    st = payload;
  },
  SET_ONE(st, { _id, value }) {
    // eslint-disable-next-line no-underscore-dangle
    st[_id] = value;
  }
};

const actions = {
  initSettings({ commit }, data) {
    commit("SET_ALL", data);
  },
  updateSettings({ commit }, data) {
    commit("SET_ALL", data);
  },
  updateSettingsItem({ commit }, data) {
    commit("SET_ONE", data);
  }
};

export default {
  state,
  mutations,
  actions
};
