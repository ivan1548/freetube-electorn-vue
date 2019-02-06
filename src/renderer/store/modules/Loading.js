const state = {
    seen: false
}

const mutations = {
    SET_LOADING(state) {
        state.seen = true
    },
    UNSET_LOADING(state) {
        state.seen = false
    }
}

const actions = {
    showLoading({
        commit
    }) {
        commit('SET_LOADING')
    },
    hideLoading({
        commit
    }) {
        commit('UNSET_LOADING')
    }
}

export default {
    state,
    mutations,
    actions
}