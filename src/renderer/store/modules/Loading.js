/* eslint-disable no-param-reassign */
const state = {
  seen: false
};

const mutations = {
  SET_LOADING(st) {
    st.seen = true;
  },
  UNSET_LOADING(st) {
    st.seen = false;
  }
};

const actions = {
  showLoading({ commit }) {
    commit("SET_LOADING");
  },
  hideLoading({ commit }) {
    commit("UNSET_LOADING");
  }
};

export default {
  state,
  mutations,
  actions
};
