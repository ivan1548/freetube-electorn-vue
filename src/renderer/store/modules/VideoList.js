const state = {
    subscriptions: [],
    trending: [],
    most_popular: []
}

const mutations = {
    SET_VIDEOLIST(state, {
        key,
        items
    }) {
        state[key] = items
    },
    UNSET_VIDEOLIST(state,
        key
    ) {
        state[key] = []
    },
    UNSET_ALL_VIDEOLIST(state) {
        state = {
            subscriptions: [],
            trending: [],
            most_popular: []
        }
    }
}

const actions = {
    setSubscriptions({
        commit
    }, data) {
        commit('SET_VIDEOLIST', {
            key: 'subscriptions',
            items: data
        })
    },
    setTrending({
        commit
    }, data) {
        commit('SET_VIDEOLIST', {
            key: 'subscriptions',
            items: data
        })
    },
    setMostPopular({
        commit
    }, data) {
        commit('SET_VIDEOLIST', {
            key: 'subscriptions',
            items: data
        })
    },
    clearSubscriptions({
        commit
    }) {
        commit('SET_VIDEOLIST', {
            key: 'subscriptions',
            items: []
        })
    },
    clearTrending({
        commit
    }) {
        commit('SET_VIDEOLIST', {
            key: 'subscriptions',
            items: []
        })
    },
    clearMostPopular({
        commit
    }) {
        commit('SET_VIDEOLIST', {
            key: 'subscriptions',
            items: []
        })
    },
    clearVideoListStore({
        commit
    }) {
        commit('UNSET_ALL_VIDEOLIST')
    }
}

export default {
    state,
    mutations,
    actions
}