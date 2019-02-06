const state = {
    useTor: false,
    history: true,
    autoplay: true,
    subtitles: false,
    updates: true,
    theme: 'light',
    quality: '720',
    rate: '1',
}

const mutations = {
    SET_ALL(state, payload) {
        state = payload
    },
    SET_ONE(state, {
        _id,
        value
    }) {
        state[_id] = value
    }
}

const actions = {
    initSettings({
        commit
    }, data) {
        commit('SET_ALL', data)
    },
    updateSettings({
        commit
    }, data) {
        commit('SET_ALL', data)
    },
    updateSettingsItem({
        commit
    }, data) {
        commit('SET_ONE', data)
    }
}

export default {
    state,
    mutations,
    actions
}