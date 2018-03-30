let ALERT_ID = 0

export default {
  namespaced: true,

  state: {
    alerts: [],
    dialog: null
  },

  mutations: {
    addAlert (state, alert) {
      alert.id = ++ALERT_ID
      state.alerts.push(alert)
    },

    removeAlert (state, alert) {
      const index = state.alerts.indexOf(alert)
      if (index !== -1) {
        state.alerts.splice(index, 1)
      }
    },

    removeAlerts (state) {
      state.alerts = []
    },

    setDialog (state, dialog) {
      state.dialog = dialog
    }
  },

  actions: {
    showAlert ({commit, dispatch}, alert) {
      alert.visible = true
      if (alert.isError === undefined) {
        alert.isError = false
      }
      if (!alert.title) {
        const index = Math.round(Math.random() * 5)
        alert.title = alert.isError
          ? ['Mist', 'Hat nicht geklappt', 'Kritischer Fehler #983-45§.v2)=', 'Kann mal passieren', 'Leider schade', 'Versuchs nochmal'][index]
          : ['Super', 'Totalgenial', 'Geschafft', 'Hervorragend', 'Gut gemacht', 'Datenspeicherung erfolgt'][index]
      }
      commit('addAlert', alert)
      if (alert.autoHide !== false) {
        const autoHide = parseInt(alert.autoHide) || 3000
        setTimeout(() => {
          dispatch('hideAlert', alert)
        }, autoHide)
      }
    },

    hideAlert ({commit}, alert) {
      commit('removeAlert', alert)
    },

    hideAlerts ({commit}) {
      commit('removeAlerts')
    },

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
