const state = {
    list: []
}

const mutations = {
    SET_DISPLAY_SUBSCRIPTIONS(state, payload) {
        state.list = payload
    }
}

const actions = {
    setDisplaySubscriptions({
        commit
    }, data) {
        commit('SET_DISPLAY_SUBSCRIPTIONS', data)
    }
}

export default {
    state,
    mutations,
    actions
}