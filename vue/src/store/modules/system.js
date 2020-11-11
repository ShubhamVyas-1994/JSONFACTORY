const system = {
  state: {
    categoryList: '',
    resolutionOfScreenInCurrentState: { width: window.innerWidth, height: window.innerHeight }
  },
  mutations: {
    SET_CATEGORY_LIST (state, list) {
      state.categoryList = list
    },
    SET_RESOLUTION_DETAILS (state, data) {
      state.resolutionOfScreenInCurrentState = data
    }
  },
  actions: {
    setCategoryList ({commit}, list) {
      commit('SET_CATEGORY_LIST', list)
    },
    SetResolutionOfScreen ({commit}, data) {
      commit('SET_RESOLUTION_DETAILS', data)
    }
  }
}
export default system
