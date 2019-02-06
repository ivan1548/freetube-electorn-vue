const state = {
    seen: false,
    message: false,
    callback: false,
    params: []
}

const mutations = {
    SET_CONFIRM_DIALOG(state) {
        state.seen = true
    },
    SET_CONFIRM_DIALOG_MESSAGE(state, message) {
        state.message = message
    },
    SET_CONFIRM_DIALOG_CALLBACK(state, callback) {
        state.callback = callback
    },
    SET_CONFIRM_DIALOG_PARAMS(state, params) {
        state.params = params
    },
    UNSET_CONFIRM_DIALOG(state) {
        state.seen = false;
        state.message = false;
        state.callback = false;
        state.params = [];
    }
}

const actions = {
    showConfirmDialog({
        commit
    }, {
        message,
        callback,
        params
    }) {
        commit('SET_CONFIRM_DIALOG')
        commit('SET_CONFIRM_DIALOG_MESSAGE', message)
        commit('SET_CONFIRM_DIALOG_CALLBACK', callback)
        if (params) {
            commit('SET_CONFIRM_DIALOG_PARAMS', params)
        }
    },
    hideConfirmDialog({
        commit
    }) {
        commit('UNSET_CONFIRM_DIALOG')
    }
}

export default {
    state,
    mutations,
    actions
}