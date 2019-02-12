/* eslint-disable no-param-reassign */
const state = {
  list: []
};

const mutations = {
  SET_DISPLAY_SUBSCRIPTIONS(st, payload) {
    st.list = payload;
  }
};

const actions = {
  setDisplaySubscriptions({ commit }, data) {
    commit("SET_DISPLAY_SUBSCRIPTIONS", data);
  }
};

export default {
  state,
  mutations,
  actions
};
