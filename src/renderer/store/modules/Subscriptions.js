/* eslint-disable no-param-reassign */
const state = {
  list: [],
  loading: false
};

const mutations = {
  SET_SUBSCRIPTIONS(st, data) {
    st.list = data;
  }
};

const actions = {
  setSubscriptions({ commit }, list) {
    commit("SET_SUBSCRIPTIONS", list);
  },
  clearSubscriptions({ commit }) {
    commit("SET_SUBSCRIPTIONS", []);
  }
};

const getters = {
  getSubscriptions: st => {
    return st.list;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
