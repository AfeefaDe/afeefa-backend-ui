export default {
  namespaced: true,

  state: {
    dialog: null
  },

  mutations: {
    setDialog (state, dialog) {
      state.dialog = dialog
    }
  },

  actions: {
    showDialog ({commit, dispatch}, dialog) {
      if (!dialog.yesButton) {
        dialog.yesButton = 'Ja'
      }
      if (!dialog.noButton) {
        dialog.noButton = 'Nein'
      }

      const promise = new Promise((resolve, reject) => {
        dialog.yes = () => {
          resolve('yes')
          dispatch('hideDialog')
        }
        dialog.no = () => {
          resolve('no')
          dispatch('hideDialog')
        }
        dialog.cancel = () => {
          resolve('cancel')
          dispatch('hideDialog')
        }
      })

      commit('setDialog', dialog)
      return promise
    },

    hideDialog ({commit}) {
      commit('setDialog', null)
    }
  }
}
