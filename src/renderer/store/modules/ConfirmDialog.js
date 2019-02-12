/* eslint-disable no-param-reassign */
const state = {
  seen: false,
  message: false,
  callback: false,
  params: []
};

const mutations = {
  SET_CONFIRM_DIALOG(st) {
    st.seen = true;
  },
  SET_CONFIRM_DIALOG_MESSAGE(st, message) {
    st.message = message;
  },
  SET_CONFIRM_DIALOG_CALLBACK(st, callback) {
    st.callback = callback;
  },
  SET_CONFIRM_DIALOG_PARAMS(st, params) {
    st.params = params;
  },
  UNSET_CONFIRM_DIALOG(st) {
    st.seen = false;
    st.message = false;
    st.callback = false;
    st.params = [];
  }
};

const actions = {
  showConfirmDialog({ commit }, { message, callback, params }) {
    commit("SET_CONFIRM_DIALOG");
    commit("SET_CONFIRM_DIALOG_MESSAGE", message);
    commit("SET_CONFIRM_DIALOG_CALLBACK", callback);
    if (params) {
      commit("SET_CONFIRM_DIALOG_PARAMS", params);
    }
  },
  hideConfirmDialog({ commit }) {
    commit("UNSET_CONFIRM_DIALOG");
  }
};

export default {
  state,
  mutations,
  actions
};
