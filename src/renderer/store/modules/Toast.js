/* eslint-disable no-param-reassign */
const state = {
  seen: false,
  message: false,
  timeout: false
};

const mutations = {
  SET_TOAST(st) {
    st.seen = true;
  },
  SET_TOAST_MESSAGE(st, message) {
    st.message = message;
  },
  SET_TOAST_TIMEOUT(st, timeout) {
    st.timeout = timeout;
  },
  CLEAR_TOAST_TIMEOUT(st) {
    st.timeout = clearTimeout(st.timeout);
  },
  UNSET_TOAST(st) {
    st.seen = false;
    st.message = false;
  }
};

const actions = {
  showToast({ commit }, message) {
    commit("SET_TOAST");
    commit("SET_TOAST_MESSAGE", message);

    const timeout = setTimeout(() => {
      commit("UNSET_TOAST");
      commit("CLEAR_TOAST_TIMEOUT");
    }, 5000);

    commit("SET_TOAST_TIMEOUT", timeout);
  },
  hideToast({ commit }) {
    commit("UNSET_TOAST");
    commit("CLEAR_TOAST_TIMEOUT");
  }
};

export default {
  state,
  mutations,
  actions
};
