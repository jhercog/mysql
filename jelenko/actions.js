import { getState, initState } from 'store/plugins/storage'

export async function loadCachedState ({ commit, dispatch, rootState, state }, { currentModule, userId }) {
  // TODO: If item on first load. Check with current route
  // console.log(this.$router)
  if (!state.cachedModules.includes(currentModule)) {
    // Current module is not on the list of cached modules
    // Module has no cached data and doesn't need initialization
    // Do not load cached state for this module
    return Promise.resolve()
  }
  if (rootState[currentModule][`${currentModule.toLowerCase()}Initialized`]) {
    // Current module is already initialized and doesn't need cache loading
    return Promise.resolve()
  }
  // if (state.cachedModules.includes(currentModule)) {
  try {
    // Current module is not initialized. Need cache loading.
    // Proceed to loading cache for current module
    await initState(userId)
    const cachedData = await getState(currentModule, userId)
    commit(`${currentModule}/load${currentModule}FromCache`, cachedData, { root: true })
  } catch (err) {
    console.error('loadState', err)
    dispatch('Notifications/handleError', { err: err }, { root: true })
  }
  // }
}

export async function unloadCachedState ({ commit }) {

}

export async function checkIsOnline ({ commit, dispatch }) {
  commit('setIsOnline', navigator.onLine)
  window.addEventListener('online', async () => {
    commit('setIsOnline', true)
    await dispatch('saveChangesToDatabase')
    await dispatch('Notifications/handleConnection', { online: true }, { root: true })
  }, false)
  window.addEventListener('offline', async () => {
    commit('setIsOnline', false)
    await dispatch('Notifications/handleConnection', { online: false }, { root: true })
  }, false)
}

export async function handleData ({ dispatch, commit, state }) {
  commit('setIsOnline', navigator.onLine)
  try {
    await dispatch('checkIsOnline')
    // await dispatch('Employees/queryEmployees', null, { root: true })
  } catch (err) {
    console.error(err)
    dispatch('Notifications/handleError', { err: err }, { root: true })
  }
}

export async function saveChangesToDatabase ({ dispatch }) {
  try {
    await dispatch('Employees/saveChangesToDatabase', null, { root: true })
  } catch (err) {
    console.error(err)
    dispatch('Notifications/handleError', { err: err }, { root: true })
  }
}

export async function drawerOpen ({ commit }) {
  commit('setDrawer', true)
}

export async function drawerClose ({ commit }) {
  commit('setDrawer', false)
}
