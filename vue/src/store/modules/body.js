const body = {
  state: {
    jsonValue: '',
    gridView: false
  },
  mutations: {
    SET_JSON (state, value) {
      state.jsonValue = value
    },
    SET_GRID_VIEW (state, value) {
      state.gridView = value
    }
  },
  actions: {
    SetJsonValue ({commit}, value) {
      commit('SET_JSON', value)
    },
    SetGridValue ({commit}, value) {
      commit('SET_GRID_VIEW', value)
    }
  }
}
export default body
