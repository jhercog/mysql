export async function checkIsOnline ({ commit, dispatch }) {
  commit('setIsOnline', navigator.onLine)
  window.addEventListener('online', async () => {
    commit('setIsOnline', true)
    // await dispatch('saveChangesToDatabase')
    // await dispatch('Notifications/handleConnection', { online: true }, { root: true })
  }, false)
  window.addEventListener('offline', async () => {
    commit('setIsOnline', false)
    // await dispatch('Notifications/handleConnection', { online: false }, { root: true })
  }, false)
}
