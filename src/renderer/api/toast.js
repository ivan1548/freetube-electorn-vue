import store from '../store'

export default {
    show(message) {
        store.dispatch('showToast', message)
    },
    hide() {
        store.dispatch('hideToast')
    }
}