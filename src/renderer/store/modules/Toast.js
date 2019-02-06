const state = {
    seen: false,
    message: false,
    timeout: false
}

const mutations = {
    SET_TOAST(state) {
        state.seen = true
    },
    SET_TOAST_MESSAGE(state, message) {
        state.message = message
    },
    SET_TOAST_TIMEOUT(state, timeout) {
        state.timeout = timeout
    },
    CLEAR_TOAST_TIMEOUT(state) {
        state.timeout = clearTimeout(state.timeout);
    },
    UNSET_TOAST(state) {
        state.seen = false;
        state.message = false;
    }
}

const actions = {
    showToast({
            commit
        },
        message,
    ) {
        commit('SET_TOAST')
        commit('SET_TOAST_MESSAGE', message)

        let timeout = setTimeout(() => {
            commit('UNSET_TOAST')
            commit('CLEAR_TOAST_TIMEOUT')
        }, 5000)

        commit('SET_TOAST_TIMEOUT', timeout)
    },
    hideToast({
        commit
    }) {
        commit('UNSET_TOAST')
        commit('CLEAR_TOAST_TIMEOUT')
    }
}

export default {
    state,
    mutations,
    actions
}